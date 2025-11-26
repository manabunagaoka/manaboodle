# Session Notes - November 26, 2024

## Overview
Major improvements to the Academic Portal authentication and user management system, focusing on email verification, username handling, and UI refinements.

## Issues Identified & Fixed

### 1. Email Verification System - Infinite Loop Issue
**Problem**: Users stuck in "Invalid verification link" loop when trying to verify email after registration.

**Root Cause**: The `EmailVerificationToken` table requires an `id` field (defined in Prisma schema with `@id @default(cuid())`), but the registration code wasn't providing one when inserting token records. This caused silent insert failures, making all verification links invalid.

**Solution**: 
- Added `id: randomUUID()` to the EmailVerificationToken insert in `/src/app/api/register/route.ts`
- File: `src/app/api/register/route.ts` (line ~238)

```typescript
await supabase.from('EmailVerificationToken').insert({
  id: randomUUID(),  // ← Added this
  email: email.toLowerCase(),
  token: verificationToken,
  expires: verificationExpires.toISOString(),
})
```

### 2. Multiple Verification Emails Being Sent
**Problem**: System kept sending multiple verification emails to the same user.

**Root Cause**: No check for existing users before creating new accounts, allowing duplicate registration attempts.

**Solution**:
- Added email existence check in registration endpoint before creating new accounts
- File: `src/app/api/register/route.ts` (lines ~67-82)

```typescript
// Check if user already exists with this email
const { data: existingUser } = await supabase
  .from('ManaboodleUser')
  .select('email, emailVerified')
  .eq('email', email.toLowerCase())
  .single()

if (existingUser) {
  if (existingUser.emailVerified) {
    return NextResponse.json(
      { error: 'An account with this email already exists. Please login instead.' },
      { status: 400 }
    )
  } else {
    return NextResponse.json(
      { error: 'An account with this email already exists but is not verified. Please check your email for the verification link.' },
      { status: 400 }
    )
  }
}
```

### 3. .edu Email Validation Blocking Non-.edu Users
**Problem**: Login and forgot-password pages had hardcoded validation requiring .edu email addresses, blocking sesame.org and other authorized users.

**Root Cause**: Legacy validation from when portal was Harvard-only (.edu emails).

**Solution**:
- Removed `.edu` validation from login page
- Removed `.edu` validation from forgot-password page
- Files modified:
  - `src/app/academic-portal/login/page.tsx` (removed lines 140-145)
  - `src/app/academic-portal/forgot-password/page.tsx` (removed lines 19-23)

### 4. Username Case Not Preserved
**Problem**: Usernames entered as "ManabuSesame" were being stored as "manabusesame" (all lowercase).

**Root Cause**: Code was calling `username.toLowerCase()` before storing in database.

**Solution**:
- Removed `.toLowerCase()` from username storage in both auto-approved and guest user creation paths
- Changed uniqueness check from `.eq('username', username.toLowerCase())` to `.ilike('username', username)` for case-insensitive comparison
- Files modified:
  - `src/app/api/register/route.ts` (lines ~232, ~155)
  - `src/app/api/check-username/route.ts` (line ~31)

