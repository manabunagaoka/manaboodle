-- Supabase SQL Script to ensure university access table has all required columns
-- Run this in your Supabase SQL Editor

-- First, create the table if it doesn't exist
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
  newsletter_consent boolean DEFAULT false,
  age_verification boolean DEFAULT false,
  
  -- Access tracking
  access_granted_at timestamptz DEFAULT now(),
  last_accessed timestamptz,
  access_count integer DEFAULT 0,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add missing columns if they don't exist (for existing tables)
DO $$ 
BEGIN
    -- Add age_verification column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'university_access' 
        AND column_name = 'age_verification'
    ) THEN
        ALTER TABLE public.university_access 
        ADD COLUMN age_verification boolean DEFAULT false;
        
        -- Add comment to explain the column
        COMMENT ON COLUMN public.university_access.age_verification IS 'LEGAL: Confirm user is 18+ years old for COPPA compliance';
    END IF;
    
    -- Add newsletter_consent column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'university_access' 
        AND column_name = 'newsletter_consent'
    ) THEN
        ALTER TABLE public.university_access 
        ADD COLUMN newsletter_consent boolean DEFAULT false;
    END IF;
END $$;

-- Create indexes if they don't exist
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

-- Create or replace the updated_at function
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

-- Verify the table structure
SELECT 
    column_name, 
    data_type, 
    column_default, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'university_access'
ORDER BY ordinal_position;

-- Success message
SELECT 'University access table updated successfully!' as message;
