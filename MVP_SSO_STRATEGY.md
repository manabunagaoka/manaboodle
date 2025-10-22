# MVP SSO Strategy: Non-Breaking Implementation

## Objective
Add SSO capability to Manaboodle **WITHOUT** modifying the existing Academic Portal signup/login flow, enabling Clusters and new tool to authenticate seamlessly during Harvard MVP testing (Oct - Dec 2025).

---

## Current State (Don't Touch! ✋)

### Academic Portal Flow (KEEP AS-IS)
```
Student → /academic-portal/signup
        → .edu verification + class code
        → Creates HarvardUser in Supabase
        → Email verification
        → /academic-portal/login
        → Access Runway tool
```

**Files to AVOID modifying:**
- `/src/app/academic-portal/signup/page.tsx`
- `/src/app/academic-portal/login/page.tsx`
- `/src/app/api/register/route.ts`
- `/src/app/academic-portal/runway/*`

**Why:** These are tested, working, and students are already using them. Breaking these = disrupting Harvard MVP.

---

## New SSO Layer (Add Alongside)

### SSO Flow for External Apps
```
User → Clusters/New Tool (unauthenticated)
     → Redirect to manaboodle.com/sso/login?return_url=...
     → User logs in with existing .edu credentials
     → Gets JWT token
     → Redirected back to app with token
     → App validates token with Manaboodle API
     → Access granted
```

### Key Principle: **Parallel Systems**
- Academic Portal: Existing flow (Supabase Auth + HarvardUser table)
- SSO: New endpoints that READ from same HarvardUser table
- Students use same credentials for both
- No migration needed

---

## Implementation Plan

### Phase 1: SSO Endpoints (1 day)

#### Step 1.1: Token Generation Endpoint
**File:** `/src/app/api/sso/token/route.ts` (NEW)

