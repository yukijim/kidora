import { NavLink, Link } from 'react-router-dom';
import { Home, Map, BookOpen, TrendingUp, Award } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useAudio } from '../../../hooks/useAudio';
import './ChildNav.css';

export default function ChildNav() {
  const { t } = useLanguage();
  const { playSfx } = useAudio();

  const navItems = [
    { path: '/child', icon: Home, emoji: '🏠', label: t('nav_home'), end: true },
    { path: '/child/learn', icon: BookOpen, emoji: '📚', label: t('nav_learn') },
    { path: '/child/play', icon: Map, emoji: '🎮', label: t('nav_play') },
    { path: '/child/grow', icon: TrendingUp, emoji: '🌱', label: t('nav_grow') },
    { path: '/child/achieve', icon: Award, emoji: '🏆', label: t('nav_achieve') },
  ];

  return (
    <nav className="child-nav" aria-label="Main navigation">
      <Link
        to="/child"
        className="child-nav__logo"
        title="KIDORA Home"
        onClick={() => playSfx('click')}
      >
        🦁
      </Link>

      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          onClick={() => playSfx('click')}
          className={({ isActive }) =>
            `child-nav__item ${isActive ? 'child-nav__item--active' : ''}`
          }
        >
          <span className="child-nav__icon">{item.emoji}</span>
          <span className="child-nav__label">{item.label}</span>
        </NavLink>
      ))}

      <div className="child-nav__spacer" />
    </nav>
  );
}
