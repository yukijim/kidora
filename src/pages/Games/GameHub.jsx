import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '../../context/AccessContext.jsx';
import { api } from '../../lib/api.js';
import { GAMES, PACKAGES } from '../../data/games.js';
import { playTap, playWrong, playWin } from '../../lib/audio.js';
import './GameHub.css';

export default function GameHub() {
  const navigate = useNavigate();
  const { access, unlock, lock, hasAccess } = useAccess();
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
          <div className="gate__logo">🦁 KIDORA</div>
          <h1 className="gate__title">Masukkan Kod Akses</h1>
          <p className="gate__sub">
            Dapatkan kod selepas membeli pakej. Masukkan kod di sini untuk buka permainan.
          </p>
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
              {loading ? 'Menyemak…' : 'Buka Permainan'}
            </button>
          </form>
          <button className="gate__link" onClick={() => { playTap(); navigate('/'); }}>
            ← Kembali ke laman utama
          </button>
        </div>
      </div>
    );
  }

  const pkg = PACKAGES.find((p) => p.id === access.package);

  return (
    <div className="hub page">
      <header className="hub__top">
        <button className="hub__back" onClick={() => { playTap(); navigate('/'); }} aria-label="Kembali">
          ←
        </button>
        <div className="hub__brand">🦁 KIDORA</div>
        <button className="hub__logout" onClick={() => lock()}>
          Keluar
        </button>
      </header>

      <main className="hub__body">
        <h1 className="hub__title">Hai! Jom main 🎉</h1>
        <p className="hub__sub">Pilih permainan di bawah.</p>

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
                <span className="hub__game-name" style={{ color: g.color }}>{g.name}</span>
                <span className="hub__game-desc">{unlocked ? g.desc : 'Belum dibuka'}</span>
              </button>
            );
          })}
        </div>

        <p className="hub__pkg">
          Pakej anda: <strong>{pkg ? pkg.name : '—'}</strong>
        </p>
      </main>
    </div>
  );
}
