# Authentication Migration Report - October 7, 2025

## Executive Summary

Started with a simple visual theme change (Harvard crimson), discovered authentication completely broken in production, attempted full migration from NextAuth to Supabase Auth, introduced performance issues, and spent hours debugging. Currently stuck in partially working state. Need fresh approach tomorrow.

---

## Timeline of Events

### ✅ WORKING STATE (Start of Day)
- **Time**: Morning, October 7, 2025
- **Status**: Authentication was functional
- **Issue**: Only cosmetic - email confirmations had Supabase branding instead of Harvard branding
- **Performance**: Registration took 1-2 seconds ✅
- **Git Commit**: `9df2f27` - "Switch from NextAuth to Supabase Auth"

### 🎨 Initial Request (Completed Successfully)
- **Task**: Change blue theme to Harvard wine red (#A51C30)
- **Status**: ✅ COMPLETED
- **Files Modified**: Multiple CSS files across academic portal
- **Result**: Harvard crimson theme successfully applied

### ❌ Discovery: Production Authentication Broken
- **Issue**: Users couldn't log in or register in production (Vercel)
- **Root Cause**: Vercel serverless functions cannot establish TCP connections to PostgreSQL (port 5432 blocked)
- **Previous Architecture**: NextAuth + Prisma + Direct PostgreSQL connection

---

## Migration Attempt #1: Supabase Auth

### Strategy
Migrate from NextAuth (requires TCP) to Supabase Auth (uses HTTPS REST API)

### Implementation (7 Files Changed)
1. **`/src/app/api/register/route.ts`** - Registration endpoint
   - Replaced Prisma + bcrypt with `supabase.auth.signUp()`
   - Created user in `auth.users` table (Supabase managed)
   - Stored Harvard profile in `HarvardUser` table with `authUserId` reference

2. **`/src/app/academic-portal/login/page.tsx`** - Login UI
   - Replaced NextAuth with `supabase.auth.signInWithPassword()`

3. **`/src/app/academic-portal/signup/page.tsx`** - Signup UI
   - Calls `/api/register` endpoint

4. **`/src/app/api/auth/callback/route.ts`** - Email confirmation handler
   - Exchanges Supabase verification code for session
   - Sets cookies, redirects to dashboard

5. **`/src/app/academic-portal/dashboard/page.tsx`** - Protected route
   - Uses `supabase.auth.getUser()` instead of NextAuth session

6. **`/src/lib/supabase-server.ts`** - Server-side clients
   - `createClient()` - Regular user client
   - `createServiceClient()` - Admin client with service role key

7. **Database Schema Updates**
   ```prisma
   model HarvardUser {
     id               String   @id @default(uuid())
     authUserId       String   @unique // References Supabase auth.users.id
     email            String   @unique
     name             String
     classCode        String?
     affiliation      String
     createdAt        DateTime @default(now())
     updatedAt        DateTime @updatedAt
     // NO password field - Supabase auth.users manages this
   }
   ```

### Initial Result
- ✅ Migration completed successfully
- ✅ Registration worked (1-2 seconds)
- ❌ **Only problem**: Emails had Supabase branding (not Harvard)

---

## The Fatal Mistake: Adding Resend SMTP

### Decision
"Let's add custom Harvard-branded emails via Resend SMTP"

### Configuration Added
- Integrated Resend API key into Supabase Auth settings
- Configured custom SMTP in Supabase Dashboard → Authentication → Email Templates
- Expected: Harvard-branded emails would send quickly

### Actual Result
- ⏱️ Registration started taking **40-50 seconds**
- 🐌 Sometimes timed out completely (504 Gateway Timeout)
- ❌ Production became unusable

### Root Cause (Identified Late)
Supabase Auth's `signUp()` function is **synchronous with email sending**:
1. Validates credentials
2. Creates user in database
3. **WAITS** for SMTP server (Resend) to respond
4. Only then returns response

When Resend SMTP was slow or had connectivity issues, the entire registration API call would hang for 40-50 seconds or timeout.

---

## Misdiagnosis & Debugging Hell (4+ Hours)

### Incorrect Hypothesis
"Vercel can't reliably connect to Supabase infrastructure"

### Attempted Fixes (All Failed)
1. **Increased SDK timeouts** - Still 504 errors
2. **Direct HTTP calls with fetch()** - Bypassed SDK, still slow
3. **Removed email confirmation** - Still 40-50 seconds
4. **Tested connection pooler** - Also unreachable from Vercel
5. **Reverted to NextAuth** - Introduced new problems (can't reach pooler either)
6. **Created diagnostic endpoints** - Confirmed connectivity but not cause

### Evidence Collected
- ✅ Supabase Auth API reachable via `curl` (external test)
- ✅ Database structure correct (`authUserId` present, no `password` field)
- ❌ Vercel logs showed 50+ second delays on `supabase.auth.signUp()`
- ❌ Both TCP pooler (6543) AND direct connection (5432) blocked from Vercel

### The Breakthrough
User insight: **"Before we do anything drastic, can we go back to where we started today when it was working? Only issue then was email confirmation. It has nothing to do with vercel - supabase. When we added resend, it broke."**

### Correct Diagnosis (Finally)
- ✅ Original Supabase Auth was FAST (1-2 seconds)
- ✅ Vercel → Supabase connectivity was FINE
- ❌ **Resend SMTP integration was the bottleneck**
- ❌ Spent 4+ hours debugging wrong problem

---

## Current State (End of Day, October 7, 2025)

### Git History
- **Working commit**: `9df2f27` (Supabase Auth without Resend)
- **Current HEAD**: `be30c70` (Latest fix attempt)
- **Wasted commits**: ~25 commits of failed debugging attempts

### Code State
- ✅ All Supabase Auth migration code present
- ✅ Database schema correct
- ✅ Harvard crimson theme applied
- ❌ Registration still returning empty `{}` after 60 seconds

### Latest Fix Attempts (Today)

#### Attempt 1: Revert to Working Commit
```bash
git reset --hard 9df2f27
git push -f origin main
```
**Result**: User still saw "Internal server error"

#### Attempt 2: Force Fresh Deployment
```bash
git commit --allow-empty -m "Trigger Vercel redeploy"
git push origin main
```
**Result**: Still errors

#### Attempt 3: Fix Build Error
**Problem**: `/src/app/api/reset-password/route.ts` tried to update non-existent `password` field
**Fix**: Replaced with Supabase Auth password reset
**Commit**: `82e59da`
**Result**: Build succeeded, but registration still broken

#### Attempt 4: Use Admin API
**Changes**:
- Switched from `supabase.auth.signUp()` to `supabase.auth.admin.createUser()`
- Set `email_confirm: true` (auto-confirm, skip emails entirely)
- Use Prisma for `HarvardUser` table
**Commit**: `be30c70`
**Result**: Still returning `{}` after 60 seconds

---

## Technical Debt Created

### Security Issues (Resolved)
- ❌ 4 secrets exposed in GitHub (Supabase service key, Resend API key, DB password, OpenAI key)
- ✅ All credentials rotated
- ✅ Documentation files with secrets removed
- ✅ GitHub Secret Scanning alerts closed

### Code Quality Issues
- Multiple unused API endpoints created for testing
- Inconsistent error handling
- Mixed use of Supabase SDK vs direct HTTP calls
- Console logs everywhere (need cleanup)

### Database Issues
- `HarvardUser` table structure changed multiple times
- RLS policies may be misconfigured
- No migration scripts tracked

---

## Why Registration Still Broken

### Hypothesis 1: Supabase Custom SMTP Still Enabled
**Most Likely Cause**: The Resend SMTP configuration is still active in Supabase Dashboard, causing the admin API to also hang waiting for email.

**Need to Check**:
1. Supabase Dashboard → Authentication → Email Templates
2. Look for "Custom SMTP" configuration
3. **DISABLE** Resend SMTP entirely
4. Revert to Supabase's default email provider

### Hypothesis 2: Environment Variables Not Updated in Vercel
**Possible Issue**: Vercel may have cached old environment variables

**Need to Verify**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Database connection string

### Hypothesis 3: RLS Policies Blocking Service Role
**Possible Issue**: Row Level Security policies may be blocking even the service role client

**Need to Check**:
1. Supabase Dashboard → Authentication → Policies
2. Verify service role can bypass RLS
3. Check `HarvardUser` table policies

### Hypothesis 4: Vercel Function Timeout
**Possible Issue**: Vercel free tier has 10-second function timeout

**Need to Verify**:
- Check Vercel project settings
- May need to upgrade plan for longer timeouts

---

## What We Should Have Done (Lessons Learned)

### ✅ Correct Approach
1. ✅ Migrate to Supabase Auth (done correctly)
2. ✅ Accept Supabase default emails temporarily (fast, reliable)
3. ✅ Get authentication working 100% (primary goal)
4. ❌ **THEN** customize emails as separate feature (secondary goal)

### ❌ What We Did Wrong
1. ❌ Tried to solve TWO problems simultaneously (auth + branding)
2. ❌ Integrated Resend SMTP directly into auth flow (coupling)
3. ❌ Misdiagnosed slowdown as infrastructure problem
4. ❌ Spent hours debugging wrong hypothesis
5. ❌ Created technical debt with multiple failed attempts

### 💡 Correct Email Solution (For Tomorrow)
**Option 1: Supabase Email Templates (No SMTP)**
- Use Supabase's default email provider (fast, reliable)
- Customize HTML templates with Harvard branding
- Limitation: Still says "from Supabase" in some places
- **Pros**: Fast, no external dependencies
- **Cons**: Limited branding customization

**Option 2: Post-Registration Email (Decoupled)**
- Let Supabase send fast default confirmation email
- After user confirms, trigger separate welcome email via Resend
- Implementation: Add to `/api/auth/callback` route
- **Pros**: Fast registration, full branding control
- **Cons**: Two emails (confirmation + welcome)

**Option 3: Webhook-Based Email (Recommended)**
- Set up Supabase webhook for `auth.user.created` event
- Webhook calls separate API endpoint to send email via Resend
- Decouples email sending from registration flow
- **Pros**: Fast registration, async email, full control
- **Cons**: More complex setup

---

## Action Plan for Tomorrow

### Step 1: Verify Supabase Configuration (30 minutes)
1. Log into Supabase Dashboard
2. Navigate to: Authentication → Email Templates
3. **CRITICAL**: Check if Custom SMTP is enabled
4. If Resend SMTP is configured, **DISABLE IT**
5. Verify default Supabase email provider is active
6. Test registration after this change

### Step 2: Verify Vercel Environment (15 minutes)
1. Log into Vercel Dashboard
2. Check environment variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
3. Redeploy if variables were updated

### Step 3: Check Vercel Logs (15 minutes)
1. Vercel Dashboard → Deployments → Latest → Functions
2. Look for console logs from registration attempt
3. Check what line the code is hanging on
4. Look for timeout errors

### Step 4: Test Database Connectivity (15 minutes)
Create diagnostic endpoint:
```typescript
// /src/app/api/test-connection/route.ts
export async function GET() {
  const supabase = createServiceClient()
  
  // Test 1: Can we reach Supabase?
  const { data: authTest, error: authError } = await supabase.auth.admin.listUsers()
  
  // Test 2: Can we write to database?
  const { data: dbTest, error: dbError } = await prisma.harvardUser.findFirst()
  
  return NextResponse.json({
    authTest: { success: !authError, error: authError?.message },
    dbTest: { success: !dbError, error: dbError?.message }
  })
}
```

### Step 5: Simplify Registration (30 minutes)
Strip down to absolute minimum:
```typescript
// Simplest possible registration
export async function POST(request: NextRequest) {
  const { email, password, name } = await request.json()
  
  const supabase = createServiceClient()
  
  // Just create user, nothing else
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })
  
  console.log('User created:', data?.user?.id)
  
  return NextResponse.json({ 
    success: !error, 
    userId: data?.user?.id,
    error: error?.message 
  })
}
```

Test this first. If it works in <3 seconds, then issue is in profile creation logic.

### Step 6: If Still Broken - Nuclear Option (1 hour)
1. Create brand new Supabase project
2. Copy just the auth configuration
3. Update environment variables
4. Test registration
5. If this works, something is corrupted in current Supabase project

---

## Key Files Reference

### Environment Variables Needed
```env
# Supabase (Public)
NEXT_PUBLIC_SUPABASE_URL=https://otxidzozhdnszvqbgzne.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<see_vercel_dashboard_or_supabase_settings>

# Supabase (Private - Server Only)
SUPABASE_SERVICE_ROLE_KEY=<see_vercel_dashboard_or_supabase_settings>

# Database
DATABASE_URL=<see_vercel_dashboard_or_supabase_settings>

# Resend (NOT USED - DISABLED)
RESEND_API_KEY=<see_resend_dashboard>
```

### Critical Code Files
1. **`/src/app/api/register/route.ts`** - Registration logic (currently broken)
2. **`/src/lib/supabase-server.ts`** - Server-side Supabase clients
3. **`/src/lib/supabase-client.ts`** - Client-side Supabase instance
4. **`/prisma/schema.prisma`** - Database schema (has authUserId field)

### Database Schema (Supabase SQL Editor)
```sql
-- Verify HarvardUser table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'HarvardUser';

-- Expected columns:
-- id (text), authUserId (text), email (text), name (text), 
-- classCode (text), affiliation (text), createdAt (timestamp), updatedAt (timestamp)
```

### Supabase Configuration
- **Project**: otxidzozhdnszvqbgzne
- **Region**: US East
- **Database Password**: <rotated - see Supabase dashboard>
- **Site URL**: https://manaboodle.com
- **Redirect URLs**: Configured for /api/auth/callback

---

## Questions to Answer Tomorrow

1. **Is Custom SMTP still enabled in Supabase?** (Most likely culprit)
2. **What do Vercel function logs show?** (Where is code hanging?)
3. **Can we create users directly in Supabase Dashboard?** (Test auth system)
4. **Do RLS policies block service role?** (Permission issue?)
5. **Is there a Vercel function timeout?** (Infrastructure limit?)

---

## Success Criteria for Tomorrow

### Minimum Viable Product
- ✅ User can register with .edu email
- ✅ Registration completes in <5 seconds
- ✅ User can log in immediately after registration
- ✅ Dashboard shows user name and email
- ⚠️ Accept Supabase-branded emails temporarily

### Nice to Have (Separate Task)
- Custom Harvard-branded emails
- Email templates with Harvard logo
- Welcome emails after registration

### Do NOT
- ❌ Try to implement custom emails until basic auth works
- ❌ Spend more than 2 hours debugging before asking for help
- ❌ Make changes without testing each step
- ❌ Couple email sending with auth flow

---

## Summary

We started with working authentication (just ugly emails) and broke it by integrating Resend SMTP directly into the auth flow. Spent 4+ hours debugging the wrong problem (infrastructure connectivity) when the real issue was SMTP integration causing delays. 

**Current Status**: Stuck with registration timing out after 60 seconds, returning empty `{}`.

**Most Likely Fix**: Disable Custom SMTP in Supabase Dashboard.

**Tomorrow's Priority**: Get basic auth working with default emails first, then customize emails as separate feature.

**Key Learning**: Don't solve two problems at once. Get core functionality working, then add enhancements incrementally.

---

## Commit History (Relevant)

- `9df2f27` - ✅ Working Supabase Auth (before Resend)
- `54882f8` - Empty commit to force redeploy
- `82e59da` - Fix reset-password build error
- `be30c70` - ⏳ Current HEAD (admin API with auto-confirm)

---

## Contact Information

- **Supabase Project**: https://supabase.com/dashboard/project/otxidzozhdnszvqbgzne
- **Vercel Project**: https://vercel.com/manabunagaokas-projects/manaboodle
- **GitHub Repo**: https://github.com/manabunagaoka/manaboodle
- **Production URL**: https://manaboodle.com

---

**Report Generated**: October 7, 2025, End of Day  
**Status**: 🔴 Authentication Broken - Registration Timing Out  
**Next Session**: Start fresh debugging with systematic approach  
**Priority**: Disable Custom SMTP in Supabase Dashboard first thing
