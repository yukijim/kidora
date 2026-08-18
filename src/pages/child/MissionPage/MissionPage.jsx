import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button/Button';
import ProgressBar from '../../../components/ui/ProgressBar/ProgressBar';
import Modal from '../../../components/ui/Modal/Modal';
import { PageTitle } from '../../../components/layout/ResponsiveContainer/ResponsiveContainer';
import { useLanguage } from '../../../context/LanguageContext';
import { useLearning } from '../../../context/LearningContext';
import { useAudio } from '../../../hooks/useAudio';
import mascotExplore from '../../../assets/mascot/explore.jpg';

export default function MissionPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { missions, advanceMission } = useLearning();
  const { playSfx } = useAudio();

  const currentMission = missions[0] || {
    id: 'm1',
    title: 'Save the Baby Turtles',
    emoji: '🐢',
    description: 'Help 5 little sea turtles reach the safe ocean waters!',
    progress: 2,
    totalSteps: 5,
    xpReward: 20,
    steps: [
      { id: 's1', label: 'Listen to Mama Turtle', completed: true, icon: '📖' },
      { id: 's2', label: 'Clear the Beach Path', completed: true, icon: '🧹' },
      { id: 's3', label: 'Guide Turtle 1 & 2', completed: false, icon: '🐢' },
      { id: 's4', label: 'Protect from Seagulls', completed: false, icon: '🛡️' },
      { id: 's5', label: 'Celebrate at Sunset Ocean', completed: false, icon: '🌅' },
    ],
  };

  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);

  const handleNextStep = () => {
    if (currentMission.progress < currentMission.totalSteps) {
      advanceMission(currentMission.id);
      if (currentMission.progress + 1 >= currentMission.totalSteps) {
        playSfx('celebration');
        setShowCelebration(true);
      }
    } else {
      playSfx('celebration');
      setShowCelebration(true);
    }
  };

  const handleStepClick = (step, index) => {
    playSfx('click');
    setSelectedStep({ ...step, index });
  };

  return (
    <div className="container" style={{ maxWidth: 'var(--container-md)' }}>
      <PageTitle emoji="🗺️">{t('mission_adventure')}</PageTitle>

      {/* Mission Header */}
      <div className="anim-slide-up" style={{
        background: 'var(--gradient-card-play)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-7)',
        textAlign: 'center',
        marginBottom: 'var(--space-6)',
        border: '2px solid rgba(92,195,110,0.2)',
      }}>
        <span
          style={{ fontSize: '64px', display: 'block', marginBottom: 'var(--space-3)', cursor: 'pointer' }}
          onClick={() => playSfx('reward')}
        >
          {currentMission.emoji}
        </span>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-extrabold)', marginBottom: 'var(--space-2)' }}>
          {currentMission.title}
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
          {currentMission.description}
        </p>
        <ProgressBar
          value={currentMission.progress}
          max={currentMission.totalSteps}
          color="green"
          label={t('steps_completed', { progress: currentMission.progress, total: currentMission.totalSteps })}
        />
      </div>

      {/* Mission Steps */}
      <div className="anim-slide-up-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
        {currentMission.steps.map((step, index) => {
          const isStepCompleted = index < currentMission.progress;
          const isCurrentStep = index === currentMission.progress;

          return (
            <div
              key={step.id}
              onClick={() => handleStepClick(step, index)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)',
                padding: 'var(--space-4)',
                background: isStepCompleted ? 'var(--color-secondary-bg)' :
                            isCurrentStep ? 'var(--color-primary-bg)' : 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--space-2)',
                border: isCurrentStep ? '2px solid var(--color-primary)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-full)',
                background: isStepCompleted ? 'var(--color-secondary)' :
                            isCurrentStep ? 'var(--color-primary)' : 'var(--color-border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isStepCompleted || isCurrentStep ? 'var(--color-white)' : 'var(--color-text-muted)',
                fontSize: '18px',
                fontWeight: 'var(--weight-bold)',
                flexShrink: 0,
              }}>
                {isStepCompleted ? '✓' : step.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontWeight: 'var(--weight-bold)',
                  color: isStepCompleted ? 'var(--color-secondary-dark)' : 'var(--color-text-primary)',
                }}>
                  {step.label}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  {isStepCompleted ? 'Completed ✓' : isCurrentStep ? 'Current active challenge' : 'Upcoming'}
                </p>
              </div>
              <span style={{ fontSize: '18px' }}>👉</span>
            </div>
          );
        })}
      </div>

      {/* Mascot Guide */}
      <div className="anim-slide-up-delay-2" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-5)',
        boxShadow: 'var(--shadow-md)',
        marginBottom: 'var(--space-6)',
      }}>
        <img
          src={mascotExplore}
          alt="KIDORA guide"
          onClick={() => playSfx('reward')}
          style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-lg)', objectFit: 'cover', cursor: 'pointer' }}
        />
        <div>
          <p style={{ fontWeight: 'var(--weight-bold)' }}>{t('kidora_says')}</p>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            {currentMission.progress >= currentMission.totalSteps
              ? "Hooraay! Mission complete! You are a true Little Explorer! 🌟"
              : `"Let's continue our adventure on step ${currentMission.progress + 1}! 🐢"`}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <Button variant="secondary" size="lg" fullWidth onClick={handleNextStep}>
          {currentMission.progress >= currentMission.totalSteps
            ? t('replay_mission')
            : t('complete_step_x', { step: currentMission.progress + 1 })}
        </Button>
        <Button variant="ghost" size="lg" onClick={() => { playSfx('click'); navigate('/child/play'); }}>
          {t('back')}
        </Button>
      </div>

      {/* Step Detail Modal */}
      <Modal
        isOpen={!!selectedStep}
        onClose={() => setSelectedStep(null)}
        title={selectedStep ? `Step ${selectedStep.index + 1}: ${selectedStep.label}` : ''}
        emoji={selectedStep?.icon}
      >
        <p style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-3)' }}>
          {selectedStep?.index < currentMission.progress
            ? 'You have already completed this step! Great work.'
            : selectedStep?.index === currentMission.progress
            ? 'This is your current challenge! Complete this step to advance.'
            : 'Complete the previous steps first to unlock this adventure!'}
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-5)' }}>
          {selectedStep?.index === currentMission.progress && (
            <Button variant="primary" onClick={() => { setSelectedStep(null); handleNextStep(); }}>
              {t('complete_now')}
            </Button>
          )}
          <Button variant="ghost" onClick={() => setSelectedStep(null)}>
            {t('close')}
          </Button>
        </div>
      </Modal>

      {/* Mission Celebration Modal */}
      <Modal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        title={t('mission_complete_title')}
        emoji="🐢"
        celebration
        points={20}
      >
        <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)' }}>
          {t('mission_complete_desc')}
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-5)' }}>
          <Button variant="accent" size="lg" onClick={() => { playSfx('badge_unlock'); setShowCelebration(false); navigate('/child/achieve'); }}>
            {t('view_badge')}
          </Button>
          <Button variant="ghost" onClick={() => setShowCelebration(false)}>
            {t('close')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