**Result**: Usernames now stored exactly as typed, but duplicates are still prevented case-insensitively (ManabuSesame and manabusesame can't both exist).

### 5. Email Displayed in Portal Dashboard
**Problem**: Dashboard showed both email and username, user wanted only username.

**Solution**:
- Modified dashboard to fetch username from ManaboodleUser table
- Updated display to show only username
- File: `src/app/academic-portal/dashboard/page.tsx`

```typescript
// Added state
const [username, setUsername] = useState<string>('')

// Added fetch in checkUser()
const { data: userData, error: userError } = await supabase
  .from('ManaboodleUser')
  .select('username')
  .eq('email', user.email)
  .single()

if (userData?.username) {
  setUsername(userData.username)
}

// Updated display
<span className={styles.welcome}>
  Welcome, {username || '...'}
</span>
```

## Files Modified

### Core Registration & Authentication
1. **src/app/api/register/route.ts**
   - Added `id` field to EmailVerificationToken inserts
   - Added duplicate email registration check
   - Removed `username.toLowerCase()` to preserve case
   - Changed username uniqueness check to case-insensitive `.ilike()`

2. **src/app/api/check-username/route.ts**
   - Changed from `.eq('username', username.toLowerCase())` to `.ilike('username', username)`
   - Removed lowercase transformation in response

3. **src/app/academic-portal/login/page.tsx**
   - Removed `.edu` email validation (lines 140-145)
   - Changed label from ".edu email" to "Email Address"

4. **src/app/academic-portal/forgot-password/page.tsx**
   - Removed `.edu` email validation (lines 19-23)

5. **src/app/academic-portal/dashboard/page.tsx**
   - Added username state and fetch from ManaboodleUser table
   - Simplified display to show only username
   - Added debug logging for username fetch

## Database Schema
No schema changes were needed - all fixes were code-level changes to properly use existing schema.

**EmailVerificationToken Table Structure** (already existed):
```sql
CREATE TABLE "EmailVerificationToken" (
  "id" TEXT PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL,
  "token" TEXT UNIQUE NOT NULL,
  "expires" TIMESTAMP NOT NULL,
  "used" BOOLEAN DEFAULT false,
  "usedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW()
);
```

## Git Commits Made

1. `Fix EmailVerificationToken insert - add missing id field` (e62ca3f)
2. `Remove .edu email validation from login page` (60d0307)
3. `Show username instead of email in portal dashboard` (6947a11)
4. `Prevent duplicate registrations and multiple verification emails` (b346911)
5. `Preserve username case (ManabuSesame not manabusesame) while checking uniqueness case-insensitively` (2b912ad)
6. `Simplify dashboard username display and add debug logging` (c7958f4)

## System Status

### ✅ Working Features
- Email verification with Resend (registration@manaboodle.com)
- 24-hour token expiration with one-time use enforcement
- Username display in dashboard (case-preserved)
- Prevention of duplicate registrations
- Case-insensitive username uniqueness checking
- Login works for both harvard.edu and sesame.org emails
- Password reset works for non-.edu emails

### 🔄 Hybrid Access Control System
- **Auto-approved**: harvard.edu, sesame.org
- **Requires approval**: All other domains (guest pass workflow)
- Guest pass admin dashboard not yet built

### 📋 Known Technical Details
- ManaboodleUser table stores: username (case-preserved), email (lowercase), accessType, emailVerified, institution, affiliation
- EmailVerificationToken requires explicit `id` field on insert (UUID)
- Supabase auth.users is separate from ManaboodleUser table
- Both tables must be updated during email verification

## Next Steps (Not Yet Implemented)

1. **Admin Dashboard for Guest Pass Approvals**
   - Create `/academic-portal/admin/dashboard` page
   - Display pending GuestPass requests
   - Add approve/deny buttons with API endpoints
   - Send notification emails on approval/denial

2. **Profile/Account Page**
   - Display username, email, institution, affiliation
   - Allow users to update their information
   - Show account creation date and verification status

3. **Testing with Multiple Email Domains**
   - Test with various harvard.edu subdomains
   - Test guest pass request workflow
   - Verify email verification works across all domains

## Testing Completed Today
- ✅ Registration with sesame.org email
- ✅ Email verification link receipt and validation
- ✅ Login with verified sesame.org email
- ✅ Username case preservation (ManabuSesame)
- ✅ Dashboard displaying only username
- ✅ Prevention of duplicate registration attempts

## Notes
- Database migration files preserved in `/prisma/migrations/`
- Email verification uses Resend API with manaboodle.com domain
- All authentication uses Supabase Auth + custom ManaboodleUser table
- Username format: 3-20 characters, alphanumeric and underscores only
