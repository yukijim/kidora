// ============================================
// KIDORA — Data permainan & pakej (dwibahasa)
// ============================================

// Pilih medan ikut bahasa semasa (cth: name / nameEn)
export function pick(lang, obj, field) {
  return lang === 'en' ? obj[field + 'En'] : obj[field];
}

// Huruf A–Z: sebutan + contoh perkataan (Melayu & English)
export const LETTERS = [
  { letter: 'A', name: 'e', word: 'Ayam', emoji: '🐔', nameEn: 'ay', wordEn: 'Apple', emojiEn: '🍎' },
  { letter: 'B', name: 'bi', word: 'Bola', emoji: '⚽', nameEn: 'bee', wordEn: 'Ball', emojiEn: '⚽' },
  { letter: 'C', name: 'si', word: 'Cawan', emoji: '☕', nameEn: 'see', wordEn: 'Cat', emojiEn: '🐱' },
  { letter: 'D', name: 'di', word: 'Durian', emoji: '🥭', nameEn: 'dee', wordEn: 'Dog', emojiEn: '🐶' },
  { letter: 'E', name: 'i', word: 'Epal', emoji: '🍎', nameEn: 'ee', wordEn: 'Egg', emojiEn: '🥚' },
  { letter: 'F', name: 'ef', word: 'Foto', emoji: '📷', nameEn: 'eff', wordEn: 'Fish', emojiEn: '🐟' },
  { letter: 'G', name: 'ji', word: 'Gajah', emoji: '🐘', nameEn: 'jee', wordEn: 'Goat', emojiEn: '🐐' },
  { letter: 'H', name: 'ec', word: 'Harimau', emoji: '🐯', nameEn: 'aitch', wordEn: 'Hat', emojiEn: '🎩' },
  { letter: 'I', name: 'ai', word: 'Ikan', emoji: '🐟', nameEn: 'eye', wordEn: 'Ice cream', emojiEn: '🍦' },
  { letter: 'J', name: 'je', word: 'Jam', emoji: '⏰', nameEn: 'jay', wordEn: 'Juice', emojiEn: '🧃' },
  { letter: 'K', name: 'ke', word: 'Kucing', emoji: '🐱', nameEn: 'kay', wordEn: 'Kite', emojiEn: '🪁' },
  { letter: 'L', name: 'el', word: 'Lori', emoji: '🚚', nameEn: 'ell', wordEn: 'Lion', emojiEn: '🦁' },
  { letter: 'M', name: 'em', word: 'Monyet', emoji: '🐵', nameEn: 'em', wordEn: 'Moon', emojiEn: '🌙' },
  { letter: 'N', name: 'en', word: 'Nanas', emoji: '🍍', nameEn: 'en', wordEn: 'Nest', emojiEn: '🪺' },
  { letter: 'O', name: 'o', word: 'Oren', emoji: '🍊', nameEn: 'oh', wordEn: 'Orange', emojiEn: '🍊' },
  { letter: 'P', name: 'pi', word: 'Pisang', emoji: '🍌', nameEn: 'pee', wordEn: 'Pig', emojiEn: '🐷' },
  { letter: 'Q', name: 'kiu', word: 'Quran', emoji: '📖', nameEn: 'cue', wordEn: 'Queen', emojiEn: '👑' },
  { letter: 'R', name: 'ar', word: 'Rumah', emoji: '🏠', nameEn: 'ar', wordEn: 'Rabbit', emojiEn: '🐰' },
  { letter: 'S', name: 'es', word: 'Siput', emoji: '🐌', nameEn: 'ess', wordEn: 'Sun', emojiEn: '☀️' },
  { letter: 'T', name: 'ti', word: 'Tikus', emoji: '🐭', nameEn: 'tee', wordEn: 'Tree', emojiEn: '🌳' },
  { letter: 'U', name: 'yu', word: 'Ular', emoji: '🐍', nameEn: 'you', wordEn: 'Umbrella', emojiEn: '☂️' },
  { letter: 'V', name: 'vi', word: 'Van', emoji: '🚐', nameEn: 'vee', wordEn: 'Van', emojiEn: '🚐' },
  { letter: 'W', name: 'dabel yu', word: 'Wau', emoji: '🪁', nameEn: 'double-you', wordEn: 'Whale', emojiEn: '🐳' },
  { letter: 'X', name: 'eks', word: 'Xilofon', emoji: '🎹', nameEn: 'ex', wordEn: 'Xylophone', emojiEn: '🎹' },
  { letter: 'Y', name: 'wai', word: 'Yoyo', emoji: '🪀', nameEn: 'why', wordEn: 'Yo-yo', emojiEn: '🪀' },
  { letter: 'Z', name: 'zed', word: 'Zirafah', emoji: '🦒', nameEn: 'zed', wordEn: 'Zebra', emojiEn: '🦓' },
];

