import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useLang } from '../../context/LanguageContext.jsx';
import { playTap } from '../../lib/audio.js';
import './ThankYou.css';

export default function ThankYou() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { t } = useLang();
  const [order, setOrder] = useState(null);
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const data = await api(`/order/${orderId}`);
        if (cancelled) return;
        setOrder(data);
        if (data.status === 'paid' || data.status === 'failed') {
          if (timer.current) clearInterval(timer.current);
        }
      } catch {
        /* cuba lagi pada tick seterusnya */
      }
    };

    check();
    timer.current = setInterval(check, 4000);
    return () => {
      cancelled = true;
      if (timer.current) clearInterval(timer.current);
    };
  }, [orderId]);

  const copyAll = async () => {
    if (!order?.codes?.length) return;
    try {
      await navigator.clipboard.writeText(order.codes.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard tidak tersedia */
    }
  };

  const isPending = order && order.status === 'pending';
  const isLoading = !order;

  return (
    <div className="ty page">
      <div className="ty__card">
        <div className="ty__emoji">
          {isLoading ? '⏳' : isPending ? '🏦' : order.status === 'paid' ? '🎉' : '😕'}
        </div>

        {isLoading ? (
          <>
            <h1 className="ty__title">{t('tyChecking')}</h1>
            <p className="ty__sub">{t('tyCheckingSub')}</p>
            <div className="ty__spinner" />
            <p className="ty__hint">{t('tyCheckingHint')}</p>
          </>
        ) : isPending ? (
          <>
            <h1 className="ty__title">{t('tyChecking')}</h1>
            <p className="ty__sub">{t('tyPendingSub')}</p>

            <div className="ty__row">
              <span>{t('tyPendingRef')}</span>
              <strong>{order.orderId}</strong>
            </div>
            <div className="ty__row ty__row--amount">
              <span>{t('tyPendingAmount')}</span>
              <strong>RM {Number(order.amount || 0).toFixed(2)}</strong>
            </div>

            <p className="ty__hint">{t('tyFailedHint')}</p>
            <div className="ty__spinner ty__spinner--sm" />
          </>
        ) : order.status === 'paid' ? (
          <>
            <h1 className="ty__title">{t('tyPaidTitle')}</h1>
            <p className="ty__sub">{t('tyPaidSub')}</p>
            <div className="ty__codes">
              {order.codes.map((c) => (
                <div key={c} className="ty__code">{c}</div>
              ))}
            </div>
            <button className="ty__copy" onClick={copyAll}>
              {copied ? t('tyCopied') : t('tyCopy')}
            </button>
            <button className="ty__play" onClick={() => { playTap(); navigate('/main'); }}>
              {t('tyPlay')}
            </button>
            <p className="ty__hint">
              {t('tyHint')}
            </p>
          </>
        ) : (
          <>
            <h1 className="ty__title">{t('tyFailedTitle')}</h1>
            <p className="ty__sub">{t('tyFailedSub')}</p>
            <p className="ty__hint">{t('tyFailedHint')}</p>
            <button className="ty__play" onClick={() => { playTap(); navigate('/'); }}>
              {t('tyBack')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
