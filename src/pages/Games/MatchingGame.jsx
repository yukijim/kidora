import { useEffect, useState } from 'react';
import GameShell from '../../components/GameShell.jsx';
import Confetti from '../../components/Confetti.jsx';
import { PAIRS, GAMES, pick, shuffle } from '../../data/games.js';
import { useLang } from '../../context/LanguageContext.jsx';
import { playCorrect, playWrong, playWin, playTap, speak } from '../../lib/audio.js';
import './MatchingGame.css';

export default function MatchingGame() {
  const { lang, t, voice } = useLang();
  const game = GAMES.find((g) => g.id === 'padan');
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState('');

  const build = () => {
    const deck = [...PAIRS, ...PAIRS].map((p, i) => ({ ...p, uid: i }));
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
  }, []);

  const isFaceUp = (card) => flipped.includes(card.uid) || matched.includes(card.id);

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 1100);
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
      const cardA = cards.find((c) => c.uid === a);
      const cardB = cards.find((c) => c.uid === b);

      if (cardA.id === cardB.id) {
        const newMatched = [...matched, cardA.id];
        const name = pick(lang, cardA, 'name');
        setMatched(newMatched);
        setFlipped([]);
        playCorrect();
        speak(name, voice);
        showFeedback(`${t('matchCorrect')} ${name}!`);
        if (newMatched.length === PAIRS.length) {
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
    <GameShell title={pick(lang, game, 'name')} emoji="🃏">
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
          <p className="match-status">
            🐾 {t('pairsWord')} {matched.length} / {PAIRS.length} &nbsp;·&nbsp; 🎯 {t('stepsWord')} {moves}
          </p>

          {feedback && (
            <div className="game-feedback game-feedback--correct">{feedback}</div>
          )}

          <div className="match-grid">
            {cards.map((card) => {
              const faceUp = isFaceUp(card);
              return (
                <button
                  key={card.uid}
                  className={`mcard ${faceUp ? 'mcard--flipped' : ''} ${matched.includes(card.id) ? 'mcard--matched' : ''}`}
                  onClick={() => flip(card)}
                  aria-label={faceUp ? pick(lang, card, 'name') : t('cardClosed')}
                >
                  <span className="mcard__inner">
                    <span className="mcard__face mcard__face--back">🐾</span>
                    <span className="mcard__face mcard__face--front">{card.emoji}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </GameShell>
  );
}
