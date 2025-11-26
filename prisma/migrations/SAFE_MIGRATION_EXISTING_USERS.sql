-- ===================================================================
-- SAFE MIGRATION FOR EXISTING USERS
-- This preserves ALL your existing data and generates usernames
-- Run this in Supabase SQL Editor
-- ===================================================================

-- Step 1: Check your existing users BEFORE migration
-- RUN THIS FIRST TO SEE YOUR CURRENT DATA:
SELECT id, email, name, "classCode", "createdAt" FROM "HarvardUser" ORDER BY "createdAt";

-- Step 2: Add new columns (all nullable at first, we'll populate then make required)
ALTER TABLE "HarvardUser" 
ADD COLUMN IF NOT EXISTS "username" VARCHAR(50),
ADD COLUMN IF NOT EXISTS "accessType" VARCHAR(20) DEFAULT 'harvard',
ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN DEFAULT true,  -- Default TRUE for existing users
ADD COLUMN IF NOT EXISTS "institution" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "guestPassId" UUID,
ADD COLUMN IF NOT EXISTS "accessExpiresAt" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP;

-- Step 3: Make classCode nullable (if not already)
ALTER TABLE "HarvardUser" 
ALTER COLUMN "classCode" DROP NOT NULL;

-- Step 4: Generate usernames from email addresses
-- Example: john.smith@law.harvard.edu becomes "john_smith"
UPDATE "HarvardUser"
SET "username" = LOWER(
  REGEXP_REPLACE(
    SPLIT_PART(email, '@', 1),  -- Get part before @
    '[^a-z0-9]',                -- Replace non-alphanumeric
    '_',                        -- With underscore
    'g'
  )
)
WHERE "username" IS NULL;

-- Step 5: Handle any duplicate usernames by adding number suffix
DO $$
DECLARE
  r RECORD;
  counter INT;
BEGIN
  FOR r IN 
    SELECT username 
    FROM "HarvardUser" 
    GROUP BY username 
    HAVING COUNT(*) > 1
  LOOP
    counter := 1;
    FOR r IN 
      SELECT id, username, "createdAt"
      FROM "HarvardUser" 
      WHERE username = r.username
      ORDER BY "createdAt"
    LOOP
      IF counter > 1 THEN
        UPDATE "HarvardUser"
        SET username = username || '_' || counter
        WHERE id = r.id;
      END IF;
      counter := counter + 1;
    END LOOP;
  END LOOP;
END $$;

-- Step 6: Set accessType based on email domain
UPDATE "HarvardUser"
SET "accessType" = CASE
  WHEN email LIKE '%@sesame.org' THEN 'sesame'
  WHEN email LIKE '%harvard.edu' THEN 'harvard'
  ELSE 'guest'
END;

-- Step 7: Now make username NOT NULL and add unique constraint
ALTER TABLE "HarvardUser"
ALTER COLUMN "username" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "HarvardUser_username_key" ON "HarvardUser"("username");

-- Step 8: Add performance indexes
CREATE INDEX IF NOT EXISTS "HarvardUser_accessType_idx" ON "HarvardUser"("accessType");
CREATE INDEX IF NOT EXISTS "HarvardUser_emailVerified_idx" ON "HarvardUser"("emailVerified");
CREATE INDEX IF NOT EXISTS "HarvardUser_username_idx" ON "HarvardUser"("username");

-- Step 9: Create GuestPass table
CREATE TABLE IF NOT EXISTS "GuestPass" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" VARCHAR(255) NOT NULL,
  "code" VARCHAR(20) UNIQUE,
  "status" VARCHAR(20) DEFAULT 'pending',
  "requestReason" TEXT,
  "institution" VARCHAR(255),
  "expiresAt" TIMESTAMP,
  "approvedBy" VARCHAR(255),
  "approvedAt" TIMESTAMP,
  "deniedReason" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "GuestPass_email_idx" ON "GuestPass"("email");
CREATE INDEX IF NOT EXISTS "GuestPass_status_idx" ON "GuestPass"("status");
CREATE INDEX IF NOT EXISTS "GuestPass_code_idx" ON "GuestPass"("code");

-- Step 10: Create AdminUser table
CREATE TABLE IF NOT EXISTS "AdminUser" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "role" VARCHAR(20) DEFAULT 'admin',
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "AdminUser_email_idx" ON "AdminUser"("email");

-- Step 11: Insert YOUR admin email (CHANGE THIS TO YOUR ACTUAL EMAIL!)
-- IMPORTANT: Update this with your sesame.org email
INSERT INTO "AdminUser" ("email", "role") 
VALUES ('manabunagaoka@gmail.com', 'super_admin')
ON CONFLICT ("email") DO NOTHING;

-- ===================================================================
-- VERIFICATION QUERIES - Run these to check migration success
-- ===================================================================

-- Check all users have usernames now:
SELECT 
  email, 
  username, 
  "accessType", 
  "emailVerified",
  name,
  "classCode"
FROM "HarvardUser" 
ORDER BY "createdAt";

-- Count by access type:
SELECT "accessType", COUNT(*) 
FROM "HarvardUser" 
GROUP BY "accessType";

-- Check for any NULL usernames (should be 0):
SELECT COUNT(*) as null_usernames 
FROM "HarvardUser" 
WHERE username IS NULL;

-- Check for duplicate usernames (should be 0):
SELECT username, COUNT(*) 
FROM "HarvardUser" 
GROUP BY username 
HAVING COUNT(*) > 1;

-- Check admin table:
SELECT * FROM "AdminUser";

-- ===================================================================
-- ROLLBACK SCRIPT (if something goes wrong, run this)
-- ===================================================================
/*
ALTER TABLE "HarvardUser" DROP COLUMN IF EXISTS "username";
ALTER TABLE "HarvardUser" DROP COLUMN IF EXISTS "accessType";
ALTER TABLE "HarvardUser" DROP COLUMN IF EXISTS "emailVerified";
ALTER TABLE "HarvardUser" DROP COLUMN IF EXISTS "institution";
ALTER TABLE "HarvardUser" DROP COLUMN IF EXISTS "guestPassId";
ALTER TABLE "HarvardUser" DROP COLUMN IF EXISTS "accessExpiresAt";
ALTER TABLE "HarvardUser" DROP COLUMN IF EXISTS "lastLoginAt";
DROP TABLE IF EXISTS "GuestPass";
DROP TABLE IF EXISTS "AdminUser";
*/
