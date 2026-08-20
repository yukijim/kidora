import { useEffect, useState } from 'react';
import GameShell from '../../components/GameShell.jsx';
import Confetti from '../../components/Confetti.jsx';
import { LETTERS, GAMES, VOWELS, SYLLABLES, pick, shuffle } from '../../data/games.js';
import { useLang } from '../../context/LanguageContext.jsx';
import { playCorrect, playWrong, playWin, speak } from '../../lib/audio.js';
import './letter-game.css';

const ROUNDS = 8;

// mode: 'bunyi' | 'awal' | 'vokal' | 'kuiz' | 'suku'
// gameId: id dalam GAMES untuk tajuk (default = mode)
// range: [startIdx, endIdx] untuk hadkan huruf (cth ulangkaji A–M)
export default function LetterChoice({ mode, gameId, range }) {
  const { lang, t, voice } = useLang();
  const game = GAMES.find((g) => g.id === (gameId || mode));
  const pool = range ? LETTERS.slice(range[0], range[1] + 1) : LETTERS;

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [rd, setRd] = useState(null);
  const [status, setStatus] = useState('idle');
  const [wrongIdx, setWrongIdx] = useState(null);
  const [done, setDone] = useState(false);

  const randomDistinct = (exclude, count) =>
    shuffle(pool.filter((l) => l.letter !== exclude)).slice(0, count).map((l) => l.letter);

  const buildRound = () => {
    setStatus('idle');
    setWrongIdx(null);

    if (mode === 'suku') {
      const target = SYLLABLES[Math.floor(Math.random() * SYLLABLES.length)];
      const opts = shuffle([target, ...shuffle(SYLLABLES.filter((s) => s !== target)).slice(0, 2)]);
      setRd({
        kind: 'suku',
        label: t('syllableLabel'),
        big: target,
        speakText: target,
        correct: target,
        options: opts.map((s) => ({ label: s, value: s })),
      });
      return;
    }

    if (mode === 'vokal') {
      const isVowel = Math.random() < 0.5;
      const letter = isVowel
        ? VOWELS[Math.floor(Math.random() * VOWELS.length)]
        : shuffle(pool.filter((l) => !VOWELS.includes(l.letter)))[0].letter;
      const lobj = LETTERS.find((l) => l.letter === letter);
      setRd({
        kind: 'vokal',
        label: t('vowelLabel'),
        big: letter,
        speakText: `${letter} ${t('forWord')} ${pick(lang, lobj, 'word')}`,
        correct: isVowel ? 'vowel' : 'consonant',
        options: shuffle([
          { label: t('vowelOption'), value: 'vowel' },
          { label: t('consonantOption'), value: 'consonant' },
        ]),
      });
      return;
    }

    const target = pool[Math.floor(Math.random() * pool.length)];
    const opts = [target.letter, ...randomDistinct(target.letter, 2)];

    if (mode === 'bunyi') {
      setRd({
        kind: 'bunyi',
        label: t('soundLabel'),
        big: '🔊',
        speakText: `${target.letter} ${t('forWord')} ${pick(lang, target, 'word')}`,
        correct: target.letter,
        options: shuffle(opts.map((l) => ({ label: l, value: l }))),
      });
    } else if (mode === 'awal') {
      setRd({
        kind: 'awal',
        label: t('firstLabel'),
        big: pick(lang, target, 'emoji'),
        word: pick(lang, target, 'word'),
        speakText: pick(lang, target, 'word'),
        correct: target.letter,
        options: shuffle(opts.map((l) => ({ label: l, value: l }))),
      });
    } else if (mode === 'kuiz') {
      const after = Math.random() < 0.5;
      const idx = after
        ? Math.floor(Math.random() * (pool.length - 1))
        : 1 + Math.floor(Math.random() * (pool.length - 1));
      const base = pool[idx];
      const answer = after ? pool[idx + 1] : pool[idx - 1];
      const q = `${after ? t('quizAfter') : t('quizBefore')} ${base.letter}?`;
      setRd({
        kind: 'kuiz',
        label: q,
        big: '❓',
        speakText: q,
        correct: answer.letter,
        options: shuffle([answer.letter, ...randomDistinct(answer.letter, 2)].map((l) => ({ label: l, value: l }))),
      });
    }
  };

  useEffect(() => {
    buildRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    if (rd) {
      const timer = setTimeout(() => speak(rd.speakText, voice), 350);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rd]);

  const choose = (opt, idx) => {
    if (status !== 'idle') return;
    if (opt.value === rd.correct) {
      setStatus('correct');
      playCorrect();
      speak(t('correctWord'), voice);
      setScore((s) => s + 1);
      setTimeout(() => {
        if (round + 1 >= ROUNDS) {
          playWin();
          setDone(true);
        } else {
          setRound((r) => r + 1);
          buildRound();
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
    setRound(0);
    setDone(false);
    buildRound();
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
              <span
                key={i}
                className={`lg-progress__dot ${i < round + (status === 'correct' ? 1 : 0) ? 'lg-progress__dot--on' : ''}`}
              />
            ))}
          </div>

          <div className="lg-prompt">
            <p className="lg-prompt__label">{rd?.label}</p>
            {rd?.kind === 'bunyi' && (
              <button className="lg-speak" onClick={() => speak(rd.speakText, voice)}>🔊</button>
            )}
            {rd?.kind === 'awal' && (
              <>
                <span className="lg-prompt__big">{rd.big}</span>
                <p className="lg-prompt__word">{rd.word}</p>
              </>
            )}
            {(rd?.kind === 'vokal' || rd?.kind === 'kuiz' || rd?.kind === 'suku') && (
              <span className="lg-prompt__big">{rd.big}</span>
            )}
          </div>

          <div className="lg-options">
            {(rd?.options || []).map((o, i) => (
              <button
                key={i}
                className={`lg-option ${status === 'correct' && o.value === rd?.correct ? 'lg-option--correct' : ''} ${wrongIdx === i ? 'lg-option--wrong' : ''} ${rd?.kind === 'vokal' ? 'lg-option--text' : ''}`}
                onClick={() => choose(o, i)}
              >
                {o.label}
              </button>
            ))}
          </div>

          {status !== 'idle' && (
            <div className={`game-feedback game-feedback--${status}`}>
              {status === 'correct' ? t('correctShort') : t('wrongShort')}
            </div>
          )}

          <div className="lg-score">⭐ {score} {t('scoreSuffix')}</div>
        </>
      )}
    </GameShell>
  );
}
