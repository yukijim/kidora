import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import { BusinessShell, Stat, DateFilter, Status, Trend, localDate } from '../../components/BusinessUI.jsx';
import { PRICE_CENTS, commissionCents, money } from '../../../shared/pricing.js';
import { portalUrls } from '../../lib/portal.js';

export default function Affiliate() {
  const [data, setData] = useState(null), [ready, setReady] = useState(false), [mode, setMode] = useState('register');
  const [form, setForm] = useState({ name:'',email:'',phone:'',password:'',confirm:'' });
  const [range, setRange] = useState({from:'',to:''}), [busy,setBusy]=useState(false), [error,setError]=useState(''), [copied,setCopied]=useState(false);
  const load = async (filter = range) => {
    setBusy(true); setError('');
    try { setData(await api(`/affiliate/dashboard?${new URLSearchParams(filter)}`)); }
    catch(e) { if (e.status === 401) setData(null); else setError(e.message); }
    finally { setBusy(false); setReady(true); }
  };
  useEffect(()=>{ load({from:'',to:''}); },[]);
  const submit = async e => {
    e.preventDefault(); setError('');
    if (mode === 'register' && form.password !== form.confirm) { setError('Pengesahan kata laluan tidak sepadan.'); return; }
    setBusy(true);
    try { await api(`/affiliate/${mode}`,{method:'POST',body:JSON.stringify(form)}); await load(); setForm({name:'',email:'',phone:'',password:'',confirm:''}); }
    catch(err){setError(err.message);} finally{setBusy(false);}
  };
  const logout = async () => { try { await api('/affiliate/logout',{method:'POST',body:'{}'}); setData(null); setMode('login'); } catch(e){setError(e.message);} };
  if (!ready) return <BusinessShell kind="affiliate"><p className="business__empty">Memuatkan portal affiliate…</p></BusinessShell>;
  if (!data) return <BusinessShell kind="affiliate">
    <div className="business__intro"><div className="business__eyebrow">KONGSI KIDORA. BINA PENDAPATAN.</div><h1>Bantu anak belajar.<br/>Dapat komisyen setiap jualan.</h1><p>Daftar percuma, dapat link jualan sendiri dan pantau prestasi dalam satu dashboard. Komisyen dikira sebagai 35% daripada harga jualan, kemudian ditolak fee RM1 bagi setiap pembelian berjaya.</p></div>
    <div className="business__steps"><div><strong>01 · Daftar</strong>Buka akaun affiliate dengan emel sendiri.</div><div><strong>02 · Kongsi link</strong>Hantar pelawat ke halaman jualan Kidora.</div><div><strong>03 · Pantau hasil</strong>Lihat trafik, pembelian dan komisyen disahkan.</div></div>
    <div className="business__grid"><section className="business__panel"><h2>Komisyen setiap pakej</h2><div className="business__tableWrap"><table style={{minWidth:280}}><thead><tr><th>Pakej</th><th>Harga</th><th>Komisyen</th></tr></thead><tbody>{Object.entries(PRICE_CENTS).map(([id,price])=><tr key={id}><td>{({asas:'Asas',lengkap:'Lengkap',keluarga:'Keluarga'})[id]}</td><td>{money(price)}</td><td><strong>{money(commissionCents(price))}</strong></td></tr>)}</tbody></table></div><p className="business__subtitle">Atribusi menggunakan link affiliate terakhir yang diklik dalam 30 hari pada pelayar yang sama. Komisyen hanya disahkan selepas bayaran berjaya. Pembayaran komisyen diurus oleh admin secara berasingan.</p><a href={`${portalUrls.home.replace(/\/$/, '')}/privasi`}>Maklumat privasi</a></section>
    <section className="business__panel business__auth"><h2>{mode==='register'?'Daftar sebagai affiliate':'Selamat kembali'}</h2><div className="business__tabs" role="tablist" aria-label="Akaun affiliate"><button role="tab" aria-selected={mode==='register'} onClick={()=>{setMode('register');setError('');}}>Daftar percuma</button><button role="tab" aria-selected={mode==='login'} onClick={()=>{setMode('login');setError('');}}>Log masuk</button></div>{error&&<p className="business__error" role="alert">{error}</p>}
    <form onSubmit={submit}>{mode==='register'&&<label>Nama penuh<input required maxLength={100} minLength={3} autoComplete="name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>}<label>Emel<input required type="email" maxLength={254} autoComplete="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>{mode==='register'&&<label>Nombor telefon<input required type="tel" maxLength={20} autoComplete="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label>}<label>Kata laluan<input required type="password" minLength={mode==='register'?12:1} maxLength={128} autoComplete={mode==='register'?'new-password':'current-password'} value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>{mode==='register'&&<><small>Gunakan sekurang-kurangnya 12 aksara.</small><label>Ulang kata laluan<input required type="password" autoComplete="new-password" value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})}/></label></>}<button className="business__button" disabled={busy}>{busy?'Sila tunggu…':mode==='register'?'Daftar & dapatkan link saya':'Log masuk'}</button>{mode==='login'&&<a href="https://wa.me/60183577910">Perlukan bantuan akaun?</a>}</form></section></div>
  </BusinessShell>;
  const s=data.summary;
  return <BusinessShell kind="affiliate" name={data.account.name} onLogout={logout}>
    <div className="business__eyebrow">PRESTASI AFFILIATE</div><h1>Hai, {data.account.name.split(' ')[0]}.</h1><p className="business__subtitle">Kongsi link, bawa pelawat dan pantau hasil jualan anda.</p>
    <section className="business__panel"><h2>Link jualan anda</h2><div className="business__linkBox"><input readOnly aria-label="Link jualan anda" value={data.account.link}/><button className="business__button" onClick={async()=>{try{await navigator.clipboard.writeText(data.account.link);setCopied(true);setTimeout(()=>setCopied(false),2500);}catch{setError('Salin link daripada ruangan di sebelah.');}}}>{copied?'✓ Disalin':'Salin link'}</button></div><small>Pelawat akan dibawa terus ke halaman jualan Kidora. Atribusi 30 hari, link terakhir.</small></section>
    <DateFilter range={range} setRange={setRange} onApply={()=>load()} busy={busy}/>{error&&<p className="business__error" role="alert">{error}</p>}
    <div className="business__stats"><Stat label="Lawatan link" value={s.visits} hint={`${s.newVisitors} pelawat baharu dikenal pasti`}/><Stat label="Pembelian berjaya" value={s.paid} hint={`${s.pending} pesanan menunggu`}/><Stat label="Jumlah jualan" value={money(s.revenueCents)} hint="Bayaran berjaya sahaja"/><Stat label="Komisyen disahkan" value={money(s.commissionCents)} hint="35% harga jualan − RM1"/></div>
    <div className="business__grid"><section className="business__panel"><h2>Trafik link jualan</h2><Trend rows={[...data.traffic].sort((a,b)=>a.date.localeCompare(b.date))} field="visits"/><p className="business__subtitle">Paparan 14 hari terakhir yang mempunyai trafik. Muat semula dalam 30 minit dikira sebagai satu lawatan. Pelawat baharu dikenal pasti melalui kuki, bukan identiti peribadi.</p></section><section className="business__panel"><h2>Rekod komisyen</h2><div className="business__stats" style={{gridTemplateColumns:'1fr 1fr'}}><Stat label="Belum dibayar" value={money(s.unpaidCommissionCents)}/><Stat label="Direkod dibayar" value={money(s.paidCommissionCents)}/></div><p className="business__subtitle">Status dibayar dikemas kini oleh admin selepas pembayaran komisyen dibuat. Dashboard ini tidak memindahkan wang secara automatik.</p></section></div>
    <section className="business__panel"><h2>Pembelian daripada link anda</h2><div className="business__tableWrap"><table><thead><tr><th>Tarikh / rujukan</th><th>Pakej</th><th>Jualan</th><th>Bayaran</th><th>Komisyen</th><th>Status komisyen</th></tr></thead><tbody>{data.sales.map(o=><tr key={o.reference}><td>{localDate(o.createdAt)}<small>#{o.reference}</small></td><td>{o.packageName}</td><td>{money(o.amountCents)}</td><td><Status status={o.status}/></td><td>{money(o.commissionCents)}</td><td>{o.status==='paid'?(o.commissionStatus==='paid'?'Dibayar':'Belum dibayar'):'Belum layak'}</td></tr>)}</tbody></table>{!data.sales.length&&<p className="business__empty">Belum ada pembelian. Kongsi link anda untuk bermula.</p>}</div></section>
  </BusinessShell>;
}
