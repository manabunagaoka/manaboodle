# 📧 Supabase Email Configuration Guide

## 🎯 Goals
1. ✅ Remove Supabase branding from emails
2. ✅ Use custom "from" address (hello@manaboodle.com)
3. ✅ Fix redirect URLs to point to production
4. ✅ Customize email templates with Harvard branding

---

## 🚀 Quick Fix Steps

### Step 1: Configure Site URL and Redirect URLs

Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**

#### Site URL
```
https://manaboodle.com
```

#### Redirect URLs (Add all of these)
```
https://manaboodle.com/api/auth/callback
https://manaboodle.com/academic-portal/dashboard
http://localhost:3000/api/auth/callback
http://localhost:3000/academic-portal/dashboard
```

**Important:** The `Site URL` is used as the default redirect when `emailRedirectTo` is not specified.

---

### Step 2: Remove Supabase Branding

**Option A: Use Custom SMTP (Recommended for Production)**

Using custom SMTP completely removes Supabase branding and lets you use your own email domain.

1. Go to **Supabase Dashboard** → **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Enable **Custom SMTP**
4. Configure with your email provider:

#### Using Resend (Recommended - You Already Have API Key)
```
SMTP Host: smtp.resend.com
SMTP Port: 587 (or 465 for SSL)
SMTP User: resend
SMTP Password: [Your RESEND_API_KEY]
Sender Email: hello@manaboodle.com
Sender Name: Harvard Academic Portal
```

#### Using SendGrid (Alternative)
```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Password: [Your SendGrid API Key]
Sender Email: hello@manaboodle.com
Sender Name: Harvard Academic Portal
```

