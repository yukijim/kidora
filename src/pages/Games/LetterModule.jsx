import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GameShell from '../../components/GameShell.jsx';
import Confetti from '../../components/Confetti.jsx';
import { LETTERS, pick, shuffle } from '../../data/games.js';
import { useLang } from '../../context/LanguageContext.jsx';
import { playCorrect, playWrong, playWin, playTap, speak } from '../../lib/audio.js';
import './letter-game.css';

export default function LetterModule() {
  const navigate = useNavigate();
  const { letter } = useParams();
  const { lang, t, voice } = useLang();
  const l = LETTERS.find((x) => x.letter === letter);
  const word = l ? pick(lang, l, 'word') : '';
  const emoji = l ? pick(lang, l, 'emoji') : '';
  const title = lang === 'en' ? `Letter ${letter}` : `Huruf ${letter}`;

  const [step, setStep] = useState(0); // 0 kenal, 1 bunyi, 2 cari
  const [status, setStatus] = useState('idle');
  const [wrongIdx, setWrongIdx] = useState(null);
  const [options, setOptions] = useState([]);
  const [grid, setGrid] = useState([]);
  const [done, setDone] = useState(false);

  const speakLetter = () => speak(`${letter} ${t('forWord')} ${word}`, voice);

  const buildChoice = () => {
    const others = shuffle(LETTERS.filter((x) => x.letter !== letter)).slice(0, 2).map((x) => x.letter);
    setOptions(shuffle([letter, ...others]));
    setStatus('idle');
    setWrongIdx(null);
  };

  const buildGrid = () => {
    const others = shuffle(LETTERS.filter((x) => x.letter !== letter)).slice(0, 8).map((x) => x.letter);
    setGrid(shuffle([letter, ...others]));
    setStatus('idle');
    setWrongIdx(null);
  };

  useEffect(() => {
    buildChoice();
    const timer = setTimeout(speakLetter, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letter]);

  const choose = (opt, idx) => {
    if (status !== 'idle') return;
    if (opt === letter) {
      setStatus('correct');
      playCorrect();
      speak(t('correctWord'), voice);
      setTimeout(() => {
        if (step === 0) {
          setStep(1);
          buildChoice();
          speakLetter();
        } else if (step === 1) {
          setStep(2);
          buildGrid();
        } else {
          playWin();
          setDone(true);
        }
      }, 900);
    } else {
      setStatus('wrong');
      setWrongIdx(idx);
      playWrong();
      speak(t('tryAgainWord'), voice);
      setTimeout(() => {
        setStatus('idle');
        setWrongIdx(null);
      }, 800);
    }
  };

  const find = (cell, idx) => {
    if (status !== 'idle') return;
    if (cell === letter) {
      setStatus('correct');
      playCorrect();
      speak(t('correctWord'), voice);
      setTimeout(() => {
        playWin();
        setDone(true);
      }, 700);
    } else {
      setStatus('wrong');
      setWrongIdx(idx);
      playWrong();
      setTimeout(() => {
        setStatus('idle');
        setWrongIdx(null);
      }, 700);
    }
  };

  const next = () => {
    playTap();
    const i = LETTERS.findIndex((x) => x.letter === letter);
    if (i >= 0 && i < LETTERS.length - 1) navigate(`/main/huruf/${LETTERS[i + 1].letter}`);
    else navigate('/main');
  };

  const restart = () => {
    setStep(0);
    setDone(false);
    buildChoice();
    speakLetter();
  };

  const stepLabel = step === 0 ? t('moduleSee') : step === 1 ? t('moduleHear') : t('findLabel');

  return (
    <GameShell title={title} emoji="🔤">
      {done ? (
        <div className="game-win">
          <Confetti />
          <div className="game-win__emoji">🏆</div>
          <h2 className="game-win__title">{t('moduleDone')}</h2>
          <div className="game-win__stars">
            <span>⭐</span><span>⭐</span><span>⭐</span>
          </div>
          <button className="game-btn game-btn--primary" onClick={next}>{t('nextModule')}</button>
          <button className="game-btn game-btn--ghost" onClick={restart}>{t('playAgain')}</button>
        </div>
      ) : (
        <>
          <div className="lg-progress">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`lg-progress__dot ${i < step || (i === step && status === 'correct') ? 'lg-progress__dot--on' : ''}`}
              />
            ))}
          </div>

          <div className="lg-prompt">
            <p className="lg-prompt__label">{stepLabel}</p>
            {step === 0 && (
              <>
                <span className="lg-prompt__big">{letter}</span>
                <p className="lg-prompt__word">{word} {emoji}</p>
              </>
            )}
            {step === 1 && (
              <button className="lg-speak" onClick={speakLetter}>🔊</button>
            )}
            {step === 2 && (
              <span className="lg-prompt__big">{letter}</span>
            )}
          </div>

          {step === 2 ? (
            <div className="lg-grid">
              {grid.map((c, i) => (
                <button
                  key={i}
                  className={`lg-cell ${wrongIdx === i ? 'lg-cell--wrong' : ''}`}
                  onClick={() => find(c, i)}
                >
                  {c}
                </button>
              ))}
            </div>
          ) : (
            <div className="lg-options">
              {options.map((o, i) => (
                <button
                  key={i}
                  className={`lg-option ${status === 'correct' && o === letter ? 'lg-option--correct' : ''} ${wrongIdx === i ? 'lg-option--wrong' : ''}`}
                  onClick={() => choose(o, i)}
                >
                  {o}
                </button>
              ))}
            </div>
          )}

          {status !== 'idle' && (
            <div className={`game-feedback game-feedback--${status}`}>
              {status === 'correct' ? t('correctShort') : t('wrongShort')}
            </div>
          )}
        </>
      )}
    </GameShell>
  );
}
