-- Profiles table (one row per user)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT UNIQUE,
  display_name TEXT,
  branch TEXT,
  mos_code TEXT,
  mos_title TEXT,
  service_start_date DATE,
  service_end_date DATE,
  intent_to_file_date DATE,
  entitlement TEXT DEFAULT 'preview' CHECK (entitlement IN ('preview', 'lifetime')),
  vault_passcode_hash TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conditions table
CREATE TABLE IF NOT EXISTS conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  diagnostic_code TEXT,
  category TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'filed', 'awarded', 'denied', 'appeal')),
  claimed_rating INTEGER,
  awarded_rating INTEGER,
  is_secondary BOOLEAN DEFAULT FALSE,
  primary_condition_id UUID REFERENCES conditions(id) ON DELETE SET NULL,
  service_connection_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health logs table (all log types in one table)
CREATE TABLE IF NOT EXISTS health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  log_type TEXT NOT NULL CHECK (log_type IN ('symptom', 'sleep', 'migraine', 'medication', 'visit', 'exposure')),
  condition_id UUID REFERENCES conditions(id) ON DELETE SET NULL,
  data JSONB NOT NULL DEFAULT '{}',
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evidence metadata table
CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  condition_id UUID REFERENCES conditions(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('medical_record', 'buddy_statement', 'nexus_letter', 'photo', 'other')),
  title TEXT,
  notes TEXT,
  storage_path TEXT,
  status TEXT DEFAULT 'needed' CHECK (status IN ('needed', 'collected', 'submitted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  condition_id UUID REFERENCES conditions(id) ON DELETE SET NULL,
  doc_type TEXT CHECK (doc_type IN ('personal_statement', 'buddy_statement', 'nexus_letter', 'stressor_statement', 'form_draft')),
  title TEXT,
  content TEXT,
  storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- VA Form Guide drafts table
CREATE TABLE IF NOT EXISTS form_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  form_number TEXT NOT NULL,
  form_title TEXT,
  field_data JSONB DEFAULT '{}',
  ai_suggestions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Entitlements / purchase records table
CREATE TABLE IF NOT EXISTS entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT CHECK (platform IN ('ios', 'android')),
  product_id TEXT,
  receipt_data TEXT,
  validated BOOLEAN DEFAULT FALSE,
  purchased_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on ALL tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
-- Profiles (id = auth.uid(), not user_id)
CREATE POLICY "Users see own profile" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Users delete own profile" ON profiles FOR DELETE USING (id = auth.uid());

-- All other tables use user_id
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['conditions', 'health_logs', 'evidence', 'documents', 'form_drafts', 'entitlements'])
  LOOP
    EXECUTE format('CREATE POLICY "Users see own %1$s" ON %1$s FOR SELECT USING (user_id = auth.uid())', tbl);
    EXECUTE format('CREATE POLICY "Users insert own %1$s" ON %1$s FOR INSERT WITH CHECK (user_id = auth.uid())', tbl);
    EXECUTE format('CREATE POLICY "Users update own %1$s" ON %1$s FOR UPDATE USING (user_id = auth.uid())', tbl);
    EXECUTE format('CREATE POLICY "Users delete own %1$s" ON %1$s FOR DELETE USING (user_id = auth.uid())', tbl);
  END LOOP;
END $$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_conditions_updated_at BEFORE UPDATE ON conditions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_evidence_updated_at BEFORE UPDATE ON evidence FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_form_drafts_updated_at BEFORE UPDATE ON form_drafts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
