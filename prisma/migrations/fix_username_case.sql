-- Fix username case for existing user
-- This updates the lowercase username to proper case

UPDATE "ManaboodleUser"
SET username = 'ManabuSesame'
WHERE LOWER(username) = 'manabusesame';

-- Verify the update
SELECT username, email FROM "ManaboodleUser" WHERE email LIKE '%sesame%';
