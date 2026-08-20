import { useEffect, useState } from 'react';
import GameShell from '../../components/GameShell.jsx';
import Confetti from '../../components/Confetti.jsx';
import { NUMBERS, GAMES, pick, shuffle } from '../../data/games.js';
import { useLang } from '../../context/LanguageContext.jsx';
import { playCorrect, playWrong, playWin, speak } from '../../lib/audio.js';
import './CountingGame.css';

const ROUNDS = 8;

export default function CountingGame() {
  const { lang, t, voice } = useLang();
  const game = GAMES.find((g) => g.id === 'kira');
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(null);
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState('idle');
  const [wrongIdx, setWrongIdx] = useState(null);
  const [done, setDone] = useState(false);

  const startRound = (r) => {
    const tgt = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    const opts = [tgt.value];
    while (opts.length < 3) {
      const v = Math.floor(Math.random() * 10) + 1;
      if (!opts.includes(v)) opts.push(v);
    }
    setTarget(tgt);
    setOptions(shuffle(opts));
    setStatus('idle');
    setWrongIdx(null);
    setRound(r);
  };

  useEffect(() => {
    startRound(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (target) {
      const timer = setTimeout(() => speak(t('countSpeak'), voice), 350);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, lang]);

  const pickNum = (value, idx) => {
    if (status !== 'idle') return;
    if (value === target.value) {
      setStatus('correct');
      playCorrect();
      speak(pick(lang, target, 'name'), voice);
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
      speak(t('tryAgainWord'), voice);
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
    <GameShell title={pick(lang, game, 'name')} emoji="🔢">
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
          <div className="count-progress">
            {Array.from({ length: ROUNDS }).map((_, i) => (
              <span
                key={i}
                className={`count-progress__dot ${i < round + (status === 'correct' ? 1 : 0) ? 'count-progress__dot--on' : ''}`}
              />
            ))}
          </div>

          <div className="count-question">
            <p className="count-question__label">{t('countLabel')}</p>
            <div className={`count-objects ${status === 'correct' ? 'count-objects--correct' : ''}`}>
              {target && Array.from({ length: target.value }).map((_, i) => (
                <span key={i} className="count-object">{target.emoji}</span>
              ))}
            </div>
          </div>

          <div className="count-options">
            {options.map((v, i) => (
              <button
                key={i}
                className={`count-option ${
                  status === 'correct' && v === target?.value ? 'count-option--correct' : ''
                } ${wrongIdx === i ? 'count-option--wrong' : ''}`}
                onClick={() => pickNum(v, i)}
              >
                {v}
              </button>
            ))}
          </div>

          {status !== 'idle' && (
            <div className={`game-feedback game-feedback--${status}`}>
              {status === 'correct' ? `🎉 ${t('correctWord')} ${pick(lang, target, 'name')}!` : t('wrongShort')}
            </div>
          )}

          <div className="count-score">⭐ {score} {t('scoreSuffix')}</div>
        </>
      )}
    </GameShell>
  );
}
