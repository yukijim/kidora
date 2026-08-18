import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../../components/ui/Avatar/Avatar';
import Badge from '../../../components/ui/Badge/Badge';
import ProgressBar from '../../../components/ui/ProgressBar/ProgressBar';
import Button from '../../../components/ui/Button/Button';
import Modal from '../../../components/ui/Modal/Modal';
import ParentPinModal from '../../../components/auth/ParentPinModal';
import { PageTitle, Section } from '../../../components/layout/ResponsiveContainer/ResponsiveContainer';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { useLearning } from '../../../context/LearningContext';
import { useAudio } from '../../../hooks/useAudio';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isParentAuthenticated } = useAuth();
  const { child, badges, skillAnalytics, missions } = useLearning();
  const { playSfx } = useAudio();
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);

  const handleParentSwitch = () => {
    playSfx('click');
    if (isParentAuthenticated) {
      navigate('/parent');
    } else {
      setShowPinModal(true);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 'var(--container-md)' }}>
      <PageTitle emoji="👤">{t('nav_profile')}</PageTitle>

      {/* Profile Card */}
      <div className="anim-slide-up" style={{
        background: 'var(--gradient-hero)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-8)',
        textAlign: 'center',
        marginBottom: 'var(--space-7)',
        border: '2px solid rgba(74,144,226,0.1)',
      }}>
        <Avatar emoji={child.avatar} size="xl" level={child.level} showBorder />
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-extrabold)', marginTop: 'var(--space-4)' }}>
          {child.name}
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
          Little Explorer • {child.age} Years Old
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--space-3)',
          maxWidth: '400px',
          margin: '0 auto',
        }}>
          {[
            { emoji: '⭐', value: child.stars, label: t('stars'), path: '/child/achieve' },
            { emoji: '🔥', value: child.streak, label: t('streak'), path: '/child/achieve' },
            { emoji: '🎯', value: missions.filter(m => m.status === 'completed').length, label: t('missions'), path: '/child/play' },
            { emoji: '🏆', value: badges.filter(b => b.unlocked).length, label: t('badges'), path: '/child/achieve' },
          ].map((stat) => (
            <div
              key={stat.label}
              onClick={() => { playSfx('click'); navigate(stat.path); }}
              style={{ textAlign: 'center', cursor: 'pointer' }}
              title={`View ${stat.label}`}
            >
              <span style={{ fontSize: '20px' }}>{stat.emoji}</span>
              <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-extrabold)' }}>{stat.value}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'var(--space-5)', maxWidth: '300px', margin: 'var(--space-5) auto 0' }}>
          <ProgressBar
            value={child.xp}
            max={child.xpToNext}
            color="yellow"
            label={`${t('level')} ${child.level}`}
            variant="xp"
          />
        </div>
      </div>

      {/* Badges */}
      <Section title={t('earned_badges')} emoji="🏅" action={t('see_all')} onAction={() => { playSfx('click'); navigate('/child/achieve'); }}>
        <div style={{
          display: 'flex',
          gap: 'var(--space-3)',
          overflowX: 'auto',
          paddingBottom: 'var(--space-2)',
        }}>
          {badges.filter(b => b.unlocked).map((badge) => (
            <Badge
              key={badge.id}
              emoji={badge.emoji}
              label={badge.title}
              unlocked
              size="sm"
              interactive
              onClick={() => { playSfx('badge_unlock'); setSelectedBadge(badge); }}
            />
          ))}
        </div>
      </Section>

      {/* Skills Summary */}
      <Section title={t('my_skills')} emoji="📊" action={t('view_all')} onAction={() => { playSfx('click'); navigate('/child/grow'); }}>
        {skillAnalytics.slice(0, 4).map((skill) => (
          <div
            key={skill.id}
            onClick={() => { playSfx('click'); navigate('/child/grow'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) 0',
              borderBottom: '1px solid var(--color-border-light)',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '24px' }}>{skill.emoji}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)' }}>{skill.name}</p>
              <ProgressBar value={skill.progress} max={100} color={skill.color} size="sm" showValue={false} label="" />
            </div>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-secondary)' }}>
              {t('level')}.{skill.level}
            </span>
          </div>
        ))}
      </Section>

      <Button variant="ghost" fullWidth onClick={handleParentSwitch} style={{ marginTop: 'var(--space-4)' }}>
        {t('switch_to_parent')}
      </Button>

      {/* Badge Modal */}
      <Modal
        isOpen={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
        title={selectedBadge?.title || ''}
        emoji={selectedBadge?.emoji}
      >
        <p style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)' }}>{selectedBadge?.description}</p>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-secondary-dark)', fontWeight: 'var(--weight-bold)' }}>
          {selectedBadge?.unlocked ? `Unlocked on ${selectedBadge?.date}` : 'Locked'}
        </p>
        <div style={{ marginTop: 'var(--space-5)' }}>
          <Button variant="primary" onClick={() => setSelectedBadge(null)}>
            {t('awesome')}
          </Button>
        </div>
      </Modal>

      {/* Parent PIN Modal */}
      <ParentPinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={() => navigate('/parent')}
      />
    </div>
  );
}
