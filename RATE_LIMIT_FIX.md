# 🚨 Rate Limit Error - Quick Fix Guide

## What Happened

You hit Supabase Auth's rate limit:
- **3-4 email confirmations per hour per email address**
- You've been testing multiple times, so Supabase blocked further emails temporarily

---

## ✅ Immediate Solution (Choose One)

### Option 1: Manually Confirm Your Account ⭐ RECOMMENDED

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Find your test email in the list
3. Click on the user row
4. Look for the **"..."** menu (three dots) or edit button
5. Set **Email Confirmed** to `true` OR set `email_confirmed_at` to current timestamp
6. Click **Save**
7. Now try logging in at https://manaboodle.com/academic-portal/login

**OR use SQL Editor:**

```sql
-- Replace YOUR_EMAIL with your actual email
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'YOUR_EMAIL@harvard.edu';
```

---

### Option 2: Use a Different Email

Register with a different .edu email address:
- Use a secondary school email if you have one
- Or use a colleague's email for testing

---

### Option 3: Wait 60 Minutes

Rate limit resets after 1 hour. Have coffee, then try again! ☕

---

## 🛡️ Preventing This in Production

### For Development (Now):

1. **Use manual confirmation** for your test accounts
2. **Test with multiple different emails** to avoid hitting per-email limits
3. **Wait between tests** - don't spam registrations

### For Production (Later):

These rate limits are actually GOOD for security! They prevent:
- ✅ Email spam attacks
- ✅ Malicious bot registrations
- ✅ Abuse of your email quota

**Keep them enabled in production!**

### Adjust Limits (Pro Plan Only):

If you upgrade to Supabase Pro, you can adjust:
- **Per-email limit:** Increase from 4 to higher
- **Per-IP limit:** Increase from 30 to higher
- **Time window:** Change from 1 hour to custom

Go to: **Project Settings** → **Auth** → **Rate Limits**

---

## 🧪 Better Testing Workflow

Instead of deleting and re-registering constantly:

### Method 1: Keep Test Account
```
1. Register once with test email
2. Manually confirm in Supabase
3. Test login/logout repeatedly (no rate limit)
4. Only delete/re-register when testing registration flow
```

### Method 2: Multiple Test Emails
```
test1@yourdomain.edu
test2@yourdomain.edu
test3@yourdomain.edu
```

### Method 3: Use SQL to Reset
```sql
-- Clear user without deleting (keeps auth.users record)
DELETE FROM "HarvardUser" WHERE email = 'test@domain.edu';

-- Then you can re-insert Harvard data without new registration
```

---

## 🎯 Next Steps for You

**Right Now:**

1. Go to Supabase → Authentication → Users
2. Find your email
3. Manually confirm the email
4. Try logging in at https://manaboodle.com/academic-portal/login
5. Should work! ✅

**Or wait 60 minutes and register again**

---

## 📊 Understanding Rate Limits

### Default Supabase Auth Rate Limits:

| Action | Limit | Window | Scope |
|--------|-------|--------|-------|
| Signup | 4 | 1 hour | Per email |
| Signin | 6 | 1 hour | Per email |
| Password reset | 4 | 1 hour | Per email |
| Email verification resend | 2 | 1 hour | Per email |
| Any auth request | 30 | 1 hour | Per IP |

### Why This Exists:

1. **Prevent email bombing** - Someone can't spam someone else's inbox
2. **Prevent brute force** - Can't rapidly try passwords
3. **Prevent abuse** - Can't overwhelm your email quota
4. **Cost control** - Email sends cost money

---

## 🔧 If You Need Testing Without Limits

For development/testing environments:

### Option 1: Local Supabase (No Limits)
```bash
npm install -g supabase
supabase init
supabase start
```

Then point your local dev to local Supabase (no rate limits).

### Option 2: Separate Test Project
Create a second Supabase project just for testing:
- Test Project: Aggressive testing, no worries
- Production Project: Real users, rate limits enabled

### Option 3: Custom Auth Endpoint
Build your own registration endpoint that:
- Validates .edu email
- Creates user in Supabase manually
- Skips email confirmation for test accounts

---

## ✅ Summary

**Your account IS created** - it just needs email confirmation.

**Fastest fix:** Manually confirm in Supabase dashboard (30 seconds)

**Then:** Test login at https://manaboodle.com/academic-portal/login

The rate limit is actually protecting you - keep it enabled for production! 🛡️
