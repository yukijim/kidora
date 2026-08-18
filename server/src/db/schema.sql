-- ============================================
-- KIDORA PostgreSQL Database Schema
-- Production DDL for Parents, Children, Curriculum, Progress, & Achievements
-- ============================================

CREATE TABLE IF NOT EXISTS parents (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  pin_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'parent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS children (
  id VARCHAR(64) PRIMARY KEY,
  parent_id VARCHAR(64) NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 3 AND age <= 12),
  avatar VARCHAR(50) DEFAULT '🦁',
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  xp_to_next INTEGER DEFAULT 100,
  stars INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  title_bm VARCHAR(120) NOT NULL,
  emoji VARCHAR(20) NOT NULL,
  color VARCHAR(50) NOT NULL,
  theme_color VARCHAR(20) NOT NULL,
  skill_key VARCHAR(50) NOT NULL,
  description TEXT,
  description_bm TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS topics (
  id VARCHAR(64) PRIMARY KEY,
  subject_id VARCHAR(64) NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title VARCHAR(120) NOT NULL,
  title_bm VARCHAR(120) NOT NULL,
  emoji VARCHAR(20) NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lessons (
  id VARCHAR(64) PRIMARY KEY,
  subject_id VARCHAR(64) NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  topic_id VARCHAR(64) NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  age_group INTEGER NOT NULL CHECK (age_group >= 4 AND age_group <= 7),
  title VARCHAR(150) NOT NULL,
  title_bm VARCHAR(150) NOT NULL,
  emoji VARCHAR(20) NOT NULL,
  difficulty VARCHAR(50) DEFAULT 'beginner',
  estimated_minutes INTEGER DEFAULT 5,
  xp_reward INTEGER DEFAULT 15,
  stars_reward INTEGER DEFAULT 5,
  badge_trigger VARCHAR(64),
  learning_objective TEXT NOT NULL,
  learning_objective_bm TEXT NOT NULL,
  challenge_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lesson_completions (
  id SERIAL PRIMARY KEY,
  child_id VARCHAR(64) NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  lesson_id VARCHAR(64) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  xp_earned INTEGER DEFAULT 15,
  stars_earned INTEGER DEFAULT 5,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_child_lesson UNIQUE (child_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS missions (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  emoji VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  total_steps INTEGER NOT NULL DEFAULT 5,
  xp_reward INTEGER DEFAULT 20,
  steps_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mission_progress (
  id SERIAL PRIMARY KEY,
  child_id VARCHAR(64) NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  mission_id VARCHAR(64) NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  progress_step INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'in-progress',
  completed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT unique_child_mission UNIQUE (child_id, mission_id)
);

CREATE TABLE IF NOT EXISTS badges (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  emoji VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  requirement TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS badge_unlocks (
  id SERIAL PRIMARY KEY,
  child_id VARCHAR(64) NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  badge_id VARCHAR(64) NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_child_badge UNIQUE (child_id, badge_id)
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id VARCHAR(64) PRIMARY KEY,
  child_id VARCHAR(64) NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  emoji VARCHAR(20) NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_children_parent ON children(parent_id);
CREATE INDEX IF NOT EXISTS idx_lessons_age ON lessons(age_group);
CREATE INDEX IF NOT EXISTS idx_lessons_subject ON lessons(subject_id);
CREATE INDEX IF NOT EXISTS idx_completions_child ON lesson_completions(child_id);
CREATE INDEX IF NOT EXISTS idx_activity_child ON activity_logs(child_id, created_at DESC);