// Nombor 1–10: sebutan + emoji objek untuk mengira
export const NUMBERS = [
  { value: 1, name: 'satu', emoji: '🍎', nameEn: 'one' },
  { value: 2, name: 'dua', emoji: '🍌', nameEn: 'two' },
  { value: 3, name: 'tiga', emoji: '🐱', nameEn: 'three' },
  { value: 4, name: 'empat', emoji: '🐶', nameEn: 'four' },
  { value: 5, name: 'lima', emoji: '⭐', nameEn: 'five' },
  { value: 6, name: 'enam', emoji: '🎈', nameEn: 'six' },
  { value: 7, name: 'tujuh', emoji: '🚗', nameEn: 'seven' },
  { value: 8, name: 'lapan', emoji: '🌸', nameEn: 'eight' },
  { value: 9, name: 'sembilan', emoji: '🐟', nameEn: 'nine' },
  { value: 10, name: 'sepuluh', emoji: '🦋', nameEn: 'ten' },
];

// Pasangan emoji untuk permainan padanan
export const PAIRS = [
  { id: 'cat', emoji: '🐱', name: 'kucing', nameEn: 'cat' },
  { id: 'dog', emoji: '🐶', name: 'anjing', nameEn: 'dog' },
  { id: 'lion', emoji: '🦁', name: 'singa', nameEn: 'lion' },
  { id: 'frog', emoji: '🐸', name: 'katak', nameEn: 'frog' },
  { id: 'panda', emoji: '🐼', name: 'panda', nameEn: 'panda' },
  { id: 'rabbit', emoji: '🐰', name: 'arnab', nameEn: 'rabbit' },
];

// Pakej harga (mesti sepadan dengan backend server/src/server.js)
export const PACKAGES = [
  {
    id: 'asas',
    name: 'Pakej Asas',
    nameEn: 'Basic Plan',
    priceLabel: 'RM 9.90',
    tagline: 'Cuba-cuba dulu',
    taglineEn: 'Just try it',
    games: ['abc'],
    popular: false,
    features: ['1 permainan: Kenal Huruf ABC', 'Akses tanpa had', 'Mudah untuk mula'],
    featuresEn: ['1 game: ABC Letters', 'Unlimited access', 'Easy to start'],
  },
  {
    id: 'lengkap',
    name: 'Pakej Lengkap',
    nameEn: 'Complete Plan',
    priceLabel: 'RM 19.90',
    tagline: 'Paling popular',
    taglineEn: 'Most popular',
    games: ['abc', 'kira', 'padan'],
    popular: true,
    features: ['Ketiga-tiga permainan', 'Akses tanpa had', 'Nilai terbaik'],
    featuresEn: ['All three games', 'Unlimited access', 'Best value'],
  },
  {
    id: 'keluarga',
    name: 'Pakej Keluarga',
    nameEn: 'Family Plan',
    priceLabel: 'RM 29.90',
    tagline: 'Untuk seisi keluarga',
    taglineEn: 'For the whole family',
    games: ['abc', 'kira', 'padan'],
    popular: false,
    features: ['Ketiga-tiga permainan', '3 kod akses (3 peranti)', 'Permainan baru percuma', 'Sokongan WhatsApp keutamaan'],
    featuresEn: ['All three games', '3 access codes (3 devices)', 'Free new games', 'Priority WhatsApp support'],
  },
];

export const GAMES = [
  {
    id: 'abc',
    name: 'Kenal Huruf ABC',
    nameEn: 'ABC Letters',
    emoji: '🔤',
    desc: 'Belajar huruf A–Z dengan bunyi & perkataan.',
    descEn: 'Learn letters A–Z with sounds & words.',
    learn: 'Belajar: huruf, bunyi & perkataan',
    learnEn: 'Learn: letters, sounds & words',
    demo: ['A', 'B', 'C'],
    color: 'var(--color-primary)',
    bg: 'var(--gradient-card-learn)',
  },
  {
    id: 'kira',
    name: 'Mari Mengira',
    nameEn: 'Let\'s Count',
    emoji: '🔢',
    desc: 'Kira objek & pilih nombor 1–10.',
    descEn: 'Count objects & pick the number 1–10.',
    learn: 'Belajar: mengira & nombor',
    learnEn: 'Learn: counting & numbers',
    demo: ['1', '2', '3'],
    color: 'var(--color-secondary)',
    bg: 'var(--gradient-card-play)',
  },
  {
    id: 'padan',
    name: 'Padankan Gambar',
    nameEn: 'Picture Match',
    emoji: '🃏',
    desc: 'Cari pasangan haiwan yang sama.',
    descEn: 'Find the matching animal pairs.',
    learn: 'Belajar: ingatan & pengecaman',
    learnEn: 'Learn: memory & recognition',
    demo: ['🐱', '🐶', '🐰'],
    color: 'var(--color-purple)',
    bg: 'var(--gradient-card-grow)',
  },
];

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
