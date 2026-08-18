import { useState } from 'react';
import Badge from '../../../components/ui/Badge/Badge';
import Modal from '../../../components/ui/Modal/Modal';
import Button from '../../../components/ui/Button/Button';
import { PageTitle, Section } from '../../../components/layout/ResponsiveContainer/ResponsiveContainer';
import { useLanguage } from '../../../context/LanguageContext';
import { useLearning } from '../../../context/LearningContext';
import { useAudio } from '../../../hooks/useAudio';
import mascotCelebrate from '../../../assets/mascot/celebrate.jpg';

export default function AchievePage() {
  const { t } = useLanguage();
  const { child, badges } = useLearning();
  const { playSfx } = useAudio();
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const unlockedCount = badges.filter(b => b.unlocked).length;

  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
    if (badge.unlocked) {
      playSfx('badge_unlock');
      setShowCelebration(true);
    } else {
      playSfx('click');
      setShowCelebration(false);
    }
  };

  return (
    <div className="container">
      <PageTitle emoji="🏆">{t('nav_achieve')}</PageTitle>

      {/* Achievement Stats */}
      <div className="anim-slide-up" style={{
        background: 'var(--gradient-card-achieve)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        marginBottom: 'var(--space-7)',
        textAlign: 'center',
        border: '2px solid rgba(255,111,145,0.15)',
      }}>
        <img
          src={mascotCelebrate}
          alt="KIDORA celebrating"
          onClick={() => playSfx('celebration')}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: 'var(--radius-xl)',
            objectFit: 'cover',
            margin: '0 auto var(--space-4)',
            cursor: 'pointer',
          }}
        />
        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-extrabold)', marginBottom: 'var(--space-2)' }}>
          {t('badges_earned_summary', { count: unlockedCount, total: badges.length })}
        </h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {t('keep_going_subtitle')}
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-6)',
          marginTop: 'var(--space-5)',
          flexWrap: 'wrap',
        }}>
          <div>
            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-extrabold)' }}>{child.stars}</span>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('stars')}</p>
          </div>
          <div>
            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-extrabold)' }}>{child.streak}</span>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('streak')}</p>
          </div>
          <div>
            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-extrabold)' }}>{child.level}</span>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('level')}</p>
          </div>
        </div>
      </div>

      {/* Earned Badges */}
      <Section title={t('earned_badges')} emoji="🌟">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: 'var(--space-4)',
        }}>
          {badges.filter(b => b.unlocked).map((badge) => (
            <div key={badge.id} className="anim-slide-up">
              <Badge
                emoji={badge.emoji}
                label={badge.title}
                unlocked
                interactive
                onClick={() => handleBadgeClick(badge)}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Locked Badges */}
      <Section title={t('keep_going')} emoji="🔒">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: 'var(--space-4)',
        }}>
          {badges.filter(b => !b.unlocked).map((badge) => (
            <div key={badge.id} className="anim-slide-up">
              <Badge
                emoji={badge.emoji}
                label={badge.title}
                description={badge.description}
                interactive
                onClick={() => handleBadgeClick(badge)}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Celebration Modal */}
      <Modal
        isOpen={showCelebration && selectedBadge?.unlocked}
        onClose={() => { setShowCelebration(false); setSelectedBadge(null); }}
        title={t('badge_earned_title')}
        emoji={selectedBadge?.emoji}
        celebration
        points={20}
      >
        <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)' }}>
          {selectedBadge?.title}
        </p>
        <p style={{ marginTop: 'var(--space-2)' }}>{selectedBadge?.description}</p>
        <div style={{ marginTop: 'var(--space-5)' }}>
          <Button variant="accent" onClick={() => { setShowCelebration(false); setSelectedBadge(null); }}>
            {t('awesome')}
          </Button>
        </div>
      </Modal>

      {/* Info Modal for locked badges */}
      <Modal
        isOpen={!!selectedBadge && !selectedBadge.unlocked && !showCelebration}
        onClose={() => setSelectedBadge(null)}
        title={selectedBadge?.title || ''}
        emoji={selectedBadge?.emoji}
      >
        <p>{selectedBadge?.description}</p>
        <div style={{ marginTop: 'var(--space-5)' }}>
          <Button variant="primary" onClick={() => setSelectedBadge(null)}>
            {t('got_it')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
