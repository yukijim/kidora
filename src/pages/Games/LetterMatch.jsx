import { useEffect, useState } from 'react';
import GameShell from '../../components/GameShell.jsx';
import Confetti from '../../components/Confetti.jsx';
import { LETTERS, GAMES, pick, shuffle } from '../../data/games.js';
import { useLang } from '../../context/LanguageContext.jsx';
import { playCorrect, playWrong, playWin, playTap, speak } from '../../lib/audio.js';
import './letter-game.css';

const PAIR_COUNT = 6;

export default function LetterMatch({ mode }) {
  const { lang, t, voice } = useLang();
  const game = GAMES.find((g) => g.id === mode);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState('');

  const build = () => {
    const chosen = shuffle(LETTERS).slice(0, PAIR_COUNT);
    const deck = [];
    chosen.forEach((l, idx) => {
      if (mode === 'besarkecil') {
        deck.push({ uid: idx * 2, id: l.letter, front: l.letter });
        deck.push({ uid: idx * 2 + 1, id: l.letter, front: l.letter.toLowerCase() });
      } else {
        deck.push({ uid: idx * 2, id: l.letter, front: l.letter });
        deck.push({ uid: idx * 2 + 1, id: l.letter, front: pick(lang, l, 'emoji') });
      }
    });
    setCards(shuffle(deck));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setBusy(false);
    setDone(false);
    setFeedback('');
  };

  useEffect(() => {
    build();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const isFaceUp = (card) => flipped.includes(card.uid) || matched.includes(card.id);

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 1100);
  };

  const speakCard = (card) => {
    const l = LETTERS.find((x) => x.letter === card.id);
    if (mode === 'besarkecil') speak(card.id, voice);
    else speak(`${card.id} ${t('forWord')} ${pick(lang, l, 'word')}`, voice);
  };

  const flip = (card) => {
    if (busy || done) return;
    if (flipped.includes(card.uid) || matched.includes(card.id)) return;

    const next = [...flipped, card.uid];
    setFlipped(next);
    playTap();

    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      const ca = cards.find((c) => c.uid === a);
      const cb = cards.find((c) => c.uid === b);

      if (ca.id === cb.id) {
        const nm = [...matched, ca.id];
        setMatched(nm);
        setFlipped([]);
        playCorrect();
        speakCard(ca);
        showFeedback(`${t('matchCorrect')}!`);
        if (nm.length === PAIR_COUNT) {
          setTimeout(() => {
            playWin();
            setDone(true);
          }, 600);
        }
      } else {
        setBusy(true);
        setTimeout(() => {
          playWrong();
          showFeedback(t('matchWrong'));
        }, 350);
        setTimeout(() => {
          setFlipped([]);
          setBusy(false);
        }, 1100);
      }
    }
  };

  return (
    <GameShell title={pick(lang, game, 'name')} emoji={game.emoji}>
      {done ? (
        <div className="game-win">
          <Confetti />
          <div className="game-win__emoji">🏆</div>
          <h2 className="game-win__title">{t('matchWinTitle')}</h2>
          <p className="game-win__score">{t('matchDoneIn')} {moves} {t('movesWord')} 🎯</p>
          <div className="game-win__stars">
            <span>⭐</span><span>⭐</span><span>⭐</span>
          </div>
          <button className="game-btn game-btn--primary" onClick={build}>{t('playAgain')}</button>
        </div>
      ) : (
        <>
          <p className="lg-status">
            🐾 {t('pairsWord')} {matched.length} / {PAIR_COUNT} &nbsp;·&nbsp; 🎯 {t('stepsWord')} {moves}
          </p>

          {feedback && (
            <div className="game-feedback game-feedback--correct">{feedback}</div>
          )}

          <div className="lg-grid">
            {cards.map((card) => {
              const faceUp = isFaceUp(card);
              return (
                <button
                  key={card.uid}
                  className={`lg-cell ${faceUp ? '' : 'lg-cell--back'} ${matched.includes(card.id) ? 'lg-cell--found' : ''}`}
                  onClick={() => flip(card)}
                  aria-label={faceUp ? card.front : t('cardClosed')}
                >
                  {faceUp ? card.front : '🐾'}
                </button>
              );
            })}
          </div>
        </>
      )}
    </GameShell>
  );
}
