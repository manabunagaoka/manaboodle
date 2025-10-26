-- Enable Row Level Security on HarvardUser table
ALTER TABLE "HarvardUser" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own HarvardUser record
-- Matches the authenticated user's ID (auth.uid()) to the authUserId column
CREATE POLICY "Users can read own HarvardUser record"
ON "HarvardUser"
FOR SELECT
TO authenticated
USING (auth.uid() = "authUserId");

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
WITH CHECK (auth.uid() = "authUserId");

-- Optional: Policy for updating own HarvardUser record
CREATE POLICY "Users can update own HarvardUser record"
ON "HarvardUser"
FOR UPDATE
TO authenticated
USING (auth.uid() = "authUserId")
WITH CHECK (auth.uid() = "authUserId");
