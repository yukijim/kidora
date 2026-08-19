import { useEffect, useState } from 'react';
import GameShell from '../../components/GameShell.jsx';
import Confetti from '../../components/Confetti.jsx';
import { LETTERS, shuffle } from '../../data/games.js';
import { playCorrect, playWrong, playWin, speak } from '../../lib/audio.js';
import './AbcGame.css';

const ROUNDS = 8;

export default function AbcGame() {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(null);
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | correct | wrong
  const [wrongIdx, setWrongIdx] = useState(null);
  const [done, setDone] = useState(false);

  const startRound = (r) => {
    const t = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    const opts = [t];
    while (opts.length < 3) {
      const c = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      if (!opts.includes(c)) opts.push(c);
    }
    setTarget(t);
    setOptions(shuffle(opts));
    setStatus('idle');
    setWrongIdx(null);
    setRound(r);
  };

  useEffect(() => {
    startRound(0);
  }, []);

  useEffect(() => {
    if (target) {
      const timer = setTimeout(() => speak(`${target.letter} untuk ${target.word}`), 350);
      return () => clearTimeout(timer);
    }
  }, [target]);

  const pick = (opt, idx) => {
    if (status !== 'idle') return;
    if (opt.letter === target.letter) {
      setStatus('correct');
      playCorrect();
      speak('Betul!');
      setScore((s) => s + 1);
      setTimeout(() => {
        if (round + 1 >= ROUNDS) {
          playWin();
          setDone(true);
        } else {
          startRound(round + 1);
        }
      }, 1100);
    } else {
      setStatus('wrong');
      setWrongIdx(idx);
      playWrong();
      speak('Cuba lagi');
      setTimeout(() => {
        setStatus('idle');
        setWrongIdx(null);
      }, 900);
    }
  };

  const restart = () => {
    setScore(0);
    setDone(false);
    startRound(0);
  };

  return (
    <GameShell title="Kenal Huruf ABC" emoji="🔤">
      {done ? (
        <div className="game-win">
          <Confetti />
          <div className="game-win__emoji">🏆</div>
          <h2 className="game-win__title">Hebat! Pandainya! 🎉</h2>
          <p className="game-win__score">Kamu dapat {score} / {ROUNDS} ⭐</p>
          <div className="game-win__stars">
            {Array.from({ length: Math.max(1, Math.round((score / ROUNDS) * 3)) }).map((_, i) => (
              <span key={i}>⭐</span>
            ))}
          </div>
          <button className="game-btn game-btn--primary" onClick={restart}>Main Lagi 🔁</button>
        </div>
      ) : (
        <>
          <div className="abc-progress">
            {Array.from({ length: ROUNDS }).map((_, i) => (
              <span
                key={i}
                className={`abc-progress__dot ${i < round + (status === 'correct' ? 1 : 0) ? 'abc-progress__dot--on' : ''}`}
              />
            ))}
          </div>

          <div className="abc-question">
            <p className="abc-question__label">🔍 Tekan huruf ini</p>
            <div className={`abc-target abc-target--${status}`}>
              <span className="abc-target__letter">{target ? target.letter : ''}</span>
            </div>
            <button className="abc-question__speak" onClick={() => target && speak(`${target.letter} untuk ${target.word}`)}>
              🔊 Dengar
            </button>
            <p className="abc-question__hint">
              {target ? `${target.letter} untuk ${target.word} ${target.emoji}` : ''}
            </p>
          </div>

          <div className="abc-options">
            {options.map((o, i) => (
              <button
                key={i}
                className={`abc-option ${
                  status === 'correct' && o.letter === target?.letter ? 'abc-option--correct' : ''
                } ${wrongIdx === i ? 'abc-option--wrong' : ''}`}
                onClick={() => pick(o, i)}
              >
                {o.letter}
              </button>
            ))}
          </div>

          {status !== 'idle' && (
            <div className={`game-feedback game-feedback--${status}`}>
              {status === 'correct' ? '🎉 Betul! Hebat!' : '💪 Hampir! Cuba lagi!'}
            </div>
          )}

          <div className="abc-score">⭐ {score} betul</div>
        </>
      )}
    </GameShell>
  );
}
