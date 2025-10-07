# Tomorrow's Action Plan - October 8, 2025

## 🎯 PRIMARY GOALS (In Order)

### 1. 🔒 COMPLETE SECURITY ROTATION (30 minutes)

**Status**: Partially complete - need to finish Vercel updates

#### What's Done:
- ✅ Created new Supabase API keys (new format: `sb_publishable_...` and `sb_secret_...`)
- ✅ Rotated Resend API key
- ✅ Reset database password
- ✅ Updated local `.env.local` with new values

#### What's NOT Done:
- ❌ Update Vercel environment variables with new keys
- ❌ Redeploy Vercel
- ❌ Test application with new keys
- ❌ Disable legacy JWT keys in Supabase
- ❌ Close GitHub Secret Scanning alerts

#### Steps:
1. Go to Vercel Dashboard → manaboodle project → Settings → Environment Variables
2. Update these 4 variables (get values from your local `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (starts with `sb_publishable_`)
   - `SUPABASE_SERVICE_KEY` (starts with `sb_secret_`)
   - `RESEND_API_KEY` (starts with `re_`)
   - `DATABASE_URL` (PostgreSQL connection string with NEW password)
3. Click "Redeploy" in Vercel
4. Wait 2-3 minutes for deployment
5. Test: Try to visit https://manaboodle.com
6. If working: Go to Supabase → API Settings → Click "Disable JWT-based API keys"
7. Close GitHub Secret Scanning alerts

---

### 2. 🐛 FIX BROKEN FEATURES (1-2 hours)

#### A. Fix Resend Email Integration

**Problems Identified:**
- Subscribe form broken
- Contact form broken
- Resend setup is messed up
- May be related to API key rotation

**Diagnostic Steps:**
1. Check Resend Dashboard: https://resend.com
   - Verify API key is active
   - Check sending limits/quota
   - Review recent email logs for errors
2. Test endpoints:
   - `/api/subscribe` - Newsletter subscription
   - `/api/contact` - Contact form
3. Check code for hardcoded old keys or config issues

**Files to Check:**
- `/src/app/api/subscribe/route.ts`
- `/src/app/api/contact/route.ts`
- Any email template files in `/src/components/email/`

**Likely Fixes:**
- Update Resend SDK initialization if needed
- Verify "from" email address is verified in Resend
- Check CORS/domain settings in Resend dashboard
- Test with simple email first before complex templates

#### B. Fix Harvard Login/Signup

**Current Status:**
- Registration returns `{}` after 60 seconds
- Login likely also broken
- Supabase Auth implemented but not working

**Root Cause Analysis (from yesterday):**
1. Original issue: Custom SMTP (Resend) made registration slow (40-50 seconds)
2. Attempted fix: Use admin API with `email_confirm: true`
3. Still broken: Likely Resend SMTP still configured in Supabase

**Diagnostic Steps:**
1. **FIRST THING**: Check Supabase Dashboard
   - Go to: Authentication → Email Templates
   - Check if "Custom SMTP" is ENABLED
   - **If enabled: DISABLE IT** ← This is probably the entire problem
2. Check Vercel deployment logs for errors
3. Test registration endpoint directly with curl/Postman
4. Check Supabase auth.users table for test users

**Files to Review:**
- `/src/app/api/register/route.ts` (current registration logic)
- `/src/app/academic-portal/login/page.tsx` (login UI)
- `/src/app/academic-portal/signup/page.tsx` (signup UI)
- `/src/lib/supabase-server.ts` (server client config)

**Expected Fix:**
- Disable Custom SMTP in Supabase Dashboard
- Registration should complete in 1-2 seconds with default Supabase emails
- Users will receive Supabase-branded emails (temporary, acceptable)
- Can customize emails LATER as separate task

---

### 3. 📧 EMAIL CUSTOMIZATION (Future - Do NOT do tomorrow)

**Current Decision**: Accept Supabase default emails temporarily

**Why**: 
- Trying to customize emails broke authentication
- Need working auth FIRST, branding SECOND
- Can revisit after everything is stable

**Future Options** (for later):
1. Supabase email templates (built-in customization)
2. Post-registration welcome email (separate from auth)
3. Webhook-triggered emails (decoupled from auth flow)

---

## 📋 STEP-BY-STEP CHECKLIST FOR TOMORROW

### Phase 1: Security (Do First)
- [ ] Open Vercel Dashboard
- [ ] Update `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel
- [ ] Update `SUPABASE_SERVICE_KEY` in Vercel
- [ ] Update `RESEND_API_KEY` in Vercel
- [ ] Update `DATABASE_URL` in Vercel
- [ ] Trigger Vercel redeploy
- [ ] Wait for deployment (2-3 min)
- [ ] Test: Visit https://manaboodle.com (should load)
- [ ] Disable legacy JWT keys in Supabase
- [ ] Close GitHub Secret Scanning alerts

### Phase 2: Fix Supabase Auth (Critical)
- [ ] Go to Supabase Dashboard → Authentication → Email Templates
- [ ] Check if "Custom SMTP" is enabled
- [ ] **IF ENABLED: DISABLE IT**
- [ ] Go to https://manaboodle.com/academic-portal/signup
- [ ] Try to register with test email (use .edu email)
- [ ] Should complete in 1-2 seconds (not 60 seconds)
- [ ] Check email for confirmation link (will be Supabase-branded)
- [ ] Click confirmation link
- [ ] Should redirect to dashboard
- [ ] Verify you can log in with same credentials
- [ ] Test dashboard access
- [ ] Test Clusters page access

### Phase 3: Fix Email Forms (Secondary)
- [ ] Check Resend Dashboard for API key status
- [ ] Test Subscribe form: https://manaboodle.com/subscribe
- [ ] Check browser console for errors
- [ ] Test Contact form: https://manaboodle.com/contact
- [ ] Check Vercel function logs for `/api/subscribe` errors
- [ ] Check Vercel function logs for `/api/contact` errors
- [ ] Verify "from" email is verified in Resend
- [ ] If needed: Update Resend SDK usage in code

---

## 🚨 CRITICAL RULES FOR TOMORROW

### DO:
- ✅ Keep secrets ONLY in Vercel dashboard and local `.env.local`
- ✅ Use placeholder values in any documentation: `<your_secret_here>`
- ✅ Test each fix incrementally
- ✅ Check Vercel deployment logs after each change
- ✅ Start fresh chat if needed (this session has full context)

### DO NOT:
- ❌ **NEVER COMMIT ACTUAL SECRET VALUES**
- ❌ **NO MORE SECRET LEAKS**
- ❌ Don't create documentation files with real API keys
- ❌ Don't paste secrets in code comments
- ❌ Don't try to fix emails before fixing auth
- ❌ Don't spend more than 2 hours before asking for help
- ❌ Don't integrate Resend SMTP into Supabase Auth again

---

## 📚 Reference Documents (No Secrets)

### For Security Rotation:
- See: `SECURITY_ACTION_REQUIRED.md` (has step-by-step Vercel instructions)

### For Auth Debugging:
- See: `AUTHENTICATION_MIGRATION_REPORT.md` (has full timeline and lessons learned)

### Key Insights from Today:
1. Resend SMTP integration made registration slow (40-50 seconds)
2. Disabling Custom SMTP in Supabase should fix registration
3. Accept Supabase default emails temporarily
4. Your new Supabase keys use `sb_secret_` format (correct, not JWT)
5. Must update Vercel BEFORE disabling old JWT keys

---

## 🎯 SUCCESS CRITERIA

### Minimum Viable (Must achieve):
- ✅ GitHub Secret Scanning alerts closed
- ✅ Old exposed secrets disabled/rotated
- ✅ User can register at `/academic-portal/signup` in <5 seconds
- ✅ User can log in at `/academic-portal/login`
- ✅ Dashboard loads and shows user info

### Nice to Have (If time permits):
- ✅ Subscribe form works
- ✅ Contact form works
- ✅ Email templates look good

### Do NOT Attempt:
- ❌ Custom email branding (defer to later)
- ❌ Advanced Resend integrations
- ❌ Complex SMTP configurations

---

## 🔍 Diagnostic Commands (If Needed)

### Check Vercel Deployment Status:
```bash
# Visit in browser:
https://vercel.com/manabunagaokas-projects/manaboodle/deployments
```

### Check Vercel Function Logs:
```bash
# Visit in browser:
https://vercel.com/manabunagaokas-projects/manaboodle/deployments/[latest]/functions
```

### Test Registration Directly:
```bash
curl -X POST https://manaboodle.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@harvard.edu",
    "password": "testpass123",
    "name": "Test User",
    "affiliation": "student"
  }'
```

### Check Supabase Auth Users:
```sql
-- In Supabase SQL Editor:
SELECT id, email, created_at, email_confirmed_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## ⏱️ Time Estimates

- Security rotation completion: **15 minutes**
- Disable Custom SMTP in Supabase: **5 minutes**
- Test auth registration/login: **15 minutes**
- Fix Resend email forms: **30-60 minutes**
- **Total**: ~1.5 hours (best case) to 2.5 hours (if issues)

---

## 📞 If You Get Stuck

1. **Check Vercel deployment logs first** - Most errors show there
2. **Check Supabase Dashboard logs** - Auth attempts logged
3. **Check browser console** - Client-side errors visible
4. **Start new chat** - Reference this document and `AUTHENTICATION_MIGRATION_REPORT.md`
5. **Supabase Support** - https://supabase.com/dashboard/support
6. **Vercel Support** - https://vercel.com/help

---

## 💾 Files That Have Current Context

- `AUTHENTICATION_MIGRATION_REPORT.md` - Full history of today's debugging
- `SECURITY_ACTION_REQUIRED.md` - Security rotation instructions
- `TOMORROW_ACTION_PLAN.md` - This file
- `.env.local` - Your LOCAL secrets (DO NOT COMMIT)

---

**Last Updated**: October 7, 2025, End of Day  
**Status**: Ready for fresh start tomorrow  
**Priority Order**: Security → Auth → Emails  
**Estimated Total Time**: 1.5-2.5 hours

**Remember**: Start with security rotation in Vercel, then disable Custom SMTP in Supabase. Everything else should fall into place after that! 🚀
