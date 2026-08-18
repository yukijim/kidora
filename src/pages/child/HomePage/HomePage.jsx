import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EcosystemHub } from '../../../components/ecosystem/Ecosystem';
import { Section } from '../../../components/layout/ResponsiveContainer/ResponsiveContainer';
import Button from '../../../components/ui/Button/Button';
import ProgressBar from '../../../components/ui/ProgressBar/ProgressBar';
import Modal from '../../../components/ui/Modal/Modal';
import { useLanguage } from '../../../context/LanguageContext';
import { useLearning } from '../../../context/LearningContext';
import { useAudio } from '../../../hooks/useAudio';
import { todaysMission } from '../../../data/mockData';
import mascotHello from '../../../assets/mascot/hello.jpg';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { child, recentActivities, missions } = useLearning();
  const { playSfx } = useAudio();
  const [selectedActivity, setSelectedActivity] = useState(null);

  const activeMission = missions.find(m => m.status === 'in-progress') || todaysMission;

  return (
    <div className="child-home">
      {/* Welcome Banner with Mascot */}
      <div
        className="welcome-banner anim-slide-up"
        onClick={() => { playSfx('click'); navigate('/child/profile'); }}
        style={{ cursor: 'pointer' }}
        role="button"
        tabIndex={0}
      >
        <img
          src={mascotHello}
          alt="KIDORA Explorer saying hello"
          className="welcome-banner__mascot"
          onClick={(e) => {
            e.stopPropagation();
            playSfx('reward');
          }}
        />
        <div className="welcome-banner__content">
          <h1 className="welcome-banner__greeting">
            {t('hi_name', { name: child.name })}
          </h1>
          <p className="welcome-banner__message">
            {t('adventure_greeting')}
          </p>
          <ProgressBar
            value={child.xp}
            max={child.xpToNext}
            label={`${t('level')} ${child.level}`}
            color="yellow"
            variant="xp"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row anim-slide-up-delay-1">
        <div
          className="stat-item"
          onClick={() => { playSfx('click'); navigate('/child/achieve'); }}
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
        >
          <span className="stat-item__emoji">⭐</span>
          <div className="stat-item__value">{child.stars}</div>
          <div className="stat-item__label">{t('stars')}</div>
        </div>
        <div
          className="stat-item"
          onClick={() => { playSfx('click'); navigate('/child/achieve'); }}
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
        >
          <span className="stat-item__emoji">🔥</span>
          <div className="stat-item__value">{child.streak}</div>
          <div className="stat-item__label">{t('streak')}</div>
        </div>
        <div
          className="stat-item"
          onClick={() => { playSfx('click'); navigate('/child/play'); }}
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
        >
          <span className="stat-item__emoji">🎯</span>
          <div className="stat-item__value">{missions.filter(m => m.status === 'completed').length}</div>
          <div className="stat-item__label">{t('missions')}</div>
        </div>
      </div>

      {/* Today's Mission */}
      <Section title={t('todays_mission')} emoji="🗺️">
        <div
          className="today-mission anim-slide-up-delay-2"
          onClick={() => { playSfx('step'); navigate('/child/mission'); }}
        >
          <div className="today-mission__header">
            <span className="today-mission__badge">TODAY</span>
          </div>
          <div className="today-mission__info">
            <span className="today-mission__emoji">{activeMission.emoji}</span>
            <div>
              <h3 className="today-mission__title">{activeMission.title}</h3>
              <p className="today-mission__desc">{activeMission.description}</p>
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-3)' }}>
            <ProgressBar
              value={activeMission.progress}
              max={activeMission.totalSteps}
              color="green"
              size="sm"
              showValue={false}
            />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
              {t('steps_completed', { progress: activeMission.progress, total: activeMission.totalSteps })}
            </p>
          </div>
          <Button
            variant="secondary"
            fullWidth
            style={{ marginTop: 'var(--space-3)' }}
            onClick={(e) => {
              e.stopPropagation();
              playSfx('step');
              navigate('/child/mission');
            }}
          >
            {t('lets_go')}
          </Button>
        </div>
      </Section>

      {/* Ecosystem Hub */}
      <Section title={t('explore_ecosystem')} emoji="🌍">
        <EcosystemHub />
      </Section>

      {/* Recent Activity */}
      <Section
        title={t('recent_activity')}
        emoji="📋"
        action={t('see_all')}
        onAction={() => { playSfx('click'); navigate('/child/achieve'); }}
      >
        <div className="anim-slide-up-delay-4">
          {recentActivities.slice(0, 4).map((act) => (
            <div
              key={act.id}
              onClick={() => { playSfx('click'); setSelectedActivity(act); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                borderBottom: '1px solid var(--color-border-light)',
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '24px' }}>{act.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)' }}>{act.title}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{act.time}</p>
              </div>
              {act.xp > 0 && (
                <span style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--weight-bold)',
                  color: 'var(--color-yellow-dark)',
                  background: 'var(--color-yellow-bg)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                }}>
                  +{act.xp} ⭐
                </span>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Activity Details Modal */}
      <Modal
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        title={selectedActivity?.title || ''}
        emoji={selectedActivity?.emoji}
      >
        <p style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-2)' }}>
          {selectedActivity?.title}
        </p>
        {selectedActivity?.xp > 0 && (
          <p style={{ color: 'var(--color-yellow-dark)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-4)' }}>
            +{selectedActivity.xp} {t('stars')}! ⭐
          </p>
        )}
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
          <Button variant="primary" onClick={() => setSelectedActivity(null)}>
            {t('awesome')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
