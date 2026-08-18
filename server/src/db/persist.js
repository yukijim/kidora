/* ============================================
   KIDORA — Disk Persistence Layer
   Menyimpan data pengguna (akaun, progress, XP, bintang)
   ke fail JSON supaya kekal selepas server restart.
   ============================================ */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Lokasi fail data: server/data/store.json (boleh overrides guna env DATA_FILE)
const DEFAULT_DATA_FILE = path.join(__dirname, '..', '..', 'data', 'store.json');

export function getDataFile() {
  return process.env.DATA_FILE || DEFAULT_DATA_FILE;
}

/**
 * Baca data tersimpan dari cakera (jika ada).
 * Pulangkan objek data, atau null jika tiada / rosak.
 */
export function loadPersistedData() {
  const file = getDataFile();
  try {
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (err) {
    console.warn('[persist] Gagal baca fail data, guna data lalai:', err.message);
  }
  return null;
}

/**
 * Simpan data ke cakera secara atomik (tulis ke fail sementara, kemudian rename).
 */
export function savePersistedData(data) {
  const file = getDataFile();
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const tmp = `${file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
    fs.renameSync(tmp, file);
    return true;
  } catch (err) {
    console.warn('[persist] Gagal simpan data ke cakera:', err.message);
    return false;
  }
}
