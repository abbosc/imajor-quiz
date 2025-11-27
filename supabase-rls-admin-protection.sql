-- Row Level Security Policy: Prevent users from updating is_admin field
-- Run this in your Supabase SQL Editor for defense-in-depth security

-- First, ensure RLS is enabled on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing update policy if it exists (optional, adjust to your needs)
-- DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create policy: Users can update their own profile EXCEPT is_admin field
CREATE POLICY "Users can update own profile (except is_admin)"
ON profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND
  -- Ensure is_admin is not being changed by the user
  (
    is_admin IS NULL OR
    is_admin = (SELECT is_admin FROM profiles WHERE id = auth.uid())
  )
);

-- Note: This policy ensures that even if someone bypasses client-side code,
-- they cannot change their is_admin status at the database level.
