import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { PACKAGES, pick } from '../../data/games.js';
import { playTap, playWrong } from '../../lib/audio.js';
import { useLang } from '../../context/LanguageContext.jsx';
import { rich } from '../../i18n/translations.js';
import AnimatedMascot from '../../components/AnimatedMascot.jsx';
import LanguageToggle from '../../components/LanguageToggle.jsx';
import heroImg from '../../assets/mascot/hero.png';
import mascotCelebrate from '../../assets/mascot/celebrate.jpg';
import parentsImg from '../../assets/mascot/parents.jpg';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const { lang, t } = useLang();
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

  const pains = [
    { icon: '😟', text: t('pain1') },
    { icon: '🤔', text: t('pain2') },
    { icon: '😩', text: t('pain3') },
  ];

  const steps = [
    { n: '1', icon: '🛒', title: t('how1Title'), desc: t('how1Desc') },
    { n: '2', icon: '💳', title: t('how2Title'), desc: t('how2Desc') },
    { n: '3', icon: '🔑', title: t('how3Title'), desc: t('how3Desc') },
  ];

  const faqs = [
    { q: t('faq1q'), a: t('faq1a') },
    { q: t('faq2q'), a: t('faq2a') },
    { q: t('faq3q'), a: t('faq3a') },
    { q: t('faq4q'), a: t('faq4a') },
    { q: t('faq5q'), a: t('faq5a') },
    { q: t('faq6q'), a: t('faq6a') },
  ];

  const testimonials = [
    { text: t('testi1'), name: t('testi1Name') },
    { text: t('testi2'), name: t('testi2Name') },
    { text: t('testi3'), name: t('testi3Name') },
  ];

  return (
    <div className="landing">
      {/* ===== Header ===== */}
      <header className="landing-header">
        <a href="/" className="landing-brand" onClick={() => playTap()}>
          <span className="landing-brand__emoji">🦁</span>
          <span>KIDORA</span>
        </a>
        <div className="landing-header__actions">
          <LanguageToggle />
          <button className="btn btn--ghost landing-header__btn" onClick={() => { playTap(); navigate('/main'); }}>
            {t('playNow')}
          </button>
          <button className="btn btn--primary landing-header__btn" onClick={() => scrollTo('pricing')}>
            {t('viewPlans')}
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
            <span className="landing-hero__badge">{t('heroBadge')}</span>
            <h1 className="landing-hero__title">
              {t('heroTitle1')}<br />
              <span>{t('heroTitle2')}</span>
            </h1>
            <p className="landing-hero__desc">{rich(t('heroDesc'))}</p>
            <div className="landing-hero__buttons">
              <button className="btn btn--primary btn--lg" onClick={() => { playTap(); navigate('/main'); }}>
                {t('heroCta')}
              </button>
              <button className="btn btn--ghost btn--lg" onClick={() => scrollTo('pricing')}>
                {t('viewPlans')}
              </button>
            </div>
            <div className="landing-hero__proof">
              <span>{t('proof1')}</span>
              <span>{t('proof2')}</span>
              <span>{t('proof3')}</span>
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
          <div className="landing-trust__item">{t('trust1')}</div>
          <div className="landing-trust__item">{t('trust2')}</div>
          <div className="landing-trust__item">{t('trust3')}</div>
          <div className="landing-trust__item">{t('trust4')}</div>
        </div>
      </section>

      {/* ===== Masalah ===== */}
      <section className="landing-pain">
        <h2 className="landing-section-title">{t('painTitle')}</h2>
        <p className="landing-section-sub">{t('painSub')}</p>
        <div className="landing-pain__grid">
          {pains.map((p) => (
            <div key={p.text} className="landing-pain__card">
              <span className="landing-pain__icon">{p.icon}</span>
              <p className="landing-pain__text">{p.text}</p>
            </div>
          ))}
        </div>
        <p className="landing-pain__punch">{rich(t('painPunch'))}</p>
      </section>

      {/* ===== Penyelesaian ===== */}
      <section className="landing-solution">
        <div className="landing-solution__inner">
          <div className="landing-solution__text">
            <h2 className="landing-section-title landing-section-title--left">{t('solTitle')}</h2>
            <p className="landing-solution__desc">{rich(t('solDesc'))}</p>
            <ul className="landing-solution__list">
              <li>{t('sol1')}</li>
              <li>{t('sol2')}</li>
              <li>{t('sol3')}</li>
              <li>{t('sol4')}</li>
            </ul>
            <button className="btn btn--primary btn--lg" onClick={() => scrollTo('pricing')}>
              {t('solCta')}
            </button>
          </div>
          <div className="landing-solution__visual">
            <img src={heroImg} alt="Maskot singa KIDORA" className="landing-solution__img" />
          </div>
        </div>
      </section>

      {/* ===== Permainan ===== */}
      <section className="landing-games" id="games">
        <h2 className="landing-section-title">{t('gamesTitle')}</h2>
        <p className="landing-section-sub">{t('gamesSub')}</p>
        <div className="landing-games__grid">
          {[
            { emoji: '🔤', title: t('catLetters'), desc: t('catLettersDesc'), color: 'var(--color-primary)', bg: 'var(--gradient-card-learn)' },
            { emoji: '🔢', title: t('catCount'), desc: t('catCountDesc'), color: 'var(--color-secondary)', bg: 'var(--gradient-card-play)' },
            { emoji: '🃏', title: t('catMatch'), desc: t('catMatchDesc'), color: 'var(--color-purple)', bg: 'var(--gradient-card-grow)' },
          ].map((c) => (
            <div key={c.title} className="landing-game" style={{ background: c.bg }}>
              <span className="landing-game__emoji">{c.emoji}</span>
              <h3 className="landing-game__title" style={{ color: c.color }}>{c.title}</h3>
              <p className="landing-game__desc">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Testimoni ===== */}
      <section className="landing-testi">
        <h2 className="landing-section-title">{t('testiTitle')}</h2>
        <p className="landing-section-sub">{t('testiSub')}</p>
        <div className="landing-testi__inner">
          <img src={parentsImg} alt="Ibu bapa gembira melihat anak belajar" className="landing-testi__img" />
          <div className="landing-testi__grid">
            {testimonials.map((ts) => (
              <div key={ts.name} className="landing-testi__card">
                <div className="landing-testi__stars">⭐⭐⭐⭐⭐</div>
                <p className="landing-testi__text">{ts.text}</p>
                <p className="landing-testi__name">— {ts.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Cara Ia Berfungsi ===== */}
      <section className="landing-how">
        <h2 className="landing-section-title">{t('howTitle')}</h2>
        <div className="landing-how__steps">
          {steps.map((s) => (
            <div key={s.n} className="landing-how__step">
              <div className="landing-how__num">{s.n}</div>
              <div className="landing-how__icon">{s.icon}</div>
              <h3 className="landing-how__title">{s.title}</h3>
              <p className="landing-how__desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Cara Guna di Telefon ===== */}
      <section className="landing-guide">
        <h2 className="landing-section-title">{t('guideTitle')}</h2>
        <p className="landing-section-sub">{t('guideSub')}</p>
        <div className="landing-guide__inner">
          <div className="landing-guide__steps">
            {[
              { n: '1', icon: '🌐', title: t('guide1Title'), desc: t('guide1Desc') },
              { n: '2', icon: '📤', title: t('guide2Title'), desc: t('guide2Desc') },
              { n: '3', icon: '➕', title: t('guide3Title'), desc: t('guide3Desc') },
            ].map((s) => (
              <div key={s.n} className="landing-guide__step">
                <div className="landing-guide__num">{s.n}</div>
                <div className="landing-guide__icon">{s.icon}</div>
                <div>
                  <h3 className="landing-guide__title">{s.title}</h3>
                  <p className="landing-guide__desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="landing-guide__visual">
            <div className="landing-guide__phone">
              <div className="landing-guide__screen">
                <div className="landing-guide__appgrid">
                  <span className="landing-guide__app">📞</span>
                  <span className="landing-guide__app">✉️</span>
                  <span className="landing-guide__app">📷</span>
                  <span className="landing-guide__app">🎵</span>
                  <span className="landing-guide__app landing-guide__app--kidora">🦁</span>
                  <span className="landing-guide__app">🗺️</span>
                  <span className="landing-guide__app">📅</span>
                  <span className="landing-guide__app">⚙️</span>
                  <span className="landing-guide__app">🎮</span>
                </div>
                <div className="landing-guide__label">🦁 KIDORA</div>
              </div>
            </div>
          </div>
        </div>
        <p className="landing-guide__note">{t('guideNote')}</p>
      </section>

      {/* ===== Pakej Harga ===== */}
      <section className="landing-pricing" id="pricing">
        <h2 className="landing-section-title">{t('pricingTitle')}</h2>
        <p className="landing-section-sub">{rich(t('pricingSub'))}</p>

        <div className="landing-pricing__grid">
          {PACKAGES.map((pkg) => (
            <div key={pkg.id} className={`pricing-card ${pkg.popular ? 'pricing-card--popular' : ''}`}>
              {pkg.popular && <span className="pricing-card__badge">{t('popularBadge')}</span>}
              <h3 className="pricing-card__name">{pick(lang, pkg, 'name')}</h3>
              <div className="pricing-card__price">{pkg.priceLabel}</div>
              <p className="pricing-card__tagline">{pick(lang, pkg, 'tagline')}</p>
              <ul className="pricing-card__features">
                {pick(lang, pkg, 'features').map((f) => (
                  <li key={f}>✅ {f}</li>
                ))}
              </ul>
              <button
                className={`btn ${pkg.popular ? 'btn--primary' : 'btn--outline'} btn--block`}
                onClick={() => { playTap(); openBuy(pkg); }}
              >
                {t('buyNow')}
              </button>
            </div>
          ))}
        </div>
        <p className="landing-pricing__note">{t('pricingNote')}</p>
      </section>

      {/* ===== FAQ ===== */}
      <section className="landing-faq">
        <h2 className="landing-section-title">{t('faqTitle')}</h2>
        <div className="landing-faq__list">
          {faqs.map((f) => (
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
        <h2 className="landing-cta__title">{t('ctaTitle')}</h2>
        <p className="landing-cta__sub">{t('ctaSub')}</p>
        <button className="btn btn--primary btn--lg" onClick={() => scrollTo('pricing')}>
          {t('ctaButton')}
        </button>
      </section>

      {/* ===== Footer ===== */}
      <footer className="landing-footer">
        <div className="landing-footer__brand">
          <span className="landing-footer__emoji">🦁</span> {t('footerBrand')}
        </div>
        <p className="landing-footer__copy">
          {t('footerCopy')}
        </p>
      </footer>

      {/* ===== Modal Beli ===== */}
      {selected && (
        <div className="modal-backdrop" onClick={() => !loading && setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={() => setSelected(null)} aria-label={t('close')}>
              ✕
            </button>
            <h3 className="modal__title">{t('buy')} {pick(lang, selected, 'name')}</h3>
            <div className="modal__price">{selected.priceLabel}</div>
            <form onSubmit={submit} className="modal__form">
              <label className="modal__label">
                {t('fieldName')}
                <input
                  className="modal__input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t('fieldNamePh')}
                  required
                />
              </label>
              <label className="modal__label">
                {t('fieldEmail')}
                <input
                  className="modal__input"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={t('fieldEmailPh')}
                  required
                />
              </label>
              <label className="modal__label">
                {t('fieldPhone')}
                <input
                  className="modal__input"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={t('fieldPhonePh')}
                  required
                />
              </label>
              {error && <p className="modal__error">{error}</p>}
              <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
                {loading ? t('payLoading') : t('payNow')}
              </button>
              <p className="modal__hint">
                {t('modalHint')}
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
