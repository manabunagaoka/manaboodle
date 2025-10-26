-- Enable Row Level Security on HarvardUser table
ALTER TABLE "HarvardUser" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own HarvardUser record
-- Matches the authenticated user's ID (auth.uid()) to the authUserId column
CREATE POLICY "Users can read own HarvardUser record"
ON "HarvardUser"
FOR SELECT
TO authenticated
USING (auth.uid()::text = "authUserId"::text);

-- Policy: Allow reading HarvardUser by email for authenticated users
-- This allows the login page to look up user by email when they have a valid session
CREATE POLICY "Authenticated users can read HarvardUser by email"
ON "HarvardUser"
FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'email' = email);

-- Optional: Policy for inserting new HarvardUser records during signup
CREATE POLICY "Users can insert own HarvardUser record"
ON "HarvardUser"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "authUserId"::text);

-- Optional: Policy for updating own HarvardUser record
CREATE POLICY "Users can update own HarvardUser record"
ON "HarvardUser"
FOR UPDATE
TO authenticated
USING (auth.uid()::text = "authUserId"::text)
WITH CHECK (auth.uid()::text = "authUserId"::text);

-- ============================================================================
-- SUBSCRIBERS TABLE SECURITY (Optional - Uncomment to lock down)
-- ============================================================================
-- Current state: Public can read all subscribers (potentially insecure)
-- Uncomment below to remove public read access and only allow service role

/*
-- Drop the overly permissive public read policies
DROP POLICY IF EXISTS "Allow public read" ON subscribers;
DROP POLICY IF EXISTS "Allow authenticated read" ON subscribers;
DROP POLICY IF EXISTS "Enable read access for all users" ON subscribers;

-- Keep public insert for newsletter signups
-- "Allow public subscription" policy should remain

-- Add secure policy: Only service role can read subscribers
-- This prevents anyone from scraping your subscriber list
CREATE POLICY "Service role can read subscribers"
ON subscribers
FOR SELECT
TO service_role
USING (true);
*/