#### Using Gmail (For Testing Only)
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: your-email@gmail.com
SMTP Password: [App Password - not your regular password]
Sender Email: your-email@gmail.com
Sender Name: Harvard Academic Portal
```

**Option B: Contact Supabase Support (For Paid Plans)**

If you're on a paid Supabase plan, you can request to remove the footer by:
1. Going to **Support** in Supabase Dashboard
2. Requesting removal of "powered by Supabase" footer
3. They usually approve this for production projects

---

### Step 3: Customize Email Templates

Go to **Supabase Dashboard** → **Authentication** → **Email Templates**

#### Confirm Signup Template

Click **"Confirm signup"** and replace with:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Email - Harvard Academic Portal</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header with Harvard Crimson -->
          <tr>
            <td style="background-color: #A51C30; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Harvard Academic Portal</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Manaboodle</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">Welcome to the Harvard Academic Portal!</h2>
              
              <p style="color: #555; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for registering with Manaboodle's Harvard Academic Portal.
              </p>
              
              <p style="color: #555; line-height: 1.6; margin: 0 0 30px 0;">
                Click the button below to confirm your email address and activate your account:
              </p>
              
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 40px; background-color: #A51C30; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Confirm Your Email</a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #777; line-height: 1.6; margin: 30px 0 0 0; font-size: 14px;">
                Or copy and paste this link into your browser:
              </p>
              
              <p style="color: #A51C30; line-height: 1.6; margin: 10px 0 0 0; font-size: 12px; word-break: break-all;">
                {{ .ConfirmationURL }}
              </p>
              
              <p style="color: #999; line-height: 1.6; margin: 30px 0 0 0; font-size: 13px;">
                <strong>This link will expire in 24 hours.</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px 30px; border-top: 1px solid #eeeeee;">
              <p style="color: #A51C30; margin: 0 0 10px 0; font-weight: bold; font-size: 14px;">
                Veritas • Harvard Academic Portal
              </p>
              <p style="color: #999; margin: 0; font-size: 12px; line-height: 1.5;">
                If you didn't sign up for a Harvard Academic Portal account, you can safely ignore this email.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

#### Magic Link Template (Optional)

If you want to enable passwordless login:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign In - Harvard Academic Portal</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <tr>
            <td style="background-color: #A51C30; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Harvard Academic Portal</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Manaboodle</p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">Sign In to Your Account</h2>
              
              <p style="color: #555; line-height: 1.6; margin: 0 0 30px 0;">
                Click the button below to sign in to the Harvard Academic Portal:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 40px; background-color: #A51C30; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Sign In</a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #777; line-height: 1.6; margin: 30px 0 0 0; font-size: 14px;">
                Or copy and paste this link into your browser:
              </p>
              
              <p style="color: #A51C30; line-height: 1.6; margin: 10px 0 0 0; font-size: 12px; word-break: break-all;">
                {{ .ConfirmationURL }}
              </p>
              
              <p style="color: #999; line-height: 1.6; margin: 30px 0 0 0; font-size: 13px;">
                <strong>This link will expire in 1 hour.</strong>
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px 30px; border-top: 1px solid #eeeeee;">
              <p style="color: #A51C30; margin: 0 0 10px 0; font-weight: bold; font-size: 14px;">
                Veritas • Harvard Academic Portal
              </p>
              <p style="color: #999; margin: 0; font-size: 12px; line-height: 1.5;">
                If you didn't request this sign-in link, you can safely ignore this email.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

#### Password Reset Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password - Harvard Academic Portal</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <tr>
            <td style="background-color: #A51C30; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Harvard Academic Portal</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Manaboodle</p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">Reset Your Password</h2>
              
              <p style="color: #555; line-height: 1.6; margin: 0 0 20px 0;">
                We received a request to reset your password for the Harvard Academic Portal.
              </p>
              
              <p style="color: #555; line-height: 1.6; margin: 0 0 30px 0;">
                Click the button below to create a new password:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 40px; background-color: #A51C30; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Reset Password</a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #777; line-height: 1.6; margin: 30px 0 0 0; font-size: 14px;">
                Or copy and paste this link into your browser:
              </p>
              
              <p style="color: #A51C30; line-height: 1.6; margin: 10px 0 0 0; font-size: 12px; word-break: break-all;">
                {{ .ConfirmationURL }}
              </p>
              
              <p style="color: #999; line-height: 1.6; margin: 30px 0 0 0; font-size: 13px;">
                <strong>This link will expire in 1 hour.</strong>
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px 30px; border-top: 1px solid #eeeeee;">
              <p style="color: #A51C30; margin: 0 0 10px 0; font-weight: bold; font-size: 14px;">
                Veritas • Harvard Academic Portal
              </p>
              <p style="color: #999; margin: 0; font-size: 12px; line-height: 1.5;">
                If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 🔧 Testing

After configuration:

1. **Delete your test account** from Supabase Dashboard → Authentication → Users
2. **Register again** at https://manaboodle.com/academic-portal/signup
3. **Check email** - Should now:
   - ✅ Come from `hello@manaboodle.com` (if using custom SMTP)
   - ✅ Have no Supabase branding
   - ✅ Redirect to `https://manaboodle.com` (not localhost)
   - ✅ Use Harvard crimson branding

---

## ⚠️ Important Notes

### About "Powered by Supabase" Footer

- **Free Plan:** Footer appears by default, can only be removed with custom SMTP
- **Pro Plan:** Can request removal through support ticket
- **Custom SMTP:** Completely removes all Supabase branding

### Email Deliverability

When using custom SMTP:
1. Make sure your domain has proper **SPF** and **DKIM** records
2. Use a transactional email service (Resend, SendGrid, etc.)
3. Don't use personal Gmail for production

### Rate Limits

Supabase Auth has rate limits:
- **Free tier:** 10,000 emails/month via Supabase SMTP
- **Custom SMTP:** Depends on your email provider
- Consider implementing your own rate limiting

---

## 📚 Additional Resources

- [Supabase Auth Configuration](https://supabase.com/docs/guides/auth/auth-smtp)
- [Custom SMTP Setup](https://supabase.com/docs/guides/auth/auth-smtp#setting-up-custom-smtp)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Resend Documentation](https://resend.com/docs)

---

## ✅ Checklist

- [ ] Configure Site URL to `https://manaboodle.com`
- [ ] Add all redirect URLs
- [ ] Set up custom SMTP (Resend recommended)
- [ ] Update all email templates with Harvard branding
- [ ] Test registration with new email
- [ ] Verify emails come from `hello@manaboodle.com`
- [ ] Confirm no Supabase branding appears
- [ ] Test confirmation link redirects to correct URL

Once complete, your emails will be fully branded and professional! 🎉
