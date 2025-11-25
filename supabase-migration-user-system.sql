-- ============================================
-- iMajor Platform Expansion Migration
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USER PROFILES (extends Supabase Auth)
-- ============================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. EXPLORATION TASKS (Admin-defined)
-- ============================================

CREATE TABLE IF NOT EXISTS exploration_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. USER TASK PROGRESS
-- ============================================

CREATE TABLE IF NOT EXISTS user_task_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES exploration_tasks(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'completed')),
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

-- ============================================
-- 4. USER UNIVERSITIES
-- ============================================

CREATE TABLE IF NOT EXISTS user_universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  deadline DATE,
  status TEXT DEFAULT 'researching'
    CHECK (status IN ('researching', 'applying', 'applied', 'accepted', 'rejected', 'waitlisted', 'withdrawn')),
  major TEXT,
  decision_type TEXT
    CHECK (decision_type IN ('early_decision', 'early_action', 'regular', 'rolling')),
  scholarship_info TEXT,
  notes TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. USER TESTS
-- ============================================

CREATE TABLE IF NOT EXISTS user_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_name TEXT NOT NULL,
  status TEXT DEFAULT 'planned'
    CHECK (status IN ('planned', 'preparing', 'scheduled', 'completed')),
  test_date DATE,
  target_score TEXT,
  result_score TEXT,
  certificate_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. USER ACTIVITIES (Common App style)
-- ============================================

CREATE TABLE IF NOT EXISTS user_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_name TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  position_title TEXT,
  organization_name TEXT,
  hours_per_week INTEGER,
  weeks_per_year INTEGER,
  years_participated TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. USER HONORS
-- ============================================

CREATE TABLE IF NOT EXISTS user_honors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  honor_name TEXT NOT NULL,
  level TEXT NOT NULL
    CHECK (level IN ('school', 'state', 'regional', 'national', 'international')),
  year_received TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. USER ESSAYS
-- ============================================

CREATE TABLE IF NOT EXISTS user_essays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  prompt TEXT,
  content TEXT,
  word_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft'
    CHECK (status IN ('draft', 'in_review', 'final')),
  university_id UUID REFERENCES user_universities(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. USER RECOMMENDATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS user_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommender_name TEXT NOT NULL,
  recommender_email TEXT,
  subject_taught TEXT,
  relationship TEXT,
  status TEXT DEFAULT 'not_requested'
    CHECK (status IN ('not_requested', 'requested', 'in_progress', 'submitted')),
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. MODIFY EXISTING QUIZ_SUBMISSIONS
-- ============================================

-- Add user_id column to link submissions to users (optional)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_submissions' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE quiz_submissions
    ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================
-- 11. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_exploration_tasks_active ON exploration_tasks(is_active);
CREATE INDEX IF NOT EXISTS idx_exploration_tasks_order ON exploration_tasks(order_index);
CREATE INDEX IF NOT EXISTS idx_user_task_progress_user ON user_task_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_task_progress_task ON user_task_progress(task_id);
CREATE INDEX IF NOT EXISTS idx_user_universities_user ON user_universities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tests_user ON user_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_user ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_honors_user ON user_honors(user_id);
CREATE INDEX IF NOT EXISTS idx_user_essays_user ON user_essays(user_id);
CREATE INDEX IF NOT EXISTS idx_user_recommendations_user ON user_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_user ON quiz_submissions(user_id);

-- ============================================
-- 12. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exploration_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_task_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_honors ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_essays ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recommendations ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can only access their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- EXPLORATION TASKS: Public read for active tasks
DROP POLICY IF EXISTS "Public can read active tasks" ON exploration_tasks;
CREATE POLICY "Public can read active tasks" ON exploration_tasks
  FOR SELECT USING (is_active = true);

-- USER TASK PROGRESS: Users can only manage their own
DROP POLICY IF EXISTS "Users can manage own task progress" ON user_task_progress;
CREATE POLICY "Users can manage own task progress" ON user_task_progress
  FOR ALL USING (auth.uid() = user_id);

-- USER UNIVERSITIES: Users can only manage their own
DROP POLICY IF EXISTS "Users can manage own universities" ON user_universities;
CREATE POLICY "Users can manage own universities" ON user_universities
  FOR ALL USING (auth.uid() = user_id);

-- USER TESTS: Users can only manage their own
DROP POLICY IF EXISTS "Users can manage own tests" ON user_tests;
CREATE POLICY "Users can manage own tests" ON user_tests
  FOR ALL USING (auth.uid() = user_id);

-- USER ACTIVITIES: Users can only manage their own
DROP POLICY IF EXISTS "Users can manage own activities" ON user_activities;
CREATE POLICY "Users can manage own activities" ON user_activities
  FOR ALL USING (auth.uid() = user_id);

-- USER HONORS: Users can only manage their own
DROP POLICY IF EXISTS "Users can manage own honors" ON user_honors;
CREATE POLICY "Users can manage own honors" ON user_honors
  FOR ALL USING (auth.uid() = user_id);

-- USER ESSAYS: Users can only manage their own
DROP POLICY IF EXISTS "Users can manage own essays" ON user_essays;
CREATE POLICY "Users can manage own essays" ON user_essays
  FOR ALL USING (auth.uid() = user_id);

-- USER RECOMMENDATIONS: Users can only manage their own
DROP POLICY IF EXISTS "Users can manage own recommendations" ON user_recommendations;
CREATE POLICY "Users can manage own recommendations" ON user_recommendations
  FOR ALL USING (auth.uid() = user_id);

-- QUIZ SUBMISSIONS: Update policy to allow user-linked submissions
DROP POLICY IF EXISTS "Users can view own quiz submissions" ON quiz_submissions;
CREATE POLICY "Users can view own quiz submissions" ON quiz_submissions
  FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);

-- ============================================
-- 13. STORAGE BUCKET FOR USER FILES
-- ============================================
-- NOTE: Run this in Supabase Dashboard > Storage, or via API:
-- 1. Create bucket named 'user-files' with private access
-- 2. Add policy: authenticated users can only access their own folder
--    - Folder structure: user-files/{user_id}/{filename}

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
