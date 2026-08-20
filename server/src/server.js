// ============================================
// KIDORA Backend — serve static frontend + API:
//   - /api/packages          : senarai pakej harga
//   - /api/order             : cipta bil BizApp Pay → return URL bayaran
//   - /api/bizappay/callback : webhook BizApp Pay (bayaran berjaya → jana kod)
//   - /api/order/:id         : status pesanan (untuk polling muka terima kasih)
//   - /api/validate-code     : semak kod akses
//   - /api/admin/issue       : (pilihan) jana kod manual
// ============================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { generateToken, listCategories, createBill } from './bizappay.js';
import { getOrder, saveOrder, findOrderByBillCode, findOrderByCode } from './store.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.BIZAPPAY_API_KEY || '';
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const ADMIN_KEY = process.env.ADMIN_KEY || '';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Pakej harga (sumber sebenar, dikongsi dengan frontend) ----
const PACKAGES = {
  asas: { name: 'Pakej Asas', price: 9.9, games: ['abc', 'bunyi', 'awal', 'vokal', 'kuiz', 'besarkecil', 'ingatan', 'cari', 'susun', 'eja'], codeCount: 1, tagline: 'Cuba-cuba dulu' },
  lengkap: { name: 'Pakej Lengkap', price: 19.9, games: ['abc', 'bunyi', 'awal', 'vokal', 'kuiz', 'besarkecil', 'ingatan', 'cari', 'susun', 'eja', 'kira', 'padan'], codeCount: 1, tagline: 'Paling popular' },
  keluarga: { name: 'Pakej Keluarga', price: 29.9, games: ['abc', 'bunyi', 'awal', 'vokal', 'kuiz', 'besarkecil', 'ingatan', 'cari', 'susun', 'eja', 'kira', 'padan'], codeCount: 3, tagline: 'Untuk seisi keluarga' },
};

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function genCode() {
  const block = () =>
    Array.from({ length: 4 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
  return `KIDORA-${block()}-${block()}`;
}
function genCodes(count) {
  return Array.from({ length: count }, genCode);
}

let cachedCategory = null;
async function resolveCategory(apiKey, token) {
  if (cachedCategory) return cachedCategory;
  if (process.env.BIZAPPAY_CATEGORY) {
    cachedCategory = process.env.BIZAPPAY_CATEGORY;
    return cachedCategory;
  }
  const categories = await listCategories(apiKey, token);
  cachedCategory = (categories[0] && categories[0].code) || '';
  if (!cachedCategory) throw new Error('Tiada kategori bil. Buat kategori di dashboard BizApp Pay.');
  return cachedCategory;
}

// ---- Kesihatan ----
app.get('/api/health', (_req, res) => res.json({ status: 'healthy', name: 'KIDORA' }));

// ---- Senarai pakej ----
app.get('/api/packages', (_req, res) => {
  res.json({ packages: Object.entries(PACKAGES).map(([id, p]) => ({ id, ...p })) });
});

// ---- Cipta pesanan → bil BizApp Pay ----
app.post('/api/order', async (req, res) => {
  const { package: pkgId, name, email, phone } = req.body || {};
  const pkg = PACKAGES[pkgId];
  if (!pkg) return res.status(400).json({ error: 'Pakej tidak sah.' });

  const payerName = String(name || '').trim();
  const payerEmail = String(email || '').trim();
  const payerPhone = String(phone || '').trim();

  if (payerName.length < 5) return res.status(400).json({ error: 'Sila masukkan nama penuh (min 5 huruf).' });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payerEmail)) return res.status(400).json({ error: 'Emel tidak sah.' });
  if (payerPhone.replace(/\D/g, '').length < 8) return res.status(400).json({ error: 'Nombor telefon tidak sah.' });

  if (!API_KEY) return res.status(503).json({ error: 'Bayaran belum dikonfigurasi. Sila hubungi kami.' });

  const orderId = `ord_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const callbackUrl = `${BASE_URL}/api/bizappay/callback`;
  const returnUrl = `${BASE_URL}/terima-kasih/${orderId}`;

  try {
    const token = await generateToken(API_KEY);
    const category = await resolveCategory(API_KEY, token);
    const bill = await createBill({
      apiKey: API_KEY,
      token,
      category,
      name: `KIDORA ${pkg.name}`,
      amount: pkg.price.toFixed(2),
      payerName,
      payerEmail,
      payerPhone,
      callbackUrl,
      returnUrl,
      extReference: orderId,
    });

    if (bill.status !== 'ok' || !bill.url) {
      throw new Error(bill.msg || 'Gagal cipta bil BizApp Pay.');
    }

    saveOrder({
      orderId,
      package: pkgId,
      amount: pkg.price,
      payerName,
      payerEmail,
      payerPhone,
      billCode: bill.billCode,
      status: 'pending',
      codes: [],
      createdAt: new Date().toISOString(),
    });

    return res.json({ orderId, url: bill.url, billCode: bill.billCode });
  } catch (err) {
    console.error('[order] ralat:', err.message);
    return res.status(500).json({ error: err.message || 'Gagal cipta pesanan. Sila cuba lagi.' });
  }
});

// ---- Webhook / callback BizApp Pay (GET atau POST) ----
async function handleCallback(req, res) {
  const params = { ...req.query, ...req.body };
  console.log('[callback]', JSON.stringify(params));

  const billcode = params.billcode || params.billCode;
  const billstatus = params.billstatus || params.billStatus;
  const billinvoice = params.billinvoice || params.billInvoice;

  const order = findOrderByBillCode(billcode);
  if (!order) {
    console.error('[callback] billcode tidak dikenali:', billcode);
    return res.status(404).send('UNKNOWN');
  }

  if (String(billstatus) === '1') {
    // 1 = berjaya
    if (order.status !== 'paid') {
      const count = PACKAGES[order.package]?.codeCount || 1;
      order.codes = genCodes(count);
    }
    order.status = 'paid';
    order.paidAt = new Date().toISOString();
    order.billinvoice = billinvoice || order.billinvoice;
  } else if (String(billstatus) === '3') {
    order.status = 'failed';
  } else if (String(billstatus) === '2') {
    order.status = 'pending';
  }
  saveOrder(order);
  return res.send('RECEIVED');
}
app.get('/api/bizappay/callback', handleCallback);
app.post('/api/bizappay/callback', handleCallback);

// ---- Status pesanan (untuk muka terima kasih) ----
app.get('/api/order/:id', (req, res) => {
  const order = getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: 'Pesanan tidak dijumpai.' });
  const pkg = PACKAGES[order.package] || {};
  return res.json({
    orderId: order.orderId,
    package: order.package,
    packageName: pkg.name,
    status: order.status,
    games: pkg.games || [],
    codes: order.status === 'paid' ? order.codes : [],
  });
});

// ---- Semak kod akses ----
app.post('/api/validate-code', (req, res) => {
  const code = req.body && req.body.code;
  if (!code) return res.status(400).json({ error: 'Sila masukkan kod akses.' });
  const order = findOrderByCode(code);
  if (!order) return res.status(404).json({ valid: false, error: 'Kod akses tidak sah.' });
  const pkg = PACKAGES[order.package] || {};
  return res.json({ valid: true, package: order.package, games: pkg.games || [] });
});

// ---- (Pilihan) Jana kod manual — hanya aktif bila ADMIN_KEY ditetapkan ----
if (ADMIN_KEY) {
  app.post('/api/admin/issue', (req, res) => {
    const { key, package: pkgId, name, email, phone, codeCount } = req.body || {};
    if (key !== ADMIN_KEY) return res.status(401).json({ error: 'Kunci admin salah.' });
    const pkg = PACKAGES[pkgId];
    if (!pkg) return res.status(400).json({ error: 'Pakej tidak sah.' });
    const count = Number(codeCount) || pkg.codeCount;
    const codes = genCodes(count);
    const orderId = `man_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    saveOrder({
      orderId,
      package: pkgId,
      amount: pkg.price,
      payerName: name || '',
      payerEmail: email || '',
      payerPhone: phone || '',
      billCode: null,
      status: 'paid',
      codes,
      manual: true,
      createdAt: new Date().toISOString(),
    });
    return res.json({ orderId, codes });
  });
}

// ---- Serve frontend (production) + SPA fallback ----
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = process.env.STATIC_DIR || path.join(__dirname, '..', '..', 'dist');

if (fs.existsSync(STATIC_DIR)) {
  app.use(express.static(STATIC_DIR));
  app.get('*', (req, res) => {
    res.sendFile(path.join(STATIC_DIR, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`KIDORA backend berjalan di :${PORT}`);
  console.log(`BASE_URL=${BASE_URL}`);
  console.log(`BIZAPPAY_API_KEY=${API_KEY ? '✔ ditetapkan' : '✘ belum ditetapkan'}`);
});
