import bcrypt from 'bcryptjs';
import { SUBJECTS } from '../../../src/data/learningCurriculum.js';
import { badges, missions, parentStats } from '../../../src/data/mockData.js';
import { pool, isDbConnected } from '../config/db.js';
import { loadPersistedData, savePersistedData } from './persist.js';

// Pre-hashed values for Demo Parent
const DEMO_PASSWORD_HASH = bcrypt.hashSync('password123', 8);
const DEMO_PIN_HASH = bcrypt.hashSync('1234', 8);

export const memoryStore = {
  parents: [
    {
      id: 'parent_001',
      name: 'Puan Siti & En. Ahmad',
      email: 'parent@kidora.com.my',
      password_hash: DEMO_PASSWORD_HASH,
      pin_hash: DEMO_PIN_HASH,
      role: 'parent',
      created_at: new Date().toISOString(),
    },
  ],
  children: [
    {
      id: 'child_001',
      parent_id: 'parent_001',
      name: 'Adam',
      age: 5,
      avatar: '🦁',
      level: 3,
      xp: 120,
      xp_to_next: 200,
      stars: 45,
      streak: 7,
      created_at: new Date('2026-06-15').toISOString(),
    },
  ],
  subjects: SUBJECTS,
  lessons: [],
  completions: [
    { id: 1, child_id: 'child_001', lesson_id: 'math_4_count_fruits', xp_earned: 15, stars_earned: 5, completed_at: new Date().toISOString() },
    { id: 2, child_id: 'child_001', lesson_id: 'bm_4_vokal_ceria', xp_earned: 15, stars_earned: 5, completed_at: new Date().toISOString() },
    { id: 3, child_id: 'child_001', lesson_id: 'eng_4_alphabet_sounds', xp_earned: 15, stars_earned: 5, completed_at: new Date().toISOString() },
    { id: 4, child_id: 'child_001', lesson_id: 'sci_4_five_senses', xp_earned: 15, stars_earned: 5, completed_at: new Date().toISOString() },
    { id: 5, child_id: 'child_001', lesson_id: 'art_4_primary_colors', xp_earned: 15, stars_earned: 5, completed_at: new Date().toISOString() },
    { id: 6, child_id: 'child_001', lesson_id: 'life_4_handwashing', xp_earned: 15, stars_earned: 5, completed_at: new Date().toISOString() },
  ],
  missions: missions,
  badges: badges,
  badgeUnlocks: [
    { id: 1, child_id: 'child_001', badge_id: 'explorer-1', unlocked_at: new Date().toISOString() },
    { id: 2, child_id: 'child_001', badge_id: 'math-star', unlocked_at: new Date().toISOString() },
    { id: 3, child_id: 'child_001', badge_id: 'nature-friend', unlocked_at: new Date().toISOString() },
    { id: 4, child_id: 'child_001', badge_id: 'bookworm', unlocked_at: new Date().toISOString() },
    { id: 5, child_id: 'child_001', badge_id: 'artist', unlocked_at: new Date().toISOString() },
  ],
  activityLogs: [
    { id: 'act-001', child_id: 'child_001', type: 'mission', title: 'Completed "Feed the Hungry Animals"', emoji: '🦒', xp_earned: 15, created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: 'act-002', child_id: 'child_001', type: 'learn', title: 'Finished ABC Sounds & Animals', emoji: '🔤', xp_earned: 15, created_at: new Date(Date.now() - 3 * 3600000).toISOString() },
    { id: 'act-003', child_id: 'child_001', type: 'badge', title: 'Earned "Creative Artist" badge', emoji: '🎨', xp_earned: 0, created_at: new Date(Date.now() - 24 * 3600000).toISOString() },
  ],
};

// Flatten lessons list for quick access
SUBJECTS.forEach((sub) => {
  sub.topics.forEach((top) => {
    top.lessons.forEach((les) => {
      memoryStore.lessons.push({
        ...les,
        subjectId: sub.id,
        subjectTitle: sub.title,
        subjectTitleBm: sub.title_bm,
        subjectColor: sub.color,
        topicId: top.id,
        topicTitle: top.title,
      });
    });
  });
});

/* ============================================
   Disk Persistence — data pengguna kekal selepas restart
   ============================================ */
const MUTABLE_KEYS = ['parents', 'children', 'completions', 'badgeUnlocks', 'activityLogs', 'missions'];

// Pulihkan data tersimpan (hanya koleksi mutable) di atas data lalai.
const persisted = loadPersistedData();
if (persisted) {
  for (const key of MUTABLE_KEYS) {
    if (Array.isArray(persisted[key])) {
      memoryStore[key] = persisted[key];
    }
  }
  console.log(`[persist] Data dipulihkan dari cakera (${memoryStore.parents.length} parent, ${memoryStore.children.length} child).`);
}

function persistSnapshot() {
  const snap = {};
  for (const key of MUTABLE_KEYS) snap[key] = memoryStore[key];
  return snap;
}

if (process.env.NODE_ENV !== 'test') {
  const AUTOSAVE_MS = Number(process.env.AUTOSAVE_MS) || 15000;
  setInterval(() => savePersistedData(persistSnapshot()), AUTOSAVE_MS);

  // Simpan pada graceful shutdown (PM2 stop/restart, Ctrl+C).
  const flush = () => {
    savePersistedData(persistSnapshot());
    process.exit(0);
  };
  process.on('SIGINT', flush);
  process.on('SIGTERM', flush);
}

export default memoryStore;
