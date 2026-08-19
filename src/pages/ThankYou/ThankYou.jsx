import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { playTap } from '../../lib/audio.js';
import './ThankYou.css';

export default function ThankYou() {
  const { orderId } = useParams();
  const navigate = useNavigate();
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
    timer.current = setInterval(check, 2500);
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

  const isWaiting = !order || order.status === 'pending';

  return (
    <div className="ty page">
      <div className="ty__card">
        <div className="ty__emoji">{isWaiting ? '⏳' : order.status === 'paid' ? '🎉' : '😕'}</div>

        {isWaiting ? (
          <>
            <h1 className="ty__title">Sedang Menyemak Bayaran…</h1>
            <p className="ty__sub">Kami sedang sahkan pembayaran anda.</p>
            <div className="ty__spinner" />
            <p className="ty__hint">Jangan tutup halaman ini. Ia mengambil masa beberapa saat sahaja.</p>
          </>
        ) : order.status === 'paid' ? (
          <>
            <h1 className="ty__title">Terima Kasih! Bayaran Berjaya 🎉</h1>
            <p className="ty__sub">Ini kod akses anda. Simpan baik-baik:</p>
            <div className="ty__codes">
              {order.codes.map((c) => (
                <div key={c} className="ty__code">{c}</div>
              ))}
            </div>
            <button className="ty__copy" onClick={copyAll}>
              {copied ? '✓ Disalin!' : 'Salin Kod'}
            </button>
            <button className="ty__play" onClick={() => { playTap(); navigate('/main'); }}>
              Buka Permainan Sekarang →
            </button>
            <p className="ty__hint">
              Masukkan kod di halaman <strong>Main</strong> untuk buka permainan. Kod juga disimpan di peranti ini.
            </p>
          </>
        ) : (
          <>
            <h1 className="ty__title">Bayaran Belum Berjaya</h1>
            <p className="ty__sub">Nampaknya bayaran tidak selesai.</p>
            <p className="ty__hint">Kalau anda sudah bayar, tunggu sebentar atau hubungi kami untuk bantuan.</p>
            <button className="ty__play" onClick={() => { playTap(); navigate('/'); }}>
              ← Kembali ke Laman Utama
            </button>
          </>
        )}
      </div>
    </div>
  );
}
