// ============================================
// KIDORA Backend — serve static frontend + API:
//   - /api/packages            : senarai pakej harga
//   - /api/order               : cipta payment intent Bayarcash → return URL bayaran
//   - /api/bayarcash/callback  : webhook Bayarcash (server-to-server, bayaran berjaya → jana kod)
//   - /api/order/:id           : status pesanan (untuk polling muka terima kasih)
//   - /api/validate-code       : semak kod akses
//   - /api/recover-code        : dapatkan semula kod akses (lupa kod)
//   - /api/admin/orders        : (admin) senarai pesanan
//   - /api/admin/confirm/:id   : (admin) sahkan bayaran manual untuk satu pesanan (fallback)
//   - /api/admin/issue         : (admin) jana kod manual (tanpa pesanan sedia ada)
// ============================================

import express from 'express';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createPaymentIntent, verifyTransactionCallbackData } from './bayarcash.js';
import { getOrder, getOrders, saveOrder, findOrderByCode, findOrderByEmailPhone } from './store.js';

import { PRICE_CENTS } from '../../shared/pricing.js';
import { WHITELABEL } from '../../shared/whitelabel.js';
import { whitelabelAvailability, existingWhitelabelOrder } from './whitelabel.js';
import { registerCommerce, referralFor, commissionSnapshot, settleOrder, rateLimit } from './commerce.js';

dotenv.config();

export const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const ADMIN_KEY = process.env.ADMIN_KEY || '';

// ---- Bayarcash Payment Gateway ----
const BC_TOKEN = process.env.BAYARCASH_PAT || '';
const BC_SECRET = process.env.BAYARCASH_SECRET_KEY || '';
const BC_PORTAL = process.env.BAYARCASH_PORTAL_KEY || '';
const BC_SANDBOX = String(process.env.BAYARCASH_SANDBOX || 'true').toLowerCase() !== 'false';

app.disable('x-powered-by');
// Simpan raw body sekali (untuk debug/log) — Bayarcash callback hantar JSON biasa.
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: true }));

// ---- Pakej harga (sumber sebenar, dikongsi dengan frontend) ----
const LETTER_IDS = 'abcdefghijklmnopqrstuvwxyz'.split('').map((c) => `h-${c}`);
const SKILL_IDS = ['abc', 'bunyi', 'awal', 'vokal', 'kuiz', 'besarkecil', 'ingatan', 'cari', 'susun', 'eja', 'suku', 'ulang1', 'ulang2'];
const LETTER_GAMES = [...LETTER_IDS, ...SKILL_IDS];
const PACKAGES = {
  whitelabel: { name: 'Whitelabel — 1 Tahun', price: WHITELABEL.priceCents / 100, games: [], codeCount: 0, tagline: 'Jenama dan harga jualan sendiri' },
  asas: { name: 'Pakej Asas', price: PRICE_CENTS.asas / 100, games: LETTER_GAMES, codeCount: 1, tagline: 'Cuba-cuba dulu' },
  lengkap: { name: 'Pakej Lengkap', price: PRICE_CENTS.lengkap / 100, games: [...LETTER_GAMES, 'kira', 'padan'], codeCount: 1, tagline: 'Paling popular' },
  keluarga: { name: 'Pakej Keluarga', price: PRICE_CENTS.keluarga / 100, games: [...LETTER_GAMES, 'kira', 'padan'], codeCount: 3, tagline: 'Untuk seisi keluarga' },
};

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function genCode() {
  const block = () =>
    Array.from({ length: 4 }, () => CODE_CHARS[crypto.randomInt(CODE_CHARS.length)]).join('');
  return `KIDORA-${block()}-${block()}`;
}
function genCodes(count) {
  return Array.from({ length: count }, genCode);
}

function requireAdmin(req, res, next) {
  const key = String(req.headers['x-admin-key'] || '');
  if (!ADMIN_KEY) return res.status(503).json({ error: 'Admin belum dikonfigurasi (ADMIN_KEY tiada di server).' });
  if (Buffer.byteLength(key) !== Buffer.byteLength(ADMIN_KEY) || !crypto.timingSafeEqual(Buffer.from(key), Buffer.from(ADMIN_KEY))) return res.status(401).json({ error: 'Kunci admin salah.' });
  next();
}

