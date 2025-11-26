-- Database Index Optimization Migration
-- Run this in Supabase SQL Editor to add missing indexes

-- Index for quiz_submissions email lookups (used in quiz-results fallback query)
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_email
  ON quiz_submissions(user_email);

-- Composite index for user_id + created_at (common query pattern: fetch user's submissions sorted by date)
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_user_created
  ON quiz_submissions(user_id, created_at DESC);

-- Index for profiles email lookups (used in check-email route)
CREATE INDEX IF NOT EXISTS idx_profiles_email
  ON profiles(email);

-- Index for user_majors lookups (used in dashboard and settings)
CREATE INDEX IF NOT EXISTS idx_user_majors_user
  ON user_majors(user_id);

-- Composite index for exploration_tasks (active tasks ordered by index)
CREATE INDEX IF NOT EXISTS idx_exploration_tasks_active_order
  ON exploration_tasks(is_active, order_index)
  WHERE is_active = true;

-- Verify indexes were created
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
