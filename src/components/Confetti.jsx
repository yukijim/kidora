import './Confetti.css';

const EMOJIS = ['🎉', '⭐', '🎊', '✨', '🥳', '🎈', '🌟', '💫'];

/** Hujan emoji perayaan (CSS sahaja, tiada library). */
export default function Confetti({ count = 36 }) {
  const pieces = Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: EMOJIS[i % EMOJIS.length],
    left: Math.random() * 100,
    delay: Math.random() * 1.2,
    duration: 2.5 + Math.random() * 2,
    size: 18 + Math.random() * 22,
  }));

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti__piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: `${p.size}px`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
