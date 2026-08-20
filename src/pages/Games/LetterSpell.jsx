import { useEffect, useState } from 'react';
import GameShell from '../../components/GameShell.jsx';
import Confetti from '../../components/Confetti.jsx';
import { GAMES, SPELL_WORDS, pick, shuffle } from '../../data/games.js';
import { useLang } from '../../context/LanguageContext.jsx';
import { playCorrect, playWrong, playWin, speak } from '../../lib/audio.js';
import './letter-game.css';

const WORDS = 5;

export default function LetterSpell() {
  const { lang, t, voice } = useLang();
  const game = GAMES.find((g) => g.id === 'eja');
  const [wordNum, setWordNum] = useState(0);
  const [cur, setCur] = useState(null); // { word, emoji }
  const [tiles, setTiles] = useState([]); // [{id, ch}]
  const [usedIds, setUsedIds] = useState([]);
  const [spelled, setSpelled] = useState([]); // huruf diletakkan ikut urutan
  const [wrongIdx, setWrongIdx] = useState(null);
  const [done, setDone] = useState(false);

  const buildWord = (n) => {
    const w = SPELL_WORDS[Math.floor(Math.random() * SPELL_WORDS.length)];
    const word = pick(lang, w, 'word').toUpperCase();
    setCur({ word, emoji: w.emoji });
    setTiles(shuffle(word.split('').map((ch, i) => ({ ch, id: i }))));
    setUsedIds([]);
    setSpelled([]);
    setWrongIdx(null);
    setWordNum(n);
    speak(word, voice);
  };

  useEffect(() => {
    buildWord(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const tap = (tile, idx) => {
    if (done || usedIds.includes(tile.id)) return;
    if (tile.ch === cur.word[spelled.length]) {
      playCorrect();
      speak(tile.ch, voice);
      const ns = [...spelled, tile.ch];
      setSpelled(ns);
      setUsedIds((u) => [...u, tile.id]);
      if (ns.length === cur.word.length) {
        playWin();
        setTimeout(() => speak(cur.word, voice), 400);
        setTimeout(() => {
          if (wordNum + 1 >= WORDS) setDone(true);
          else buildWord(wordNum + 1);
        }, 1400);
      }
    } else {
      playWrong();
      setWrongIdx(idx);
      setTimeout(() => setWrongIdx(null), 600);
    }
  };

  const restart = () => {
    setDone(false);
    buildWord(0);
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
            {Array.from({ length: WORDS }).map((_, i) => (
              <span key={i} className={`lg-progress__dot ${i < wordNum ? 'lg-progress__dot--on' : ''}`} />
            ))}
          </div>

          <div className="lg-prompt">
            <p className="lg-prompt__label">{t('spellLabel')}</p>
            <span className="lg-prompt__big">{cur?.emoji}</span>
          </div>

          <div className="lg-slots">
            {cur && cur.word.split('').map((_, i) => (
              <span key={i} className={`lg-slot ${i < spelled.length ? 'lg-slot--filled' : ''}`}>
                {spelled[i] || ''}
              </span>
            ))}
          </div>

          <div className="lg-tiles">
            {tiles.map((tile, i) => {
              const used = usedIds.includes(tile.id);
              return (
                <button
                  key={tile.id}
                  disabled={used}
                  className={`lg-tile ${used ? 'lg-tile--used' : ''} ${wrongIdx === i ? 'lg-tile--wrong' : ''}`}
                  onClick={() => tap(tile, i)}
                >
                  {tile.ch}
                </button>
              );
            })}
          </div>
        </>
      )}
    </GameShell>
  );
}
