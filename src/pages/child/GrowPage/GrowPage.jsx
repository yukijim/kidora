import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GrowCard } from '../../../components/ecosystem/Ecosystem';
import { PageTitle, Section } from '../../../components/layout/ResponsiveContainer/ResponsiveContainer';
import ProgressBar from '../../../components/ui/ProgressBar/ProgressBar';
import Modal from '../../../components/ui/Modal/Modal';
import Button from '../../../components/ui/Button/Button';
import { useLanguage } from '../../../context/LanguageContext';
import { useLearning } from '../../../context/LearningContext';
import { useAudio } from '../../../hooks/useAudio';
import mascotExplore from '../../../assets/mascot/explore.jpg';

export default function GrowPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { child, skillAnalytics } = useLearning();
  const { playSfx } = useAudio();
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const overallProgress = Math.round(
    skillAnalytics.reduce((sum, s) => sum + s.progress, 0) / (skillAnalytics.length || 1)
  );

  const milestones = [
    { emoji: '🌱', label: 'Seedling', desc: 'First lesson completed', done: true },
    { emoji: '🌿', label: 'Sprout', desc: '10 lessons completed', done: true },
    { emoji: '🌳', label: 'Sapling', desc: '25 lessons completed', done: child.stars >= 40 },
    { emoji: '🌲', label: 'Tree', desc: '50 lessons completed', done: child.stars >= 80 },
    { emoji: '🏔️', label: 'Mountain', desc: '100 lessons completed', done: child.stars >= 150 },
  ];

  return (
    <div className="container">
      <PageTitle emoji="🌱">{t('nav_grow')}</PageTitle>

      {/* Overall Growth Banner */}
      <div className="anim-slide-up" style={{
        background: 'var(--gradient-card-grow)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        marginBottom: 'var(--space-7)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-5)',
        border: '2px solid rgba(142,124,242,0.15)',
      }}>
        <img
          src={mascotExplore}
          alt="KIDORA exploring"
          style={{
            width: '100px',
            height: '100px',
            borderRadius: 'var(--radius-lg)',
            objectFit: 'cover',
            cursor: 'pointer',
          }}
          onClick={() => playSfx('reward')}
        />
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)' }}>
            {t('growth_journey', { name: child.name })}
          </h3>
          <ProgressBar
            value={overallProgress}
            max={100}
            color="purple"
            label={t('overall_progress')}
            milestones={['⭐', '⭐', '⭐', '⭐', '⭐']}
          />
        </div>
      </div>

      <Section title={t('my_skills')} emoji="💪">
        <div className="grid grid--2">
          {skillAnalytics.map((skill) => (
            <div key={skill.id} className="anim-slide-up">
              <GrowCard
                skill={skill}
                onClick={() => { playSfx('click'); setSelectedSkill(skill); }}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title={t('milestones')} emoji="🏔️">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
        }}>
          {milestones.map((milestone) => (
            <div
              key={milestone.label}
              onClick={() => { playSfx('click'); setSelectedMilestone(milestone); }}
              style={{
                background: milestone.done ? 'var(--color-purple-bg)' : 'var(--color-surface-hover)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
                textAlign: 'center',
                flex: '1 1 120px',
                opacity: milestone.done ? 1 : 0.6,
                border: milestone.done ? '2px solid var(--color-purple)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
              }}
            >
              <span style={{ fontSize: '32px', display: 'block', marginBottom: 'var(--space-2)' }}>
                {milestone.emoji}
              </span>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)' }}>{milestone.label}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{milestone.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Skill Detail Modal */}
      <Modal
        isOpen={!!selectedSkill}
        onClose={() => setSelectedSkill(null)}
        title={selectedSkill ? `${selectedSkill.name}` : ''}
        emoji={selectedSkill?.emoji}
      >
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>
            {t('level')} {selectedSkill?.level} / {selectedSkill?.maxLevel}
          </p>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
            {t('overall_progress')}: {selectedSkill?.progress}% ({selectedSkill?.completedLessons} / {selectedSkill?.totalLessons} {t('lessons_completed', { completed: selectedSkill?.completedLessons, total: selectedSkill?.totalLessons })})
          </p>
          {selectedSkill && (
            <ProgressBar
              value={selectedSkill.progress}
              max={100}
              color={selectedSkill.color}
              label={t('my_skills')}
            />
          )}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-5)' }}>
          <Button variant="purple" onClick={() => { playSfx('step'); setSelectedSkill(null); navigate('/child/learn'); }}>
            {t('practice_skill')}
          </Button>
          <Button variant="ghost" onClick={() => setSelectedSkill(null)}>
            {t('close')}
          </Button>
        </div>
      </Modal>

      {/* Milestone Modal */}
      <Modal
        isOpen={!!selectedMilestone}
        onClose={() => setSelectedMilestone(null)}
        title={selectedMilestone?.label || ''}
        emoji={selectedMilestone?.emoji}
      >
        <p style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-2)' }}>
          {selectedMilestone?.desc}
        </p>
        <p style={{
          fontWeight: 'var(--weight-bold)',
          color: selectedMilestone?.done ? 'var(--color-secondary)' : 'var(--color-text-muted)',
          marginBottom: 'var(--space-5)',
        }}>
          {selectedMilestone?.done ? '✅ Unlocked & Completed!' : '🔒 Keep exploring lessons to unlock this milestone!'}
        </p>
        <Button variant="primary" onClick={() => setSelectedMilestone(null)}>
          {t('got_it')}
        </Button>
      </Modal>
    </div>
  );
}
