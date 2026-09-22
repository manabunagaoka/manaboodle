-- Setup: the Manaboodle sign-in service on a fresh Supabase project
-- (AUTH_CORE_PLAN.md, Steps 1, 3 and 3b)
-- Date: 2026-09-22
--
-- For the dedicated project manaboodle-auth (Singapore), created with
-- "Automatically expose new tables" off and "automatic RLS" on. Run this
-- once in the SQL Editor. It replaces add_app_table.sql and
-- add_app_access_and_organisers.sql, which were written for the old shared
-- project.
--
-- This database holds sign-in data only: who people are, which apps they
-- may use, and which organiser they registered through. Apps keep their own
-- data elsewhere.

-- People with a Manaboodle account. Passwords live in Supabase's auth.users;
-- this is the profile beside it. The Harvard-era columns (username,
-- classCode, affiliation, institution, guestPassId, accessExpiresAt) are kept
-- so the older portal routes still run, but SSO registration leaves them empty.
CREATE TABLE "ManaboodleUser" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "authUserId" UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "name" VARCHAR(255) NOT NULL,
  "username" VARCHAR(50) UNIQUE,
  "classCode" VARCHAR(50),
  "affiliation" VARCHAR(50),
  "accessType" VARCHAR(20) NOT NULL DEFAULT 'member',
  "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  "institution" VARCHAR(255),
  "guestPassId" UUID,
  "accessExpiresAt" TIMESTAMP,
  "lastLoginAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Who may approve requests and see the dashboard.
CREATE TABLE "AdminUser" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "role" VARCHAR(20) NOT NULL DEFAULT 'admin',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Requests for access from people without an approved email domain.
CREATE TABLE "GuestPass" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" VARCHAR(255) NOT NULL,
  "code" VARCHAR(20) UNIQUE,
  "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
  "requestReason" TEXT,
  "institution" VARCHAR(255),
  "expiresAt" TIMESTAMP,
  "approvedBy" VARCHAR(255),
  "approvedAt" TIMESTAMP,
  "deniedBy" VARCHAR(255),
  "deniedAt" TIMESTAMP,
  "deniedReason" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Links sent to confirm an email address. appSlug and returnUrl send the
-- person back to the app they registered for.
CREATE TABLE "EmailVerificationToken" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" VARCHAR(255) NOT NULL,
  "token" VARCHAR(255) NOT NULL UNIQUE,
  "expires" TIMESTAMP NOT NULL,
  "used" BOOLEAN NOT NULL DEFAULT false,
  "usedAt" TIMESTAMP,
  "appSlug" VARCHAR(50),
  "returnUrl" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX "EmailVerificationToken_email_idx" ON "EmailVerificationToken" ("email");

-- The apps allowed to sign people in, and the web addresses each one may
-- send people back to. Anything not listed is refused.
CREATE TABLE "App" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" VARCHAR(50) NOT NULL UNIQUE,
  "name" VARCHAR(100) NOT NULL,
  "returnOrigins" TEXT[] NOT NULL DEFAULT '{}',
  "secretHash" TEXT,
  "signupOpen" BOOLEAN NOT NULL DEFAULT false,
  "approvedDomains" TEXT[] NOT NULL DEFAULT '{}',
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Which person may use which app, and in what role.
CREATE TABLE "AppAccess" (
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
-- bringing facilitators to Forks. contactEmails are the people there who
-- may receive the organiser's registrants.
CREATE TABLE "Organiser" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" VARCHAR(50) NOT NULL UNIQUE,
  "name" VARCHAR(200) NOT NULL,
  "contactEmails" TEXT[] NOT NULL DEFAULT '{}',
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- One row each time a person registers for an app, with the organiser whose
-- link they used (if any) and the exact wording they agreed to.
CREATE TABLE "Registration" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "authUserId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "appId" UUID NOT NULL REFERENCES "App"("id") ON DELETE CASCADE,
  "organiserId" UUID REFERENCES "Organiser"("id") ON DELETE SET NULL,
  "agreedText" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX "Registration_organiserId_idx" ON "Registration" ("organiserId");

-- Lock every table: row level security on, and no policies, so browsers
-- using the public key see nothing.
ALTER TABLE "ManaboodleUser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AdminUser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GuestPass" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EmailVerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "App" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AppAccess" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Organiser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Registration" ENABLE ROW LEVEL SECURITY;

-- New tables are not exposed automatically on this project, so open these
-- to Manaboodle's server key only. The public key gets nothing.
GRANT USAGE ON SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON
  "ManaboodleUser", "AdminUser", "GuestPass", "EmailVerificationToken",
  "App", "AppAccess", "Organiser", "Registration"
TO service_role;

-- The apps. Forks runs on port 3001 in development; add its live address
-- once it is deployed. The SSO test page at /sso/test returns to Manaboodle.
INSERT INTO "App" ("slug", "name", "returnOrigins", "signupOpen") VALUES
  ('forks', 'Forks', ARRAY['http://localhost:3001'], true),
  ('sso-test', 'SSO Test', ARRAY['http://localhost:3000', 'https://manaboodle.com', 'https://www.manaboodle.com'], true);

INSERT INTO "Organiser" ("slug", "name") VALUES ('mangrove', 'Mangrove Education');
