# NextAuth Removal Documentation

**Date:** December 6, 2025  
**Reason:** NextAuth was not actually being used; caused CLIENT_FETCH_ERROR after Next.js 15.5.7 upgrade  
**Migration Status:** App uses Supabase Auth exclusively

## What Was Removed

### Dependencies (package.json)
```json
"next-auth": "^4.24.11",
"@next-auth/prisma-adapter": "^1.0.7"
```

### Files Modified

#### 1. `src/components/AuthProvider.tsx` (BEFORE)
```tsx
'use client'

import { SessionProvider } from 'next-auth/react'

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <SessionProvider>{children}</SessionProvider>
}
```

#### 2. `src/app/layout.tsx` (BEFORE)
Wrapped entire app with `<AuthProvider>` which used NextAuth's SessionProvider.

### Environment Variables Referenced
- `NEXTAUTH_URL` - Used only as base URL reference in `/api/forgot-password` and `/api/diagnostics`
- `NEXTAUTH_SECRET` - Only checked in `/api/diagnostics`, never actually used for auth

## What NextAuth Was NOT Doing

NextAuth was **not** handling any actual authentication in this app:

1. **No API routes:** No `/api/auth/[...nextauth]` route existed
2. **No session management:** All sessions managed by Supabase
3. **No sign in/out:** All auth flows use `supabase.auth.signInWithPassword()`
4. **No providers:** No OAuth, no credentials provider configured
5. **No database adapter:** PrismaAdapter installed but never configured

## Actual Auth System: Supabase

All authentication is handled by Supabase:

### Login Examples
```typescript
// Academic portal login
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
})

// Session check
const { data: { session } } = await supabase.auth.getSession()

// SSO token auth
const { data: { session }, error } = await supabase.auth.signInWithPassword({
  email: user.email,
  password: `sso_${user.id}_${Date.now()}`
})
```

### Files Using Supabase Auth
- `/src/app/sso/login/page.tsx`
- `/src/app/academic-portal/login/page.tsx`
- `/src/app/academic-portal/admin/login/page.tsx`
- `/src/app/academic-portal/admin/page.tsx`
- `/src/app/academic-portal/debug-session/page.tsx`
- `/src/app/api/sso/token/route.ts`

## Error That Prompted Removal

After upgrading to Next.js 15.5.7 (CVE-2025-55182 patch), NextAuth's SessionProvider tried to fetch from `/api/auth/session`:

```
[next-auth][error][CLIENT_FETCH_ERROR]
https://next-auth.js.org/errors#client_fetch_error
"Unexpected token '<', "<!DOCTYPE "... is not valid JSON"
```

This error occurred because:
1. SessionProvider expected NextAuth API routes at `/api/auth/*`
2. Those routes never existed (Supabase handles auth)
3. Next.js 15 returned 404 HTML page, SessionProvider expected JSON
4. Error appeared in console on every page load

## How to Restore NextAuth (If Ever Needed)

### 1. Reinstall Dependencies
```bash
npm install next-auth@^4.24.11 @next-auth/prisma-adapter@^1.0.7
```

### 2. Restore AuthProvider.tsx
```tsx
'use client'

import { SessionProvider } from 'next-auth/react'

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <SessionProvider>{children}</SessionProvider>
}
```

### 3. Create NextAuth API Route
Create `/src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import CredentialsProvider from "next-auth/providers/credentials"

const prisma = new PrismaClient()

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Add your auth logic here
        return null
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      return session
    },
    async jwt({ token, user }) {
      return token
    }
  },
  pages: {
    signIn: '/academic-portal/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
```

### 4. Restore Layout Wrapper
In `src/app/layout.tsx`, wrap with `<AuthProvider>` as before.

## Migration Notes

**Do NOT restore NextAuth unless:**
1. You need to switch away from Supabase
2. You need NextAuth-specific features (OAuth providers, JWT customization)
3. You have a specific reason to run dual auth systems

**Current setup (Supabase only) provides:**
- Email/password authentication ✅
- Session management ✅
- SSO integration ✅
- Email verification ✅
- Password reset ✅
- Row Level Security (RLS) ✅

## References

- NextAuth docs: https://next-auth.js.org
- Supabase Auth docs: https://supabase.com/docs/guides/auth
- CVE that triggered upgrade: CVE-2025-55182
- Next.js version at removal: 15.5.7
