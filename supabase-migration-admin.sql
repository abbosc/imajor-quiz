-- Migration: Add is_admin column to profiles table
-- Run this in your Supabase SQL Editor

-- Add is_admin column with default false
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Make yourself admin (replace with your admin email)
-- UPDATE profiles SET is_admin = true WHERE email = 'your-admin-email@example.com';

-- Example: If your admin email is admin@imajor.app:
-- UPDATE profiles SET is_admin = true WHERE email = 'admin@imajor.app';
