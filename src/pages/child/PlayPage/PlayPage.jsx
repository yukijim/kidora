import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCard, MissionCard } from '../../../components/ecosystem/Ecosystem';
import { PageTitle, Section } from '../../../components/layout/ResponsiveContainer/ResponsiveContainer';
import Modal from '../../../components/ui/Modal/Modal';
import Button from '../../../components/ui/Button/Button';
import { useLanguage } from '../../../context/LanguageContext';
import { useLearning } from '../../../context/LearningContext';
import { useAudio } from '../../../hooks/useAudio';
import { activities } from '../../../data/mockData';

export default function PlayPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { missions, advanceMission } = useLearning();
  const { playSfx } = useAudio();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityPlayed, setActivityPlayed] = useState(false);

  const handleOpenActivity = (act) => {
    playSfx('click');
    setSelectedActivity(act);
    setActivityPlayed(false);
  };

  const handlePlayActivity = () => {
    playSfx('celebration');
    setActivityPlayed(true);
  };

  const handleCloseModal = () => {
    setSelectedActivity(null);
    setActivityPlayed(false);
  };

  const handleMissionClick = (mission) => {
    playSfx('step');
    navigate('/child/mission');
  };

  return (
    <div className="container">
      <PageTitle emoji="🎮">{t('nav_play')}</PageTitle>

      <Section title={t('active_missions')} emoji="🗺️" action={t('see_all')} onAction={() => navigate('/child/mission')}>
        <div className="grid grid--2">
          {missions.filter(m => m.status === 'in-progress').map((mission) => (
            <div key={mission.id} className="anim-slide-up">
              <MissionCard mission={mission} onClick={() => handleMissionClick(mission)} />
            </div>
          ))}
        </div>
      </Section>

      <Section title={t('new_missions')} emoji="🆕">
        <div className="grid grid--2">
          {missions.filter(m => m.status === 'new').map((mission) => (
            <div key={mission.id} className="anim-slide-up">
              <MissionCard mission={mission} onClick={() => handleMissionClick(mission)} />
            </div>
          ))}
        </div>
      </Section>

      <Section title={t('fun_activities')} emoji="🎯">
        <div className="grid grid--3">
          {activities.map((activity) => (
            <div key={activity.id} className="anim-slide-up">
              <PlayCard activity={activity} onClick={() => handleOpenActivity(activity)} />
            </div>
          ))}
        </div>
      </Section>

      <Section title={t('completed_section')} emoji="✅">
        <div className="grid grid--2">
          {missions.filter(m => m.status === 'completed').map((mission) => (
            <div key={mission.id} className="anim-slide-up">
              <MissionCard mission={mission} onClick={() => handleMissionClick(mission)} />
            </div>
          ))}
        </div>
      </Section>

      {/* Activity Preview Modal */}
      <Modal
        isOpen={!!selectedActivity && !activityPlayed}
        onClose={handleCloseModal}
        title={selectedActivity?.title || ''}
        emoji={selectedActivity?.emoji}
      >
        <p style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-3)' }}>
          {selectedActivity?.category} • {selectedActivity?.difficulty}
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-5)' }}>
          <Button variant="secondary" size="lg" onClick={handlePlayActivity}>
            {t('play_now')}
          </Button>
          <Button variant="ghost" onClick={handleCloseModal}>
            {t('cancel')}
          </Button>
        </div>
      </Modal>

      {/* Activity Played Reward Modal */}
      <Modal
        isOpen={activityPlayed}
        onClose={handleCloseModal}
        title={t('activity_completed_title')}
        emoji={selectedActivity?.emoji}
        celebration
        points={15}
      >
        <p style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)' }}>
          {selectedActivity?.title}
        </p>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          {t('activity_completed_desc')}
        </p>
        <div style={{ marginTop: 'var(--space-5)' }}>
          <Button variant="accent" size="lg" onClick={handleCloseModal}>
            {t('yay')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
