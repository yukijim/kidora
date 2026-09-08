import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import { DATA_DIR, getAffiliateData, saveAffiliateData, getOrders, getOrder, saveOrder } from './store.js';
import { commissionCents } from '../../shared/pricing.js';

const scrypt = promisify(crypto.scrypt);
const DAY = 86400000;
const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');
const cookieOptions = { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' };
const cookies = (req) => Object.fromEntries(String(req.headers.cookie || '').split(';').map(p => {
  const i = p.indexOf('=');
  if (i < 0) return ['', ''];
  try { return [p.slice(0, i).trim(), decodeURIComponent(p.slice(i + 1).trim())]; }
  catch { return ['', '']; }
}));
let cookieKey;
function signingKey() {
  if (cookieKey) return cookieKey;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const file = path.join(DATA_DIR, 'referral-signing.key');
  try { fs.writeFileSync(file, crypto.randomBytes(32).toString('hex'), { flag: 'wx', mode: 0o600 }); }
  catch (e) { if (e.code !== 'EEXIST') throw e; }
  cookieKey = fs.readFileSync(file, 'utf8').trim();
  return cookieKey;
}
function sign(value) { return crypto.createHmac('sha256', signingKey()).update(value).digest('hex'); }
function signed(value) { return `${value}.${sign(value)}`; }
function unsigned(value = '') {
  const i = value.lastIndexOf('.');
  if (i < 1) return null;
  const raw = value.slice(0, i), actual = value.slice(i + 1), expected = sign(raw);
  return /^[a-f0-9]{64}$/.test(actual) && crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expected)) ? raw : null;
}
export function referralFor(req) {
  const raw = unsigned(cookies(req).kidora_ref);
  if (!raw) return null;
  const [id, expiry] = raw.split(':');
  const account = getAffiliateData().accounts[id];
  return account && account.active && Number(expiry) > Date.now() ? id : null;
}
export function commissionSnapshot(affiliateId, amount) {
  return affiliateId ? { affiliateId, commissionRule: '35pct-minus-rm1-v1', expectedCommissionCents: commissionCents(Math.round(amount * 100)) } : {};
}
export function settleOrder(order, codes, now = new Date().toISOString()) {
  if (order.status === 'paid') return order;
  order.status = 'paid';
  order.paidAt = now;
  order.codes = codes;
  if (order.package === 'whitelabel') order.fulfillmentStatus = 'pending_setup';
  if (order.affiliateId) {
    order.commissionCents = order.expectedCommissionCents ?? commissionCents(Math.round(order.amount * 100));
    order.commissionStatus = 'unpaid';
  }
  return order;
}
export const dayKey = (date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kuala_Lumpur', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(date));
function dateRange(req) {
  const from = String(req.query.from || ''), to = String(req.query.to || '');
  if ([from, to].some(d => d && (!/^\d{4}-\d{2}-\d{2}$/.test(d) || !Number.isFinite(Date.parse(d)))) || (from && to && from > to)) throw new Error('Julat tarikh tidak sah.');
  return (date) => { const d = dayKey(date); return (!from || d >= from) && (!to || d <= to); };
}
export function summarize(orders) {
  const paid = orders.filter(o => o.status === 'paid');
  return {
    orders: orders.length, paid: paid.length, pending: orders.filter(o => o.status === 'pending').length,
    failed: orders.filter(o => o.status === 'failed').length,
    revenueCents: paid.reduce((n, o) => n + Math.round(o.amount * 100), 0),
    commissionCents: paid.reduce((n, o) => n + (o.commissionCents || 0), 0),
    unpaidCommissionCents: paid.reduce((n, o) => n + (o.commissionStatus === 'unpaid' ? o.commissionCents || 0 : 0), 0),
    paidCommissionCents: paid.reduce((n, o) => n + (o.commissionStatus === 'paid' ? o.commissionCents || 0 : 0), 0),
  };
}
const publicAccount = (a, base) => ({ id: a.id, name: a.name, email: a.email, phone: a.phone, active: a.active, createdAt: a.createdAt, link: `${base}/r/${a.id}` });
const limits = new Map();
export function rateLimit(namespace, maximum, duration) {
  return (req, res, next) => {
    const key = `${namespace}:${req.ip}`;
    const now = Date.now();
    if (limits.size > 10000) for (const [k, v] of limits) if (v.until <= now) limits.delete(k);
    let item = limits.get(key);
    if (!item || item.until <= now) { item = { count: 0, until: now + duration }; limits.set(key, item); }
    if (++item.count > maximum) return res.status(429).json({ error: 'Terlalu banyak cubaan. Sila cuba lagi sebentar lagi.' });
    next();
  };
}
export function registerCommerce(app, { requireAdmin, baseUrl, packages }) {
  const base = baseUrl.replace(/\/$/, '');
  const referralCookies = { ...cookieOptions, ...(new URL(base).hostname === 'kidora.com.my' ? { domain: 'kidora.com.my' } : {}) }; 
  const wrap = (fn) => (req, res, next) => Promise.resolve().then(() => fn(req, res)).catch(next);
  app.use(['/api/admin', '/api/affiliate'], (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  app.use('/api/affiliate', (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (req.headers.origin && ![new URL(base).origin, `https://affiliate.${new URL(base).hostname}`].includes(req.headers.origin)) return res.status(403).json({ error: 'Permintaan tidak dibenarkan.' });
      if (!req.is('application/json')) return res.status(415).json({ error: 'Permintaan JSON diperlukan.' });
    }
    next();
  });
  function session(req) {
    const token = cookies(req).kidora_affiliate;
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
    const d = getAffiliateData();
    const s = d.sessions[hash(token)];
    return s && s.expires > Date.now() && d.accounts[s.accountId]?.active ? d.accounts[s.accountId] : null;
  }
  function issueSession(res, accountId) {
    const d = getAffiliateData();
    for (const [id, s] of Object.entries(d.sessions)) if (s.expires < Date.now()) delete d.sessions[id];
    const token = crypto.randomBytes(32).toString('hex');
    d.sessions[hash(token)] = { accountId, expires: Date.now() + 7 * DAY };
    saveAffiliateData(d);
    res.cookie('kidora_affiliate', token, { ...cookieOptions, maxAge: 7 * DAY });
  }
  const requireAffiliate = (req, res, next) => {
    req.affiliate = session(req);
    if (!req.affiliate) return res.status(401).json({ error: 'Sila log masuk akaun affiliate.' });
    next();
  };
  app.post('/api/affiliate/register', rateLimit('register', 10, 3600000), wrap(async (req, res) => {
    const name = String(req.body.name || '').trim(), email = String(req.body.email || '').trim().toLowerCase();
    const phone = String(req.body.phone || '').replace(/\D/g, ''), password = String(req.body.password || '');
    if (name.length < 3 || name.length > 100 || email.length > 254 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || phone.length < 8 || phone.length > 15 || password.length < 12 || password.length > 128) return res.status(400).json({ error: 'Semak nama, emel dan telefon. Kata laluan perlu 12–128 aksara.' });
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = (await scrypt(password, salt, 64)).toString('hex');
    // Re-read after asynchronous hashing to prevent lost concurrent registrations.
    const data = getAffiliateData();
    if (Object.values(data.accounts).some(a => a.email === email)) return res.status(409).json({ error: 'Emel ini sudah berdaftar. Sila log masuk.' });
    const id = crypto.randomBytes(8).toString('hex');
    data.accounts[id] = { id, name, email, phone, salt, passwordHash, active: true, createdAt: new Date().toISOString() };
    saveAffiliateData(data);
    issueSession(res, id);
    res.status(201).json({ account: publicAccount(data.accounts[id], base) });
  }));
  app.post('/api/affiliate/login', rateLimit('login', 20, 900000), wrap(async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase(), password = String(req.body.password || '');
    if (password.length > 128) return res.status(400).json({ error: 'Emel atau kata laluan salah.' });
    const a = Object.values(getAffiliateData().accounts).find(a => a.email === email);
    const result = await scrypt(password, a?.salt || 'invalid-account-salt', 64);
    if (!a?.active || !crypto.timingSafeEqual(result, Buffer.from(a.passwordHash, 'hex'))) return res.status(401).json({ error: 'Emel atau kata laluan salah.' });
    issueSession(res, a.id);
    res.json({ account: publicAccount(a, base) });
  }));
  app.post('/api/affiliate/logout', (req, res) => {
    const token = cookies(req).kidora_affiliate;
    if (token) { const d = getAffiliateData(); delete d.sessions[hash(token)]; saveAffiliateData(d); }
    res.clearCookie('kidora_affiliate', cookieOptions).json({ ok: true });
  });
  app.get('/r/:code', rateLimit('referral', 300, 3600000), (req, res) => {
    res.set('Cache-Control', 'no-store');
    const d = getAffiliateData(), a = Object.hasOwn(d.accounts, req.params.code) ? d.accounts[req.params.code] : null;
    if (!a?.active) return res.status(404).send('Link affiliate tidak sah. Sila buka https://kidora.com.my');
    if (req.method === 'HEAD') return res.redirect(302, '/');
    let visitor = unsigned(cookies(req).kidora_visitor);
    if (!visitor || !/^[a-f0-9]{32}$/.test(visitor)) visitor = crypto.randomBytes(16).toString('hex');
    const now = Date.now(), day = dayKey(now);
    const entry = d.traffic[a.id] ||= { days: {}, visitors: {} };
    const visitorKey = hash(visitor);
    const previous = entry.visitors[visitorKey];
    // Reloads within 30 minutes are one visit; unique visitors use an anonymous cookie.
    if (!previous || now - previous.last >= 1800000) {
      const stats = entry.days[day] ||= { visits: 0, newVisitors: 0 };
      stats.visits++;
      if (!previous) stats.newVisitors++;
      entry.visitors[visitorKey] = { first: previous?.first || now, last: now };
      saveAffiliateData(d);
    }
    res.cookie('kidora_visitor', signed(visitor), { ...referralCookies, maxAge: 365 * DAY });
    res.cookie('kidora_ref', signed(`${a.id}:${now + 30 * DAY}`), { ...referralCookies, maxAge: 30 * DAY });
    res.redirect(302, '/');
  });
  app.get('/api/affiliate/dashboard', requireAffiliate, (req, res) => {
    let inRange; try { inRange = dateRange(req); } catch (e) { return res.status(400).json({ error: e.message }); }
    const a = req.affiliate;
    const orders = Object.values(getOrders()).filter(o => o.affiliateId === a.id && inRange(o.createdAt));
    const traffic = getAffiliateData().traffic[a.id] || { days: {} };
    const days = Object.entries(traffic.days).filter(([d]) => inRange(`${d}T12:00:00+08:00`));
    res.json({ account: publicAccount(a, base), summary: { ...summarize(orders), visits: days.reduce((n, [,v]) => n + v.visits, 0), newVisitors: days.reduce((n, [,v]) => n + v.newVisitors, 0) }, traffic: days.map(([date, v]) => ({ date, ...v })),
      sales: orders.sort((a,b) => b.createdAt.localeCompare(a.createdAt)).map(o => ({ reference: o.orderId.slice(-8), packageName: packages[o.package]?.name || o.package, amountCents: Math.round(o.amount * 100), status: o.status, createdAt: o.createdAt, commissionCents: o.commissionCents || 0, commissionStatus: o.commissionStatus || 'pending' })) });
  });
  app.get('/api/admin/sales', requireAdmin, (req, res) => {
    let inRange; try { inRange = dateRange(req); } catch (e) { return res.status(400).json({ error: e.message }); }
    const all = Object.values(getOrders()), d = getAffiliateData();
    const orders = all.filter(o => inRange(o.createdAt)).sort((a,b) => b.createdAt.localeCompare(a.createdAt));
    const summary = summarize(orders);
    const daily = {};
    for (const o of orders.filter(o => o.status === 'paid')) { const day = dayKey(o.createdAt); daily[day] = (daily[day] || 0) + Math.round(o.amount * 100); }
    res.json({ summary, daily: Object.entries(daily).sort(([a],[b])=>a.localeCompare(b)).map(([date,revenueCents])=>({date,revenueCents})),
      orders: orders.map(o => ({ ...o, packageName: packages[o.package]?.name || o.package, affiliateName: d.accounts[o.affiliateId]?.name || null })),
      affiliates: Object.values(d.accounts).map(a => {
        const days = Object.entries(d.traffic[a.id]?.days || {}).filter(([day]) => inRange(`${day}T12:00:00+08:00`));
        return { ...publicAccount(a, base), ...summarize(orders.filter(o => o.affiliateId === a.id)), visits: days.reduce((n,[,v])=>n+v.visits,0), newVisitors: days.reduce((n,[,v])=>n+v.newVisitors,0) };
      }) });
  });
  app.post('/api/admin/commission/:id/paid', requireAdmin, (req, res) => {
    const o = getOrder(req.params.id);
    const reference = String(req.body.reference || '').trim();
    if (!o || o.status !== 'paid' || !o.affiliateId || !(o.commissionCents > 0)) return res.status(400).json({ error: 'Komisyen belum layak dibayar.' });
    if (o.commissionStatus === 'paid') return res.json({ ok: true });
    if (reference.length < 3 || reference.length > 120) return res.status(400).json({ error: 'Masukkan rujukan pembayaran komisyen.' });
    o.commissionStatus = 'paid'; o.commissionPaidAt = new Date().toISOString(); o.commissionPaymentReference = reference;
    saveOrder(o);
    res.json({ ok: true });
  });
}
