import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { GAMES, PACKAGES } from '../../data/games.js';
import { playTap, playWrong } from '../../lib/audio.js';
import AnimatedMascot from '../../components/AnimatedMascot.jsx';
import heroImg from '../../assets/mascot/hero.png';
import mascotCelebrate from '../../assets/mascot/celebrate.jpg';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const openBuy = (pkg) => {
    setSelected(pkg);
    setError('');
    setForm({ name: '', email: '', phone: '' });
  };

  const scrollTo = (id) => {
    playTap();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api('/order', {
        method: 'POST',
        body: JSON.stringify({
          package: selected.id,
          name: form.name,
          email: form.email,
          phone: form.phone,
        }),
      });
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      playWrong();
      setLoading(false);
    }
  };

  return (
    <div className="landing">
      {/* ===== Header ===== */}
      <header className="landing-header">
        <a href="/" className="landing-brand" onClick={() => playTap()}>
          <span className="landing-brand__emoji">🦁</span>
          <span>KIDORA</span>
        </a>
        <div className="landing-header__actions">
          <button className="btn btn--ghost" onClick={() => { playTap(); navigate('/main'); }}>
            Mula Main
          </button>
          <button className="btn btn--primary" onClick={() => scrollTo('pricing')}>
            Lihat Pakej
          </button>
        </div>
      </header>

      {/* ===== Hero (Hook) ===== */}
      <section className="landing-hero">
        <span className="landing-hero__deco landing-hero__deco--1">🎈</span>
        <span className="landing-hero__deco landing-hero__deco--2">🌤️</span>
        <span className="landing-hero__deco landing-hero__deco--3">🦋</span>
        <span className="hero-float hero-float--a">A</span>
        <span className="hero-float hero-float--b">B</span>
        <span className="hero-float hero-float--c">C</span>
        <span className="hero-float hero-float--1">1</span>
        <span className="hero-float hero-float--2">2</span>
        <span className="hero-float hero-float--3">3</span>

        <div className="landing-hero__content">
          <div className="landing-hero__text anim-slide-up">
            <span className="landing-hero__badge">⭐ Untuk kanak-kanak 3–6 tahun · 100% Bahasa Melayu</span>
            <h1 className="landing-hero__title">
              Tukar Masa Skrin Anak<br />
              <span>Jadi Masa Belajar</span>
            </h1>
            <p className="landing-hero__desc">
              Anak anda asyik main gajet? <strong>KIDORA</strong> ubah kebimbangan itu jadi peluang —
              3 permainan pendidikan yang buat anak seronok <strong>kenal huruf, mengira & mengingat</strong>,
              tanpa mereka sedar sedang belajar.
            </p>
            <div className="landing-hero__buttons">
              <button className="btn btn--primary btn--lg" onClick={() => { playTap(); navigate('/main'); }}>
                Cuba KIDORA Sekarang 🎮
              </button>
              <button className="btn btn--ghost btn--lg" onClick={() => scrollTo('pricing')}>
                Lihat Pakej
              </button>
            </div>
            <div className="landing-hero__proof">
              <span>✅ Tiada iklan</span>
              <span>🔒 Bayaran selamat</span>
              <span>📱 Telefon, tablet & komputer</span>
            </div>
          </div>

          <div className="landing-hero__visual anim-slide-in-right">
            <AnimatedMascot className="landing-hero__mascot" />
          </div>
        </div>
      </section>

      {/* ===== Trust Bar ===== */}
      <section className="landing-trust">
        <div className="landing-trust__items">
          <div className="landing-trust__item">🦁 Dibina khas untuk anak Malaysia</div>
          <div className="landing-trust__item">🇲🇾 Kandungan Bahasa Melayu</div>
          <div className="landing-trust__item">💳 FPX · eWallet · Kad</div>
          <div className="landing-trust__item">👶 Umur 3–6 tahun</div>
        </div>
      </section>

      {/* ===== Masalah ===== */}
      <section className="landing-pain">
        <h2 className="landing-section-title">😅 Biasa tak, mak ayah rasa macam ni?</h2>
        <p className="landing-section-sub">Anda tidak keseorangan. Ramai ibu bapa hadapi benda yang sama.</p>
        <div className="landing-pain__grid">
          {[
            { icon: '😟', text: 'Rasa bersalah setiap kali bagi gajet pada anak' },
            { icon: '🤔', text: 'Risau anak terdedah kandungan yang tak sesuai' },
            { icon: '😩', text: 'Nak ajar huruf & nombor, tapi tak tahu nak mula' },
          ].map((p) => (
            <div key={p.text} className="landing-pain__card">
              <span className="landing-pain__icon">{p.icon}</span>
              <p className="landing-pain__text">{p.text}</p>
            </div>
          ))}
        </div>
        <p className="landing-pain__punch">
          ✨ <strong>Berita baik:</strong> ada cara untuk jadikan masa skrin itu <strong>bermanfaat</strong>.
        </p>
      </section>

      {/* ===== Penyelesaian ===== */}
      <section className="landing-solution">
        <div className="landing-solution__inner">
          <div className="landing-solution__text">
            <h2 className="landing-section-title landing-section-title--left">🦁 Perkenalkan KIDORA</h2>
            <p className="landing-solution__desc">
              KIDORA ialah platform permainan pendidikan untuk anak kecil. Setiap kali anak menekan,
              meneka dan menyusun, dia sebenarnya sedang <strong>belajar kemahiran asas</strong> —
              huruf, nombor dan ingatan — dalam Bahasa Melayu yang betul.
            </p>
            <ul className="landing-solution__list">
              <li>🎯 Belajar tanpa tekanan — semua rasa macam main</li>
              <li>👆 Butang besar & warna terang untuk jari kecil</li>
              <li>🔊 Ada bunyi & sebutan untuk setiap jawapan</li>
              <li>🚫 Tanpa iklan, tanpa gangguan, tanpa risiko</li>
            </ul>
            <button className="btn btn--primary btn--lg" onClick={() => scrollTo('pricing')}>
              Mulakan Sekarang
            </button>
          </div>
          <div className="landing-solution__visual">
            <img src={heroImg} alt="Maskot singa KIDORA" className="landing-solution__img" />
          </div>
        </div>
      </section>

      {/* ===== Permainan ===== */}
      <section className="landing-games" id="games">
        <h2 className="landing-section-title">🎮 3 Permainan Yang Anak Akan Suka</h2>
        <p className="landing-section-sub">Setiap permainan direka supaya anak belajar sambil seronok.</p>
        <div className="landing-games__grid">
          {GAMES.map((g) => (
            <div key={g.id} className="landing-game" style={{ background: g.bg }}>
              <div className="landing-game__demo">
                {(g.demo || []).map((d, i) => (
                  <span
                    key={i}
                    className="landing-game__demo-chip"
                    style={{ animationDelay: `${i * 0.18}s` }}
                  >
                    {d}
                  </span>
                ))}
              </div>
              <span className="landing-game__emoji">{g.emoji}</span>
              <h3 className="landing-game__title" style={{ color: g.color }}>{g.name}</h3>
              <p className="landing-game__desc">{g.desc}</p>
              <p className="landing-game__learn">{g.learn}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Cara Ia Berfungsi ===== */}
      <section className="landing-how">
        <h2 className="landing-section-title">🚀 Mudah Nak Mula — 3 Langkah</h2>
        <div className="landing-how__steps">
          {[
            { n: '1', icon: '🛒', title: 'Pilih Pakej', desc: 'Pilih pakej yang sesuai dan klik "Beli Sekarang".' },
            { n: '2', icon: '💳', title: 'Bayar Online', desc: 'Bayar guna FPX, eWallet atau kad melalui BizApp Pay.' },
            { n: '3', icon: '🔑', title: 'Masukkan Kod & Main', desc: 'Dapat kod akses, masukkan, dan anak terus main!' },
          ].map((s) => (
            <div key={s.n} className="landing-how__step">
              <div className="landing-how__num">{s.n}</div>
              <div className="landing-how__icon">{s.icon}</div>
              <h3 className="landing-how__title">{s.title}</h3>
              <p className="landing-how__desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Pakej Harga ===== */}
      <section className="landing-pricing" id="pricing">
        <h2 className="landing-section-title">💰 Pilih Pakej Anda</h2>
        <p className="landing-section-sub">
          Bayaran <strong>sekali sahaja</strong>. Tiada yuran bulanan tersembunyi. Main selamanya.
        </p>

        <div className="landing-pricing__grid">
          {PACKAGES.map((pkg) => (
            <div key={pkg.id} className={`pricing-card ${pkg.popular ? 'pricing-card--popular' : ''}`}>
              {pkg.popular && <span className="pricing-card__badge">⭐ Paling Popular</span>}
              <h3 className="pricing-card__name">{pkg.name}</h3>
              <div className="pricing-card__price">{pkg.priceLabel}</div>
              <p className="pricing-card__tagline">{pkg.tagline}</p>
              <ul className="pricing-card__features">
                {pkg.features.map((f) => (
                  <li key={f}>✅ {f}</li>
                ))}
              </ul>
              <button
                className={`btn ${pkg.popular ? 'btn--primary' : 'btn--outline'} btn--block`}
                onClick={() => { playTap(); openBuy(pkg); }}
              >
                Beli Sekarang
              </button>
            </div>
          ))}
        </div>
        <p className="landing-pricing__note">🔒 Bayaran selamat melalui BizApp Pay — FPX, eWallet & kad.</p>
      </section>

      {/* ===== FAQ ===== */}
      <section className="landing-faq">
        <h2 className="landing-section-title">❓ Soalan Lazim</h2>
        <div className="landing-faq__list">
          {[
            { q: 'Anak umur berapa sesuai guna KIDORA?', a: 'KIDORA direka untuk kanak-kanak 3–6 tahun, tetapi anak 2 dan 7 tahun juga boleh menikmatinya.' },
            { q: 'Macam mana nak mula?', a: 'Pilih pakej, bayar online, dan anda akan dapat kod akses. Masukkan kod dan anak terus boleh main.' },
            { q: 'Ada yuran bulanan?', a: 'Tiada. Bayar sekali sahaja dan akses adalah untuk selama-lamanya.' },
            { q: 'Boleh main di berapa peranti?', a: 'Pakej Asas & Lengkap untuk 1 peranti. Pakej Keluarga dapat 3 kod untuk 3 peranti.' },
            { q: 'Ada iklan ke?', a: 'Tiada iklan langsung. Pengalaman anak bersih dan selamat.' },
            { q: 'Bayaran selamat?', a: 'Ya. Semua bayaran diproses oleh BizApp Pay yang menyokong FPX, eWallet dan kad bank.' },
          ].map((f) => (
            <details key={f.q} className="landing-faq__item">
              <summary className="landing-faq__q">{f.q}</summary>
              <p className="landing-faq__a">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ===== CTA Akhir ===== */}
      <section className="landing-cta">
        <img src={mascotCelebrate} alt="Maskot KIDORA meraikan" className="landing-cta__mascot" />
        <h2 className="landing-cta__title">Mulakan Pengembaraan Belajar Hari Ini!</h2>
        <p className="landing-cta__sub">
          Berikan anak anda permulaan yang menyeronokkan. Satu kod, satu bayaran, belajar selamanya.
        </p>
        <button className="btn btn--primary btn--lg" onClick={() => scrollTo('pricing')}>
          Beli Pakej Sekarang 🚀
        </button>
      </section>

      {/* ===== Footer ===== */}
      <footer className="landing-footer">
        <div className="landing-footer__brand">
          <span className="landing-footer__emoji">🦁</span> KIDORA — Little Minds, Big Adventures
        </div>
        <p className="landing-footer__copy">
          kidora.com.my · Build by Brojim Digital
        </p>
      </footer>

      {/* ===== Modal Beli ===== */}
      {selected && (
        <div className="modal-backdrop" onClick={() => !loading && setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={() => setSelected(null)} aria-label="Tutup">
              ✕
            </button>
            <h3 className="modal__title">Beli {selected.name}</h3>
            <div className="modal__price">{selected.priceLabel}</div>
            <form onSubmit={submit} className="modal__form">
              <label className="modal__label">
                Nama penuh
                <input
                  className="modal__input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="cth: Ali bin Ahmad"
                  required
                />
              </label>
              <label className="modal__label">
                Emel
                <input
                  className="modal__input"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="cth: ali@email.com"
                  required
                />
              </label>
              <label className="modal__label">
                Nombor telefon
                <input
                  className="modal__input"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="cth: 0123456789"
                  required
                />
              </label>
              {error && <p className="modal__error">{error}</p>}
              <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
                {loading ? 'Menyediakan bayaran…' : 'Bayar Sekarang'}
              </button>
              <p className="modal__hint">
                🔒 Anda akan dibawa ke halaman bayaran selamat BizApp Pay.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
