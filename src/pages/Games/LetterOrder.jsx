import { useEffect, useState } from 'react';
import GameShell from '../../components/GameShell.jsx';
import Confetti from '../../components/Confetti.jsx';
import { LETTERS, GAMES, pick, shuffle } from '../../data/games.js';
import { useLang } from '../../context/LanguageContext.jsx';
import { playCorrect, playWrong, playWin, speak } from '../../lib/audio.js';
import './letter-game.css';

const SEQS = 5;
const SEQ_LEN = 4;

export default function LetterOrder() {
  const { lang, t, voice } = useLang();
  const game = GAMES.find((g) => g.id === 'susun');
  const [seqNum, setSeqNum] = useState(0);
  const [seq, setSeq] = useState([]); // turutan betul
  const [tiles, setTiles] = useState([]); // jubin dikocok
  const [placed, setPlaced] = useState([]); // huruf diletakkan (ikut turutan)
  const [wrongIdx, setWrongIdx] = useState(null);
  const [done, setDone] = useState(false);

  const buildSeq = (n) => {
    const start = Math.floor(Math.random() * (LETTERS.length - SEQ_LEN));
    const ordered = LETTERS.slice(start, start + SEQ_LEN).map((l) => l.letter);
    setSeq(ordered);
    setTiles(shuffle(ordered));
    setPlaced([]);
    setWrongIdx(null);
    setSeqNum(n);
  };

  useEffect(() => {
    buildSeq(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tap = (letter, idx) => {
    if (done || placed.includes(letter)) return;
    if (letter === seq[placed.length]) {
      playCorrect();
      speak(letter, voice);
      const np = [...placed, letter];
      setPlaced(np);
      if (np.length === SEQ_LEN) {
        playWin();
        setTimeout(() => {
          if (seqNum + 1 >= SEQS) setDone(true);
          else buildSeq(seqNum + 1);
        }, 900);
      }
    } else {
      playWrong();
      setWrongIdx(idx);
      setTimeout(() => setWrongIdx(null), 600);
    }
  };

  const restart = () => {
    setDone(false);
    buildSeq(0);
  };

  return (
    <GameShell title={pick(lang, game, 'name')} emoji={game.emoji}>
      {done ? (
        <div className="game-win">
          <Confetti />
          <div className="game-win__emoji">🏆</div>
          <h2 className="game-win__title">{t('winTitle')}</h2>
          <div className="game-win__stars">
            <span>⭐</span><span>⭐</span><span>⭐</span>
          </div>
          <button className="game-btn game-btn--primary" onClick={restart}>{t('playAgain')}</button>
        </div>
      ) : (
        <>
          <div className="lg-progress">
            {Array.from({ length: SEQS }).map((_, i) => (
              <span key={i} className={`lg-progress__dot ${i < seqNum ? 'lg-progress__dot--on' : ''}`} />
            ))}
          </div>

          <div className="lg-prompt">
            <p className="lg-prompt__label">{t('orderLabel')}</p>
          </div>

          <div className="lg-slots">
            {seq.map((letter, i) => (
              <span key={i} className={`lg-slot ${i < placed.length ? 'lg-slot--filled' : ''}`}>
                {placed[i] || ''}
              </span>
            ))}
          </div>

          <div className="lg-tiles">
            {tiles.map((letter, i) => {
              const used = placed.includes(letter);
              return (
                <button
                  key={i}
                  disabled={used}
                  className={`lg-tile ${used ? 'lg-tile--used' : ''} ${wrongIdx === i ? 'lg-tile--wrong' : ''}`}
                  onClick={() => tap(letter, i)}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </>
      )}
    </GameShell>
  );
}
