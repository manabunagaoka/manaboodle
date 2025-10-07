# 🔧 RLS Policy Fix for HarvardUser Table

## Issue: Empty {} Response

The registration was failing silently because Row Level Security (RLS) policies on the `HarvardUser` table were blocking inserts from the service role.

## ✅ Fixes Applied

1. **Changed to Service Role Client** - Now using `createServiceClient()` with admin privileges
2. **Added Error Handling** - Now logs errors to help debug
3. **Deployed** - Changes are being pushed to production

## 🔍 Check RLS Policies in Supabase

After deployment, if registration still fails, check RLS:

### Step 1: Check if RLS is Enabled

1. Go to **Supabase Dashboard** → **Table Editor** → **HarvardUser**
2. Look for **"RLS"** badge or toggle
3. If enabled, check policies

### Step 2: Add Policy to Allow Service Role Inserts

If RLS is blocking, run this in **SQL Editor**:

```sql
-- Allow service role to insert into HarvardUser
CREATE POLICY "Service role can insert HarvardUser"
ON "HarvardUser"
FOR INSERT
TO service_role
USING (true);

-- Allow service role to do everything (recommended for backend operations)
CREATE POLICY "Service role full access"
ON "HarvardUser"
FOR ALL
TO service_role
USING (true);
```

### Step 3: Or Temporarily Disable RLS for Testing

```sql
-- Disable RLS on HarvardUser table (for testing only!)
ALTER TABLE "HarvardUser" DISABLE ROW LEVEL SECURITY;
```

**Warning:** Only disable RLS temporarily for testing. Re-enable with proper policies for production!

---

## 🧪 Testing After Deployment

Wait 2-3 minutes for Vercel to deploy, then:

### 1. Try Registration Again

1. Go to https://manaboodle.com/academic-portal/signup
2. Fill in the form
3. Submit

**Expected result:**
- ✅ Success message (not `{}`)
- ✅ User created in Supabase → Authentication → Users
- ✅ Data in Supabase → Table Editor → HarvardUser

### 2. Check Vercel Function Logs

If still failing:

1. Go to **Vercel Dashboard** → manaboodle → **Deployments**
2. Click latest deployment
3. Go to **Functions** → `/api/register`
4. Look for error logs
5. Should now see detailed error messages!

### 3. Try Login

1. Go to https://manaboodle.com/academic-portal/login
2. Enter your email and password
3. Click "Sign In"

**Expected result:**
- ✅ Redirects to dashboard
- ✅ Shows "Welcome, your@email.edu"

---

## 📊 What Changed

### Before (Broken):
```typescript
import { supabase } from '@/lib/supabase'  // Anon key client
// ... later ...
await supabase.from('HarvardUser').insert(...)  // BLOCKED by RLS!
```

### After (Fixed):
```typescript
import { createServiceClient } from '@/lib/supabase-server'  // Service role
const supabase = createServiceClient()  // Admin privileges
await supabase.from('HarvardUser').insert(...)  // WORKS! ✅
```

---

## 🎯 Next Steps

1. **Wait 2-3 minutes** for deployment to finish
2. **Try registration** at https://manaboodle.com/academic-portal/signup
3. **Check result:**
   - ✅ If success message appears → FIXED! 🎉
   - ❌ If still `{}` → Check Vercel logs, then RLS policies

Let me know what happens! 🚀
