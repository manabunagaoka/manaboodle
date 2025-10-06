# Harvard Academic Portal - Authentication Troubleshooting Action Plan
**Date Created:** October 6, 2025  
**Status:** Database connection failing between Vercel and Supabase

---

## 🔴 CURRENT ISSUE
- ✅ Vercel deployment successful (build completes)
- ✅ All environment variables set correctly (NEXTAUTH_URL, NEXTAUTH_SECRET, DATABASE_URL)
- ✅ Database tables created manually in Supabase
- ❌ **Vercel cannot connect to Supabase database at runtime**
- ❌ Login/Registration failing with "Internal server error"

**Root Cause:** Network connectivity issue between Vercel serverless functions and Supabase PostgreSQL database.

---

## 🎯 ACTION PLAN FOR TOMORROW

### Option 1: Fix Supabase Connection (PREFERRED - 30 min)

#### Step 1.1: Enable IPv6 on Supabase
**Why:** Vercel functions may require IPv6, Supabase may have it disabled.

1. Go to **Supabase Dashboard** → Your Project → **Settings** → **Database**
2. Look for **Network Settings** or **IPv6 Configuration**
3. Enable IPv6 if available
4. Redeploy Vercel and test

#### Step 1.2: Check Connection Pooling Mode
**Why:** Supabase pooler has different modes - we need Session Mode for Prisma.

1. Go to **Supabase Dashboard** → **Database** → **Connection Pooling**
2. Check current mode (Transaction vs Session)
3. If using Transaction mode, switch to **Session mode**
4. Update Vercel DATABASE_URL to use session mode pooler:
   ```
   postgresql://postgres.otxidzozhdnszvqbgzne:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```
   (Note: Port 5432 for session mode, not 6543)
5. Redeploy and test

#### Step 1.3: Add Vercel IP Ranges to Supabase Allowlist
**Why:** Supabase may be blocking Vercel's IPs.

1. Get Vercel IP ranges: https://vercel.com/docs/security/attack-protection/ip-ranges
2. In Supabase: **Settings** → **Database** → **Connection Pooling** → **Add IP Addresses**
3. Add all Vercel IP ranges for your deployment region (us-east-1)
4. Redeploy and test

#### Step 1.4: Try Supabase Connection String from Dashboard
**Why:** The connection string format might be wrong.

1. Go to **Supabase Dashboard** → **Project Settings** → **Database**
2. Copy the **Connection string** under "Connection string" (not pooler)
3. Replace `[YOUR-PASSWORD]` with your actual password: `9I1aLwKJiJYbMOLa`
4. Update Vercel DATABASE_URL with this exact string
5. Redeploy and test

---

### Option 2: Use Supabase Auth Instead of NextAuth (RECOMMENDED - 1 hour)

**Why:** Supabase has built-in authentication that works perfectly with their database.

#### Benefits:
- ✅ No direct database connection needed from Vercel
- ✅ Uses Supabase's Auth API (REST-based, always works)
- ✅ Built-in email verification, password reset
- ✅ Better security (tokens, sessions managed by Supabase)

#### Implementation:
1. **Install Supabase Auth SDK:**
   ```bash
   npm install @supabase/auth-helpers-nextjs @supabase/supabase-js
   ```

2. **Keep existing database tables** (HarvardUser, etc.) as-is

3. **Modify signup to use Supabase Auth + Custom tables:**
   - Register user with Supabase Auth
   - Store additional Harvard data (classCode, affiliation) in HarvardUser table
   - Use Supabase service role key for server-side operations

4. **Files to update:**
   - `/src/app/api/register/route.ts` - Use Supabase Auth signup
   - `/src/app/api/auth/[...nextauth]/route.ts` - Replace with Supabase Auth
   - `/src/app/academic-portal/login/page.tsx` - Use Supabase signIn
   - `/src/app/academic-portal/signup/page.tsx` - Use Supabase signUp

5. **Reference:**
   - Supabase Auth with Next.js: https://supabase.com/docs/guides/auth/server-side/nextjs
   - Example: https://github.com/supabase/auth-helpers/tree/main/examples/nextjs

---

### Option 3: Switch to Vercel Postgres (FASTEST - 20 min)

**Why:** Guaranteed to work since it's Vercel's own database service.

#### Steps:
1. Go to **Vercel Dashboard** → Your Project → **Storage** → **Create Database**
2. Select **Postgres**
3. Vercel will automatically add `POSTGRES_URL` environment variable
4. Update `.env` and Prisma schema to use `POSTGRES_URL`
5. Run migration script in Vercel Postgres query editor (same SQL we created)
6. Redeploy

