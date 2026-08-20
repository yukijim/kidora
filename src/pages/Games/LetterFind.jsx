import { useEffect, useState } from 'react';
import GameShell from '../../components/GameShell.jsx';
import Confetti from '../../components/Confetti.jsx';
import { LETTERS, GAMES, pick, shuffle } from '../../data/games.js';
import { useLang } from '../../context/LanguageContext.jsx';
import { playCorrect, playWrong, playWin, speak } from '../../lib/audio.js';
import './letter-game.css';

const ROUNDS = 6;
const GRID = 16;

export default function LetterFind() {
  const { lang, t, voice } = useLang();
  const game = GAMES.find((g) => g.id === 'cari');
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(null);
  const [cells, setCells] = useState([]);
  const [wrongIdx, setWrongIdx] = useState(null);
  const [done, setDone] = useState(false);

  const buildRound = (r) => {
    const tg = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    const others = shuffle(LETTERS.filter((l) => l.letter !== tg.letter))
      .slice(0, GRID - 1)
      .map((l) => l.letter);
    setTarget(tg);
    setCells(shuffle([tg.letter, ...others]));
    setWrongIdx(null);
    setRound(r);
  };

  useEffect(() => {
    buildRound(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (target) {
      const timer = setTimeout(() => speak(`${target.letter} ${t('forWord')} ${pick(lang, target, 'word')}`, voice), 350);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, lang]);

  const tap = (cell, idx) => {
    if (done) return;
    if (cell === target.letter) {
      playCorrect();
      speak(t('correctWord'), voice);
      setScore((s) => s + 1);
      setTimeout(() => {
        if (round + 1 >= ROUNDS) {
          playWin();
          setDone(true);
        } else {
          buildRound(round + 1);
        }
      }, 800);
    } else {
      playWrong();
      setWrongIdx(idx);
      setTimeout(() => setWrongIdx(null), 600);
    }
  };

  const restart = () => {
    setScore(0);
    setDone(false);
    buildRound(0);
  };

  return (
    <GameShell title={pick(lang, game, 'name')} emoji={game.emoji}>
      {done ? (
        <div className="game-win">
          <Confetti />
          <div className="game-win__emoji">🏆</div>
          <h2 className="game-win__title">{t('winTitle')}</h2>
          <p className="game-win__score">{t('winScore')} {score} / {ROUNDS} ⭐</p>
          <div className="game-win__stars">
            {Array.from({ length: Math.max(1, Math.round((score / ROUNDS) * 3)) }).map((_, i) => (
              <span key={i}>⭐</span>
            ))}
          </div>
          <button className="game-btn game-btn--primary" onClick={restart}>{t('playAgain')}</button>
        </div>
      ) : (
        <>
          <div className="lg-progress">
            {Array.from({ length: ROUNDS }).map((_, i) => (
              <span key={i} className={`lg-progress__dot ${i < round ? 'lg-progress__dot--on' : ''}`} />
            ))}
          </div>

          <div className="lg-prompt">
            <p className="lg-prompt__label">{t('findLabel')}</p>
            <span className="lg-prompt__big">{target?.letter}</span>
          </div>

          <div className="lg-grid">
            {cells.map((c, i) => (
              <button
                key={i}
                className={`lg-cell ${wrongIdx === i ? 'lg-cell--wrong' : ''}`}
                onClick={() => tap(c, i)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="lg-score">⭐ {score} {t('scoreSuffix')}</div>
        </>
      )}
    </GameShell>
  );
}
