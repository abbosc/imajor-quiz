-- Career Paths Feature Migration
-- Run this in Supabase SQL Editor

-- =============================================
-- 1. CREATE TABLES
-- =============================================

-- Career Categories Table
CREATE TABLE career_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,                    -- emoji or icon name
  color text,                   -- hex color for styling
  order_index int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Career Majors Table
CREATE TABLE career_majors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES career_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(category_id, slug)
);

-- Careers Table
CREATE TABLE careers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  major_id uuid REFERENCES career_majors(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,

  -- Basic Info
  brief_description text,

  -- Responsibilities (stored as JSON array)
  responsibilities jsonb,       -- ["Design systems", "Write code", ...]

  -- Skills
  hard_skills jsonb,            -- ["Python", "SQL", "System Design"]
  soft_skills jsonb,            -- ["Communication", "Problem Solving"]

  -- Education
  education_required text,      -- "Bachelor's degree typically required"
  certifications jsonb,         -- ["AWS Certified", "PMP"]

  -- Salary (in USD)
  salary_entry int,             -- 65000
  salary_average int,           -- 95000
  salary_high int,              -- 150000
  salary_growth text,           -- "Salaries typically grow 5-8% annually"
  high_paying_regions jsonb,    -- ["San Francisco", "New York", "Seattle"]
  high_paying_industries jsonb, -- ["Tech", "Finance", "Healthcare"]

  -- Growth
  growth_outlook text,          -- "Much faster than average (22% over 10 years)"
  advancement_paths jsonb,      -- ["Senior Engineer", "Tech Lead", "CTO"]

  -- Day to Day
  typical_day text,             -- "A typical day involves..."
  real_tasks jsonb,             -- ["Review pull requests", "Debug production issues"]

  -- Meta
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(major_id, slug)
);

-- User Saved Careers Table
CREATE TABLE user_saved_careers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  career_id uuid REFERENCES careers(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, career_id)
);

-- =============================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_career_categories_slug ON career_categories(slug);
CREATE INDEX idx_career_categories_active ON career_categories(is_active);
CREATE INDEX idx_career_majors_category ON career_majors(category_id);
CREATE INDEX idx_career_majors_slug ON career_majors(slug);
CREATE INDEX idx_careers_major ON careers(major_id);
CREATE INDEX idx_careers_slug ON careers(slug);
CREATE INDEX idx_user_saved_careers_user ON user_saved_careers(user_id);
CREATE INDEX idx_user_saved_careers_career ON user_saved_careers(career_id);

-- =============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE career_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_majors ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_careers ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 4. CREATE RLS POLICIES
-- =============================================

-- Public read access for career data (anyone can browse careers)
CREATE POLICY "Public can view active categories"
  ON career_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can view active majors"
  ON career_majors FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can view active careers"
  ON careers FOR SELECT
  USING (is_active = true);

-- Admin full access (using service role key in API routes)
-- Note: Admin operations use service role which bypasses RLS

-- User bookmark management
CREATE POLICY "Users can view own saved careers"
  ON user_saved_careers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save careers"
  ON user_saved_careers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave careers"
  ON user_saved_careers FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- 5. INSERT INITIAL CATEGORIES
-- =============================================

INSERT INTO career_categories (name, slug, description, icon, color, order_index) VALUES
  ('Technology & Engineering', 'technology-engineering', 'Build the future with software, hardware, and innovative solutions', '💻', '#3B82F6', 1),
  ('Healthcare & Medicine', 'healthcare-medicine', 'Save lives and improve health outcomes for communities', '🏥', '#10B981', 2),
  ('Business & Finance', 'business-finance', 'Drive economic growth and manage organizational success', '💼', '#F59E0B', 3),
  ('Arts & Design', 'arts-design', 'Create visual experiences and shape aesthetic culture', '🎨', '#EC4899', 4),
  ('Education & Social Sciences', 'education-social-sciences', 'Shape minds and understand human behavior and society', '📚', '#8B5CF6', 5),
  ('Law & Public Policy', 'law-public-policy', 'Advocate for justice and shape governance systems', '⚖️', '#6366F1', 6),
  ('Natural Sciences', 'natural-sciences', 'Discover the fundamental laws of nature and universe', '🔬', '#14B8A6', 7),
  ('Communications & Media', 'communications-media', 'Tell stories and connect people through information', '📝', '#F97316', 8);

-- =============================================
-- 6. HELPER FUNCTION FOR UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_careers_updated_at
  BEFORE UPDATE ON careers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
