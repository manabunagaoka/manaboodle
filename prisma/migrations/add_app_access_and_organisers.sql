-- Migration: Access per app, organisers and registrations
-- (Steps 3 and 3b of AUTH_CORE_PLAN.md)
-- Date: 2026-09-22
--
-- Run this in the Supabase SQL Editor after add_app_table.sql and before
-- deploying the code that uses it.

-- Registration no longer asks for a username or an affiliation.
ALTER TABLE "ManaboodleUser" ALTER COLUMN "username" DROP NOT NULL;
ALTER TABLE "ManaboodleUser" ALTER COLUMN "affiliation" DROP NOT NULL;

-- Anyone may register for Forks. The test app is open too.
UPDATE "App" SET "signupOpen" = true WHERE "slug" IN ('forks', 'sso-test');

-- Which person may use which app, and in what role. Keyed on the Supabase
-- Auth user, so deleting a person removes their access with them.
CREATE TABLE IF NOT EXISTS "AppAccess" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "authUserId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "appId" UUID NOT NULL REFERENCES "App"("id") ON DELETE CASCADE,
  "role" VARCHAR(20) NOT NULL DEFAULT 'member',    -- 'guest' | 'member' | 'admin'
  "status" VARCHAR(20) NOT NULL DEFAULT 'active',  -- 'pending' | 'active' | 'revoked'
  "expiresAt" TIMESTAMP,
  "grantedBy" VARCHAR(255),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE ("authUserId", "appId")
);

-- Organisations that bring people to an app, such as Mangrove Education
-- bringing facilitators to Forks. contactEmails are the people at the
-- organiser who may receive its registrants' contact details.
CREATE TABLE IF NOT EXISTS "Organiser" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" VARCHAR(50) NOT NULL UNIQUE,
  "name" VARCHAR(200) NOT NULL,
  "contactEmails" TEXT[] NOT NULL DEFAULT '{}',
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- One row each time a person registers for an app, with the organiser whose
-- link they used (if any) and the exact wording they agreed to.
CREATE TABLE IF NOT EXISTS "Registration" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "authUserId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "appId" UUID NOT NULL REFERENCES "App"("id") ON DELETE CASCADE,
  "organiserId" UUID REFERENCES "Organiser"("id") ON DELETE SET NULL,
  "agreedText" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Registration_organiserId_idx" ON "Registration" ("organiserId");

-- Only the service key can read or change these tables.
ALTER TABLE "AppAccess" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Organiser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Registration" ENABLE ROW LEVEL SECURITY;

-- The confirmation email sends people back to the app they registered for.
ALTER TABLE "EmailVerificationToken" ADD COLUMN IF NOT EXISTS "appSlug" VARCHAR(50);
ALTER TABLE "EmailVerificationToken" ADD COLUMN IF NOT EXISTS "returnUrl" TEXT;

INSERT INTO "Organiser" ("slug", "name")
VALUES ('mangrove', 'Mangrove Education')
ON CONFLICT ("slug") DO NOTHING;

-- Admins get admin access to every listed app.
INSERT INTO "AppAccess" ("authUserId", "appId", "role", "status", "grantedBy")
SELECT u."authUserId"::uuid, a."id", 'admin', 'active', 'migration'
FROM "ManaboodleUser" u
JOIN "AdminUser" ad ON lower(ad."email") = lower(u."email")
CROSS JOIN "App" a
ON CONFLICT ("authUserId", "appId") DO NOTHING;
