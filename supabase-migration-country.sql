-- ============================================
-- Migration: Add country field to profiles
-- ============================================

-- 1. Add country column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country TEXT;

-- 2. Update the handle_new_user trigger function to include country
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, country)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'country'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: The trigger itself (on_auth_user_created) doesn't need to be recreated
-- since it just calls the function which we've updated above.
