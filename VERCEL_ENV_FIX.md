# 🚨 URGENT: Missing Environment Variable in Vercel

## Problem
Registration is failing with "Internal server error" because the `SUPABASE_SERVICE_KEY` environment variable is not configured in Vercel.

## Solution: Add SUPABASE_SERVICE_KEY to Vercel

### Step 1: Get Your Service Role Key

Your service role key (from `.env.local`):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90eGlkem96aGRuc3p2cWJnem5lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTc5Njc4OCwiZXhwIjoyMDY3MzcyNzg4fQ.r0fVBVfE5JT_HxyuGKCNAi6V_IIqd4hraLZrHeVBD_k
```

**Alternatively**, get it from Supabase Dashboard:
1. Go to https://supabase.com/dashboard/project/otxidzozhdnszvqbgzne
2. Click **Settings** → **API**
3. Scroll to **Project API keys**
4. Copy the **`service_role` key** (NOT the anon key)

### Step 2: Add to Vercel

1. Go to https://vercel.com/manabunagaoka/manaboodle
2. Click **Settings** → **Environment Variables**
3. Click **Add New**
4. Enter:
   - **Key:** `SUPABASE_SERVICE_KEY`
   - **Value:** [paste the service role key from above]
   - **Environments:** Check all three: ✅ Production ✅ Preview ✅ Development
5. Click **Save**

### Step 3: Redeploy

After adding the environment variable, you need to trigger a new deployment:

**Option A: Redeploy from Vercel Dashboard**
1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**

**Option B: Trigger from Command Line**
```bash
# Make a small change and push
git commit --allow-empty -m "Trigger redeployment with SUPABASE_SERVICE_KEY"
git push origin main
```

---

## Why This Happened

The registration API was changed to use `createServiceClient()` which requires the `SUPABASE_SERVICE_KEY` environment variable. This key gives admin privileges to bypass Row Level Security (RLS) policies.

Without this key:
- ❌ `createServiceClient()` throws an error
- ❌ Registration fails with "Internal server error"
- ❌ Users cannot be created

With this key:
- ✅ Service client has admin privileges
- ✅ Can insert into HarvardUser table
- ✅ Registration works properly

---

## Verification

After redeployment, test registration:
1. Go to https://manaboodle.com/academic-portal/signup
2. Fill out the form with:
   - `.edu` email
   - Valid password (8+ characters)
   - Name
   - Class code (T565/T566/T595)
   - Affiliation
3. Click "Sign Up"
4. **Expected:** Success message with email confirmation instructions
5. **Not:** "Internal server error"

---

## Current Environment Variables in Vercel

Make sure you have ALL of these:

✅ `NEXT_PUBLIC_SUPABASE_URL`
✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
❌ `SUPABASE_SERVICE_KEY` ← **MISSING - ADD THIS!**
✅ `RESEND_API_KEY`
✅ `OPENAI_API_KEY`
⚠️ `NEXTAUTH_URL` (can remove - no longer needed)
⚠️ `NEXTAUTH_SECRET` (can remove - no longer needed)

---

## Security Note

⚠️ **IMPORTANT:** The service role key is EXTREMELY powerful:
- Bypasses ALL Row Level Security policies
- Has full database access
- Should ONLY be used in server-side code
- NEVER expose in client-side code
- Keep it secret like a database password

Good practice:
- ✅ Use in API routes (server-side)
- ✅ Use for admin operations
- ❌ Never use in client components
- ❌ Never commit to GitHub
- ❌ Never expose in browser

Our code is safe because:
- ✅ Only used in `/api/register/route.ts` (server-side)
- ✅ Not included in client bundle
- ✅ Protected by Vercel environment variables

---

## Quick Command

If you want me to trigger the redeployment after you add the env var:

```bash
git commit --allow-empty -m "Redeploy with SUPABASE_SERVICE_KEY"
git push origin main
```

Just let me know when you've added the environment variable in Vercel! 🚀
