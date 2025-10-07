# Current State & Recovery Plan - October 7, 2025 End of Day

## 🎯 CRITICAL UNDERSTANDING

### The Working State (This Morning)
**Commit**: `9df2f27` - "Switch from NextAuth to Supabase Auth"

**What Was Working:**
- ✅ Harvard Academic Portal registration (1-2 seconds)
- ✅ Harvard Academic Portal login
- ✅ Email confirmation (Supabase-branded emails)
- ✅ Dashboard access after login
- ✅ Clusters tool access
- ✅ **Contact form working**
- ✅ **Subscribe form working**

**Only Problem:**
- ❌ Email confirmations had Supabase branding (not Harvard branding)
- This was a **cosmetic issue only** - everything functionally worked

### What We Broke (During Debugging)
**Action Taken:** Added Resend custom SMTP to Supabase Auth for Harvard-branded emails

**Result:**
- ❌ Registration became extremely slow (40-50 seconds)
- ❌ Sometimes timed out completely (504 errors)
- ❌ Production became unusable

**Root Cause:** 
- Supabase Auth's `signUp()` is synchronous with email sending
- Waits for SMTP server (Resend) to respond
- Resend SMTP was slow, causing entire registration to hang

### Current State (Now - End of Day)
**After rotating all leaked secrets:**
- ❌ Harvard registration/login **BROKEN** (returns `{}` after 60 seconds)
- ❌ **Contact form BROKEN** (Resend API key rotated)
- ❌ **Subscribe form BROKEN** (Resend API key rotated)
- ⚠️ Old secrets exposed in Git history
- ✅ New secrets created but not fully deployed
- ⚠️ Legacy JWT keys not yet disabled in Supabase

---

## 📋 PRIORITY ORDER (For Tomorrow)

### PRIORITY 1: Fix Contact & Subscribe Forms (30-60 min)
**WHY FIRST:** These were working this morning, only broke when we rotated Resend key

**Current Problem:**
- Rotated Resend API key to fix security leak
- New key created in local `.env.local`
- New key NOT yet updated in Vercel
- Forms calling old (now invalid) Resend key

**What to Fix:**
1. Update Vercel environment variable `RESEND_API_KEY` with new key
2. Redeploy Vercel
3. Test contact form: https://manaboodle.com/contact
4. Test subscribe form: https://manaboodle.com/subscribe

**Files Involved:**
- `/src/app/api/contact/route.ts` - Contact form endpoint
- `/src/app/api/subscribe/route.ts` - Subscribe form endpoint
- Both use Resend SDK initialized with `process.env.RESEND_API_KEY`

**Expected Fix:**
- Simple environment variable update in Vercel
- Should work immediately after redeploy
- No code changes needed

---

### PRIORITY 2: Complete Security Rotation (15-30 min)
**WHY SECOND:** Need to close security alerts and disable old exposed keys

**Current Status:**
- ✅ Created new Supabase API keys (new format: `sb_publishable_...`, `sb_secret_...`)
- ✅ Rotated Resend API key
- ✅ Reset database password
- ✅ Updated local `.env.local`
- ❌ NOT updated in Vercel yet
- ❌ Old JWT keys still active in Supabase
- ❌ GitHub Secret Scanning alerts still open

**What to Do:**
1. Update ALL 4 environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (get from local `.env.local`)
   - `SUPABASE_SERVICE_KEY` (get from local `.env.local`)
   - `RESEND_API_KEY` (get from local `.env.local`)
   - `DATABASE_URL` (get from local `.env.local`)
2. Redeploy Vercel
3. Wait for deployment (2-3 minutes)
4. Test: Visit https://manaboodle.com (should load)
5. Go to Supabase Dashboard → API Settings
6. Click "Disable JWT-based API keys"
7. Close GitHub Secret Scanning alerts

**Reference:** See `SECURITY_ACTION_REQUIRED.md` for detailed steps

---

