-- Migration: Add the App table (Step 1 of AUTH_CORE_PLAN.md)
-- Date: 2026-09-21
--
-- The list of apps allowed to sign people in through Manaboodle, and the
-- web addresses each one may send people back to. The SSO login page and
-- /api/sso/token refuse any app or return address not listed here.
--
-- Run this in the Supabase SQL Editor before deploying the code that uses it.

CREATE TABLE IF NOT EXISTS "App" (
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

-- No policies are added, so only the service key can read or change this
-- table. Browsers using the public key see nothing.
ALTER TABLE "App" ENABLE ROW LEVEL SECURITY;

-- Forks runs on port 3001 in development, next to Manaboodle on 3000.
-- Add its live address here once it is deployed.
INSERT INTO "App" ("slug", "name", "returnOrigins")
VALUES ('forks', 'Forks', ARRAY['http://localhost:3001'])
ON CONFLICT ("slug") DO NOTHING;

-- The SSO test page at /sso/test returns to Manaboodle itself.
INSERT INTO "App" ("slug", "name", "returnOrigins")
VALUES (
  'sso-test',
  'SSO Test',
  ARRAY['http://localhost:3000', 'https://manaboodle.com', 'https://www.manaboodle.com']
)
ON CONFLICT ("slug") DO NOTHING;
