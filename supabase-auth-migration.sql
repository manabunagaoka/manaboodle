-- Migration: Switch from NextAuth to Supabase Auth
-- Run this in Supabase SQL Editor

-- 1. Drop the old HarvardUser table (if it exists from previous setup)
DROP TABLE IF EXISTS "HarvardUser" CASCADE;

-- 2. Create new HarvardUser table that references Supabase auth.users
CREATE TABLE IF NOT EXISTS "HarvardUser" (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  "classCode" TEXT,
  affiliation TEXT NOT NULL CHECK (affiliation IN ('student', 'faculty', 'staff')),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS "HarvardUser_email_idx" ON "HarvardUser"(email);

-- 4. Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_harvard_user_updated_at ON "HarvardUser";
CREATE TRIGGER update_harvard_user_updated_at BEFORE UPDATE ON "HarvardUser"
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Optional: Drop old NextAuth tables if you don't need them
DROP TABLE IF EXISTS "Account" CASCADE;
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "VerificationToken" CASCADE;
DROP TABLE IF EXISTS "PasswordResetToken" CASCADE;

-- Done! Your database is now ready for Supabase Auth
-- Note: auth.users table is managed by Supabase automatically
