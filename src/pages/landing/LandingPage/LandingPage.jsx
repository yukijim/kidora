import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button/Button';
import LanguageSwitcher from '../../../components/ui/LanguageSwitcher/LanguageSwitcher';
import ParentPinModal from '../../../components/auth/ParentPinModal';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { useAudio } from '../../../hooks/useAudio';
import mascotHello from '../../../assets/mascot/hello.jpg';
import mascotCelebrate from '../../../assets/mascot/celebrate.jpg';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isParentAuthenticated } = useAuth();
  const { playSfx } = useAudio();
  const [showPinModal, setShowPinModal] = useState(false);

  const handleParentLogin = () => {
    playSfx('click');
    if (isParentAuthenticated) {
      navigate('/parent');
    } else {
      setShowPinModal(true);
    }
  };

  const ecosystemItems = [
    {
      emoji: '📚',
      title: t('eco_learn_title'),
      desc: t('eco_learn_desc'),
      bg: 'var(--gradient-card-learn)',
      color: 'var(--color-primary)',
      path: '/child/learn',
    },
    {
      emoji: '🎮',
      title: t('eco_play_title'),
      desc: t('eco_play_desc'),
      bg: 'var(--gradient-card-play)',
      color: 'var(--color-secondary)',
      path: '/child/play',
    },
    {
      emoji: '🌱',
      title: t('eco_grow_title'),
      desc: t('eco_grow_desc'),
      bg: 'var(--gradient-card-grow)',
      color: 'var(--color-purple)',
      path: '/child/grow',
    },
    {
      emoji: '🏆',
      title: t('eco_achieve_title'),
      desc: t('eco_achieve_desc'),
      bg: 'var(--gradient-card-achieve)',
      color: 'var(--color-pink)',
      path: '/child/achieve',
    },
  ];

  const features = [
    { icon: '🎯', title: t('feat_fun_title'), desc: t('feat_fun_desc'), bg: 'var(--color-primary-bg)', path: '/child/play' },
    { icon: '🎓', title: t('feat_age_title'), desc: t('feat_age_desc'), bg: 'var(--color-secondary-bg)', path: '/child/learn' },
    { icon: '📈', title: t('feat_progress_title'), desc: t('feat_progress_desc'), bg: 'var(--color-yellow-bg)', path: '/parent/progress' },
    { icon: '❤️', title: t('feat_skills_title'), desc: t('feat_skills_desc'), bg: 'var(--color-pink-bg)', path: '/child/grow' },
    { icon: '🏆', title: t('feat_rewards_title'), desc: t('feat_rewards_desc'), bg: 'var(--color-purple-bg)', path: '/child/achieve' },
    { icon: '👨‍👩‍👧', title: t('feat_parents_title'), desc: t('feat_parents_desc'), bg: 'var(--color-teal-bg)', path: '/parent' },
  ];

  return (
    <div className="landing">
      {/* Header */}
      <header className="landing-header">
        <a href="/" className="landing-header__brand" onClick={() => playSfx('click')}>
          <span className="landing-header__brand-emoji">🦁</span>
          <span>{t('brand_name')}</span>
        </a>
        <div className="landing-header__actions">
          <LanguageSwitcher />

          <Button variant="ghost" size="sm" onClick={handleParentLogin}>
            {t('parent_login')}
          </Button>
          <Button variant="primary" size="sm" onClick={() => { playSfx('celebration'); navigate('/child'); }}>
            {t('start_exploring')}
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="landing-hero">
        <span className="landing-hero__deco-1">🎈</span>
        <span className="landing-hero__deco-2">🌤️</span>
        <span className="landing-hero__deco-3">🦋</span>

        <div className="landing-hero__content">
          <div className="landing-hero__text anim-slide-up">
            <span className="landing-hero__badge">⭐ {t('made_for_malaysia')}</span>
            <h1 className="landing-hero__title">
              {t('brand_tagline').split(',')[0]},<br />
              <span>{t('brand_tagline').split(',')[1] || t('brand_tagline')}</span>
            </h1>
            <p className="landing-hero__desc">
              {t('landing_hero_desc')}
            </p>
            <div className="landing-hero__buttons">
              <Button variant="primary" size="lg" onClick={() => { playSfx('celebration'); navigate('/child'); }}>
                {t('start_free_trial')}
              </Button>
              <Button variant="ghost" size="lg" onClick={handleParentLogin}>
                {t('parent_dashboard')}
              </Button>
            </div>
          </div>

          <div className="landing-hero__visual anim-slide-in-right">
            <img
              src={mascotHello}
              alt="KIDORA The Explorer mascot"
              className="landing-hero__mascot"
              onClick={() => playSfx('reward')}
              style={{ cursor: 'pointer' }}
              title="Click me! 🦁"
            />
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="landing-ecosystem">
        <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)' }}>
          {t('explore_ecosystem')}
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', marginTop: 'var(--space-3)' }}>
          {t('parent_overview_subtitle', { name: 'Adam' })}
        </p>

        <div className="landing-ecosystem__grid">
          {ecosystemItems.map((item) => (
            <div
              key={item.title}
              className="landing-eco-item"
              style={{ background: item.bg, cursor: 'pointer' }}
              onClick={() => { playSfx('click'); navigate(item.path); }}
              role="button"
              tabIndex={0}
              title={`Explore ${item.title}`}
            >
              <span className="landing-eco-item__emoji">{item.emoji}</span>
              <h3 className="landing-eco-item__title" style={{ color: item.color }}>{item.title} →</h3>
              <p className="landing-eco-item__desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <div style={{ textAlign: 'center', maxWidth: 'var(--container-md)', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)' }}>
            {t('landing_promise_title')}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', marginTop: 'var(--space-3)' }}>
            {t('landing_promise_sub')}
          </p>
        </div>

        <div className="landing-features__grid">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="landing-feature"
              onClick={() => {
                if (feature.path === '/parent') {
                  handleParentLogin();
                } else {
                  playSfx('click');
                  navigate(feature.path);
                }
              }}
              style={{ cursor: 'pointer' }}
              title={`View ${feature.title}`}
            >
              <div className="landing-feature__icon" style={{ background: feature.bg }}>
                {feature.icon}
              </div>
              <h3 className="landing-feature__title">{feature.title}</h3>
              <p className="landing-feature__desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="landing-trust">
        <div className="landing-trust__items">
          {[
            { icon: '✅', label: t('safe_child_friendly'), bg: 'var(--color-secondary-bg)' },
            { icon: '🔒', label: t('privacy_first'), bg: 'var(--color-primary-bg)' },
            { icon: '👶', label: t('designed_age'), bg: 'var(--color-yellow-bg)' },
            { icon: '🇲🇾', label: t('made_for_malaysia'), bg: 'var(--color-pink-bg)' },
          ].map((trust) => (
            <div key={trust.label} className="landing-trust__item">
              <span className="landing-trust__icon" style={{ background: trust.bg }}>
                {trust.icon}
              </span>
              {trust.label}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <img
          src={mascotCelebrate}
          alt="KIDORA celebrating"
          className="landing-cta__mascot"
          onClick={() => playSfx('celebration')}
          style={{ cursor: 'pointer' }}
        />
        <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)', marginBottom: 'var(--space-3)' }}>
          {t('landing_cta_title')}
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-7)', maxWidth: '500px', margin: '0 auto var(--space-7)' }}>
          {t('landing_cta_sub')}
        </p>
        <Button variant="primary" size="xl" onClick={() => { playSfx('celebration'); navigate('/child'); }}>
          {t('start_free_trial_now')}
        </Button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer__tagline">
          <span>⭐</span>
          "{t('brand_motto')}"
          <span>⭐</span>
        </div>
        <p className="landing-footer__copy">
          © 2026 {t('brand_name')} — {t('brand_tagline')} | kidora.com.my • {t('all_rights_reserved')}
        </p>
      </footer>

      {/* Parent PIN Modal */}
      <ParentPinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={() => navigate('/parent')}
      />
    </div>
  );
}