#### Cost:
- Free tier: 256 MB storage, 60 hours compute/month
- Should be sufficient for Harvard pilot program

---

### Option 4: Use Neon Database (ALTERNATIVE - 20 min)

**Why:** Neon is serverless Postgres designed for Vercel, has excellent compatibility.

#### Steps:
1. Sign up at https://neon.tech (free tier available)
2. Create new project
3. Copy connection string (will look like: `postgresql://user:pass@ep-xyz.us-east-2.aws.neon.tech/db`)
4. Update Vercel DATABASE_URL with Neon connection string
5. Run migration SQL in Neon SQL Editor
6. Redeploy

---

## 🔍 DEBUGGING STEPS IF STILL NOT WORKING

### Check 1: Verify Environment Variables Are Applied
1. Visit: `https://manaboodle.com/api/diagnostics`
2. Check response shows:
   - `DATABASE_URL.exists: true`
   - `NEXTAUTH_URL.exists: true`
   - `NEXTAUTH_SECRET.exists: true`
   - `database.connected: true` ← This is the key

### Check 2: View Actual Error Logs
1. Go to **Vercel Dashboard** → **Deployments** → Latest deployment
2. Click **Functions** tab
3. Find `/api/register` or `/api/auth/[...nextauth]`
4. Click to see runtime logs
5. Look for the actual error message (not just "Internal server error")

### Check 3: Test Database Connection Locally
If you have a way to run locally outside Codespaces:
```bash
# Install dependencies
npm install

# Set DATABASE_URL to Supabase direct connection
export DATABASE_URL="postgresql://postgres:9I1aLwKJiJYbMOLa@db.otxidzozhdnszvqbgzne.supabase.co:5432/postgres"

# Test connection
npx prisma db pull

# If successful, run dev server
npm run dev

# Try registration at http://localhost:3000/academic-portal/signup
```

---

## 📋 QUICK DECISION MATRIX

| Option | Time | Difficulty | Reliability | Cost |
|--------|------|------------|-------------|------|
| **Fix Supabase** | 30m | Medium | Unknown | Free |
| **Supabase Auth** | 1h | Medium | High | Free |
| **Vercel Postgres** | 20m | Easy | Very High | Free tier OK |
| **Neon Database** | 20m | Easy | High | Free tier OK |

**Recommendation:** Try Option 1 (Steps 1.1-1.4) first for 30 minutes. If no success, immediately switch to **Option 3 (Vercel Postgres)** for guaranteed working solution.

---

## ✅ SUCCESS CRITERIA

You'll know it's working when:
1. ✅ `https://manaboodle.com/api/diagnostics` shows `database.connected: true`
2. ✅ Registration form submits successfully
3. ✅ User can see confirmation message
4. ✅ Login with registered email/password works
5. ✅ Redirect to `/academic-portal/dashboard` after login
6. ✅ "Launch Clusters" button appears on dashboard

---

## 📞 BACKUP PLAN

If none of the above work, the nuclear option:

### Use SQLite on Vercel Edge (NOT RECOMMENDED)
- Deploy database file with the app
- Read-only mode for serverless
- Only works for very low traffic

### Contact Support
- Vercel Support: Check if there's a firewall blocking Supabase
- Supabase Support: Ask about Vercel connection issues

---

## 📝 WHAT WE'VE ALREADY TRIED

✅ Manual SQL execution in Supabase (tables created successfully)  
✅ Connection pooler with pgbouncer  
✅ Direct connection without pooler  
✅ Added connection parameters (?pgbouncer=true, &connection_limit=1)  
✅ Set all required environment variables in Vercel  
✅ Prisma client generation (works in build)  
✅ Multiple redeployments  
❌ **Still failing:** Runtime connection from Vercel to Supabase

---

## 🎨 GOOD NEWS

Everything else is ready:
- ✅ Harvard crimson theme applied to Clusters landing page
- ✅ Navigation updated (back button, launch button)
- ✅ Code committed and deployed
- ✅ No build errors
- ✅ Frontend works perfectly

**Only blocker:** Database connection at runtime.

---

## 📧 FOR TOMORROW'S SESSION

Start with:
```
"Let's fix the database connection. I want to try [Option X] from the action plan."
```

Or if you want to move fast:
```
"Let's switch to Vercel Postgres so we can get this working immediately."
```

Good luck! 🚀
