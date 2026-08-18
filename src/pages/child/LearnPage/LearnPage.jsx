import { useState, useMemo } from 'react';
import { EcoCard } from '../../../components/ecosystem/Ecosystem';
import { PageTitle, Section } from '../../../components/layout/ResponsiveContainer/ResponsiveContainer';
import ProgressBar from '../../../components/ui/ProgressBar/ProgressBar';
import LessonRunnerModal from '../../../components/learning/LessonRunnerModal';
import { useLanguage } from '../../../context/LanguageContext';
import { useLearning } from '../../../context/LearningContext';
import { useAudio } from '../../../hooks/useAudio';

export default function LearnPage() {
  const { language, t } = useLanguage();
  const { child, subjects, allLessons, completedLessonIds } = useLearning();
  const { playSfx } = useAudio();

  const [selectedAge, setSelectedAge] = useState(child.age || 5);
  const [selectedSubjectId, setSelectedSubjectId] = useState('all');
  const [activeLesson, setActiveLesson] = useState(null);

  const isBm = language === 'bm';

  // Filter lessons by subject and age
  const filteredLessons = useMemo(() => {
    return allLessons.filter((lesson) => {
      const matchesAge = selectedAge === 'all' || lesson.ageGroup === Number(selectedAge);
      const matchesSubject = selectedSubjectId === 'all' || lesson.subjectId === selectedSubjectId;
      return matchesAge && matchesSubject;
    });
  }, [allLessons, selectedAge, selectedSubjectId]);

  const handleOpenLesson = (lesson) => {
    playSfx('click');
    setActiveLesson(lesson);
  };

  return (
    <div className="container">
      <PageTitle emoji="📚">{t('nav_learn')}</PageTitle>

      {/* Age Group Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-5)',
        overflowX: 'auto',
        paddingBottom: 'var(--space-2)',
      }}>
        {['all', 4, 5, 6, 7].map((age) => (
          <button
            key={age}
            onClick={() => { playSfx('click'); setSelectedAge(age); }}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              border: selectedAge === age ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              background: selectedAge === age ? 'var(--color-primary)' : 'var(--color-surface)',
              color: selectedAge === age ? 'var(--color-white)' : 'var(--color-text-primary)',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all var(--transition-base)',
            }}
          >
            {age === 'all'
              ? (isBm ? 'Semua Umur' : 'All Ages')
              : `${age} ${isBm ? 'Tahun' : 'Years'}`}
          </button>
        ))}
      </div>

      {/* Subject Filter Pills */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-6)',
        overflowX: 'auto',
        paddingBottom: 'var(--space-2)',
      }}>
        <button
          onClick={() => { playSfx('click'); setSelectedSubjectId('all'); }}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            background: selectedSubjectId === 'all' ? 'var(--color-text-primary)' : 'var(--color-surface-hover)',
            color: selectedSubjectId === 'all' ? 'var(--color-white)' : 'var(--color-text-secondary)',
            fontWeight: 'var(--weight-bold)',
            fontSize: 'var(--text-xs)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          🌟 {isBm ? 'Semua Subjek' : 'All Subjects'}
        </button>

        {subjects.map((sub) => (
          <button
            key={sub.id}
            onClick={() => { playSfx('click'); setSelectedSubjectId(sub.id); }}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: selectedSubjectId === sub.id ? sub.themeColor : 'var(--color-surface-hover)',
              color: selectedSubjectId === sub.id ? '#FFFFFF' : 'var(--color-text-primary)',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {sub.emoji} {isBm ? sub.title_bm : sub.title}
          </button>
        ))}
      </div>

      {/* Lessons Grid */}
      <Section
        title={selectedSubjectId === 'all'
          ? (isBm ? 'Pelajaran Mengikut Kurikulum' : 'Curriculum Lessons')
          : (isBm ? subjects.find(s => s.id === selectedSubjectId)?.title_bm : subjects.find(s => s.id === selectedSubjectId)?.title)}
        emoji="🎯"
      >
        <div className="grid grid--2">
          {filteredLessons.map((lesson) => {
            const isCompleted = completedLessonIds.includes(lesson.id);
            const lessonTitle = isBm ? (lesson.title_bm || lesson.title) : lesson.title;
            const subjectTitle = isBm ? (lesson.subjectTitleBm || lesson.subjectTitle) : lesson.subjectTitle;

            return (
              <div key={lesson.id} className="anim-slide-up">
                <EcoCard
                  emoji={lesson.emoji}
                  title={lessonTitle}
                  subtitle={isBm ? lesson.learningObjective_bm : lesson.learningObjective}
                  variant={lesson.subjectColor || 'learn'}
                  tag={`${subjectTitle} • Age ${lesson.ageGroup}`}
                  onClick={() => handleOpenLesson(lesson)}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'var(--space-3)',
                    paddingTop: 'var(--space-2)',
                    borderTop: '1px solid var(--color-border-light)',
                  }}>
                    <span style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--weight-bold)',
                      color: isCompleted ? 'var(--color-secondary-dark)' : 'var(--color-primary)',
                    }}>
                      {isCompleted ? '✅ Selesai (Completed)' : '▶️ Mula Belajar (Start)'}
                    </span>
                    <span style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--weight-extrabold)',
                      color: 'var(--color-yellow-dark)',
                      background: 'var(--color-yellow-bg)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                    }}>
                      +{lesson.starsReward || 5} ⭐
                    </span>
                  </div>
                </EcoCard>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Interactive Lesson Runner */}
      <LessonRunnerModal
        lesson={activeLesson}
        isOpen={!!activeLesson}
        onClose={() => setActiveLesson(null)}
      />
    </div>
  );
}
