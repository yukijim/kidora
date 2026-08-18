import { memoryStore } from '../db/store.js';
import { parentStats } from '../../../src/data/mockData.js';

export function getDashboardOverview(req, res) {
  const child = memoryStore.children[0];
  const completions = memoryStore.completions.filter((c) => c.child_id === child.id);
  const unlockedBadges = memoryStore.badgeUnlocks.filter((u) => u.child_id === child.id);

  const subjectBreakdown = memoryStore.subjects.map((sub) => {
    const subjectLessons = memoryStore.lessons.filter((l) => l.subjectId === sub.id);
    const completed = subjectLessons.filter((l) => completions.some((c) => c.lesson_id === l.id)).length;
    const progress = subjectLessons.length > 0 ? Math.round((completed / subjectLessons.length) * 100) : 0;
    return {
      subject: sub.title,
      subject_bm: sub.title_bm,
      emoji: sub.emoji,
      color: sub.color,
      progress: Math.max(progress, 25),
      completed,
      total: subjectLessons.length,
    };
  });

  res.json({
    success: true,
    child,
    stats: {
      weeklyLearningTime: parentStats.weeklyLearningTime,
      totalLearningTime: parentStats.totalLearningTime,
      averageSessionTime: parentStats.averageSessionTime,
      missionsCompleted: memoryStore.missions.filter((m) => m.status === 'completed').length,
      missionsTotal: memoryStore.missions.length,
      badgesEarned: unlockedBadges.length,
      badgesTotal: memoryStore.badges.length,
      currentStreak: child.streak,
      weeklyProgress: parentStats.weeklyProgress,
      subjectProgress: subjectBreakdown,
    },
    recentActivities: memoryStore.activityLogs.slice(0, 5),
  });
}
