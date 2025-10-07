# 🚨 CRITICAL: Multiple Secrets Exposed - Action Required

## Summary
**4 different secrets** were accidentally committed to GitHub repository and detected by GitHub Secret Scanning and GitGuardian:

1. ✅ **Supabase Service Role Key** - FULL database admin access
2. ✅ **Resend API Key** - Can send emails from your domain
3. ✅ **Supabase Database Password** - Direct database access
4. ✅ **OpenAI API Key** - Can incur API charges

**ALL MUST BE ROTATED IMMEDIATELY**

---

## 🔥 Priority 1: Rotate Resend API Key (THIS IS CAUSING REGISTRATION ERRORS!)

### Resend API Key Rotation
1. Go to: https://resend.com/api-keys
2. Find key starting with `re_eDKcVBgd...`
3. Click **Delete/Revoke**
4. Create new key: **+ Create API Key**
5. Name it: "Manaboodle Production"
6. Copy the new key
7. Update Vercel: https://vercel.com/manabunagaoka/manaboodle/settings/environment-variables
   - Find `RESEND_API_KEY`
   - Edit and paste new key
   - Save
8. Update local `.env.local` with new key

**This is likely why registration is failing!** GitGuardian may have notified Resend who disabled the key.

---

## 🔥 Priority 2: Rotate Supabase Service Key

### Supabase Service Role Key Rotation
1. Go to: https://supabase.com/dashboard/project/otxidzozhdnszvqbgzne/settings/api
2. Find **service_role** key in **Project API keys**
3. Click **Reset service_role secret**
4. Copy the NEW key (starts with `eyJ...`)
5. Update Vercel:
   - Variable: `SUPABASE_SERVICE_KEY`
   - Value: [new key]
6. Update local `.env.local`

---

## 🔥 Priority 3: Reset Database Password

### Supabase Database Password Reset
1. Go to: https://supabase.com/dashboard/project/otxidzozhdnszvqbgzne/settings/database
2. Click **Reset database password**
3. Generate strong password (or use theirs)
4. Copy the new password
5. Update connection string in Vercel:
   - Variable: `DATABASE_URL`
   - Format: `postgresql://postgres:[NEW_PASSWORD]@db.otxidzozhdnszvqbgzne.supabase.co:5432/postgres?schema=public`
6. Update local `.env.local` and `.env` files

---

## 🔥 Priority 4: Rotate OpenAI Key (if used)

### OpenAI API Key Rotation
1. Go to: https://platform.openai.com/api-keys
2. Find the compromised key
3. Click **Revoke**
4. Create new key if still needed
5. Update Vercel: `OPENAI_API_KEY`
6. Update local `.env.local`

---

## After Rotating ALL Keys: Redeploy

```bash
git commit --allow-empty -m "Trigger redeploy with new credentials"
git push origin main
```

Wait 2-3 minutes for Vercel deployment, then test registration.

---

## Files Removed from Repository

✅ **Deleted (commit 91ab481)**:
- `VERCEL_ENV_FIX.md` (contained service key)
- `CURRENT_STATE.md` (contained ALL secrets)
- `AUTHENTICATION_TROUBLESHOOTING_PLAN.md` (contained database password)

---

## Why This Happened

**Root Cause**: Created documentation files with actual secret values for troubleshooting purposes, then accidentally committed them to GitHub.

**Detection**: 
- GitHub Secret Scanning automatically detected the secrets
- GitGuardian also detected and sent separate alerts
- These services protect open source repos from credential leaks

---

## Impact Assessment

### What Attackers Could Do With Each Secret:

**Supabase Service Key**:
- ✅ Full database read/write (bypass all security)
- ✅ Delete all data
- ✅ Create/modify users
- ✅ Change database schema

**Resend API Key**:
- ✅ Send unlimited emails from hello@manaboodle.com
- ✅ Spam/phishing attacks using your domain
- ✅ Incur API usage charges
- ✅ Damage sender reputation

**Database Password**:
- ✅ Direct database connection
- ✅ Read all user data
- ✅ Modify any records
- ✅ Drop tables

**OpenAI API Key**:
- ✅ Make API calls on your account
- ✅ Incur charges (potentially $$$)
- ✅ Access/modify your usage data

---

## Checklist: Rotation Steps

- [ ] **Resend API Key**: Revoked old, created new, updated Vercel & local
- [ ] **Supabase Service Key**: Reset, updated Vercel & local
- [ ] **Database Password**: Reset, updated connection strings
- [ ] **OpenAI Key**: Revoked old, created new (if needed)
- [ ] **Vercel Env Vars**: All 4 variables updated
- [ ] **Local .env.local**: All 4 variables updated
- [ ] **Redeployed**: Pushed empty commit to trigger build
- [ ] **Tested**: Registration works after deployment

---

## Prevention Going Forward

### ✅ What We Did Right:
- `.env.local` is in `.gitignore`
- Vercel environment variables are encrypted
- GitHub Secret Scanning caught it

### ❌ What Went Wrong:
- Put actual secrets in documentation files
- Committed without reviewing
- Multiple documentation files created during troubleshooting

### ✅ How to Prevent:
1. **NEVER** put real secrets in documentation
2. Use placeholders: `[YOUR_KEY_HERE]`, `[PASTE_KEY]`, etc.
3. Review changes before commit: `git diff`
4. Use `git status` to check which files are staged
5. Install pre-commit hooks to scan for secrets

---

## Why Registration is Currently Broken

The "Internal server error" you're seeing is likely because:

1. **GitGuardian notified Resend** → They may have auto-disabled your API key
2. **Service key exposed** → GitHub may have flagged it
3. **Both are required for registration**:
   - Service key: Creates user record in database
   - Resend key: Sends confirmation email

**Once you rotate both keys and redeploy, registration should work!**

---

## Timeline

1. **Oct 6, 04:04 UTC**: Secrets committed to GitHub
2. **Minutes later**: GitHub Secret Scanning detected
3. **Minutes later**: GitGuardian detected
4. **Alerts sent**: Email notifications to repo owner
5. **Oct 7**: Files removed from repository (commit 91ab481)
6. **Now**: Waiting for key rotation
7. **Next**: Redeploy and test

---

## Status

### Completed ✅
- Exposed files deleted from repository
- Security incident documented
- Remediation plan created

### Pending ⏳
- You must rotate all 4 compromised secrets
- You must update Vercel environment variables
- You must update local .env.local
- You must redeploy application
- You must test registration

---

## Quick Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/otxidzozhdnszvqbgzne
- **Resend Dashboard**: https://resend.com/api-keys
- **Vercel Settings**: https://vercel.com/manabunagaoka/manaboodle/settings/environment-variables
- **OpenAI Keys**: https://platform.openai.com/api-keys

---

**⚠️ DO NOT commit this file with actual secret values! This is a guide only.**

Once you've rotated all keys, let me know and we'll test the registration! 🔐
