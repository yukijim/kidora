import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../../components/ui/ProgressBar/ProgressBar';
import Modal from '../../../components/ui/Modal/Modal';
import Button from '../../../components/ui/Button/Button';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { useLearning } from '../../../context/LearningContext';
import { useAudio } from '../../../hooks/useAudio';
import { parentStats } from '../../../data/mockData';
import '../ParentStyles.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { lockParentSession } = useAuth();
  const { child, recentActivities, badges, missions, subjects, getSubjectProgress } = useLearning();
  const { playSfx } = useAudio();
  const [selectedActivity, setSelectedActivity] = useState(null);

  const maxMinutes = Math.max(...parentStats.weeklyProgress.map(d => d.minutes));
  const unlockedBadgesCount = badges.filter(b => b.unlocked).length;
  const completedMissionsCount = missions.filter(m => m.status === 'completed').length;

  const handleSwitchToChild = () => {
    playSfx('click');
    lockParentSession();
    navigate('/child');
  };

  return (
    <div className="parent-page">
      <div style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-extrabold)' }}>
            {t('welcome_parent')}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            {t('parent_overview_subtitle', { name: child.name })}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleSwitchToChild}>
          {t('child_view')}
        </Button>
      </div>

      {/* Dashboard Cards */}
      <div className="dash-cards">
        <div
          className="dash-card anim-slide-up"
          onClick={() => { playSfx('click'); navigate('/parent/progress'); }}
          style={{ cursor: 'pointer' }}
          title={t('weekly_learning')}
        >
          <div className="dash-card__icon dash-card__icon--blue">📚</div>
          <div>
            <div className="dash-card__value">{parentStats.weeklyLearningTime}</div>
            <div className="dash-card__label">{t('weekly_learning')}</div>
          </div>
        </div>
        <div
          className="dash-card anim-slide-up-delay-1"
          onClick={() => { playSfx('click'); navigate('/parent/activity'); }}
          style={{ cursor: 'pointer' }}
          title={t('missions_done')}
        >
          <div className="dash-card__icon dash-card__icon--green">🎯</div>
          <div>
            <div className="dash-card__value">{completedMissionsCount}/{missions.length}</div>
            <div className="dash-card__label">{t('missions_done')}</div>
          </div>
        </div>
        <div
          className="dash-card anim-slide-up-delay-2"
          onClick={() => { playSfx('click'); navigate('/parent/achievements'); }}
          style={{ cursor: 'pointer' }}
          title={t('badges')}
        >
          <div className="dash-card__icon dash-card__icon--yellow">🏆</div>
          <div>
            <div className="dash-card__value">{unlockedBadgesCount}/{badges.length}</div>
            <div className="dash-card__label">{t('badges')}</div>
          </div>
        </div>
        <div
          className="dash-card anim-slide-up-delay-3"
          onClick={() => { playSfx('click'); navigate('/parent/progress'); }}
          style={{ cursor: 'pointer' }}
          title={t('current_streak')}
        >
          <div className="dash-card__icon dash-card__icon--pink">🔥</div>
          <div>
            <div className="dash-card__value">{child.streak} days</div>
            <div className="dash-card__label">{t('current_streak')}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }} className="parent-grid">
        {/* Weekly Activity Chart */}
        <div
          className="weekly-chart anim-slide-up"
          onClick={() => { playSfx('click'); navigate('/parent/progress'); }}
          style={{ cursor: 'pointer' }}
          title="Click for full breakdown"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)' }}>
              {t('weekly_activity_chart')}
            </h3>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 'var(--weight-bold)' }}>
              {t('view_details')}
            </span>
          </div>
          <div className="weekly-chart__bars">
            {parentStats.weeklyProgress.map((day) => (
              <div key={day.day} className="weekly-chart__bar-wrapper">
                <div
                  className="weekly-chart__bar"
                  style={{ height: `${(day.minutes / maxMinutes) * 100}%` }}
                >
                  <span className="weekly-chart__bar-value">{day.minutes}m</span>
                </div>
                <span className="weekly-chart__bar-label">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Subject Progress */}
        <div
          className="subject-progress anim-slide-up-delay-1"
          onClick={() => { playSfx('click'); navigate('/parent/progress'); }}
          style={{ cursor: 'pointer' }}
          title="Click for full breakdown"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)' }}>
              {t('subject_progress_chart')}
            </h3>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 'var(--weight-bold)' }}>
              {t('view_details')}
            </span>
          </div>
          {subjects.map((sub) => {
            const prog = getSubjectProgress(sub.id);
            return (
              <div key={sub.id} className="subject-item">
                <span className="subject-item__name">{sub.emoji} {sub.title}</span>
                <div className="subject-item__bar">
                  <ProgressBar value={Math.max(prog.percentage, 25)} max={100} showValue color={sub.color} size="sm" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-timeline anim-slide-up-delay-2" style={{ marginTop: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)' }}>
            {t('recent_activity')}
          </h3>
          <button
            onClick={() => { playSfx('click'); navigate('/parent/activity'); }}
            style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 'var(--weight-bold)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {t('view_all')} →
          </button>
        </div>
        {recentActivities.map((act) => (
          <div
            key={act.id}
            className="activity-item"
            onClick={() => { playSfx('click'); setSelectedActivity(act); }}
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

      {/* Activity Details Modal */}
      <Modal
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        title={selectedActivity?.title || ''}
        emoji={selectedActivity?.emoji}
      >
        <p style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)' }}>
          {selectedActivity?.title}
        </p>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
          Completed {selectedActivity?.time} by {child.name}.
        </p>
        <Button variant="primary" onClick={() => setSelectedActivity(null)}>
          {t('close')}
        </Button>
      </Modal>

      <style>{`
        @media (max-width: 768px) {
          .parent-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
