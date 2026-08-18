import { memoryStore } from '../db/store.js';

export function getChildProgress(req, res) {
  const childId = req.params.childId || req.query.childId || 'child_001';
  const child = memoryStore.children.find((c) => c.id === childId) || memoryStore.children[0];

  const completions = memoryStore.completions.filter((c) => c.child_id === child.id);
  const completedLessonIds = completions.map((c) => c.lesson_id);

  const unlockedBadges = memoryStore.badgeUnlocks
    .filter((u) => u.child_id === child.id)
    .map((u) => u.badge_id);

  const activityLogs = memoryStore.activityLogs.filter((a) => a.child_id === child.id);

  res.json({
    success: true,
    child,
    completedLessonIds,
    unlockedBadgeIds: unlockedBadges,
    missions: memoryStore.missions,
    badges: memoryStore.badges.map((b) => ({
      ...b,
      unlocked: unlockedBadges.includes(b.id),
    })),
    recentActivities: activityLogs,
  });
}

export function completeLesson(req, res) {
  const { childId, lessonId } = req.body;
  const child = memoryStore.children.find((c) => c.id === (childId || 'child_001')) || memoryStore.children[0];
  const lesson = memoryStore.lessons.find((l) => l.id === lessonId);

  if (!lesson) {
    return res.status(404).json({ success: false, message: 'Lesson not found' });
  }

  const alreadyCompleted = memoryStore.completions.some(
    (c) => c.child_id === child.id && c.lesson_id === lessonId
  );

  const xpEarned = alreadyCompleted ? 5 : (lesson.xpReward || 15);
  const starsEarned = alreadyCompleted ? 2 : (lesson.starsReward || 5);

  if (!alreadyCompleted) {
    memoryStore.completions.push({
      id: memoryStore.completions.length + 1,
      child_id: child.id,
      lesson_id: lessonId,
      xp_earned: xpEarned,
      stars_earned: starsEarned,
      completed_at: new Date().toISOString(),
    });
  }

  // Update child points & level
  child.xp += xpEarned;
  child.stars += starsEarned;
  if (child.xp >= child.xp_to_next) {
    child.level += 1;
    child.xp_to_next += 100;
  }

  // Check badge trigger
  let unlockedBadge = null;
  if (lesson.badgeTrigger) {
    const hasBadge = memoryStore.badgeUnlocks.some(
      (b) => b.child_id === child.id && b.badge_id === lesson.badgeTrigger
    );
    if (!hasBadge) {
      memoryStore.badgeUnlocks.push({
        id: memoryStore.badgeUnlocks.length + 1,
        child_id: child.id,
        badge_id: lesson.badgeTrigger,
        unlocked_at: new Date().toISOString(),
      });
      unlockedBadge = memoryStore.badges.find((b) => b.id === lesson.badgeTrigger);
    }
  }

  // Add activity log
  const newActivity = {
    id: `act-${Date.now()}`,
    child_id: child.id,
    type: 'learn',
    title: `Finished "${lesson.title}"`,
    emoji: lesson.emoji || '📚',
    xp_earned: xpEarned,
    created_at: new Date().toISOString(),
  };
  memoryStore.activityLogs.unshift(newActivity);

  res.json({
    success: true,
    message: 'Lesson completed successfully',
    child,
    xpEarned,
    starsEarned,
    unlockedBadge,
    completedLessonIds: memoryStore.completions.filter((c) => c.child_id === child.id).map((c) => c.lesson_id),
  });
}

export function advanceMission(req, res) {
  const { childId, missionId } = req.body;
  const child = memoryStore.children.find((c) => c.id === (childId || 'child_001')) || memoryStore.children[0];
  const mission = memoryStore.missions.find((m) => m.id === (missionId || 'm1'));

  if (!mission) {
    return res.status(404).json({ success: false, message: 'Mission not found' });
  }

  mission.progress = Math.min(mission.progress + 1, mission.totalSteps);
  const isFinished = mission.progress >= mission.totalSteps;
  if (isFinished) mission.status = 'completed';

  const xpEarned = isFinished ? (mission.xpReward || 20) : 5;
  const starsEarned = isFinished ? 10 : 2;

  child.xp += xpEarned;
  child.stars += starsEarned;

  if (isFinished) {
    memoryStore.activityLogs.unshift({
      id: `act-${Date.now()}`,
      child_id: child.id,
      type: 'mission',
      title: `Completed Mission "${mission.title}"`,
      emoji: mission.emoji || '🎯',
      xp_earned: xpEarned,
      created_at: new Date().toISOString(),
    });
  }

  res.json({
    success: true,
    mission,
    child,
    isFinished,
  });
}
