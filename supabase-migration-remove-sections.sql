-- Migration: Remove sections and add explanation to questions
-- Run this in your Supabase SQL editor

-- 1. Add explanation column to questions table
ALTER TABLE questions ADD COLUMN IF NOT EXISTS explanation TEXT;

-- 2. Drop the foreign key constraint from questions to sections
ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_section_id_fkey;

-- 3. Remove section_id column from questions
ALTER TABLE questions DROP COLUMN IF EXISTS section_id;

-- 4. Drop the sections table
DROP TABLE IF EXISTS sections CASCADE;

-- Note: After running this migration, you'll need to restart your Next.js dev server