app.use('/api/admin', rateLimit('admin', 300, 900000));
registerCommerce(app, { requireAdmin, baseUrl: BASE_URL, packages: PACKAGES });

// ---- Kesihatan ----
app.get('/api/health', (_req, res) => res.json({ status: 'healthy', name: 'KIDORA' }));

// ---- Senarai pakej ----
app.get('/api/whitelabel/offer', (_req,res) => { res.set('Cache-Control','no-store').json({ ...whitelabelAvailability(), priceCents: WHITELABEL.priceCents, renewalCents: WHITELABEL.renewalCents, termsVersion: WHITELABEL.termsVersion }); });
app.get('/api/packages', (_req, res) => {
  res.json({ packages: Object.entries(PACKAGES).map(([id, p]) => ({ id, ...p })) });
});

// ---- Cipta pesanan → payment intent Bayarcash → return URL checkout ----
app.post('/api/order', rateLimit('orders', 30, 900000), async (req, res) => {
  const { package: pkgId, name, email, phone } = req.body || {};
  const pkg = Object.hasOwn(PACKAGES, pkgId) ? PACKAGES[pkgId] : null;
  if (!pkg) return res.status(400).json({ error: 'Pakej tidak sah.' });

  const payerName = String(name || '').trim();
  const payerEmail = String(email || '').trim();
  const payerPhone = String(phone || '').trim();

  if (payerName.length < 5 || payerName.length > 100) return res.status(400).json({ error: 'Sila masukkan nama penuh (min 5 huruf).' });
  if (payerEmail.length > 254 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payerEmail)) return res.status(400).json({ error: 'Emel tidak sah.' });
  if (payerPhone.replace(/\D/g, '').length < 8 || payerPhone.length > 24) return res.status(400).json({ error: 'Nombor telefon tidak sah.' });

  if (!BC_TOKEN || !BC_SECRET || !BC_PORTAL) {
    return res.status(503).json({ error: 'Bayaran belum dikonfigurasi. Sila hubungi kami.' });
  }

  if (pkgId === 'whitelabel') {
    if (req.body.acceptedTerms !== true || req.body.termsVersion !== WHITELABEL.termsVersion) return res.status(400).json({ error: 'Sila baca dan terima terma tawaran whitelabel semasa.' });
    const existing = existingWhitelabelOrder(payerEmail);
    if (existing?.checkoutUrl) return res.json({ orderId: existing.orderId, url: existing.checkoutUrl });
    if (existing) return res.status(409).json({ error: 'Pesanan untuk emel ini sedang diproses. Sila hubungi sokongan sebelum membuat pesanan baharu.' });
    if (!whitelabelAvailability().available) return res.status(409).json({ error: 'Semua 10 slot telah ditempah atau disahkan. Sila hubungi kami untuk semakan.' });
  }
  const orderId = `ord_${crypto.randomBytes(16).toString('hex')}`;
  const affiliateId = referralFor(req);
  saveOrder({ orderId, package: pkgId, amount: pkg.price, payerName, payerEmail, payerPhone,
    ...commissionSnapshot(affiliateId, pkg.price),
    ...(pkgId === 'whitelabel' ? { whitelabelSlot: true, termsVersion: WHITELABEL.termsVersion, acceptedTermsAt: new Date().toISOString(), serviceYears: 1, renewalAmount: WHITELABEL.renewalCents / 100, guaranteeDays: WHITELABEL.guaranteeDays, fulfillmentStatus: 'awaiting_payment' } : {}), status: 'pending', codes: [], createdAt: new Date().toISOString() });

  try {
    const intent = await createPaymentIntent({
      token: BC_TOKEN,
      secretKey: BC_SECRET,
      portalKey: BC_PORTAL,
      sandbox: BC_SANDBOX,
      orderNumber: orderId,
      amount: pkg.price.toFixed(2),
      payerName,
      payerEmail,
      payerPhone: payerPhone.replace(/\D/g, ''),
      callbackUrl: `${BASE_URL}/api/bayarcash/callback`,
      returnUrl: `${BASE_URL}/terima-kasih/${orderId}`,
    });

    if (!intent.url) throw new Error('Gagal cipta payment intent Bayarcash.');

    const order = getOrder(orderId);
    order.paymentIntentId = intent.id;
    if (pkgId === 'whitelabel') order.checkoutUrl = intent.url;
    saveOrder(order);

    return res.json({ orderId, url: intent.url });
  } catch (err) {
    const order = getOrder(orderId);
    if (order && order.status !== 'paid') { order.status = 'failed'; saveOrder(order); }
    console.error('[order] ralat Bayarcash:', err.message);
    return res.status(500).json({ error: err.message || 'Gagal cipta pesanan. Sila cuba lagi.' });
  }
});

