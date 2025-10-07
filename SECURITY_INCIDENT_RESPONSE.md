# 🚨 SECURITY INCIDENT - Service Key Exposed

## What Happened
The `SUPABASE_SERVICE_KEY` was accidentally committed to GitHub in the file `VERCEL_ENV_FIX.md`.

GitHub detected this and sent an alert.

## Immediate Actions Required

### 1. Rotate the Supabase Service Key (CRITICAL - DO THIS NOW!)

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard/project/otxidzozhdnszvqbgzne
2. Click **Settings** → **API**
3. Under **Project API keys**, find **service_role** key
4. Click **Reset service_role secret** or **Regenerate**
5. Copy the NEW service key

### 2. Update Vercel Environment Variable

1. Go to **Vercel Dashboard**: https://vercel.com/manabunagaoka/manaboodle
2. Click **Settings** → **Environment Variables**
3. Find `SUPABASE_SERVICE_KEY`
4. Click **Edit** → Delete old value
5. Paste the NEW service key
6. Save

### 3. Update Local .env.local

Update your `.env.local` file with the new key:
```
SUPABASE_SERVICE_KEY=[paste new key here]
```

### 4. Redeploy

After updating Vercel env var:
```bash
git commit --allow-empty -m "Trigger redeploy after key rotation"
git push origin main
```

---

## What This Key Can Do (Why It's Critical)

The service role key has FULL admin access to your Supabase project:
- ✅ Read/write ALL database tables (bypasses RLS)
- ✅ Delete any data
- ✅ Create/modify users
- ✅ Access authentication data
- ✅ Modify database schema

**Anyone with this key has complete control over your database.**

---

## Remediation Steps Taken

1. ✅ Deleted `VERCEL_ENV_FIX.md` file
2. ⏳ **YOU MUST**: Rotate the service key in Supabase Dashboard
3. ⏳ **YOU MUST**: Update Vercel environment variable
4. ⏳ **YOU MUST**: Update local .env.local
5. ⏳ Redeploy application

---

## Prevention for Future

### Already Protected (Good News!)
- ✅ `.env.local` is in `.gitignore` (local secrets safe)
- ✅ Vercel environment variables are encrypted and secure

### What Went Wrong
- ❌ Created documentation file with actual secret value
- ❌ Committed to GitHub without reviewing

### How to Prevent
1. **NEVER** put actual secret values in documentation
2. Use placeholders like `[YOUR_KEY_HERE]` in docs
3. Always review files before committing: `git diff`
4. Use `git-secrets` or similar tools to scan commits

---

## Timeline

1. Created `VERCEL_ENV_FIX.md` with service key for troubleshooting
2. Committed to GitHub (commit: 6ca5bbf)
3. GitHub Secret Scanning detected the key
4. Alert sent to repository owner
5. File deleted (commit: upcoming)
6. **NEXT**: Key rotation required

---

## GitHub Secret Scanning

GitHub automatically scans commits for:
- API keys
- Database passwords
- OAuth tokens
- Service credentials

When detected:
- Email alert sent
- Security tab shows alert
- Recommends key rotation

**This is a GOOD thing** - it caught our mistake!

---

## Status

- ✅ Exposed file deleted
- ⏳ **WAITING**: You to rotate Supabase service key
- ⏳ **WAITING**: You to update Vercel env var
- ⏳ Redeploy application

---

## Registration Error

**Good news**: The "Internal server error" you're seeing is likely BECAUSE GitHub disabled the exposed key for security. Once you rotate the key and update Vercel, registration should work!

---

## Quick Rotation Steps (Copy/Paste)

1. **Supabase**: https://supabase.com/dashboard/project/otxidzozhdnszvqbgzne/settings/api
   - Regenerate service_role key
   - Copy new key

2. **Vercel**: https://vercel.com/manabunagaoka/manaboodle/settings/environment-variables
   - Edit SUPABASE_SERVICE_KEY
   - Paste new key
   - Save

3. **Local**: Update `.env.local`

4. **Terminal**:
```bash
git commit --allow-empty -m "Trigger redeploy after key rotation"
git push origin main
```

---

Let me know when you've rotated the key and I'll help verify everything is working! 🔐
