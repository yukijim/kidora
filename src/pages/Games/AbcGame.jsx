import { useEffect, useState } from 'react';
import GameShell from '../../components/GameShell.jsx';
import Confetti from '../../components/Confetti.jsx';
import { LETTERS, GAMES, pick, shuffle } from '../../data/games.js';
import { useLang } from '../../context/LanguageContext.jsx';
import { playCorrect, playWrong, playWin, speak } from '../../lib/audio.js';
import './AbcGame.css';

const ROUNDS = 8;

export default function AbcGame() {
  const { lang, t, voice } = useLang();
  const game = GAMES.find((g) => g.id === 'abc');
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(null);
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | correct | wrong
  const [wrongIdx, setWrongIdx] = useState(null);
  const [done, setDone] = useState(false);

  const startRound = (r) => {
    const tgt = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    const opts = [tgt];
    while (opts.length < 3) {
      const c = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      if (!opts.includes(c)) opts.push(c);
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
      const word = pick(lang, target, 'word');
      const timer = setTimeout(() => speak(`${target.letter} ${t('forWord')} ${word}`, voice), 350);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, lang]);

  const pickLetter = (opt, idx) => {
    if (status !== 'idle') return;
    if (opt.letter === target.letter) {
      setStatus('correct');
      playCorrect();
      speak(t('correctWord'), voice);
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

  const word = target ? pick(lang, target, 'word') : '';
  const emoji = target ? pick(lang, target, 'emoji') : '';

  return (
    <GameShell title={pick(lang, game, 'name')} emoji="🔤">
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
          <div className="abc-progress">
            {Array.from({ length: ROUNDS }).map((_, i) => (
              <span
                key={i}
                className={`abc-progress__dot ${i < round + (status === 'correct' ? 1 : 0) ? 'abc-progress__dot--on' : ''}`}
              />
            ))}
          </div>

          <div className="abc-question">
            <p className="abc-question__label">{t('abcLabel')}</p>
            <div className={`abc-target abc-target--${status}`}>
              <span className="abc-target__letter">{target ? target.letter : ''}</span>
            </div>
            <button className="abc-question__speak" onClick={() => target && speak(`${target.letter} ${t('forWord')} ${word}`, voice)}>
              {t('abcListen')}
            </button>
            <p className="abc-question__hint">
              {target ? `${target.letter} ${t('forWord')} ${word} ${emoji}` : ''}
            </p>
          </div>

          <div className="abc-options">
            {options.map((o, i) => (
              <button
                key={i}
                className={`abc-option ${
                  status === 'correct' && o.letter === target?.letter ? 'abc-option--correct' : ''
                } ${wrongIdx === i ? 'abc-option--wrong' : ''}`}
                onClick={() => pickLetter(o, i)}
              >
                {o.letter}
              </button>
            ))}
          </div>

          {status !== 'idle' && (
            <div className={`game-feedback game-feedback--${status}`}>
              {status === 'correct' ? t('correctShort') : t('wrongShort')}
            </div>
          )}

          <div className="abc-score">⭐ {score} {t('scoreSuffix')}</div>
        </>
      )}
    </GameShell>
  );
}
