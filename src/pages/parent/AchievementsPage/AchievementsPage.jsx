import { useState } from 'react';
import Badge from '../../../components/ui/Badge/Badge';
import Modal from '../../../components/ui/Modal/Modal';
import Button from '../../../components/ui/Button/Button';
import { badges, childProfile } from '../../../data/mockData';
import '../ParentStyles.css';

export default function AchievementsPage() {
  const [selectedBadge, setSelectedBadge] = useState(null);
  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="parent-page">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-extrabold)' }}>
          🏆 Achievements Overview
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {childProfile.name} has earned {unlockedCount} out of {badges.length} badges
        </p>
      </div>

      {/* Progress Overview */}
      <div className="anim-slide-up" style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow-card)',
        marginBottom: 'var(--space-7)',
        textAlign: 'center',
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--gradient-sunset)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-4)',
          fontSize: '48px',
          boxShadow: 'var(--shadow-glow-yellow)',
        }}>
          🏆
        </div>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-extrabold)' }}>
          {unlockedCount} / {badges.length} Badges
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
          {Math.round((unlockedCount / badges.length) * 100)}% complete
        </p>
      </div>

      {/* Earned Badges */}
      <div className="anim-slide-up-delay-1" style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow-card)',
        marginBottom: 'var(--space-6)',
      }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-4)' }}>
          ✅ Earned ({unlockedCount})
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 'var(--space-3)',
        }}>
          {badges.filter(b => b.unlocked).map((badge) => (
            <Badge
              key={badge.id}
              emoji={badge.emoji}
              label={badge.title}
              description={badge.description}
              unlocked
              inline
              interactive
              onClick={() => setSelectedBadge(badge)}
            />
          ))}
        </div>
      </div>

      {/* Locked Badges */}
      <div className="anim-slide-up-delay-2" style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow-card)',
      }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-4)' }}>
          🔒 In Progress / Locked ({badges.length - unlockedCount})
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 'var(--space-3)',
        }}>
          {badges.filter(b => !b.unlocked).map((badge) => (
            <Badge
              key={badge.id}
              emoji={badge.emoji}
              label={badge.title}
              description={badge.description}
              inline
              interactive
              onClick={() => setSelectedBadge(badge)}
            />
          ))}
        </div>
      </div>

      {/* Badge Detail Modal */}
      <Modal
        isOpen={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
        title={selectedBadge?.title || ''}
        emoji={selectedBadge?.emoji}
      >
        <p style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-3)' }}>
          {selectedBadge?.description}
        </p>
        <p style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--weight-bold)',
          color: selectedBadge?.unlocked ? 'var(--color-secondary-dark)' : 'var(--color-text-muted)',
          marginBottom: 'var(--space-5)',
        }}>
          {selectedBadge?.unlocked ? `Unlocked on ${selectedBadge.date} 🎉` : '🔒 Requirement not yet met'}
        </p>
        <Button variant="primary" onClick={() => setSelectedBadge(null)}>
          Close
        </Button>
      </Modal>
    </div>
  );
}
