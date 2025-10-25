# SSO Debugging Guide for RIZE Integration

## Problem Summary
The `/academic-portal/login` endpoint is not detecting existing Manaboodle sessions when RIZE redirects users. This causes users to see the login form even when they're already authenticated.

## Debug Steps

### Step 1: Check if Session Exists After Login

1. Open browser (use Chrome/Firefox with DevTools)
2. Go to: https://www.manaboodle.com/academic-portal/login
3. Log in with Harvard .edu credentials
4. After successful login, you should land on the dashboard
5. Open DevTools → Console
6. Check for these logs:
   - `✅ Login successful, session created`
   - `🏠 No return_url, redirecting to dashboard`

### Step 2: Check LocalStorage

1. While on the dashboard, open DevTools → Application → Local Storage
2. Look for keys containing:
   - `manaboodle-auth-token`
   - `sb-otxidzozhdnszvqbgzne-auth-token` (Supabase's default key)
3. **If you don't see any auth tokens, the session is not being stored!**

### Step 3: Use Debug Session Page

1. Visit: https://www.manaboodle.com/academic-portal/debug-session
2. This page will show you:
   - Current Supabase session info
   - LocalStorage contents
   - All authentication-related keys
3. Screenshot this page and share with the development team

### Step 4: Test SSO Flow

#### Scenario A: Already Logged In (Should Work)

1. Log into Academic Portal: https://www.manaboodle.com/academic-portal/login
2. After logging in, manually visit:
   ```
   https://www.manaboodle.com/academic-portal/login?return_url=https://rize.vercel.app/login&app_name=RIZE
   ```
3. **Expected**: You should see "Checking authentication..." and then immediately redirect to RIZE with tokens
4. **Current Bug**: Shows login form instead

**Check Console Logs**:
- Look for: `🔍 SSO Check starting...`
- Then: `📦 Session data: { hasSession: true/false }`
- If `hasSession: false`, the session is not being retrieved

#### Scenario B: Not Logged In (Should Show Form)

1. Open an incognito/private window
2. Visit:
   ```
   https://www.manaboodle.com/academic-portal/login?return_url=https://rize.vercel.app/login&app_name=RIZE
   ```
3. **Expected**: Shows login form (correct)
4. Enter credentials and submit
5. **Expected**: After login, redirects to `https://rize.vercel.app/login?sso_token=...&sso_refresh=...`

**Check Console Logs**:
- Look for: `📝 Login form submitted`
- Then: `✅ Login successful, session created`
- Then: `🚀 Redirecting to external app: https://rize.vercel.app...`

### Step 5: Check Supabase Configuration

The issue might be related to how Supabase stores sessions. Check:

1. **Storage Key**: The session should be stored under `manaboodle-auth-token`
2. **Storage Type**: Using `localStorage` (should persist across page loads)
3. **Auto Refresh**: Tokens should auto-refresh when needed

## Common Issues & Solutions

### Issue 1: Session Not Persisting

**Symptom**: Login works, but session disappears on page reload

**Possible Causes**:
- Browser blocking localStorage
- Supabase client not configured for persistence
- Third-party cookies disabled

**Solution**:
```typescript
// In src/lib/supabase.ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,  // ✅ Should be true
    autoRefreshToken: true,
    storageKey: 'manaboodle-auth-token'
  }
})
```

### Issue 2: getSession() Returns Empty

**Symptom**: `supabase.auth.getSession()` returns `{ session: null }` even though user is logged in

**Possible Causes**:
- Session stored under different key
- Supabase client initialized before session is set
- Browser cleared localStorage

**Solution**: Use `getUser()` instead of `getSession()` for server-side checks, or refresh the session:
```typescript
const { data: { session }, error } = await supabase.auth.getSession()
if (!session) {
  // Try refreshing
  await supabase.auth.refreshSession()
}
```

### Issue 3: Cross-Domain Session Issues

**Symptom**: Session works on `manaboodle.com` but not when coming from `rize.vercel.app`

**Possible Causes**:
- Same-site cookie policies
- CORS issues
- Session not accessible across domains

**Solution**: This is why we're using tokens in URL params instead of cookies. The flow should be:
1. Check session on Manaboodle
2. If exists, extract tokens from session
3. Append tokens to redirect URL
4. RIZE receives tokens and validates them

## Expected Console Output (Working Flow)

### When Already Logged In:
```
🔍 SSO Check starting... { returnUrl: "https://rize.vercel.app/login", appName: "RIZE" }
📦 Session data: { hasData: true, hasSession: true, sessionError: undefined, userEmail: "student@harvard.edu" }
✅ Valid session found for: student@harvard.edu
👤 HarvardUser lookup: { found: true, error: undefined }
🚀 Redirecting to: https://rize.vercel.app/login?sso_token=eyJh...&sso_refresh=...
```

### When Not Logged In:
```
🔍 SSO Check starting... { returnUrl: "https://rize.vercel.app/login", appName: "RIZE" }
📦 Session data: { hasData: true, hasSession: false, sessionError: undefined, userEmail: undefined }
❌ No valid session found
✋ Setting isChecking to false, will show login form
```

### After Form Submission:
```
📝 Login form submitted
🔐 Attempting login for: student@harvard.edu
✅ Login successful, session created
🔗 Post-login redirect: { returnUrl: "https://rize.vercel.app/login", appName: "RIZE" }
🎫 Added sso_token to redirect
🔄 Added sso_refresh to redirect
🚀 Redirecting to external app: https://rize.vercel.app/login?sso_token=...
```

## Testing Checklist

- [ ] User can log into Academic Portal normally
- [ ] Session persists after page reload (visit /academic-portal/dashboard)
- [ ] Debug page shows valid session info
- [ ] LocalStorage contains auth tokens
- [ ] Console shows session check logs
- [ ] Already-logged-in users auto-redirect with tokens
- [ ] Not-logged-in users see form, then redirect after login
- [ ] RIZE receives sso_token and sso_refresh in URL

## Next Steps

1. **Test the debug page**: Visit `/academic-portal/debug-session` after logging in
2. **Share console logs**: Open DevTools and capture all logs during SSO flow
3. **Check localStorage**: Verify auth tokens are present
4. **Test both scenarios**: Already logged in AND not logged in

## Contact

If the issue persists after checking all these steps, please share:
1. Screenshot of debug page
2. Console logs from SSO flow
3. Browser and version
4. Whether you're using any privacy/ad-blocking extensions

---

**Last Updated**: October 25, 2025
**Status**: Under Investigation