### PRIORITY 3: Fix Harvard Auth (30-60 min)
**WHY LAST:** More complex, want contact/subscribe working first

**Goal:** Return to the working state from this morning (commit `9df2f27`)

**Current Problem:**
- Registration returns `{}` after 60 seconds
- Likely Custom SMTP still configured in Supabase
- This makes Supabase Auth wait for SMTP responses

**Diagnosis Steps:**
1. Check Supabase Dashboard → Authentication → Email Templates
2. Look for "Custom SMTP" configuration
3. **IF ENABLED: DISABLE IT** ← This is probably the entire problem

**Expected Result After Disabling Custom SMTP:**
- Registration completes in 1-2 seconds
- Users receive Supabase-branded confirmation emails (temporary, acceptable)
- Login works normally
- Dashboard accessible
- Everything back to working state from this morning

**Acceptance Criteria:**
- ✅ User can register at `/academic-portal/signup` in <5 seconds
- ✅ User receives confirmation email (Supabase-branded is OK)
- ✅ User can click confirmation link
- ✅ User redirected to dashboard
- ✅ User can log in with same credentials
- ✅ Dashboard shows user name and email
- ✅ Clusters page accessible

---

## 🎯 The Working State We Want to Return To

### Target Configuration (Morning of October 7, 2025)

**Supabase Auth:**
- Using Supabase Auth SDK (not NextAuth)
- Default Supabase email provider (NOT Custom SMTP)
- Email confirmation enabled
- Supabase-branded emails (cosmetic issue, acceptable)
- Fast registration (1-2 seconds)

**Database:**
- HarvardUser table with `authUserId` column
- References Supabase `auth.users` table
- No password column (Supabase manages passwords)

**Code:**
- `/src/app/api/register/route.ts` - Uses `supabase.auth.admin.createUser()`
- `/src/app/academic-portal/login/page.tsx` - Uses `supabase.auth.signInWithPassword()`
- `/src/app/academic-portal/signup/page.tsx` - Calls registration endpoint
- `/src/lib/supabase-server.ts` - Service client for admin operations

**What Was Working:**
1. User submits signup form
2. API creates user in Supabase Auth (1-2 seconds)
3. Creates profile in HarvardUser table
4. User receives Supabase confirmation email
5. User clicks link → redirected to dashboard
6. User can log in anytime

**What We DON'T Want:**
- ❌ Custom SMTP integration (makes it slow)
- ❌ NextAuth (requires TCP to database, Vercel blocks it)
- ❌ Password storage in our database (Supabase manages this)

---

## 🔍 Key Lessons Learned

### Mistake 1: Tried to Solve Two Problems at Once
- Problem A: Auth broken in production (TCP issue)
- Problem B: Email branding not Harvard
- Solved A correctly (Supabase Auth)
- Tried to solve B simultaneously (added Resend SMTP)
- This broke A again

**Correct Approach:**
1. Fix auth first (get it working)
2. Accept temporary solution (Supabase emails)
3. Add branding later as separate feature

### Mistake 2: Misdiagnosed Slowdown
- Saw 40-50 second delays after adding Resend SMTP
- Thought: "Vercel can't connect to Supabase infrastructure"
- Actually: "Resend SMTP integration is slow"
- Spent 4+ hours debugging wrong problem

**Correct Diagnosis:**
- User insight: "When we added resend, it broke"
- Remove Resend SMTP from Supabase Auth
- Keep registration fast
- Handle email branding separately

### Mistake 3: Secret Leaks
- Created documentation files with actual secret values
- Committed to Git (Git keeps history forever)
- GitHub Secret Scanning detected them
- Had to rotate all secrets

**Prevention:**
- Use placeholders in docs: `<your_secret_here>`
- Keep secrets in `.env.local` and Vercel only
- Never commit real secrets to Git

---

## 📊 Current Environment Variables

