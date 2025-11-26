# Database Migration Instructions

## ⚠️ IMPORTANT: Your Existing Users Are Safe!

This migration will:
- ✅ Keep ALL existing user data (emails, passwords, names, class codes)
- ✅ Auto-generate usernames from existing email addresses
- ✅ Mark existing users as `emailVerified: true` (grandfathered in)
- ✅ Set correct `accessType` based on email domain
- ✅ **SSO WILL CONTINUE TO WORK** - no changes to authentication flow

## Before You Start

1. **Check your current users:**
   - Go to Supabase Dashboard → SQL Editor
   - Run: `SELECT * FROM "HarvardUser";`
   - Take a screenshot or note down the emails

2. **Find your admin email:**
   - What's your sesame.org email address?
   - You'll need to add it in Step 11 of the migration

## Migration Steps

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project: https://supabase.com/dashboard
2. Click "SQL Editor" in left sidebar
3. Click "New query"

### Step 2: Run the Migration
1. Open file: `/prisma/migrations/SAFE_MIGRATION_EXISTING_USERS.sql`
2. Copy the entire content
3. Paste into Supabase SQL Editor
4. **BEFORE running:** Update line with your email:
   ```sql
   -- Change this line (Step 11):
   VALUES ('your-actual-email@sesame.org', 'super_admin')
   -- To your real email:
   VALUES ('manabu@sesame.org', 'super_admin')
   ```
5. Click "Run" button

### Step 3: Verify Migration Success
The script includes verification queries at the end. Check:
- ✅ All users have usernames
- ✅ All users have correct accessType (harvard/sesame/guest)
- ✅ No duplicate usernames
- ✅ Your admin email is in AdminUser table

### Step 4: Test Login
1. Try logging in with your existing email/password
2. Should work exactly as before
3. SSO to Clusters/Runway/PPP should still work

## What Gets Generated

### Usernames from Emails:
- `john.smith@law.harvard.edu` → `john_smith`
- `jane_doe@sesame.org` → `jane_doe`
- `bob.johnson2@edu.harvard.edu` → `bob_johnson2`

If duplicate usernames exist:
- First user: `john_smith`
- Second user: `john_smith_2`
- Third user: `john_smith_3`

### Access Types:
- Emails ending with `harvard.edu` → `accessType: 'harvard'`
- Emails ending with `sesame.org` → `accessType: 'sesame'`
- Everything else → `accessType: 'guest'`

### Email Verified:
- All existing users → `emailVerified: true` (grandfathered)
- New signups → `emailVerified: false` (must verify)

## After Migration

### Your users can:
1. Log in with existing email/password (nothing changes for them)
2. See their auto-generated username in profile (future feature)
3. Use SSO to access Clusters, Runway, PPP (exactly as before)

### New signups will:
1. Choose their own username
2. Verify email before access
3. Auto-approved if harvard.edu or sesame.org
4. Require guest pass approval if other domains

## If Something Goes Wrong

### Rollback:
At the bottom of `SAFE_MIGRATION_EXISTING_USERS.sql` is a rollback script:
```sql
-- Uncomment and run this to undo everything:
ALTER TABLE "HarvardUser" DROP COLUMN IF EXISTS "username";
-- (etc.)
```

### Get Help:
- Check Supabase logs for error messages
- Your data is NOT deleted, only new columns added
- Existing auth.users table is untouched

## Testing Checklist

After migration, test these:
- [ ] Existing users can log in
- [ ] SSO works (try accessing Clusters with return_url)
- [ ] New harvard.edu signup works
- [ ] New sesame.org signup works
- [ ] Other domains trigger guest request flow
- [ ] Username appears somewhere (once you add profile page)

## Need Help?

1. Check Supabase Dashboard → Logs
2. Run verification queries from migration script
3. Check this error: `SELECT * FROM "HarvardUser" WHERE username IS NULL;` (should be empty)
