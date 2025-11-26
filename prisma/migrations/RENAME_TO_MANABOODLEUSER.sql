-- ===================================================================
-- RENAME HarvardUser TO ManaboodleUser
-- This renames the table to reflect its role as the master user table
-- Run this in Supabase SQL Editor AFTER deploying code changes
-- ===================================================================

-- Step 1: Check current table exists
SELECT COUNT(*) as user_count FROM "HarvardUser";

-- Step 2: Rename the main table
ALTER TABLE "HarvardUser" RENAME TO "ManaboodleUser";

-- Step 3: Rename all indexes
ALTER INDEX "HarvardUser_username_key" RENAME TO "ManaboodleUser_username_key";
ALTER INDEX "HarvardUser_accessType_idx" RENAME TO "ManaboodleUser_accessType_idx";
ALTER INDEX "HarvardUser_emailVerified_idx" RENAME TO "ManaboodleUser_emailVerified_idx";
ALTER INDEX "HarvardUser_username_idx" RENAME TO "ManaboodleUser_username_idx";

-- Step 4: Verify rename worked
SELECT 
  email, 
  username, 
  "accessType", 
  "emailVerified"
FROM "ManaboodleUser" 
ORDER BY "createdAt";

-- Step 5: Check GuestPass foreign key still works
SELECT 
  gp.email, 
  gp.status, 
  mu.username 
FROM "GuestPass" gp
LEFT JOIN "ManaboodleUser" mu ON mu."guestPassId" = gp.id;

-- ===================================================================
-- ROLLBACK (if something goes wrong)
-- ===================================================================
/*
ALTER TABLE "ManaboodleUser" RENAME TO "HarvardUser";
ALTER INDEX "ManaboodleUser_username_key" RENAME TO "HarvardUser_username_key";
ALTER INDEX "ManaboodleUser_accessType_idx" RENAME TO "HarvardUser_accessType_idx";
ALTER INDEX "ManaboodleUser_emailVerified_idx" RENAME TO "HarvardUser_emailVerified_idx";
ALTER INDEX "ManaboodleUser_username_idx" RENAME TO "HarvardUser_username_idx";
*/
