# 🚀 Bypass Rate Limit - Manual User Creation

## Create Test User Directly in Supabase

Since you're hitting rate limits, let's create a test user directly in the database:

### Method 1: Use Supabase Dashboard UI

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add user"** button (top right)
3. Select **"Create new user"**
4. Fill in:
   - **Email:** your-test@harvard.edu
   - **Password:** TestPassword123!
   - **Auto Confirm User:** YES (check this box!)
5. Click **"Create user"**
6. User is created instantly, no rate limit!

### Method 2: Use SQL Editor

Run this in **Supabase Dashboard** → **SQL Editor**:

```sql
-- Create user in auth.users (Supabase Auth)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
)
VALUES (
  gen_random_uuid(),
  'test@harvard.edu', -- Change this to your email
  crypt('YourPassword123', gen_salt('bf')), -- Change password here
  NOW(), -- Email confirmed immediately
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Test User"}',
  false,
  'authenticated'
);

-- Get the user ID we just created
DO $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = 'test@harvard.edu';
  
  -- Create Harvard-specific data in HarvardUser table
  INSERT INTO "HarvardUser" (
    id,
    email,
    name,
    "classCode",
    affiliation
  ) VALUES (
    user_id,
    'test@harvard.edu',
    'Test User',
    'T565',
    'student'
  );
END $$;
```

**Important:** Change `test@harvard.edu` and `YourPassword123` to your actual test credentials!

### Then Test Login

1. Go to https://manaboodle.com/academic-portal/login
2. Sign in with:
   - Email: test@harvard.edu (or whatever you used)
   - Password: YourPassword123 (or whatever you used)
3. Should work immediately! ✅

---

## 🎯 Recommended: Disable Email Confirmation

The **easiest** solution is to turn off email confirmation in Supabase:

1. **Supabase Dashboard** → **Authentication** → **Providers** → **Email**
2. **Toggle OFF:** "Confirm email"
3. **Save**

Benefits:
- ✅ No rate limits
- ✅ Instant account creation
- ✅ Perfect for testing
- ✅ Can still enable for production later

---

## 📊 Understanding the Rate Limits

| Limit Type | Threshold | Window | What You Hit |
|------------|-----------|--------|--------------|
| Per Email | 4 signups | 1 hour | ✅ (first) |
| Per IP | 30 requests | 1 hour | ✅ (now) |
| Global | Depends on tier | 1 hour | ❌ |

You've made too many registration attempts from the same IP address.

---

## ✅ Next Steps

**Choose ONE:**

1. **FASTEST:** Disable email confirmation (2 min) → Register normally
2. **MANUAL:** Create user via SQL (5 min) → Login immediately  
3. **WAIT:** Come back in 1 hour → Try again
4. **NETWORK:** Use mobile hotspot → Register from different IP

**I recommend #1** (disable email confirmation) for testing now, then re-enable for production later!

Let me know which option you'd like to try! 🚀
