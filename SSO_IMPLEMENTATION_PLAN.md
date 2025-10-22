# SSO Implementation Plan for Manaboodle Academic Portal

## Current State
- Supabase Auth with JWT tokens
- HarvardUser table with .edu verification
- Separate apps: Clusters, Runway (future apps planned)
- Workaround: Vercel share links for Clusters

## Goal
Transform Academic Portal into SSO provider that:
1. Centralizes user registration/authentication
2. Allows independent apps to verify users
3. Maintains .edu verification requirement
4. Provides seamless cross-app experience

---

## Phase 1: JWT-Based SSO (Immediate - 1-2 days)

### Architecture Overview
```
User → Academic Portal (Login) → JWT Token → Cookie
                                      ↓
                        Other Apps verify via API
                                      ↓
                              Access granted
```

### Implementation Steps

#### Step 1: Create Auth Token API
**File:** `/src/app/api/auth/token/route.ts`

Purpose: Generate portable auth tokens for external apps

```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const supabase = createClient();
  
  // Authenticate user
  const { data: { session }, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error || !session) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  
  // Verify Harvard user
  const { data: harvardUser } = await supabase
    .from('HarvardUser')
    .select('*')
    .eq('email', email)
    .single();
    
  if (!harvardUser) {
    return NextResponse.json({ error: 'Not a Harvard user' }, { status: 403 });
  }
  
  // Return JWT and user info
  return NextResponse.json({
    token: session.access_token,
    refresh_token: session.refresh_token,
    user: {
      id: harvardUser.id,
      email: harvardUser.email,
      name: harvardUser.name,
      classCode: harvardUser.classCode
    }
  });
}
```

#### Step 2: Create Auth Verification API
**File:** `/src/app/api/auth/verify/route.ts`

Purpose: Allow external apps to verify tokens

```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
  
  const token = authHeader.substring(7);
  const supabase = createClient();
  
  // Verify token with Supabase
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
  
  // Get Harvard user details
  const { data: harvardUser } = await supabase
    .from('HarvardUser')
    .select('id, email, name, classCode, createdAt')
    .eq('email', user.email)
    .single();
    
  if (!harvardUser) {
    return NextResponse.json({ valid: false }, { status: 403 });
  }
  
  return NextResponse.json({
    valid: true,
    user: harvardUser
  });
}
```

#### Step 3: Create SSO Login Page
**File:** `/src/app/sso/login/page.tsx`

Purpose: Centralized login for all apps

```typescript
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SSOLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('return_url') || '/';
  const appName = searchParams.get('app_name') || 'Manaboodle';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      
      const { token, user } = await response.json();
      
      // Redirect back to app with token
      const redirectUrl = new URL(returnUrl);
      redirectUrl.searchParams.set('token', token);
      window.location.href = redirectUrl.toString();
      
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">
          Sign in to {appName}
        </h1>
        <p className="text-gray-600 mb-6">
          Use your Harvard Academic Portal credentials
        </p>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Harvard Email (.edu)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
        
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <a href="/academic-portal/signup" className="text-blue-600">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
```

#### Step 4: Update Clusters App
**File:** `clusters-app/middleware.ts` (in Clusters repo)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('manaboodle_token')?.value ||
                request.nextUrl.searchParams.get('token');
  
  // If token in URL, save to cookie
  if (request.nextUrl.searchParams.get('token')) {
    const response = NextResponse.redirect(request.nextUrl.pathname);
    response.cookies.set('manaboodle_token', token!, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    return response;
  }
  
  // No token? Redirect to SSO login
  if (!token) {
    const loginUrl = new URL('https://manaboodle.com/sso/login');
    loginUrl.searchParams.set('return_url', request.url);
    loginUrl.searchParams.set('app_name', 'Clusters');
    return NextResponse.redirect(loginUrl);
  }
  
  // Verify token with Manaboodle
  const verifyResponse = await fetch('https://manaboodle.com/api/auth/verify', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!verifyResponse.ok) {
    // Invalid token, redirect to login
    const loginUrl = new URL('https://manaboodle.com/sso/login');
    loginUrl.searchParams.set('return_url', request.url);
    loginUrl.searchParams.set('app_name', 'Clusters');
    return NextResponse.redirect(loginUrl);
  }
  
  // Token valid, attach user to request
  const { user } = await verifyResponse.json();
  const response = NextResponse.next();
  response.headers.set('x-user-id', user.id);
  response.headers.set('x-user-email', user.email);
  
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
```

---

## Phase 2: OAuth 2.0 Provider (Future - 1-2 weeks)

### Why Upgrade?
- Industry standard security
- Better for mobile apps
- Proper scope/permission management
- Easier third-party integrations

### Key Components to Build:
1. Client registration system
2. Authorization endpoint (`/api/oauth/authorize`)
3. Token endpoint (`/api/oauth/token`)
4. User consent screen
5. Scope management (email, profile, class_info)

### Libraries to Use:
- `node-oauth2-server` or `oauth2orize`
- Or use Supabase's built-in OAuth features

---

## Security Considerations

### Current Setup:
✅ HTTPS everywhere
✅ JWT tokens with expiry
✅ RLS policies on database
✅ .edu email verification

### Additional for SSO:
- [ ] Rate limiting on auth endpoints
- [ ] CORS configuration for external apps
- [ ] Token rotation/refresh mechanism
- [ ] Audit logging for auth events
- [ ] CSRF protection
- [ ] Secure cookie flags (httpOnly, secure, sameSite)

---

## Migration Path for Existing Apps

### Clusters:
1. Remove Vercel share link workaround
2. Add middleware for SSO check
3. Store token in httpOnly cookie
4. Redirect to SSO login when needed

### Runway:
Already using Supabase auth - can continue or migrate to SSO

### Future Apps:
All new apps use SSO from day 1

---

## Benefits of This Approach

1. **Single Registration** - Users sign up once at Academic Portal
2. **Verified Identity** - .edu verification applies to all apps
3. **Centralized Control** - Manage users, classes, permissions in one place
4. **Independent Apps** - Each app can be deployed separately
5. **Scalable** - Easy to add new apps without duplicating auth code
6. **Secure** - Industry-standard JWT validation

---

## Next Steps

### To Implement Phase 1 Now:
1. Create the three API endpoints (token, verify)
2. Create SSO login page
3. Test with Clusters app
4. Deploy to production

### Timeline:
- Day 1: Build APIs and login page
- Day 2: Test and integrate with Clusters
- Day 3: Deploy and monitor

### To Plan Phase 2 Later:
- Research OAuth 2.0 libraries
- Design client registration UI
- Build consent/permission screens
- Implement OAuth flow

Would you like me to implement Phase 1 right now?
