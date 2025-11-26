-- Migration: Add username and guest pass system
-- Date: 2025-11-26

-- Step 1: Add new columns to HarvardUser table
ALTER TABLE "HarvardUser" 
ADD COLUMN IF NOT EXISTS "username" VARCHAR(50),
ADD COLUMN IF NOT EXISTS "accessType" VARCHAR(20) DEFAULT 'guest',
ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "institution" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "guestPassId" UUID,
ADD COLUMN IF NOT EXISTS "accessExpiresAt" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP;

-- Step 2: Make classCode nullable (already is in schema)
ALTER TABLE "HarvardUser" 
ALTER COLUMN "classCode" DROP NOT NULL;

-- Step 3: Create GuestPass table
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

-- Step 4: Create AdminUser table
CREATE TABLE IF NOT EXISTS "AdminUser" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "role" VARCHAR(20) DEFAULT 'admin',
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Step 5: Add indexes
CREATE INDEX IF NOT EXISTS "idx_harvarduser_username" ON "HarvardUser"("username");
CREATE INDEX IF NOT EXISTS "idx_harvarduser_accesstype" ON "HarvardUser"("accessType");
CREATE INDEX IF NOT EXISTS "idx_harvarduser_emailverified" ON "HarvardUser"("emailVerified");
CREATE INDEX IF NOT EXISTS "idx_guestpass_email" ON "GuestPass"("email");
CREATE INDEX IF NOT EXISTS "idx_guestpass_status" ON "GuestPass"("status");
CREATE INDEX IF NOT EXISTS "idx_guestpass_code" ON "GuestPass"("code");
CREATE INDEX IF NOT EXISTS "idx_adminuser_email" ON "AdminUser"("email");

-- Step 6: Update existing users
-- Set emailVerified to true for existing users
UPDATE "HarvardUser" 
SET "emailVerified" = true
WHERE "createdAt" < NOW();

-- Set accessType based on email domain for existing users
UPDATE "HarvardUser" 
SET "accessType" = CASE 
  WHEN "email" LIKE '%@sesame.org' THEN 'sesame'
  WHEN "email" LIKE '%@%.harvard.edu' OR "email" LIKE '%@harvard.edu' THEN 'harvard'
  ELSE 'guest'
END
WHERE "accessType" = 'guest';

-- Step 7: Generate usernames for existing users (temporary - you'll need to manually verify/update)
-- This creates username from email prefix (before @)
UPDATE "HarvardUser" 
SET "username" = LOWER(REGEXP_REPLACE(SPLIT_PART("email", '@', 1), '[^a-zA-Z0-9]', '_', 'g'))
WHERE "username" IS NULL;

-- Handle duplicate usernames by appending numbers
WITH numbered AS (
  SELECT 
    "id",
    "username",
    ROW_NUMBER() OVER (PARTITION BY "username" ORDER BY "createdAt") as rn
  FROM "HarvardUser"
  WHERE "username" IS NOT NULL
)
UPDATE "HarvardUser" h
SET "username" = n."username" || '_' || n.rn
FROM numbered n
WHERE h."id" = n."id" AND n.rn > 1;

-- Step 8: Make username required after populating existing records
ALTER TABLE "HarvardUser" 
ALTER COLUMN "username" SET NOT NULL;

-- Step 9: Add unique constraint on username
CREATE UNIQUE INDEX IF NOT EXISTS "HarvardUser_username_key" ON "HarvardUser"("username");

-- Step 10: Add foreign key constraint for guestPassId
ALTER TABLE "HarvardUser"
ADD CONSTRAINT "HarvardUser_guestPassId_fkey" 
FOREIGN KEY ("guestPassId") REFERENCES "GuestPass"("id") 
ON DELETE SET NULL ON UPDATE CASCADE;

-- MANUAL STEP: Insert your admin email
-- INSERT INTO "AdminUser" ("email", "role") 
-- VALUES ('your-email@sesame.org', 'super_admin');
-- Uncomment and replace with your actual email before running
