// ============================================
// KIDORA — Audio helper (Web Audio + Speech Synthesis)
// Tiada fail audio diperlukan — semua dijana dalam pelayar.
// ============================================

let ctx = null;

function ensureCtx() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, start, duration, type = 'sine', gain = 0.16) {
  const c = ensureCtx();
  if (!c) return;
  try {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.value = freq;
    const t0 = c.currentTime + start;
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    o.connect(g);
    g.connect(c.destination);
    o.start(t0);
    o.stop(t0 + duration);
  } catch {
    /* abaikan */
  }
}

/** Bunyi betul — nada naik ceria */
export function playCorrect() {
  tone(523.25, 0, 0.16);
  tone(659.25, 0.12, 0.16);
  tone(783.99, 0.24, 0.28);
}

/** Bunyi salah — rendah lembut */
export function playWrong() {
  tone(196, 0, 0.28, 'triangle', 0.09);
  tone(150, 0.12, 0.3, 'triangle', 0.07);
}

/** Bunyi ketukan butang */
export function playTap() {
  tone(440, 0, 0.07);
}

/** Bunyi menang — fanfar kecil */
export function playWin() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.13, 0.22));
}

/** Sebut teks dalam Bahasa Melayu */
export function speak(text, lang = 'ms-MY') {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.85;
    u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  } catch {
    /* abaikan */
  }
}
