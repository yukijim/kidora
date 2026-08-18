import { useState } from 'react';
import ProgressBar from '../../../components/ui/ProgressBar/ProgressBar';
import Modal from '../../../components/ui/Modal/Modal';
import Button from '../../../components/ui/Button/Button';
import { useLanguage } from '../../../context/LanguageContext';
import { useLearning } from '../../../context/LearningContext';
import { parentStats } from '../../../data/mockData';
import '../ParentStyles.css';

export default function ProgressPage() {
  const { t } = useLanguage();
  const { child, skillAnalytics, completedLessonIds, allLessons } = useLearning();
  const [selectedSkill, setSelectedSkill] = useState(null);

  const totalLessonsDone = completedLessonIds.length;

  return (
    <div className="parent-page">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-extrabold)' }}>
          📈 {t('skill_levels_analytics')}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {t('activity_log_subtitle', { name: child.name })}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="dash-cards">
        <div className="dash-card anim-slide-up">
          <div className="dash-card__icon dash-card__icon--blue">⏱️</div>
          <div>
            <div className="dash-card__value">{parentStats.totalLearningTime}</div>
            <div className="dash-card__label">{t('total_learning_time')}</div>
          </div>
        </div>
        <div className="dash-card anim-slide-up-delay-1">
          <div className="dash-card__icon dash-card__icon--green">📝</div>
          <div>
            <div className="dash-card__value">{totalLessonsDone} / {allLessons.length}</div>
            <div className="dash-card__label">{t('all_subjects')}</div>
          </div>
        </div>
        <div className="dash-card anim-slide-up-delay-2">
          <div className="dash-card__icon dash-card__icon--yellow">⭐</div>
          <div>
            <div className="dash-card__value">{parentStats.favoriteSubject}</div>
            <div className="dash-card__label">{t('favorite_subject')}</div>
          </div>
        </div>
        <div className="dash-card anim-slide-up-delay-3">
          <div className="dash-card__icon dash-card__icon--purple">🏅</div>
          <div>
            <div className="dash-card__value">{child.streak} days</div>
            <div className="dash-card__label">{t('best_streak')}</div>
          </div>
        </div>
      </div>

      {/* Real-time Skills Analytics */}
      <div className="subject-progress anim-slide-up" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)' }}>
            🎯 {t('skill_levels_analytics')}
          </h3>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            (Click any skill for analysis)
          </span>
        </div>
        {skillAnalytics.map((skill) => (
          <div
            key={skill.id}
            onClick={() => setSelectedSkill(skill)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              padding: 'var(--space-4)',
              marginBottom: 'var(--space-2)',
              background: 'var(--color-surface-hover)',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              transition: 'all var(--transition-base)',
            }}
          >
            <span style={{ fontSize: '28px', flexShrink: 0 }}>{skill.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontWeight: 'var(--weight-bold)' }}>{skill.name}</span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  Level {skill.level}/{skill.maxLevel} ({skill.progress}%)
                </span>
              </div>
              <ProgressBar value={skill.progress} max={100} color={skill.color} showValue={false} label="" />
            </div>
          </div>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="weekly-chart anim-slide-up-delay-1">
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-4)' }}>
          {t('weekly_activity_chart')}
        </h3>
        <div className="weekly-chart__bars">
          {parentStats.weeklyProgress.map((day) => {
            const maxMin = Math.max(...parentStats.weeklyProgress.map(d => d.minutes));
            return (
              <div key={day.day} className="weekly-chart__bar-wrapper">
                <div
                  className="weekly-chart__bar"
                  style={{ height: `${(day.minutes / maxMin) * 100}%` }}
                >
                  <span className="weekly-chart__bar-value">{day.minutes}m</span>
                </div>
                <span className="weekly-chart__bar-label">{day.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill Modal */}
      <Modal
        isOpen={!!selectedSkill}
        onClose={() => setSelectedSkill(null)}
        title={`${selectedSkill?.name} Analytics`}
        emoji={selectedSkill?.emoji}
      >
        <p style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-3)' }}>
          Level <strong>{selectedSkill?.level} of {selectedSkill?.maxLevel}</strong> • {selectedSkill?.progress}% Mastery
        </p>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-5)' }}>
          {child.name} has completed {selectedSkill?.completedLessons} lessons in this domain. Daily engagement strengthens these cognitive foundations!
        </p>
        <Button variant="primary" onClick={() => setSelectedSkill(null)}>
          {t('close')}
        </Button>
      </Modal>
    </div>
  );
}
