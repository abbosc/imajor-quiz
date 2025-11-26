-- Migration: Add session_token column to quiz_submissions
-- This prevents duplicate quiz submissions by enforcing uniqueness at the database level

-- Add the session_token column with a UNIQUE constraint
ALTER TABLE quiz_submissions
ADD COLUMN session_token TEXT UNIQUE;

-- Create an index for faster lookups when handling duplicate errors
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_session_token
ON quiz_submissions(session_token)
WHERE session_token IS NOT NULL;