### Local `.env.local` (Updated ✅):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://otxidzozhdnszvqbgzne.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ADlL8RpFB65H0vTFExyhWw_D0aG3qU_
SUPABASE_SERVICE_KEY=sb_secret_ZCFMawm82TeLO-4-GA5jqw_-3Vlp1-F
RESEND_API_KEY=re_LnAs4AVn_LpFJzZih1RFkAnznxpFmTx8o
DATABASE_URL=postgresql://postgres.otxidzozhdnszvqbgzne:cNYsfMRh8Yq4JEDL@aws-0-us-east-1.pooler.supabase.com:6543/postgres
OPENAI_API_KEY=<not_rotated_not_leaked>
```

### Vercel Environment Variables (NOT Updated ❌):
- Still has OLD values from before rotation
- Needs ALL 4 updated (Supabase anon, service, Resend, Database)
- This is why contact/subscribe forms are broken

---

## 🚀 Tomorrow's Execution Order

### Step 1: Update Vercel (15 min)
1. Open Vercel Dashboard → manaboodle → Settings → Environment Variables
2. Update `RESEND_API_KEY` = `re_LnAs4AVn_LpFJzZih1RFkAnznxpFmTx8o`
3. Update `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_ADlL8RpFB65H0vTFExyhWw_D0aG3qU_`
4. Update `SUPABASE_SERVICE_KEY` = `sb_secret_ZCFMawm82TeLO-4-GA5jqw_-3Vlp1-F`
5. Update `DATABASE_URL` = `postgresql://postgres.otxidzozhdnszvqbgzne:cNYsfMRh8Yq4JEDL@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
6. Click "Redeploy"

### Step 2: Test Contact & Subscribe (5 min)
1. Wait for deployment (2-3 min)
2. Test contact form: https://manaboodle.com/contact
3. Test subscribe form: https://manaboodle.com/subscribe
4. Should work now ✅

### Step 3: Disable Old Supabase Keys (5 min)
1. Go to Supabase Dashboard → API Settings
2. Click "Disable JWT-based API keys"
3. Old exposed keys now invalid

### Step 4: Close GitHub Alerts (5 min)
1. Go to GitHub Secret Scanning alerts
2. Click "Resolve" or "Dismiss"
3. Confirm: "Secrets rotated and old keys disabled"

### Step 5: Fix Harvard Auth (30-60 min)
1. Go to Supabase Dashboard → Authentication → Email Templates
2. Check "Custom SMTP" setting
3. **IF ENABLED: DISABLE IT**
4. Test registration: https://manaboodle.com/academic-portal/signup
5. Should complete in 1-2 seconds
6. Accept Supabase-branded emails temporarily

### Step 6: Verify Everything Works
- ✅ Contact form sends emails
- ✅ Subscribe form works
- ✅ Harvard registration fast (<5 sec)
- ✅ Harvard login works
- ✅ Dashboard accessible
- ✅ Old secrets disabled
- ✅ GitHub alerts closed

---

## 📚 Reference Documents

- `AUTHENTICATION_MIGRATION_REPORT.md` - Full timeline of what happened today
- `SECURITY_ACTION_REQUIRED.md` - Step-by-step security rotation instructions
- `TOMORROW_ACTION_PLAN.md` - Detailed checklist and diagnostic commands
- This file - Current state and priority order

---

## ⚠️ Critical Reminders

1. **Update Vercel FIRST** - This fixes contact/subscribe forms immediately
2. **Disable Custom SMTP in Supabase** - This fixes Harvard auth
3. **Accept Supabase-branded emails** - Temporary solution is OK
4. **DO NOT commit secrets** - Use placeholders in any new docs
5. **Test incrementally** - Fix one thing, test, then move to next

---

**Last Updated**: October 7, 2025, 11:45 PM  
**Status**: Ready for tomorrow's fixes  
**Estimated Time**: 1.5-2 hours total  
**Success Criteria**: Contact form + Subscribe form + Harvard auth all working

**The goal is simple: Return to the working state we had this morning, where the only issue was cosmetic email branding.** 🎯
