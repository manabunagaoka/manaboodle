-- Create EmailVerificationToken table for email verification
CREATE TABLE IF NOT EXISTS "EmailVerificationToken" (
  "id" TEXT PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL,
  "token" TEXT UNIQUE NOT NULL,
  "expires" TIMESTAMP NOT NULL,
  "used" BOOLEAN DEFAULT false,
  "usedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS "EmailVerificationToken_email_idx" ON "EmailVerificationToken"("email");
CREATE INDEX IF NOT EXISTS "EmailVerificationToken_token_idx" ON "EmailVerificationToken"("token");

-- Verify table created
SELECT * FROM "EmailVerificationToken" LIMIT 1;
