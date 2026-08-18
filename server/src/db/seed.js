import bcrypt from 'bcryptjs';
import pool, { testDbConnection } from '../config/db.js';
import { SUBJECTS } from '../../../src/data/learningCurriculum.js';
import { badges, missions } from '../../../src/data/mockData.js';

async function seed() {
  console.log('🌱 Starting Database Seeding...');
  const isOnline = await testDbConnection();

  if (!isOnline) {
    console.log('ℹ️ PostgreSQL is offline. Seed completed for in-memory DB store.');
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Seed Demo Parent
    const parentPasswordHash = await bcrypt.hash('password123', 10);
    const parentPinHash = await bcrypt.hash('1234', 10);

    await client.query(
      `INSERT INTO parents (id, name, email, password_hash, pin_hash, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO NOTHING`,
      ['parent_001', 'Puan Siti & En. Ahmad', 'parent@kidora.com.my', parentPasswordHash, parentPinHash, 'parent']
    );

    // 2. Seed Demo Child (Adam)
    await client.query(
      `INSERT INTO children (id, parent_id, name, age, avatar, level, xp, xp_to_next, stars, streak)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO NOTHING`,
      ['child_001', 'parent_001', 'Adam', 5, '🦁', 3, 120, 200, 45, 7]
    );

    // 3. Seed Subjects & Lessons
    for (const sub of SUBJECTS) {
      await client.query(
        `INSERT INTO subjects (id, title, title_bm, emoji, color, theme_color, skill_key, description, description_bm)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO NOTHING`,
        [sub.id, sub.title, sub.title_bm, sub.emoji, sub.color, sub.themeColor, sub.skillKey, sub.description, sub.description_bm]
      );

      for (const top of sub.topics) {
        await client.query(
          `INSERT INTO topics (id, subject_id, title, title_bm, emoji)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO NOTHING`,
          [top.id, sub.id, top.title, top.title_bm, top.emoji]
        );

        for (const les of top.lessons) {
          await client.query(
            `INSERT INTO lessons (id, subject_id, topic_id, age_group, title, title_bm, emoji, difficulty, estimated_minutes, xp_reward, stars_reward, badge_trigger, learning_objective, learning_objective_bm, challenge_data)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
             ON CONFLICT (id) DO NOTHING`,
            [
              les.id,
              sub.id,
              top.id,
              les.ageGroup,
              les.title,
              les.title_bm,
              les.emoji,
              les.difficulty,
              les.estimatedMinutes,
              les.xpReward,
              les.starsReward,
              les.badgeTrigger,
              les.learningObjective,
              les.learningObjective_bm,
              JSON.stringify(les.challenge),
            ]
          );
        }
      }
    }

    // 4. Seed Badges
    for (const b of badges) {
      await client.query(
        `INSERT INTO badges (id, title, emoji, description, requirement)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [b.id, b.title, b.emoji, b.description, b.requirement || '']
      );
    }

    // 5. Seed Missions
    for (const m of missions) {
      await client.query(
        `INSERT INTO missions (id, title, emoji, description, total_steps, xp_reward, steps_data)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
        [m.id, m.title, m.emoji, m.description, m.totalSteps, m.xpReward || 20, JSON.stringify(m.steps || [])]
      );
    }

    await client.query('COMMIT');
    console.log('✅ PostgreSQL Database Seeding Completed Successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding Error:', err.message);
  } finally {
    client.release();
  }
}

seed();
