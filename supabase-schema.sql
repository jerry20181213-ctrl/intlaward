-- ============================================================
-- Design Awards — Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL UNIQUE,
  name TEXT,
  company TEXT,
  monthly_assessments INTEGER NOT NULL DEFAULT 0,
  quota_month TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access (backend)
CREATE POLICY "Service role can do everything on users" ON users
  FOR ALL USING (auth.role() = 'service_role');

-- Allow users to read own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);


-- 2. Assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  project_type TEXT,
  industry TEXT,
  target_market TEXT,
  project_stage TEXT,
  budget_range TEXT,
  description TEXT,
  image_count INTEGER DEFAULT 0,
  results JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can do everything on assessments" ON assessments
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Users can read own assessments" ON assessments
  FOR SELECT USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);


-- 3. Leads table (PDF report downloads)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  project_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can do everything on leads" ON leads
  FOR ALL USING (auth.role() = 'service_role');
