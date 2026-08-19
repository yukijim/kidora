// ============================================
// KIDORA — JSON disk-persistence (orders & access codes)
// Data disimpan di server/data/ (gitignored).
// ============================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

function ensureDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function load(file, fallback) {
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.error('Gagal baca', file, err.message);
  }
  return fallback;
}

function save(file, data) {
  ensureDir();
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, file);
}

/** @returns {{ [orderId]: object }} */
export function getOrders() {
  return load(ORDERS_FILE, {});
}

export function getOrder(orderId) {
  return getOrders()[orderId] || null;
}

export function saveOrder(order) {
  const orders = getOrders();
  orders[order.orderId] = order;
  save(ORDERS_FILE, orders);
}

export function findOrderByBillCode(billCode) {
  if (!billCode) return null;
  return Object.values(getOrders()).find((o) => o.billCode === billCode) || null;
}

export function findOrderByCode(code) {
  const normalized = String(code).trim().toUpperCase();
  return (
    Object.values(getOrders()).find((o) => (o.codes || []).some((c) => c === normalized)) || null
  );
}
