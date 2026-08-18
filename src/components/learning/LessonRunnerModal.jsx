import { useState, useEffect } from 'react';
import Modal from '../ui/Modal/Modal';
import Button from '../ui/Button/Button';
import { useLanguage } from '../../context/LanguageContext';
import { useLearning } from '../../context/LearningContext';
import { useAudio } from '../../hooks/useAudio';
import './LessonRunnerModal.css';

export default function LessonRunnerModal({ lesson, isOpen, onClose }) {
  const { language, t } = useLanguage();
  const { completeLesson } = useLearning();
  const { playSfx } = useAudio();

  // Phases: 'objective' -> 'challenge' -> 'reward'
  const [phase, setPhase] = useState('objective');
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPhase('objective');
      setSelectedOption(null);
      setIsCorrect(null);
      setShowHint(false);
    }
  }, [isOpen, lesson]);

  if (!lesson) return null;

  const isBm = language === 'bm';
  const title = isBm ? (lesson.title_bm || lesson.title) : lesson.title;
  const objective = isBm ? (lesson.learningObjective_bm || lesson.learningObjective) : lesson.learningObjective;
  const challenge = lesson.challenge;

  const handleStartChallenge = () => {
    playSfx('step');
    setPhase('challenge');
  };

  const handleAnswer = (index) => {
    setSelectedOption(index);
    if (index === challenge.correctIndex) {
      setIsCorrect(true);
      playSfx('reward');
      setTimeout(() => {
        completeLesson(lesson.id);
        playSfx('celebration');
        setPhase('reward');
      }, 1000);
    } else {
      setIsCorrect(false);
      setShowHint(true);
      playSfx('click');
    }
  };

  const handleFinish = () => {
    playSfx('click');
    if (onClose) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={phase === 'reward' ? (isBm ? 'Pelajaran Selesai! 🎉' : 'Lesson Completed! 🎉') : title}
      emoji={phase === 'reward' ? '🏆' : lesson.emoji}
      celebration={phase === 'reward'}
    >
      <div className="lesson-runner">
        {/* Phase 1: Objective & Intro */}
        {phase === 'objective' && (
          <div className="anim-slide-up">
            <div className="lesson-runner__badge-strip">
              <span
                className="lesson-runner__tag"
                style={{ background: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}
              >
                {isBm ? (lesson.subjectTitleBm || lesson.subjectTitle) : lesson.subjectTitle}
              </span>
              <span
                className="lesson-runner__tag"
                style={{ background: 'var(--color-yellow-bg)', color: 'var(--color-yellow-dark)' }}
              >
                {lesson.ageGroup} {isBm ? 'Tahun' : 'Years Old'}
              </span>
              <span
                className="lesson-runner__tag"
                style={{ background: 'var(--color-secondary-bg)', color: 'var(--color-secondary-dark)' }}
              >
                ⏱️ {lesson.estimatedMinutes || 5} min
              </span>
            </div>

            <div className="lesson-runner__objective-box">
              <p className="lesson-runner__objective-title">
                🎯 {isBm ? 'Objektif Pembelajaran' : 'Learning Objective'}
              </p>
              <p className="lesson-runner__objective-text">
                {objective}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
              <Button variant="primary" size="lg" onClick={handleStartChallenge}>
                {isBm ? 'Mula Cabaran Cilik! 🚀' : 'Start Challenge! 🚀'}
              </Button>
              <Button variant="ghost" onClick={onClose}>
                {t('cancel')}
              </Button>
            </div>
          </div>
        )}

        {/* Phase 2: Interactive Challenge */}
        {phase === 'challenge' && challenge && (
          <div className="anim-slide-up">
            <div className="lesson-runner__challenge-box">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)' }}>
                {isBm ? (challenge.question_bm || challenge.question) : challenge.question}
              </h3>

              {challenge.visualEmoji && (
                <div className="lesson-runner__visual">
                  {challenge.visualEmoji}
                </div>
              )}

              <div className="lesson-runner__options-grid">
                {challenge.options.map((opt, idx) => {
                  const isThisSelected = selectedOption === idx;
                  let optClass = 'lesson-option-btn';
                  if (isThisSelected && isCorrect === true) optClass += ' lesson-option-btn--correct';
                  if (isThisSelected && isCorrect === false) optClass += ' lesson-option-btn--wrong';

                  return (
                    <button
                      key={idx}
                      className={optClass}
                      onClick={() => handleAnswer(idx)}
                      disabled={isCorrect === true}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {isCorrect === true && (
                <p style={{ color: 'var(--color-secondary-dark)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-md)', marginTop: 'var(--space-3)' }}>
                  {isBm ? (challenge.successMessage_bm || challenge.successMessage) : challenge.successMessage}
                </p>
              )}

              {isCorrect === false && (
                <p style={{ color: 'var(--color-pink-dark)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                  {isBm ? 'Cuba lagi! Kamu boleh lakukannya! 💪' : 'Try again! You can do it! 💪'}
                </p>
              )}

              {showHint && (
                <div className="lesson-runner__hint">
                  💡 {isBm ? (challenge.hint_bm || challenge.hint) : challenge.hint}
                </div>
              )}
            </div>

            <Button variant="ghost" size="sm" onClick={() => setPhase('objective')}>
              ← {isBm ? 'Semak Objektif' : 'Review Objective'}
            </Button>
          </div>
        )}

        {/* Phase 3: Reward & Achievement */}
        {phase === 'reward' && (
          <div className="lesson-runner__reward-box anim-slide-up">
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-extrabold)', marginBottom: 'var(--space-2)' }}>
              {isBm ? 'Hebat Sekali!' : 'Super Explorer!'}
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-md)' }}>
              {isBm
                ? `Kamu telah berjaya menguasai "${title}"!`
                : `You successfully mastered "${title}"!`}
            </p>

            <div className="lesson-runner__reward-stats">
              <div className="lesson-runner__stat-pill">
                +{lesson.starsReward || 5} ⭐ {t('stars')}
              </div>
              <div className="lesson-runner__stat-pill">
                +{lesson.xpReward || 15} ⚡ XP
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-6)' }}>
              <Button variant="accent" size="xl" fullWidth onClick={handleFinish}>
                {isBm ? 'Teruskan Pengembaraan! 🦁' : 'Continue Adventure! 🦁'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
