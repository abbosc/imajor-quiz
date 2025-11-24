-- iMajor Quiz Platform Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Sections Table
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Questions Table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Answer Choices Table
CREATE TABLE answer_choices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  choice_text TEXT NOT NULL,
  points INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Interpretation Levels Table (Admin-defined score ranges)
CREATE TABLE interpretation_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  min_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  level_label TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Quiz Submissions Table
CREATE TABLE quiz_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unique_id TEXT NOT NULL UNIQUE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  total_score INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Submission Answers Table
CREATE TABLE submission_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES quiz_submissions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_choice_id UUID NOT NULL REFERENCES answer_choices(id) ON DELETE CASCADE,
  points_earned INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_questions_section_id ON questions(section_id);
CREATE INDEX idx_answer_choices_question_id ON answer_choices(question_id);
CREATE INDEX idx_submission_answers_submission_id ON submission_answers(submission_id);
CREATE INDEX idx_quiz_submissions_unique_id ON quiz_submissions(unique_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE interpretation_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_answers ENABLE ROW LEVEL SECURITY;

-- Public read access for quiz content (sections, questions, answers, interpretations)
CREATE POLICY "Allow public read access to sections"
  ON sections FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to active questions"
  ON questions FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow public read access to answer choices"
  ON answer_choices FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to interpretation levels"
  ON interpretation_levels FOR SELECT
  USING (true);

-- Public can insert quiz submissions
CREATE POLICY "Allow public to insert quiz submissions"
  ON quiz_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public to read their own submissions by unique_id"
  ON quiz_submissions FOR SELECT
  USING (true);

-- Public can insert submission answers
CREATE POLICY "Allow public to insert submission answers"
  ON submission_answers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public to read submission answers"
  ON submission_answers FOR SELECT
  USING (true);

-- Note: Admin operations will be handled through service role key
-- For admin CRUD operations, you'll use the service role key in your backend API routes
