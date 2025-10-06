# Quick Reference - Current State

## What's Working ✅
- Harvard crimson theme on Clusters landing page
- All visual design elements
- Vercel deployments (build succeeds)
- Environment variables set correctly

## What's Not Working ❌
- Database connection from Vercel to Supabase
- User registration (500 Internal Server Error)
- User login (no response)

## Current Configuration

### Vercel Environment Variables (CONFIRMED SET)
```
DATABASE_URL=postgresql://postgres:9I1aLwKJiJYbMOLa@db.otxidzozhdnszvqbgzne.supabase.co:5432/postgres?schema=public
NEXTAUTH_URL=https://manaboodle.com
NEXTAUTH_SECRET=harvard-portal-secret-key-change-in-production
NEXT_PUBLIC_SUPABASE_URL=https://otxidzozhdnszvqbgzne.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RESEND_API_KEY=re_eDKcVBgd_NAk563xtrCvSkxECV38DvcV6
OPENAI_API_KEY=sk-proj-TjRbJA1znmq0b6bi90J45...
```

### Supabase Database
- **Project:** otxidzozhdnszvqbgzne
- **Password:** 9I1aLwKJiJYbMOLa
- **Region:** us-east-1
- **Tables Created:** ✅ HarvardUser, PasswordResetToken, Account, Session, User, VerificationToken

### GitHub
- **Repo:** manabunagaoka/manaboodle
- **Branch:** main
- **Latest Commit:** ae1e521 "Switch to direct Supabase connection without pooler"

## Diagnostic Endpoint
https://manaboodle.com/api/diagnostics

**Last Response:**
```json
{
  "DATABASE_URL": { "exists": true, "length": 124 },
  "NEXTAUTH_URL": { "exists": true },
  "NEXTAUTH_SECRET": { "exists": true },
  "database": {
    "connected": false,
    "error": "Can't reach database server..."
  }
}
```

## Recommended Tomorrow

**FASTEST SOLUTION:** Switch to Vercel Postgres (20 minutes)
**CLEANEST SOLUTION:** Use Supabase Auth instead of NextAuth (1 hour)
**DEBUG PATH:** Check Supabase connection pooling settings (30 minutes)

See AUTHENTICATION_TROUBLESHOOTING_PLAN.md for full details.
