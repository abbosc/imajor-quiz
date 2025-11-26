-- Migration: Add majors tables for user interest selection
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Majors reference table (admin-managed)
CREATE TABLE IF NOT EXISTS majors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User-major selections (many-to-many relationship)
CREATE TABLE IF NOT EXISTS user_majors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  major_id UUID NOT NULL REFERENCES majors(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, major_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_majors_user ON user_majors(user_id);
CREATE INDEX IF NOT EXISTS idx_user_majors_major ON user_majors(major_id);
CREATE INDEX IF NOT EXISTS idx_majors_active ON majors(is_active);
CREATE INDEX IF NOT EXISTS idx_majors_order ON majors(order_index);

-- Enable Row Level Security
ALTER TABLE majors ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_majors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for majors table
-- Anyone can read active majors (for selection UI)
CREATE POLICY "Public can view active majors"
  ON majors FOR SELECT
  USING (is_active = true);

-- RLS Policies for user_majors table
-- Users can view their own major selections
CREATE POLICY "Users can view own majors"
  ON user_majors FOR SELECT
  USING (auth.uid() = user_id);

-- Users can add major selections
CREATE POLICY "Users can add own majors"
  ON user_majors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own major selections
CREATE POLICY "Users can delete own majors"
  ON user_majors FOR DELETE
  USING (auth.uid() = user_id);
