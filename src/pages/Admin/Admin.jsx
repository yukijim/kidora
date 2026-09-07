// ============================================
// KIDORA — Panel Admin (dalaman)
// Semak pesanan & sahkan bayaran tunai/pindahan bank secara manual.
// Akses: /admin-kidora — dilindungi ADMIN_KEY (bukan untuk pelanggan).
// ============================================
import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import './Admin.css';

const KEY_STORAGE = 'kidora_admin_key';

export default function Admin() {
  const [key, setKey] = useState(() => sessionStorage.getItem(KEY_STORAGE) || '');
  const [keyInput, setKeyInput] = useState('');
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = async (activeKey) => {
    setError('');
    try {
      const data = await api('/admin/orders', { headers: { 'x-admin-key': activeKey } });
      setOrders(data.orders);
      sessionStorage.setItem(KEY_STORAGE, activeKey);
      setKey(activeKey);
    } catch (err) {
      setError(err.message);
      setOrders(null);
    }
  };

  useEffect(() => {
    if (key) load(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmPayment = async (orderId) => {
    setBusyId(orderId);
    setError('');
    try {
      await api(`/admin/confirm/${orderId}`, { method: 'POST', headers: { 'x-admin-key': key } });
      await load(key);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(KEY_STORAGE);
    setKey('');
    setOrders(null);
  };

  if (!key || !orders) {
    return (
      <div className="admin page">
        <div className="admin__gate">
          <h1>🦁 KIDORA Admin</h1>
          <p>Masukkan kunci admin (ADMIN_KEY) untuk lihat & sahkan pesanan.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (keyInput.trim()) load(keyInput.trim());
            }}
          >
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="ADMIN_KEY"
              className="admin__input"
              autoFocus
            />
            <button type="submit" className="admin__btn admin__btn--primary">Masuk</button>
          </form>
          {error && <p className="admin__error">{error}</p>}
        </div>
      </div>
    );
  }

  const pending = orders.filter((o) => o.status === 'pending');
  const others = orders.filter((o) => o.status !== 'pending');

  const Row = ({ o }) => (
    <tr className={o.status === 'pending' ? 'admin__row--pending' : ''}>
      <td>{new Date(o.createdAt).toLocaleString('ms-MY')}</td>
      <td>
        <div className="admin__name">{o.payerName}</div>
        <div className="admin__muted">{o.payerEmail} · {o.payerPhone}</div>
      </td>
      <td>{o.packageName}</td>
      <td>RM {Number(o.amount || 0).toFixed(2)}</td>
      <td>
        <span className={`admin__badge admin__badge--${o.status}`}>{o.status}</span>
      </td>
      <td>
        {o.codes?.length > 0 && (
          <div className="admin__codes">{o.codes.join(', ')}</div>
        )}
        {o.status === 'pending' && (
          <button
            className="admin__btn admin__btn--confirm"
            disabled={busyId === o.orderId}
            onClick={() => confirmPayment(o.orderId)}
          >
            {busyId === o.orderId ? 'Sahkan…' : '✅ Sahkan Bayaran'}
          </button>
        )}
      </td>
    </tr>
  );

  return (
    <div className="admin page">
      <header className="admin__header">
        <h1>🦁 KIDORA Admin — Pesanan</h1>
        <div>
          <button className="admin__btn" onClick={() => load(key)}>🔄 Muat Semula</button>
          <button className="admin__btn" onClick={logout}>Log Keluar</button>
        </div>
      </header>

      {error && <p className="admin__error">{error}</p>}

      <section>
        <h2>⏳ Menunggu Pengesahan ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="admin__muted">Tiada pesanan menunggu.</p>
        ) : (
          <div className="admin__tableWrap">
            <table className="admin__table">
              <thead>
                <tr><th>Tarikh</th><th>Pelanggan</th><th>Pakej</th><th>Jumlah</th><th>Status</th><th>Tindakan</th></tr>
              </thead>
              <tbody>
                {pending.map((o) => <Row key={o.orderId} o={o} />)}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2>📋 Sejarah</h2>
        <div className="admin__tableWrap">
          <table className="admin__table">
            <thead>
              <tr><th>Tarikh</th><th>Pelanggan</th><th>Pakej</th><th>Jumlah</th><th>Status</th><th>Kod</th></tr>
            </thead>
            <tbody>
              {others.map((o) => <Row key={o.orderId} o={o} />)}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
