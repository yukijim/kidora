import { useNavigate } from 'react-router-dom';
import { playTap } from '../lib/audio.js';
import './GameShell.css';

export default function GameShell({ title, emoji, children }) {
  const navigate = useNavigate();
  return (
    <div className="gameshell">
      <header className="gameshell__top">
        <button
          className="gameshell__back"
          onClick={() => { playTap(); navigate('/main'); }}
          aria-label="Kembali"
        >
          ←
        </button>
        <div className="gameshell__title">
          <span className="gameshell__emoji">{emoji}</span>
          <span>{title}</span>
        </div>
        <div className="gameshell__spacer" />
      </header>
      <main className="gameshell__body">{children}</main>
    </div>
  );
}
