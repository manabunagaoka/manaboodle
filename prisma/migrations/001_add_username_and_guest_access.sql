-- Migration: Add username and guest access features
-- Safe for existing users - adds columns with defaults

-- 1. Add new columns to HarvardUser table (nullable first, we'll populate then make required)
ALTER TABLE "HarvardUser" 
ADD COLUMN IF NOT EXISTS "username" VARCHAR(50),
ADD COLUMN IF NOT EXISTS "displayName" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "accessType" VARCHAR(20) DEFAULT 'harvard',
ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN DEFAULT true,  -- Default true for existing users
ADD COLUMN IF NOT EXISTS "guestPassId" UUID,
ADD COLUMN IF NOT EXISTS "accessExpiresAt" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "institution" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "requestReason" TEXT,
ADD COLUMN IF NOT EXISTS "profileCompleted" BOOLEAN DEFAULT false;

-- 2. Make classCode nullable (if not already)
ALTER TABLE "HarvardUser" 
ALTER COLUMN "classCode" DROP NOT NULL;

-- 3. Generate usernames for existing users (from email prefix)
-- Example: john.smith@harvard.edu -> john_smith
UPDATE "HarvardUser"
SET "username" = LOWER(REPLACE(SPLIT_PART(email, '@', 1), '.', '_'))
WHERE "username" IS NULL;

-- 4. Handle duplicate usernames by appending numbers
WITH duplicates AS (
  SELECT username, ROW_NUMBER() OVER (PARTITION BY username ORDER BY "createdAt") as rn
  FROM "HarvardUser"
  WHERE username IN (
    SELECT username FROM "HarvardUser" GROUP BY username HAVING COUNT(*) > 1
  )
)
UPDATE "HarvardUser" h
SET username = h.username || '_' || d.rn
FROM duplicates d
WHERE h.username = d.username AND d.rn > 1;

-- 5. Set displayName from existing name field
UPDATE "HarvardUser"
SET "displayName" = name
WHERE "displayName" IS NULL;

-- 6. Set accessType based on email domain for existing users
UPDATE "HarvardUser"
SET "accessType" = CASE
  WHEN email LIKE '%@sesame.org' THEN 'sesame'
  WHEN email LIKE '%@%.harvard.edu' OR email LIKE '%@harvard.edu' THEN 'harvard'
  ELSE 'guest'
END
WHERE "accessType" = 'harvard' OR "accessType" IS NULL;

-- 7. Now make username NOT NULL and UNIQUE
ALTER TABLE "HarvardUser"
ALTER COLUMN "username" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "idx_harvarduser_username" ON "HarvardUser"("username");

-- 8. Add other indexes for performance
CREATE INDEX IF NOT EXISTS "idx_harvarduser_accesstype" ON "HarvardUser"("accessType");
CREATE INDEX IF NOT EXISTS "idx_harvarduser_emailverified" ON "HarvardUser"("emailVerified");
CREATE INDEX IF NOT EXISTS "idx_harvarduser_email_lower" ON "HarvardUser"(LOWER("email"));

-- 9. Create GuestPass table
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
  "deniedAt" TIMESTAMP,
  "deniedReason" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_guestpass_email" ON "GuestPass"("email");
CREATE INDEX IF NOT EXISTS "idx_guestpass_status" ON "GuestPass"("status");
CREATE INDEX IF NOT EXISTS "idx_guestpass_code" ON "GuestPass"("code");

-- 10. Create AdminUser table
CREATE TABLE IF NOT EXISTS "AdminUser" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "role" VARCHAR(20) DEFAULT 'admin',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_adminuser_email" ON "AdminUser"(LOWER("email"));

-- 11. Add your admin email (UPDATE THIS WITH YOUR ACTUAL EMAIL)
-- INSERT INTO "AdminUser" ("email", "role") 
-- VALUES ('your-email@sesame.org', 'super_admin')
-- ON CONFLICT ("email") DO NOTHING;

-- Migration complete!
-- Existing users preserved with auto-generated usernames from their emails
-- All new columns added with safe defaults