// ---- Webhook Bayarcash (server-to-server, POST) — bayaran berjaya → jana kod ----
app.post('/api/bayarcash/callback', (req, res) => {
  const body = req.body || {};


  if (!BC_SECRET || !verifyTransactionCallbackData(body, BC_SECRET)) {
    console.error('[bayarcash callback] checksum tidak sah, diabaikan.');
    return res.status(400).send('INVALID_CHECKSUM');
  }

  const order = getOrder(body.order_number);
  if (!order) {
    console.error('[bayarcash callback] order_number tidak dikenali:', body.order_number);
    return res.status(404).send('UNKNOWN_ORDER');
  }

  const amount = String(body.amount || '');
  if (!/^\d+(\.\d{1,2})?$/.test(amount) || Math.round(Number(amount) * 100) !== Math.round(order.amount * 100) || String(body.currency).toUpperCase() !== 'MYR') {
    return res.status(400).send('AMOUNT_OR_CURRENCY_MISMATCH');
  }
  const status = Number(body.status);
  if (status === 3) {
    if (!body.transaction_id) return res.status(400).send('MISSING_TRANSACTION');
    if (order.transactionId && order.transactionId !== body.transaction_id) return res.status(409).send('TRANSACTION_MISMATCH');
    if (order.status !== 'paid') settleOrder(order, genCodes(PACKAGES[order.package]?.codeCount ?? 1));
    order.transactionId = body.transaction_id;
  } else if ((status === 2 || status === 4) && order.status !== 'paid') {
    order.status = 'failed';
  }
  saveOrder(order);
  return res.status(200).send('OK');
});

// ---- Status pesanan (untuk muka terima kasih) ----
app.get('/api/order/:id', (req, res) => {
  const order = getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: 'Pesanan tidak dijumpai.' });
  const pkg = PACKAGES[order.package] || {};
  return res.json({
    orderId: order.orderId,
    package: order.package,
    packageName: pkg.name,
    fulfillmentStatus: order.fulfillmentStatus,
    amount: order.amount,
    status: order.status,
    games: pkg.games || [],
    codes: order.status === 'paid' ? order.codes : [],
  });
});

// ---- Semak kod akses ----
app.post('/api/validate-code', rateLimit('validate', 100, 900000), (req, res) => {
  const code = req.body && req.body.code;
  if (!code) return res.status(400).json({ error: 'Sila masukkan kod akses.' });
  const order = findOrderByCode(code);
  if (!order) return res.status(404).json({ valid: false, error: 'Kod akses tidak sah.' });
  const pkg = PACKAGES[order.package] || {};
  return res.json({ valid: true, package: order.package, games: pkg.games || [] });
});

// ---- Pemulihan kod akses (lupa kod) ----
app.post('/api/recover-code', rateLimit('recover', 20, 900000), (req, res) => {
  const email = String((req.body && req.body.email) || '').trim().toLowerCase();
  const phone = String((req.body && req.body.phone) || '').replace(/\D/g, '');
  if (!email || phone.length < 8) {
    return res.status(400).json({ error: 'Sila masukkan emel dan nombor telefon yang betul.' });
  }
  const order = findOrderByEmailPhone(email, phone);
  if (!order) {
    return res.status(404).json({ error: 'Tiada pesanan dijumpai. Sila semak emel & nombor telefon anda.' });
  }
  if (order.status !== 'paid') {
    return res.status(404).json({ error: 'Pesanan anda belum dibayar. Sila selesaikan bayaran dahulu.' });
  }
  const pkg = PACKAGES[order.package] || {};
  return res.json({ package: order.package, packageName: pkg.name, codes: order.codes, games: pkg.games || [] });
});

