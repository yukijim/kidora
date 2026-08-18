import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { SUBJECTS, getAllCurriculumLessons } from '../data/learningCurriculum';
import { badges as initialBadges, missions as initialMissions } from '../data/mockData';
import audioService from '../services/audioService';
import learningRepository from '../services/learningRepository';

const LearningContext = createContext(null);

const STORAGE_KEY = 'kidora_learning_state_v1';

const INITIAL_STATE = {
  child: {
    id: 'child_001',
    name: 'Adam',
    age: 5,
    avatar: '🦁',
    level: 3,
    xp: 120,
    xpToNext: 200,
    stars: 45,
    streak: 7,
    joinDate: '2026-06-15',
  },
  completedLessonIds: [
    'math_4_count_fruits',
    'bm_4_vokal_ceria',
    'eng_4_alphabet_sounds',
    'sci_4_five_senses',
    'art_4_primary_colors',
    'life_4_handwashing',
  ],
  unlockedBadgeIds: ['explorer-1', 'math-star', 'nature-friend', 'bookworm', 'artist'],
  missionsState: initialMissions,
  recentActivities: [
    { id: 'act-001', type: 'mission', title: 'Completed "Feed the Hungry Animals"', emoji: '🦒', time: '2 hours ago', xp: 15 },
    { id: 'act-002', type: 'learn', title: 'Finished ABC Adventure Lesson', emoji: '🔤', time: '3 hours ago', xp: 10 },
    { id: 'act-003', type: 'badge', title: 'Earned "Creative Artist" badge', emoji: '🎨', time: 'Yesterday', xp: 0 },
  ],
};

