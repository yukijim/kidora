import { useLang } from '../context/LanguageContext.jsx';
import { playTap } from '../lib/audio.js';
import './LanguageToggle.css';

export default function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <div className="lang-toggle" role="group" aria-label="Bahasa / Language">
      <button
        type="button"
        className={`lang-toggle__btn ${lang === 'ms' ? 'lang-toggle__btn--on' : ''}`}
        onClick={() => { playTap(); setLang('ms'); }}
        aria-pressed={lang === 'ms'}
      >
        BM
      </button>
      <button
        type="button"
        className={`lang-toggle__btn ${lang === 'en' ? 'lang-toggle__btn--on' : ''}`}
        onClick={() => { playTap(); setLang('en'); }}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
    </div>
  );
}
