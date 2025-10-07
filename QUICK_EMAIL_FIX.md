# 🚀 QUICK FIX: Email Configuration (Do This Now!)

## ⚡ Immediate Actions Required

### 1️⃣ Fix Redirect URL (2 minutes)

Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**

**Site URL:**
```
https://manaboodle.com
```

**Redirect URLs (click "Add URL" for each):**
```
https://manaboodle.com/api/auth/callback
https://manaboodle.com/academic-portal/dashboard
http://localhost:3000/api/auth/callback
```

Click **Save**

---

### 2️⃣ Remove Supabase Branding (5 minutes)

Go to **Supabase Dashboard** → **Project Settings** → **Auth** → Scroll to **SMTP Settings**

**Enable Custom SMTP** and use your Resend credentials:

```
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP User: resend
SMTP Password: [Your RESEND_API_KEY - same one in Vercel env vars]
Sender Email: hello@manaboodle.com
Sender Name: Harvard Academic Portal
```

Click **Save**

✅ This removes "powered by Supabase" footer completely!

---

### 3️⃣ Update Email Template (3 minutes)

Go to **Supabase Dashboard** → **Authentication** → **Email Templates** → **Confirm signup**

Replace everything with the beautiful template from `SUPABASE_EMAIL_CONFIGURATION.md` (the HTML one with Harvard crimson header)

Click **Save**

---

## 🧪 Test Again

1. **Delete your test account** from Supabase → Authentication → Users
2. **Delete from HarvardUser table** too (Supabase → Table Editor → HarvardUser)
3. **Wait for deployment to finish** (check Vercel - should be done in ~2 min)
4. **Register again** at https://manaboodle.com/academic-portal/signup
5. **Check email** - Should now:
   - ✅ Come from hello@manaboodle.com
   - ✅ Have NO Supabase branding
   - ✅ Link goes to https://manaboodle.com (not localhost)
   - ✅ Beautiful Harvard crimson design

---

## 📝 Your Resend API Key

You already have it set in Vercel environment variables as `RESEND_API_KEY`

To get it:
1. Go to Vercel Dashboard → manaboodle project → Settings → Environment Variables
2. Find `RESEND_API_KEY`
3. Click "Show" to reveal the value
4. Copy and paste into Supabase SMTP Password field

OR

1. Go directly to https://resend.com/api-keys
2. Use your existing API key

---

## ✅ Done!

After these 3 quick steps:
- Emails will come from YOUR domain
- No Supabase branding
- Links work correctly
- Professional Harvard appearance

Let me know once you've done these and we'll test! 🎉
