-- Phase 1: AI Usage Analytics & Rate Limiting Schema
-- Extends existing ai_usage_events table, adds config + analytics tables

-- 1.1 — Extend ai_usage_events with additional tracking columns
ALTER TABLE public.ai_usage_events
  ADD COLUMN IF NOT EXISTS feature text,
  ADD COLUMN IF NOT EXISTS success boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS duration_ms integer,
  ADD COLUMN IF NOT EXISTS input_length integer,
  ADD COLUMN IF NOT EXISTS platform text;

-- 1.2 — Allow authenticated users to insert their own usage events
CREATE POLICY "ai_usage_events_insert_self"
  ON public.ai_usage_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 1.3 — Server-side monthly usage count RPC
CREATE OR REPLACE FUNCTION public.get_ai_usage_count(p_user_id uuid, p_since timestamptz)
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT count(*)::integer FROM public.ai_usage_events
  WHERE user_id = p_user_id AND created_at >= p_since;
$$;

-- 1.4 — Configurable usage limits table
CREATE TABLE IF NOT EXISTS public.ai_usage_config (
  plan text PRIMARY KEY,
  monthly_limit integer NOT NULL,
  daily_limit integer,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.ai_usage_config (plan, monthly_limit) VALUES
  ('premium', 300),
  ('lifetime', 300)
ON CONFLICT (plan) DO NOTHING;

ALTER TABLE public.ai_usage_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_usage_config_read_authenticated"
  ON public.ai_usage_config FOR SELECT
  USING (auth.role() = 'authenticated');

-- 1.5 — General analytics events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user_time
  ON public.analytics_events (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_type_time
  ON public.analytics_events (event_type, created_at DESC);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "analytics_events_insert_self"
  ON public.analytics_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "analytics_events_read_self"
  ON public.analytics_events FOR SELECT
  USING (auth.uid() = user_id);
