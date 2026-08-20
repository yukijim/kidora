import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '../../context/AccessContext.jsx';
import { useLang } from '../../context/LanguageContext.jsx';
import { api } from '../../lib/api.js';
import { GAMES, PACKAGES, LETTERS, LETTER_MODULES, pick } from '../../data/games.js';
import { playTap, playWrong, playWin } from '../../lib/audio.js';
import LanguageToggle from '../../components/LanguageToggle.jsx';
import './GameHub.css';

export default function GameHub() {
  const navigate = useNavigate();
  const { access, unlock, lock, hasAccess } = useAccess();
  const { lang, t } = useLang();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('code'); // 'code' | 'recover'
  const [recForm, setRecForm] = useState({ email: '', phone: '' });
  const [recError, setRecError] = useState('');
  const [recLoading, setRecLoading] = useState(false);
  const [recResult, setRecResult] = useState(null);

  const submitCode = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await api('/validate-code', {
        method: 'POST',
        body: JSON.stringify({ code: code.trim() }),
      });
      unlock(code.trim().toUpperCase(), data.games, data.package);
      playWin();
    } catch (err) {
      playWrong();
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitRecover = async (e) => {
    e.preventDefault();
    setRecLoading(true);
    setRecError('');
    setRecResult(null);
    try {
      const data = await api('/recover-code', {
        method: 'POST',
        body: JSON.stringify(recForm),
      });
      setRecResult(data);
      playWin();
    } catch (err) {
      playWrong();
      setRecError(err.message);
    } finally {
      setRecLoading(false);
    }
  };

  const openRecovered = () => {
    if (!recResult || !recResult.codes || !recResult.codes.length) return;
    unlock(recResult.codes[0], recResult.games, recResult.package);
    playWin();
  };

  if (!access) {
    return (
      <div className="gate page">
        <div className="gate__card">
          <div className="gate__lang">
            <LanguageToggle />
          </div>
          <div className="gate__logo">🦁 KIDORA</div>

          {mode === 'code' ? (
            <>
              <h1 className="gate__title">{t('gateTitle')}</h1>
              <p className="gate__sub">{t('gateSub')}</p>
              <form onSubmit={submitCode} className="gate__form">
                <input
                  className="gate__input"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="cth: KIDORA-ABCD-1234"
                  autoCapitalize="characters"
                  autoComplete="off"
                  spellCheck={false}
                />
                {error && <p className="gate__error">{error}</p>}
                <button type="submit" className="gate__btn" disabled={loading}>
                  {loading ? t('gateChecking') : t('gateUnlock')}
                </button>
              </form>
              <button className="gate__link" onClick={() => { playTap(); setMode('recover'); setRecError(''); setRecResult(null); }}>
                {t('forgotCode')}
              </button>
            </>
          ) : (
            <>
              <h1 className="gate__title">{t('recoverTitle')}</h1>
              <p className="gate__sub">{t('recoverSub')}</p>
              {recResult ? (
                <>
                  <p className="gate__sub">{t('recoverFound')}</p>
                  <div className="gate__codes">
                    {recResult.codes.map((c) => (
                      <div key={c} className="gate__code">{c}</div>
                    ))}
                  </div>
                  <button className="gate__btn" onClick={openRecovered}>
                    {t('recoverOpen')}
                  </button>
                </>
              ) : (
                <form onSubmit={submitRecover} className="gate__form">
                  <input
                    className="gate__input gate__input--plain"
                    type="email"
                    value={recForm.email}
                    onChange={(e) => setRecForm({ ...recForm, email: e.target.value })}
                    placeholder={t('fieldEmailPh')}
                    required
                  />
                  <input
                    className="gate__input gate__input--plain"
                    type="tel"
                    value={recForm.phone}
                    onChange={(e) => setRecForm({ ...recForm, phone: e.target.value })}
                    placeholder={t('fieldPhonePh')}
                    required
                  />
                  {recError && <p className="gate__error">{recError}</p>}
                  <button type="submit" className="gate__btn" disabled={recLoading}>
                    {recLoading ? t('recoverLoading') : t('recoverBtn')}
                  </button>
                </form>
              )}
              <button className="gate__link" onClick={() => { playTap(); setMode('code'); }}>
                ← {t('gateTitle')}
              </button>
            </>
          )}

          <button className="gate__link" onClick={() => { playTap(); navigate('/'); }}>
            {t('gateBack')}
          </button>
        </div>
      </div>
    );
  }

  const pkg = PACKAGES.find((p) => p.id === access.package);
  const skillGames = GAMES.filter((g) => g.category === 'huruf');
  const otherGames = GAMES.filter((g) => g.category !== 'huruf');
  const unit1 = LETTER_MODULES.filter((m) => m.unit === 1);
  const unit2 = LETTER_MODULES.filter((m) => m.unit === 2);

  const openItem = (item) => {
    if (!hasAccess(item.id)) return;
    playTap();
    if (item.kind === 'letter') navigate(`/main/huruf/${item.letter}`);
    else navigate(`/main/${item.id}`);
  };

  const renderLetterCard = (m) => {
    const unlocked = hasAccess(m.id);
    const ld = LETTERS.find((x) => x.letter === m.letter);
    const word = pick(lang, ld, 'word');
    const emoji = pick(lang, ld, 'emoji');
    return (
      <button
        key={m.id}
        className={`hub__letter-card ${unlocked ? '' : 'hub__letter-card--locked'}`}
        onClick={() => openItem(m)}
        disabled={!unlocked}
      >
        <span className="hub__letter-card__icon">{m.letter}</span>
        <span className="hub__letter-card__name">{unlocked ? `${word} ${emoji}` : '🔒'}</span>
      </button>
    );
  };

  const renderGameCard = (g) => {
    const unlocked = hasAccess(g.id);
    return (
      <button
        key={g.id}
        className={`hub__game ${unlocked ? '' : 'hub__game--locked'}`}
        style={{ background: g.bg }}
        onClick={() => openItem(g)}
        disabled={!unlocked}
      >
        <span className="hub__game-emoji">{unlocked ? g.emoji : '🔒'}</span>
        <span className="hub__game-name" style={{ color: g.color }}>{pick(lang, g, 'name')}</span>
        <span className="hub__game-desc">{unlocked ? pick(lang, g, 'desc') : t('hubLocked')}</span>
      </button>
    );
  };

  return (
    <div className="hub page">
      <header className="hub__top">
        <button className="hub__back" onClick={() => { playTap(); navigate('/'); }} aria-label={t('back')}>
          ←
        </button>
        <div className="hub__brand">🦁 KIDORA</div>
        <div className="hub__right">
          <LanguageToggle />
          <button className="hub__logout" onClick={() => lock()}>
            {t('hubLogout')}
          </button>
        </div>
      </header>

      <main className="hub__body">
        <h1 className="hub__title">{t('hubGreet')}</h1>
        <p className="hub__sub">{t('hubSub')}</p>

        <section className="hub__unit">
          <h2 className="hub__unit-title">📚 {t('unit1')}</h2>
          <div className="hub__grid--letters">{unit1.map(renderLetterCard)}</div>
        </section>

        <section className="hub__unit">
          <h2 className="hub__unit-title">📚 {t('unit2')}</h2>
          <div className="hub__grid--letters">{unit2.map(renderLetterCard)}</div>
        </section>

        <section className="hub__unit">
          <h2 className="hub__unit-title">🎯 {t('unit3')}</h2>
          <div className="hub__grid">{skillGames.map(renderGameCard)}</div>
        </section>

        {otherGames.length > 0 && (
          <section className="hub__unit">
            <h2 className="hub__unit-title">🎮 {t('unitOther')}</h2>
            <div className="hub__grid">{otherGames.map(renderGameCard)}</div>
          </section>
        )}

        <p className="hub__pkg">
          {t('hubPkg')} <strong>{pkg ? pick(lang, pkg, 'name') : '—'}</strong>
        </p>
      </main>
    </div>
  );
}
