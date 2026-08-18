import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Award, Activity, Settings, Lock } from 'lucide-react';
import Avatar from '../../ui/Avatar/Avatar';
import LanguageSwitcher from '../../ui/LanguageSwitcher/LanguageSwitcher';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useAudio } from '../../../hooks/useAudio';
import './ParentNav.css';

export default function ParentNav() {
  const navigate = useNavigate();
  const { lockParentSession } = useAuth();
  const { t } = useLanguage();
  const { playSfx } = useAudio();

  const navItems = [
    { path: '/parent', icon: LayoutDashboard, label: t('parent_dashboard'), end: true },
    { path: '/parent/progress', icon: TrendingUp, label: t('nav_grow') },
    { path: '/parent/achievements', icon: Award, label: t('nav_achieve') },
    { path: '/parent/activity', icon: Activity, label: t('recent_activity') },
    { path: '/parent/settings', icon: Settings, label: t('settings_title') },
  ];

  const bottomNavItems = [
    { path: '/parent', emoji: '📊', label: t('parent_dashboard'), end: true },
    { path: '/parent/progress', emoji: '📈', label: t('nav_grow') },
    { path: '/parent/achievements', emoji: '🏆', label: t('badges') },
    { path: '/parent/activity', emoji: '📋', label: t('recent_activity') },
    { path: '/parent/settings', emoji: '⚙️', label: t('settings_title') },
  ];

  const handleChildSwitch = () => {
    playSfx('click');
    lockParentSession();
    navigate('/child');
  };

  return (
    <>
      {/* Top navigation bar */}
      <header className="parent-nav">
        <NavLink to="/parent" className="parent-nav__brand" onClick={() => playSfx('click')}>
          <span className="parent-nav__logo">🦁</span>
          <div>
            <div className="parent-nav__title">KIDORA</div>
            <div className="parent-nav__subtitle">{t('parent_dashboard')}</div>
          </div>
        </NavLink>

        <nav className="parent-nav__links">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => playSfx('click')}
              className={({ isActive }) =>
                `parent-nav__link ${isActive ? 'parent-nav__link--active' : ''}`
              }
            >
              <item.icon className="parent-nav__link-icon" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="parent-nav__actions">
          <LanguageSwitcher />

          <button
            className="parent-nav__child-switch"
            onClick={handleChildSwitch}
            title={t('child_view')}
          >
            {t('child_view')}
          </button>

          <Avatar emoji="👩" size="sm" />
        </div>
      </header>

      {/* Bottom nav for mobile */}
      <nav className="parent-nav-bottom" aria-label="Parent navigation">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={() => playSfx('click')}
            className={({ isActive }) =>
              `parent-nav-bottom__item ${isActive ? 'parent-nav-bottom__item--active' : ''}`
            }
          >
            <span className="parent-nav-bottom__icon">{item.emoji}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