// ---- (Admin) Senarai pesanan — untuk semak & pantau, atau sahkan bayaran secara manual (fallback) ----
app.get('/api/admin/orders', requireAdmin, (_req, res) => {
  const orders = Object.values(getOrders())
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
    .slice(0, 200)
    .map((o) => ({
      orderId: o.orderId,
      package: o.package,
      packageName: PACKAGES[o.package]?.name || o.package,
      amount: o.amount,
      payerName: o.payerName,
      payerEmail: o.payerEmail,
      payerPhone: o.payerPhone,
      status: o.status,
      codes: o.codes || [],
      manual: !!o.manual,
      createdAt: o.createdAt,
      paidAt: o.paidAt,
    }));
  res.json({ orders });
});

// ---- (Admin) Sahkan bayaran satu pesanan sedia ada secara manual — fallback jika callback gagal ----
app.post('/api/admin/confirm/:id', requireAdmin, (req, res) => {
  const order = getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: 'Pesanan tidak dijumpai.' });
  const pkg = PACKAGES[order.package];
  if (!pkg) return res.status(400).json({ error: 'Pakej pesanan ini tidak sah.' });

  if (order.status !== 'paid') {
    settleOrder(order, genCodes(pkg.codeCount));
    order.manuallyConfirmedAt = new Date().toISOString();
    saveOrder(order);
  }
  return res.json({ orderId: order.orderId, codes: order.codes });
});

// ---- (Admin) Jana kod manual — tanpa pesanan sedia ada (cth. bayaran diterima terus via WhatsApp) ----
app.post('/api/admin/issue', requireAdmin, (req, res) => {
  const { package: pkgId, name, email, phone, codeCount } = req.body || {};
  const pkg = Object.hasOwn(PACKAGES, pkgId) ? PACKAGES[pkgId] : null;
  if (!pkg) return res.status(400).json({ error: 'Pakej tidak sah.' });
  if (pkgId === 'whitelabel') return res.status(400).json({ error: 'Whitelabel perlu melalui pesanan dan penyediaan jenama.' });
  const count = Number(codeCount) || pkg.codeCount;
  if (!Number.isInteger(count) || count < 1 || count > 3) return res.status(400).json({ error: 'Bilangan kod tidak sah.' });
  const codes = genCodes(count);
  const orderId = `man_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  saveOrder({
    orderId,
    package: pkgId,
    amount: pkg.price,
    payerName: name || '',
    payerEmail: email || '',
    payerPhone: phone || '',
    status: 'paid',
    codes,
    manual: true,
    createdAt: new Date().toISOString(),
    paidAt: new Date().toISOString(),
  });
  return res.json({ orderId, codes });
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'API tidak dijumpai.' }));
app.use((err, _req, res, _next) => {
  console.error('[api]', err.message);
  res.status(err.status === 413 ? 413 : 500).json({ error: 'Permintaan gagal diproses. Sila cuba lagi.' });
});

// ---- Serve frontend (production) + SPA fallback ----
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = process.env.STATIC_DIR || path.join(__dirname, '..', '..', 'dist');

if (fs.existsSync(STATIC_DIR)) {
  app.use(express.static(STATIC_DIR));
  app.get('*', (req, res) => {
    res.sendFile(path.join(STATIC_DIR, 'index.html'));
  });
}

if (process.env.KIDORA_NO_LISTEN !== '1') app.listen(PORT, () => {
  console.log(`KIDORA backend berjalan di :${PORT}`);
  console.log(`BASE_URL=${BASE_URL}`);
  console.log(`Bayarcash: ${BC_SANDBOX ? 'SANDBOX' : 'PRODUCTION'} — ${BC_TOKEN && BC_SECRET && BC_PORTAL ? '✔ dikonfigurasi' : '✘ belum lengkap (BAYARCASH_PAT/SECRET_KEY/PORTAL_KEY)'}`);
  console.log(`ADMIN_KEY=${ADMIN_KEY ? '✔ ditetapkan' : '✘ belum ditetapkan'}`);
});
