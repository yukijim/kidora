import { money } from '../../shared/pricing.js';
import { portalUrls } from '../lib/portal.js';
import './BusinessUI.css';

export function BusinessShell({ kind, name, children, onLogout, actions }) {
  return <div className="business">
    <aside className="business__sidebar">
      <a className="business__brand" href={portalUrls.home}><span>🦁</span> KIDORA</a>
      <div className="business__workspace">{kind === 'admin' ? 'PUSAT OPERASI' : 'RAKAN AFFILIATE'}</div>
      <div className="business__nav"><span>◈</span> {kind === 'admin' ? 'Jualan & pembeli' : 'Prestasi jualan'}</div>
      <a href={portalUrls.home}>↗ Lihat halaman jualan</a>
      {kind === 'admin' && <a href={portalUrls.affiliate}>↗ Portal affiliate</a>}
      <div className="business__sidebarBottom"><strong>{name || 'KIDORA Partner'}</strong><span>{kind === 'admin' ? 'Pentadbir' : 'Affiliate'}</span>{onLogout && <button onClick={onLogout}>Log keluar</button>}</div>
    </aside>
    <main className="business__main"><header className="business__top"><span>{kind === 'admin' ? 'Dashboard admin' : 'Dashboard affiliate'}</span><div>{actions}</div></header>{children}</main>
  </div>;
}
export function Stat({ label, value, hint }) { return <div className="business__stat"><span>{label}</span><strong>{value}</strong>{hint && <small>{hint}</small>}</div>; }
export function DateFilter({ range, setRange, onApply, busy }) {
  return <form className="business__filters" onSubmit={e => { e.preventDefault(); onApply(); }}>
    <label>Dari<input aria-label="Dari" type="date" value={range.from} onChange={e=>setRange({...range,from:e.target.value})} /></label>
    <label>Hingga<input aria-label="Hingga" type="date" value={range.to} min={range.from || undefined} onChange={e=>setRange({...range,to:e.target.value})} /></label>
    <button disabled={busy} className="business__button">{busy ? 'Memuatkan…' : 'Tapis / muat semula'}</button>
    <small>Tarikh pesanan & klik · waktu Malaysia. Kosongkan untuk semua masa.</small>
  </form>;
}
export function Status({ status }) {
  const text = { paid: 'Berjaya', pending: 'Menunggu', failed: 'Gagal', unpaid: 'Belum dibayar' };
  return <span className={`business__status business__status--${status}`}>{text[status] || status}</span>;
}
export function Trend({ rows, field, monetary = false }) {
  if (!rows.length) return <p className="business__empty">Belum ada data untuk tempoh ini.</p>;
  const recent = rows.slice(-14), max = Math.max(1, ...recent.map(r => r[field]));
  return <div className="business__trend">{recent.map(r=><div key={r.date}><span>{r.date.slice(5)}</span><div><i style={{width:`${Math.max(2,r[field]/max*100)}%`}} /></div><strong>{monetary ? money(r[field]) : r[field]}</strong></div>)}</div>;
}
export const localDate = value => value ? new Date(value).toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur', dateStyle: 'medium', timeStyle: 'short' }) : '—';
export function downloadCsv(filename, rows) {
  const cell = v => { let s = String(v ?? ''); if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; return `"${s.replaceAll('"','""')}"`; };
  const blob = new Blob(['\ufeff' + rows.map(row=>row.map(cell).join(',')).join('\r\n')], {type:'text/csv;charset=utf-8'});
  const url = URL.createObjectURL(blob), link = document.createElement('a');
  link.href=url; link.download=filename; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}
