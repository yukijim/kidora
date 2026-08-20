import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext.jsx';
import { useAccess } from '../context/AccessContext.jsx';
import { playTap } from '../lib/audio.js';
import './DemoGate.css';

const pad = (n) => String(n).padStart(2, '0');

export default function DemoGate() {
  const navigate = useNavigate();
  const { t } = useLang();
  const { access, lock } = useAccess();
  const [now, setNow] = useState(Date.now());

  const isDemo = !!access && access.package === 'demo' && !!access.demoExpiry;
  const expired = isDemo && now >= access.demoExpiry;
  const leftMs = isDemo && !expired ? access.demoExpiry - now : 0;

  useEffect(() => {
    if (!isDemo || expired) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [isDemo, expired]);

  if (!isDemo) return null;

  const goHome = () => {
    playTap();
    lock();
    navigate('/');
  };

  const goBuy = () => {
    playTap();
    lock();
    navigate('/', { state: { scrollToPricing: true } });
  };

  if (expired) {
    return (
      <div className="demogate__backdrop" role="dialog" aria-modal="true">
        <div className="demogate__card">
          <div className="demogate__emoji">⏰</div>
          <h2 className="demogate__title">{t('demoOverTitle')}</h2>
          <p className="demogate__text">{t('demoOverText')}</p>
          <button className="demogate__buy" onClick={goBuy}>{t('demoBuy')}</button>
          <button className="demogate__later" onClick={goHome}>{t('demoOverLater')}</button>
        </div>
      </div>
    );
  }

  const mm = Math.floor(leftMs / 60000);
  const ss = Math.floor((leftMs % 60000) / 1000);

  return (
    <div className="demogate__pill" role="timer" aria-live="polite">
      <span className="demogate__pill-tag">{t('demoPkg')}</span>
      <span className="demogate__pill-time">⏳ {mm}:{pad(ss)}</span>
    </div>
  );
}