```typescript
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Authenticate with Supabase
    const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Invalid credentials' }, 
        { status: 401 }
      );
    }
    
    // Verify user is in HarvardUser table
    const { data: harvardUser, error: userError } = await supabase
      .from('HarvardUser')
      .select('id, email, name, classCode, createdAt')
      .eq('email', email)
      .single();
      
    if (userError || !harvardUser) {
      return NextResponse.json(
        { error: 'Not a Harvard Academic Portal user' }, 
        { status: 403 }
      );
    }
    
    return NextResponse.json({
      success: true,
      token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
      user: {
        id: harvardUser.id,
        email: harvardUser.email,
        name: harvardUser.name,
        classCode: harvardUser.classCode
      }
    });
    
  } catch (error) {
    console.error('SSO token error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// CORS for external apps
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

#### Step 1.2: Token Verification Endpoint
**File:** `/src/app/api/sso/verify/route.ts` (NEW)

```typescript
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { valid: false, error: 'Missing authorization header' }, 
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    
    // Verify token with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { valid: false, error: 'Invalid or expired token' }, 
        { status: 401 }
      );
    }
    
    // Get Harvard user details
    const { data: harvardUser, error: userError } = await supabase
      .from('HarvardUser')
      .select('id, email, name, classCode, createdAt')
      .eq('email', user.email)
      .single();
      
    if (userError || !harvardUser) {
      return NextResponse.json(
        { valid: false, error: 'Not a Harvard user' }, 
        { status: 403 }
      );
    }
    
    return NextResponse.json({
      valid: true,
      user: harvardUser
    });
    
  } catch (error) {
    console.error('SSO verify error:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// CORS for external apps
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

---

### Phase 2: SSO Login Page (1 day)

**File:** `/src/app/sso/login/page.tsx` (NEW)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SSOLogin() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('return_url');
  const appName = searchParams.get('app_name') || 'Application';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!returnUrl) {
      setError('Missing return_url parameter');
    }
  }, [returnUrl]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/sso/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Redirect back to requesting app with token
      const redirectUrl = new URL(returnUrl!);
      redirectUrl.searchParams.set('sso_token', data.token);
      redirectUrl.searchParams.set('sso_refresh', data.refresh_token);
      window.location.href = redirectUrl.toString();
      
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sign in to {appName}
            </h1>
            <p className="text-sm text-gray-600">
              Use your Harvard Academic Portal credentials
            </p>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Harvard Email (.edu)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your.email@harvard.edu"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !returnUrl}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a 
                href="/academic-portal/signup" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up here
              </a>
            </p>
            <p className="text-xs text-gray-500">
              By signing in, you'll be returned to {appName}
            </p>
          </div>
        </div>
        
        {/* Security Notice */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            🔒 Secured by Manaboodle Academic Portal
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

### Phase 3: External App Integration Template

**File:** `external-apps/sso-middleware-template.ts`

This is reusable code for Clusters and your new tool:

```typescript
// middleware.ts template for any Next.js app using Manaboodle SSO

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MANABOODLE_SSO_URL = 'https://manaboodle.com';
const APP_NAME = 'Clusters'; // Change per app

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('manaboodle_sso_token')?.value;
  const ssoToken = request.nextUrl.searchParams.get('sso_token');
  
  // Handle SSO callback (user just logged in)
  if (ssoToken) {
    const response = NextResponse.redirect(new URL(request.nextUrl.pathname, request.url));
    
    // Store tokens in cookies
    response.cookies.set('manaboodle_sso_token', ssoToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    const refreshToken = request.nextUrl.searchParams.get('sso_refresh');
    if (refreshToken) {
      response.cookies.set('manaboodle_sso_refresh', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });
    }
    
    return response;
  }
  
  // No token? Redirect to SSO login
  if (!token) {
    const loginUrl = new URL(`${MANABOODLE_SSO_URL}/sso/login`);
    loginUrl.searchParams.set('return_url', request.url);
    loginUrl.searchParams.set('app_name', APP_NAME);
    return NextResponse.redirect(loginUrl);
  }
  
  // Verify token with Manaboodle
  try {
    const verifyResponse = await fetch(`${MANABOODLE_SSO_URL}/api/sso/verify`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      },
      cache: 'no-store'
    });
    
    if (!verifyResponse.ok) {
      // Token invalid, clear cookies and redirect to login
      const loginUrl = new URL(`${MANABOODLE_SSO_URL}/sso/login`);
      loginUrl.searchParams.set('return_url', request.url);
      loginUrl.searchParams.set('app_name', APP_NAME);
      
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('manaboodle_sso_token');
      response.cookies.delete('manaboodle_sso_refresh');
      return response;
    }
    
    // Token valid, attach user info to headers
    const { user } = await verifyResponse.json();
    const response = NextResponse.next();
    
    response.headers.set('x-user-id', user.id);
    response.headers.set('x-user-email', user.email);
    response.headers.set('x-user-name', user.name);
    response.headers.set('x-user-class', user.classCode);
    
    return response;
    
  } catch (error) {
    console.error('SSO verification error:', error);
    
    // On error, redirect to login
    const loginUrl = new URL(`${MANABOODLE_SSO_URL}/sso/login`);
    loginUrl.searchParams.set('return_url', request.url);
    loginUrl.searchParams.set('app_name', APP_NAME);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
```

---

## Testing Strategy

### Test 1: Existing Users Work
1. Student logs into Academic Portal normally
2. Accesses Runway (should work as before)
3. Goes to Clusters → redirected to SSO login
4. Uses same .edu credentials → gets access
5. **Expected:** No disruption, seamless flow

### Test 2: New Users Work
1. New student signs up via Academic Portal
2. Creates account with .edu + class code
3. Completes email verification
4. Goes to Clusters → SSO login works immediately
5. **Expected:** Single signup, works everywhere

### Test 3: Invalid Users Rejected
1. Try to access Clusters without login
2. SSO redirects to login page
3. Try with non-Harvard email → rejected
4. Try with wrong password → rejected
5. **Expected:** Only verified Harvard users get access

---

## Deployment Plan

### Day 1: Build SSO Endpoints
- [ ] Create `/api/sso/token/route.ts`
- [ ] Create `/api/sso/verify/route.ts`
- [ ] Test endpoints with curl/Postman
- [ ] Deploy to Vercel (no user-facing changes yet)

### Day 2: Build SSO Login Page
- [ ] Create `/sso/login/page.tsx`
- [ ] Test with return_url parameter
- [ ] Verify token flow works
- [ ] Deploy to Vercel

### Day 3: Integrate Clusters
- [ ] Add middleware to Clusters repo
- [ ] Remove Vercel share link workaround
- [ ] Test full flow: Clusters → SSO → back to Clusters
- [ ] Deploy Clusters with SSO

### Day 4: Integrate New Tool
- [ ] Copy middleware template to new tool
- [ ] Update APP_NAME constant
- [ ] Test authentication flow
- [ ] Deploy new tool

### Day 5: Monitor & Document
- [ ] Monitor logs for errors
- [ ] Create SSO integration guide
- [ ] Document for future apps
- [ ] Update Harvard MVP docs

---

## Advantages of This Approach

✅ **Zero Risk to Academic Portal**
- No changes to existing signup/login
- Students experience no disruption
- Runway continues working as-is

✅ **Seamless User Experience**
- One signup (Academic Portal)
- One set of credentials
- Works across all apps

✅ **Easy to Add New Apps**
- Copy middleware template
- Change APP_NAME
- Deploy
- Done!

✅ **Maintains Security**
- .edu verification still required
- Class code validation intact
- JWT tokens with expiry
- Can revoke access centrally

✅ **MVP Testing Friendly**
- Quick to implement (3-4 days)
- Easy to debug
- Can monitor all auth in one place
- Can extend/modify without breaking existing

---

## Timeline for MVP

**Week 1 (Oct 22-28):**
- Implement SSO endpoints + login page
- Test with existing Academic Portal users

**Week 2 (Oct 29 - Nov 4):**
- Integrate Clusters with SSO
- Deploy and test with students

**Week 3 (Nov 5-11):**
- Build new tool with SSO from day 1
- Monitor usage and fix issues

**Nov-Dec:**
- Students use all tools seamlessly
- Collect feedback
- Iterate if needed

---

## Next Steps

Ready to implement? I can:

1. **Start with endpoints** (safest, won't affect users)
2. **Build SSO login page** (still invisible to current users)
3. **Test with Clusters** (finally remove that share link!)
4. **Create integration guide** (for your new tool)

What would you like me to build first?
