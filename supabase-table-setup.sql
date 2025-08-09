-- Supabase SQL Script to create university access table
-- Run this in your Supabase SQL Editor

-- Create the university_access table (separate from regular subscriptions)
CREATE TABLE IF NOT EXISTS public.university_access (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'revoked')),
  
  -- University researcher details
  full_name text,
  organization text,
  research_focus text,
  feedback_consent boolean DEFAULT false,
  beta_interest boolean DEFAULT false,
  newsletter_consent boolean DEFAULT false, -- NEW: Want general notifications too?
  age_verification boolean DEFAULT false, -- LEGAL: Confirm 18+ years old
  
  -- Access tracking
  access_granted_at timestamptz DEFAULT now(),
  last_accessed timestamptz,
  access_count integer DEFAULT 0,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_university_access_email ON public.university_access(email);
CREATE INDEX IF NOT EXISTS idx_university_access_status ON public.university_access(status);

-- Enable Row Level Security
ALTER TABLE public.university_access ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safe approach)
DROP POLICY IF EXISTS "Allow public inserts" ON public.university_access;
DROP POLICY IF EXISTS "Allow public reads" ON public.university_access;  
DROP POLICY IF EXISTS "Allow public updates" ON public.university_access;

-- Create policies for university access
CREATE POLICY "Allow public inserts" ON public.university_access
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public reads" ON public.university_access
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public updates" ON public.university_access
  FOR UPDATE TO anon, authenticated
  USING (true);

-- Optional: Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_university_access_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_updated_at ON public.university_access;
CREATE TRIGGER trigger_updated_at
  BEFORE UPDATE ON public.university_access
  FOR EACH ROW EXECUTE PROCEDURE public.handle_university_access_updated_at();

-- Success message
SELECT 'University access table created successfully!' as message;
