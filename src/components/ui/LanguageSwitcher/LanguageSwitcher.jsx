import { useLanguage } from '../../../context/LanguageContext';
import { useAudio } from '../../../hooks/useAudio';
import './LanguageSwitcher.css';

export default function LanguageSwitcher({ className = '' }) {
  const { language, toggleLanguage } = useLanguage();
  const { playSfx } = useAudio();

  const handleToggle = () => {
    playSfx('click');
    toggleLanguage();
  };

  return (
    <button
      className={`lang-switcher-btn ${className}`}
      onClick={handleToggle}
      title={language === 'bm' ? 'Tukar ke Bahasa Inggeris' : 'Switch to Bahasa Melayu'}
      aria-label="Switch Language"
    >
      <span>🌐</span>
      <span className={language === 'bm' ? 'lang-badge-active' : 'lang-badge-inactive'}>BM</span>
      <span>/</span>
      <span className={language === 'en' ? 'lang-badge-active' : 'lang-badge-inactive'}>EN</span>
    </button>
  );
}
