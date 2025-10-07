# 🧪 Testing Mode - Disable Email Confirmation

## Quick Setup for Easier Testing

To test without hitting rate limits, temporarily disable email confirmation:

### Step 1: Disable Email Confirmation

1. Go to **Supabase Dashboard** → **Authentication** → **Providers**
2. Click on **Email** provider
3. Find **"Confirm email"** toggle
4. Turn it **OFF** (disabled)
5. Click **Save**

✅ Now registrations work immediately without email confirmation!

### Step 2: Test Registration

1. Go to https://manaboodle.com/academic-portal/signup
2. Fill in the form with your .edu email
3. Submit
4. Should redirect to login page immediately
5. Go to https://manaboodle.com/academic-portal/login
6. Sign in with your credentials
7. Should redirect to dashboard! ✅

### Step 3: Re-enable Email Confirmation (After Testing)

Once you're done testing:

1. Go back to **Supabase Dashboard** → **Authentication** → **Providers** → **Email**
2. Turn **"Confirm email"** back **ON**
3. Click **Save**

This is recommended for production to prevent spam accounts.

---

## 📊 What You Should See

### Registration Flow (Email Confirmation OFF):
```
1. Fill form → Submit
2. Account created in Supabase instantly ✅
3. Account created in HarvardUser table ✅
4. Redirect to login page with success message
5. Login immediately works
6. Dashboard shows your email
```

### Registration Flow (Email Confirmation ON):
```
1. Fill form → Submit
2. Account created in Supabase (unconfirmed)
3. Email sent with confirmation link
4. Click link in email
5. Email confirmed ✅
6. Login works
7. Dashboard shows your email
```

---

## 🔧 Current Configuration Status

Based on what you've done:

✅ SQL migration run (HarvardUser table updated)
✅ Site URL configured (https://manaboodle.com)
✅ Redirect URLs configured
✅ Custom SMTP configured (Resend)
✅ Email templates updated (Harvard branding)
✅ No Supabase branding in emails
✅ Code deployed (redirect URLs fixed)

**For testing now:** Disable email confirmation temporarily

**For production:** Re-enable email confirmation

---

## 🎯 Recommended Testing Sequence

### Phase 1: Basic Flow (Email Confirmation OFF)
```
1. Disable email confirmation
2. Register → Login → Dashboard → Logout
3. Verify everything works
4. Test Clusters page access
```

### Phase 2: Email Flow (Email Confirmation ON)
```
1. Re-enable email confirmation
2. Register with different email
3. Check email received
4. Verify Harvard branding
5. Click confirmation link
6. Verify redirect works
7. Login and access dashboard
```

### Phase 3: Edge Cases
```
1. Test invalid class codes
2. Test non-.edu emails (should fail)
3. Test duplicate registration (should fail)
4. Test forgot password flow
```

---

## 🐛 If You Still Hit Rate Limit

The rate limit is per email address for 1 hour. Options:

1. **Wait 60 minutes** from your last attempt
2. **Use a different .edu email**
3. **Disable email confirmation** (testing mode)
4. **Manually confirm** existing accounts in Supabase

---

## ✅ Ready to Test!

Try this now:

1. **Disable email confirmation** (Supabase → Auth → Providers → Email → Confirm email OFF)
2. **Register** at https://manaboodle.com/academic-portal/signup
3. **Login** at https://manaboodle.com/academic-portal/login
4. **Report back** what you see!

This will let us verify the core authentication flow works before dealing with email confirmation rate limits. 🚀
