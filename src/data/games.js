// ============================================
// KIDORA — Data permainan & pakej
// ============================================

// Huruf A–Z: nama sebutan Melayu + contoh perkataan
export const LETTERS = [
  { letter: 'A', name: 'e', word: 'Ayam', emoji: '🐔' },
  { letter: 'B', name: 'bi', word: 'Bola', emoji: '⚽' },
  { letter: 'C', name: 'si', word: 'Cawan', emoji: '☕' },
  { letter: 'D', name: 'di', word: 'Durian', emoji: '🥭' },
  { letter: 'E', name: 'i', word: 'Epal', emoji: '🍎' },
  { letter: 'F', name: 'ef', word: 'Foto', emoji: '📷' },
  { letter: 'G', name: 'ji', word: 'Gajah', emoji: '🐘' },
  { letter: 'H', name: 'ec', word: 'Harimau', emoji: '🐯' },
  { letter: 'I', name: 'ai', word: 'Ikan', emoji: '🐟' },
  { letter: 'J', name: 'je', word: 'Jam', emoji: '⏰' },
  { letter: 'K', name: 'ke', word: 'Kucing', emoji: '🐱' },
  { letter: 'L', name: 'el', word: 'Lori', emoji: '🚚' },
  { letter: 'M', name: 'em', word: 'Monyet', emoji: '🐵' },
  { letter: 'N', name: 'en', word: 'Nanas', emoji: '🍍' },
  { letter: 'O', name: 'o', word: 'Oren', emoji: '🍊' },
  { letter: 'P', name: 'pi', word: 'Pisang', emoji: '🍌' },
  { letter: 'Q', name: 'kiu', word: 'Quran', emoji: '📖' },
  { letter: 'R', name: 'ar', word: 'Rumah', emoji: '🏠' },
  { letter: 'S', name: 'es', word: 'Siput', emoji: '🐌' },
  { letter: 'T', name: 'ti', word: 'Tikus', emoji: '🐭' },
  { letter: 'U', name: 'yu', word: 'Ular', emoji: '🐍' },
  { letter: 'V', name: 'vi', word: 'Van', emoji: '🚐' },
  { letter: 'W', name: 'dabel yu', word: 'Wau', emoji: '🪁' },
  { letter: 'X', name: 'eks', word: 'Xilofon', emoji: '🎹' },
  { letter: 'Y', name: 'wai', word: 'Yoyo', emoji: '🪀' },
  { letter: 'Z', name: 'zed', word: 'Zirafah', emoji: '🦒' },
];

// Nombor 1–10: sebutan Melayu + emoji objek untuk mengira
export const NUMBERS = [
  { value: 1, name: 'satu', emoji: '🍎' },
  { value: 2, name: 'dua', emoji: '🍌' },
  { value: 3, name: 'tiga', emoji: '🐱' },
  { value: 4, name: 'empat', emoji: '🐶' },
  { value: 5, name: 'lima', emoji: '⭐' },
  { value: 6, name: 'enam', emoji: '🎈' },
  { value: 7, name: 'tujuh', emoji: '🚗' },
  { value: 8, name: 'lapan', emoji: '🌸' },
  { value: 9, name: 'sembilan', emoji: '🐟' },
  { value: 10, name: 'sepuluh', emoji: '🦋' },
];

// Pasangan emoji untuk permainan padanan
export const PAIRS = [
  { id: 'cat', emoji: '🐱', name: 'kucing' },
  { id: 'dog', emoji: '🐶', name: 'anjing' },
  { id: 'lion', emoji: '🦁', name: 'singa' },
  { id: 'frog', emoji: '🐸', name: 'katak' },
  { id: 'panda', emoji: '🐼', name: 'panda' },
  { id: 'rabbit', emoji: '🐰', name: 'arnab' },
];

// Pakej harga (mesti sepadan dengan backend server/src/server.js)
export const PACKAGES = [
  {
    id: 'asas',
    name: 'Pakej Asas',
    priceLabel: 'RM 9.90',
    tagline: 'Cuba-cuba dulu',
    games: ['abc'],
    popular: false,
    features: ['1 permainan: Kenal Huruf ABC', 'Akses tanpa had', 'Mudah untuk mula'],
  },
  {
    id: 'lengkap',
    name: 'Pakej Lengkap',
    priceLabel: 'RM 19.90',
    tagline: 'Paling popular',
    games: ['abc', 'kira', 'padan'],
    popular: true,
    features: ['Ketiga-tiga permainan', 'Akses tanpa had', 'Nilai terbaik'],
  },
  {
    id: 'keluarga',
    name: 'Pakej Keluarga',
    priceLabel: 'RM 29.90',
    tagline: 'Untuk seisi keluarga',
    games: ['abc', 'kira', 'padan'],
    popular: false,
    features: ['Ketiga-tiga permainan', '3 kod akses (3 peranti)', 'Permainan baru percuma', 'Sokongan WhatsApp keutamaan'],
  },
];

export const GAMES = [
  { id: 'abc', name: 'Kenal Huruf ABC', emoji: '🔤', desc: 'Belajar huruf A–Z dengan bunyi & perkataan.', learn: 'Belajar: huruf, bunyi & perkataan', demo: ['A', 'B', 'C'], color: 'var(--color-primary)', bg: 'var(--gradient-card-learn)' },
  { id: 'kira', name: 'Mari Mengira', emoji: '🔢', desc: 'Kira objek & pilih nombor 1–10.', learn: 'Belajar: mengira & nombor', demo: ['1', '2', '3'], color: 'var(--color-secondary)', bg: 'var(--gradient-card-play)' },
  { id: 'padan', name: 'Padankan Gambar', emoji: '🃏', desc: 'Cari pasangan haiwan yang sama.', learn: 'Belajar: ingatan & pengecaman', demo: ['🐱', '🐶', '🐰'], color: 'var(--color-purple)', bg: 'var(--gradient-card-grow)' },
];

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