export function LearningProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STATE,
          ...parsed,
          child: { ...INITIAL_STATE.child, ...(parsed.child || {}) },
        };
      }
    } catch (e) {
      console.warn('Learning state storage read error', e);
    }
    return INITIAL_STATE;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Learning state storage write error', e);
    }
  }, [state]);

  const allLessons = useMemo(() => getAllCurriculumLessons(), []);

  // Update Child Profile (e.g. name, age)
  const updateChildProfile = useCallback((updates) => {
    setState((prev) => ({
      ...prev,
      child: {
        ...prev.child,
        ...updates,
      },
    }));
  }, []);

  // Complete a Lesson: awards XP, Stars, unlocks badge trigger if eligible, updates activity log & syncs with Backend Repository
  const completeLesson = useCallback((lessonId) => {
    const lesson = allLessons.find((l) => l.id === lessonId);
    if (!lesson) return { success: false };

    setState((prev) => {
      const isAlreadyCompleted = prev.completedLessonIds.includes(lessonId);
      const newCompleted = isAlreadyCompleted
        ? prev.completedLessonIds
        : [...prev.completedLessonIds, lessonId];

      const xpEarned = isAlreadyCompleted ? 5 : (lesson.xpReward || 15);
      const starsEarned = isAlreadyCompleted ? 2 : (lesson.starsReward || 5);

      const totalXp = prev.child.xp + xpEarned;
      let newLevel = prev.child.level;
      let xpToNext = prev.child.xpToNext;

      if (totalXp >= xpToNext) {
        newLevel += 1;
        xpToNext += 100;
        audioService.playSfx('celebration');
      }

      // Check badge triggers
      let newBadges = [...prev.unlockedBadgeIds];
      if (lesson.badgeTrigger && !newBadges.includes(lesson.badgeTrigger)) {
        newBadges.push(lesson.badgeTrigger);
        audioService.playSfx('badge_unlock');
      }

      const newActivity = {
        id: `act-${Date.now()}`,
        type: 'learn',
        title: `Finished "${lesson.title}"`,
        emoji: lesson.emoji || '📚',
        time: 'Just now',
        xp: xpEarned,
      };

      // Asynchronously notify backend repository
      learningRepository.completeLesson(prev.child.id, lessonId);

      return {
        ...prev,
        completedLessonIds: newCompleted,
        unlockedBadgeIds: newBadges,
        child: {
          ...prev.child,
          xp: totalXp,
          level: newLevel,
          xpToNext,
          stars: prev.child.stars + starsEarned,
        },
        recentActivities: [newActivity, ...prev.recentActivities.slice(0, 9)],
      };
    });

    audioService.playSfx('reward');
    return { success: true, lesson };
  }, [allLessons]);

  // Complete Mission Step or Complete Mission
  const advanceMission = useCallback((missionId) => {
    setState((prev) => {
      const updatedMissions = prev.missionsState.map((m) => {
        if (m.id === missionId) {
          const nextProg = Math.min(m.progress + 1, m.totalSteps);
          const isDone = nextProg === m.totalSteps;
          return {
            ...m,
            progress: nextProg,
            status: isDone ? 'completed' : 'in-progress',
          };
        }
        return m;
      });

      const mission = prev.missionsState.find((m) => m.id === missionId);
      const isFinishing = mission && (mission.progress + 1 >= mission.totalSteps);

      const xpEarned = isFinishing ? (mission.xpReward || 20) : 5;
      const starsEarned = isFinishing ? 10 : 2;

      const newActivity = isFinishing ? {
        id: `act-${Date.now()}`,
        type: 'mission',
        title: `Completed Mission "${mission.title}"`,
        emoji: mission.emoji || '🎯',
        time: 'Just now',
        xp: xpEarned,
      } : null;

      // Asynchronously notify backend repository
      learningRepository.advanceMission(prev.child.id, missionId);

      return {
        ...prev,
        missionsState: updatedMissions,
        child: {
          ...prev.child,
          xp: prev.child.xp + xpEarned,
          stars: prev.child.stars + starsEarned,
        },
        recentActivities: newActivity
          ? [newActivity, ...prev.recentActivities.slice(0, 9)]
          : prev.recentActivities,
      };
    });

    audioService.playSfx('step');
  }, []);

  // Compute live subject progress
  const getSubjectProgress = useCallback((subjectId, ageGroup) => {
    const subjectLessons = allLessons.filter(
      (l) => l.subjectId === subjectId && (ageGroup ? l.ageGroup === ageGroup : true)
    );
    if (subjectLessons.length === 0) return { completed: 0, total: 0, percentage: 0 };

    const completed = subjectLessons.filter((l) =>
      state.completedLessonIds.includes(l.id)
    ).length;

    return {
      completed,
      total: subjectLessons.length,
      percentage: Math.round((completed / subjectLessons.length) * 100),
    };
  }, [allLessons, state.completedLessonIds]);

  // Compute live skill analytics for Grow Page and Parent Progress Page
  const skillAnalytics = useMemo(() => {
    const skillsMap = [
      { key: 'math', name: 'Mathematics', emoji: '🔢', color: 'yellow', subjectId: 'mathematics' },
      { key: 'reading', name: 'Language & Reading', emoji: '📖', color: 'blue', subjectId: 'bahasa_melayu' },
      { key: 'english', name: 'English Phonics', emoji: '🔤', color: 'teal', subjectId: 'english' },
      { key: 'science', name: 'Science & Nature', emoji: '🔬', color: 'green', subjectId: 'science' },
      { key: 'creativity', name: 'Creativity & Arts', emoji: '🎨', color: 'purple', subjectId: 'creativity' },
      { key: 'social', name: 'Life Skills & Values', emoji: '❤️', color: 'pink', subjectId: 'life_skills' },
    ];

    return skillsMap.map((sk) => {
      const subjectLessons = allLessons.filter((l) => l.subjectId === sk.subjectId);
      const completedCount = subjectLessons.filter((l) =>
        state.completedLessonIds.includes(l.id)
      ).length;

      const progress = subjectLessons.length > 0
        ? Math.round((completedCount / subjectLessons.length) * 100)
        : 0;

      const level = Math.min(Math.max(1, Math.ceil((completedCount / (subjectLessons.length || 1)) * 5)), 5);

      return {
        id: sk.key,
        name: sk.name,
        emoji: sk.emoji,
        color: sk.color,
        level,
        maxLevel: 5,
        progress: Math.max(progress, 15),
        completedLessons: completedCount,
        totalLessons: subjectLessons.length,
      };
    });
  }, [allLessons, state.completedLessonIds]);

  // Compute badges list with dynamic unlocked flags
  const badgeList = useMemo(() => {
    return initialBadges.map((b) => ({
      ...b,
      unlocked: state.unlockedBadgeIds.includes(b.id),
    }));
  }, [state.unlockedBadgeIds]);

  const value = useMemo(() => ({
    child: state.child,
    completedLessonIds: state.completedLessonIds,
    unlockedBadgeIds: state.unlockedBadgeIds,
    missions: state.missionsState,
    recentActivities: state.recentActivities,
    subjects: SUBJECTS,
    allLessons,
    skillAnalytics,
    badges: badgeList,
    updateChildProfile,
    completeLesson,
    advanceMission,
    getSubjectProgress,
  }), [
    state,
    allLessons,
    skillAnalytics,
    badgeList,
    updateChildProfile,
    completeLesson,
    advanceMission,
    getSubjectProgress,
  ]);

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
}

export default LearningContext;
