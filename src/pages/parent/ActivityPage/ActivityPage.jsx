import { useState } from 'react';
import Modal from '../../../components/ui/Modal/Modal';
import Button from '../../../components/ui/Button/Button';
import { recentActivity, childProfile } from '../../../data/mockData';
import '../ParentStyles.css';

export default function ActivityPage() {
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Group activities by day
  const activityGroups = [
    { label: 'Today', activities: recentActivity.filter(a => a.time.includes('hour')) },
    { label: 'Yesterday', activities: recentActivity.filter(a => a.time === 'Yesterday') },
    { label: 'This Week', activities: recentActivity.filter(a => a.time.includes('days')) },
  ].filter(g => g.activities.length > 0);

  return (
    <div className="parent-page">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-extrabold)' }}>
          📋 Activity Log
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Complete chronological history of {childProfile.name}'s learning activities
        </p>
      </div>

      {/* Summary strip */}
      <div className="anim-slide-up" style={{
        display: 'flex',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
        flexWrap: 'wrap',
      }}>
        {[
          { label: 'Total Activities', value: recentActivity.length, emoji: '📊' },
          { label: 'XP Earned', value: recentActivity.reduce((s, a) => s + a.xp, 0), emoji: '⭐' },
          { label: 'Missions', value: recentActivity.filter(a => a.type === 'mission').length, emoji: '🎯' },
          { label: 'Lessons', value: recentActivity.filter(a => a.type === 'learn').length, emoji: '📚' },
        ].map((stat) => (
          <div key={stat.label} style={{
            flex: '1 1 140px',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <span style={{ fontSize: '20px' }}>{stat.emoji}</span>
            <p style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-extrabold)' }}>{stat.value}</p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Activity Groups */}
      {activityGroups.map((group) => (
        <div key={group.label} className="activity-timeline anim-slide-up" style={{ marginBottom: 'var(--space-5)' }}>
          <h3 style={{
            fontSize: 'var(--text-md)',
            fontWeight: 'var(--weight-bold)',
            marginBottom: 'var(--space-3)',
            color: 'var(--color-text-secondary)',
          }}>
            {group.label}
          </h3>
          {group.activities.map((act) => (
            <div
              key={act.id}
              className="activity-item"
              onClick={() => setSelectedActivity(act)}
              style={{ cursor: 'pointer' }}
            >
              <div className={`activity-item__icon activity-item__icon--${act.type}`}>
                {act.emoji}
              </div>
              <div className="activity-item__content">
                <p className="activity-item__title">{act.title}</p>
                <p className="activity-item__time">{act.time}</p>
              </div>
              {act.xp > 0 && (
                <span className="activity-item__xp">+{act.xp} XP</span>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Activity Details Modal */}
      <Modal
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        title={selectedActivity?.title || ''}
        emoji={selectedActivity?.emoji}
      >
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)' }}>
            Category: <strong>{selectedActivity?.type.toUpperCase()}</strong>
          </p>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
            Completed {selectedActivity?.time} by {childProfile.name}.
          </p>
          {selectedActivity?.xp > 0 && (
            <p style={{ color: 'var(--color-yellow-dark)', fontWeight: 'var(--weight-bold)' }}>
              Reward: +{selectedActivity.xp} Stars ⭐
            </p>
          )}
        </div>
        <Button variant="primary" onClick={() => setSelectedActivity(null)}>
          Close
        </Button>
      </Modal>
    </div>
  );
}
