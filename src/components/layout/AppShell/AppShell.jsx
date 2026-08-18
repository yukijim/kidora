import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import ChildNav from '../ChildNav/ChildNav';
import ParentNav from '../ParentNav/ParentNav';
import Avatar from '../../ui/Avatar/Avatar';
import LanguageSwitcher from '../../ui/LanguageSwitcher/LanguageSwitcher';
import ParentPinModal from '../../auth/ParentPinModal';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useLearning } from '../../../context/LearningContext';
import { useAudio } from '../../../hooks/useAudio';
import './AppShell.css';

export function ChildLayout() {
  const navigate = useNavigate();
  const { isParentAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { child } = useLearning();
  const { playSfx } = useAudio();
  const [showPinModal, setShowPinModal] = useState(false);

  const handleParentClick = () => {
    playSfx('click');
    if (isParentAuthenticated) {
      navigate('/parent');
    } else {
      setShowPinModal(true);
    }
  };

  const handlePinSuccess = () => {
    navigate('/parent');
  };

  return (
    <div className="app-shell app-shell--child">
      {/* Top Header */}
      <header className="child-header">
        <div
          className="child-header__left"
          onClick={() => { playSfx('click'); navigate('/child/profile'); }}
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          title={t('nav_profile')}
        >
          <Avatar emoji={child.avatar} size="sm" level={child.level} showBorder />
          <span className="child-header__greeting">
            {t('hi_name', { name: child.name })}
          </span>
        </div>

        <div className="child-header__right">
          <LanguageSwitcher />

          <span
            className="child-header__stat"
            onClick={() => { playSfx('click'); navigate('/child/achieve'); }}
            style={{ cursor: 'pointer' }}
            title={t('stars')}
          >
            <span className="child-header__stat-emoji">⭐</span>
            {child.stars}
          </span>
          <span
            className="child-header__stat"
            onClick={() => { playSfx('click'); navigate('/child/achieve'); }}
            style={{ cursor: 'pointer' }}
            title={t('streak')}
          >
            <span className="child-header__stat-emoji">🔥</span>
            {child.streak}
          </span>

          <button
            className="child-header__parent-btn"
            onClick={handleParentClick}
            title={t('switch_to_parent')}
          >
            👩 {t('parent_dashboard')}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-shell__content">
        <Outlet />
      </main>

      {/* Navigation */}
      <ChildNav />

      {/* Mandatory Parent PIN Verification Modal */}
      <ParentPinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinSuccess}
      />
    </div>
  );
}

export function ParentLayout() {
  const navigate = useNavigate();
  const { isParentAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [showPinModal, setShowPinModal] = useState(!isParentAuthenticated);

  if (!isParentAuthenticated) {
    return (
      <div className="app-shell app-shell--parent" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--gradient-hero)' }}>
        <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
          <ParentPinModal
            isOpen={showPinModal}
            onClose={() => {
              setShowPinModal(false);
              navigate('/child');
            }}
            onSuccess={() => {
              setShowPinModal(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell app-shell--parent">
      <ParentNav />
      <main className="app-shell__content">
        <Outlet />
      </main>
    </div>
  );
}

export function LandingLayout() {
  return (
    <div className="app-shell app-shell--landing">
      <Outlet />
    </div>
  );
}
