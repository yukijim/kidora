import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '../../context/AccessContext.jsx';
import { useLang } from '../../context/LanguageContext.jsx';
import { api } from '../../lib/api.js';
import { GAMES, PACKAGES, pick } from '../../data/games.js';
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

  if (!access) {
    return (
      <div className="gate page">
        <div className="gate__card">
          <div className="gate__lang">
            <LanguageToggle />
          </div>
          <div className="gate__logo">🦁 KIDORA</div>
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
          <button className="gate__link" onClick={() => { playTap(); navigate('/'); }}>
            {t('gateBack')}
          </button>
        </div>
      </div>
    );
  }

  const pkg = PACKAGES.find((p) => p.id === access.package);

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

        <div className="hub__grid">
          {GAMES.map((g) => {
            const unlocked = hasAccess(g.id);
            return (
              <button
                key={g.id}
                className={`hub__game ${unlocked ? '' : 'hub__game--locked'}`}
                style={{ background: g.bg }}
                onClick={() => {
                  if (unlocked) { playTap(); navigate(`/main/${g.id}`); }
                }}
                disabled={!unlocked}
              >
                <span className="hub__game-emoji">{unlocked ? g.emoji : '🔒'}</span>
                <span className="hub__game-name" style={{ color: g.color }}>{pick(lang, g, 'name')}</span>
                <span className="hub__game-desc">{unlocked ? pick(lang, g, 'desc') : t('hubLocked')}</span>
              </button>
            );
          })}
        </div>

        <p className="hub__pkg">
          {t('hubPkg')} <strong>{pkg ? pick(lang, pkg, 'name') : '—'}</strong>
        </p>
      </main>
    </div>
  );
}
