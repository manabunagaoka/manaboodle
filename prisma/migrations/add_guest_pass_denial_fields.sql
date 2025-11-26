-- Add deniedBy and deniedAt fields to GuestPass table
ALTER TABLE "GuestPass" 
ADD COLUMN IF NOT EXISTS "deniedBy" TEXT,
ADD COLUMN IF NOT EXISTS "deniedAt" TIMESTAMP;

-- Verify columns added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'GuestPass' 
  AND column_name IN ('deniedBy', 'deniedAt');
