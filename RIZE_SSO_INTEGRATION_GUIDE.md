# RIZE SSO Integration Guide

## Quick Start

Manaboodle SSO is ready to use. No configuration needed on Manaboodle side - just follow these steps in your RIZE project.

## SSO Endpoints

- **Login Page**: `https://www.manaboodle.com/sso/login`
- **Token Verification**: `https://www.manaboodle.com/api/sso/verify`

## Integration Steps

### Step 1: Add Middleware

Create `middleware.ts` in your RIZE project root:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MANABOODLE_SSO_URL = 'https://www.manaboodle.com';
const APP_NAME = 'RIZE';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('manaboodle_sso_token')?.value;
  const ssoToken = request.nextUrl.searchParams.get('sso_token');
  
  // Handle SSO callback (user just logged in)
  if (ssoToken) {
    const response = NextResponse.redirect(new URL(request.nextUrl.pathname, request.url));
    
    response.cookies.set('manaboodle_sso_token', ssoToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    const refreshToken = request.nextUrl.searchParams.get('sso_refresh');
    if (refreshToken) {
      response.cookies.set('manaboodle_sso_refresh', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
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
      const loginUrl = new URL(`${MANABOODLE_SSO_URL}/sso/login`);
      loginUrl.searchParams.set('return_url', request.url);
      loginUrl.searchParams.set('app_name', APP_NAME);
      
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('manaboodle_sso_token');
      response.cookies.delete('manaboodle_sso_refresh');
      return response;
    }
    
    const { user } = await verifyResponse.json();
    const response = NextResponse.next();
    
    response.headers.set('x-user-id', user.id);
    response.headers.set('x-user-email', user.email);
    response.headers.set('x-user-name', user.name || '');
    response.headers.set('x-user-class', user.classCode || '');
    
    return response;
    
  } catch (error) {
    console.error('SSO verification error:', error);
    
    const loginUrl = new URL(`${MANABOODLE_SSO_URL}/sso/login`);
    loginUrl.searchParams.set('return_url', request.url);
    loginUrl.searchParams.set('app_name', APP_NAME);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
```

### Step 2: Create Auth Utility

Create `lib/auth.ts` (or `utils/auth.ts`):

```typescript
import { headers } from 'next/headers';

export interface ManaboodleUser {
  id: string;
  email: string;
  name: string;
  classCode: string;
}

export async function getUser(): Promise<ManaboodleUser | null> {
  const headersList = headers();
  
  const id = headersList.get('x-user-id');
  const email = headersList.get('x-user-email');
  const name = headersList.get('x-user-name');
  const classCode = headersList.get('x-user-class');
  
  if (!id || !email) {
    return null;
  }
  
  return {
    id,
    email,
    name: name || '',
    classCode: classCode || ''
  };
}
```

### Step 3: Use in Your Pages

**Server Component Example:**

```typescript
import { getUser } from '@/lib/auth';

export default async function DashboardPage() {
  const user = await getUser();
  
  if (!user) {
    return <div>Not authenticated</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>Class: {user.classCode}</p>
    </div>
  );
}
```

**API Route Example:**

```typescript
import { getUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Your API logic here
  return NextResponse.json({ 
    message: `Hello ${user.name}`,
    data: { userId: user.id }
  });
}
```

## How It Works

### User Flow

1. **User visits RIZE page** (e.g., `/dashboard`)
2. **Middleware checks** for `manaboodle_sso_token` cookie
3. **No token found** → Redirect to:
   ```
   https://www.manaboodle.com/sso/login?return_url=<RIZE_URL>&app_name=RIZE
   ```
4. **SSO page checks for existing Manaboodle session**:
   - **If user already logged into Manaboodle** → Automatically generates tokens and redirects back to RIZE (instant, no login form shown)
   - **If user not logged in** → Shows login form
5. **User logs in** at Manaboodle with Harvard .edu credentials (if needed)
6. **Manaboodle redirects back** to:
   ```
   <RIZE_URL>?sso_token=<jwt_token>&sso_refresh=<refresh_token>
   ```
7. **Middleware intercepts** callback, stores tokens in cookies, redirects to clean URL
8. **Future requests** → Middleware validates token with Manaboodle
9. **User data available** in headers: `x-user-id`, `x-user-email`, `x-user-name`, `x-user-class`

### Token Lifecycle

- **Access Token**: Valid for 7 days, stored in `manaboodle_sso_token` cookie
- **Refresh Token**: Valid for 30 days, stored in `manaboodle_sso_refresh` cookie
- **Validation**: Every request verifies token with `/api/sso/verify`
- **Expiry**: Invalid tokens trigger re-authentication

## Testing

### Manual Test

1. Visit this URL (replace with your RIZE URL):
   ```
   https://www.manaboodle.com/sso/login?return_url=https%3A%2F%2Fyour-rize-url.com%2Fdashboard&app_name=RIZE
   ```

2. Login with Harvard .edu credentials

3. You should be redirected back to RIZE with tokens in URL

### End-to-End Test

1. Clear all cookies
2. Visit any protected RIZE page
3. Should redirect to Manaboodle SSO
4. Login successfully
5. Should return to RIZE, authenticated
6. Refresh page - should stay authenticated (no redirect)

## Troubleshooting

### Issue: Stays on Manaboodle after login

**Cause**: Using wrong login endpoint

**Solution**: Ensure you're redirecting to `/sso/login` NOT `/academic-portal/login`

### Issue: "Not a Harvard Academic Portal user" error

**Cause**: User not registered in Manaboodle

**Solution**: User must first sign up at:
```
https://www.manaboodle.com/academic-portal/signup
```

They need:
- Valid .edu email address
- Class code (T565, T566, or T595)

### Issue: Token verification fails

**Possible causes:**
- Token expired (7 days)
- Invalid token format
- Network error reaching Manaboodle

**Solution**: 
- Check middleware logs for error details
- Clear cookies and re-authenticate
- Verify MANABOODLE_SSO_URL is correct

### Issue: Infinite redirect loop

**Cause**: Middleware matcher catching static files or API routes

**Solution**: Update `config.matcher` to exclude your API routes:
```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
```

## Development vs Production

### Development (Codespaces/Localhost)

Set `MANABOODLE_SSO_URL` in middleware:
```typescript
const MANABOODLE_SSO_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'  // If running Manaboodle locally
  : 'https://www.manaboodle.com';
```

Cookies will use `secure: false` in development.

### Production

- Cookies automatically set to `secure: true`
- HTTPS enforced
- Set environment variables in Vercel/deployment platform

## User Data Schema

After successful authentication, you can access:

```typescript
interface ManaboodleUser {
  id: string;          // UUID: "123e4567-e89b-12d3-a456-426614174000"
  email: string;       // "student@harvard.edu"
  name: string;        // "John Smith"
  classCode: string;   // "T565" | "T566" | "T595"
}
```

Access via headers in Server Components/API routes:
- `x-user-id`
- `x-user-email`
- `x-user-name`
- `x-user-class`

## Security Notes

### Current Implementation (MVP)

- ✅ JWT tokens with expiration
- ✅ httpOnly cookies (XSS protection)
- ✅ Server-side token verification
- ✅ HTTPS in production
- ✅ .edu email validation

### Before Production (TODO)

- [ ] Whitelist allowed return URLs per app
- [ ] Add CSRF protection (state parameter)
- [ ] Rate limiting on token endpoints
- [ ] Audit logging
- [ ] Token rotation/refresh mechanism
- [ ] App registration system

## API Reference

### POST /api/sso/token

**Request:**
```json
{
  "email": "student@harvard.edu",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "expires_at": 1698765432,
  "user": {
    "id": "123e4567-...",
    "email": "student@harvard.edu",
    "name": "John Smith",
    "classCode": "T565"
  }
}
```

**Response (Error):**
```json
{
  "error": "Invalid credentials"
}
```

### GET /api/sso/verify

**Request Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response (Success):**
```json
{
  "valid": true,
  "user": {
    "id": "123e4567-...",
    "email": "student@harvard.edu",
    "name": "John Smith",
    "classCode": "T565",
    "createdAt": "2025-10-01T12:00:00Z"
  }
}
```

**Response (Error):**
```json
{
  "valid": false,
  "error": "Invalid or expired token"
}
```

## FAQ

**Q: Do I need to register RIZE with Manaboodle?**
A: Not for testing. For production, yes - to whitelist callback URLs and prevent abuse.

**Q: Can users access RIZE without a Harvard email?**
A: No, currently only .edu emails registered in Manaboodle Academic Portal can authenticate.

**Q: What happens after December when Academic Portal closes?**
A: The SSO system will continue working. Manaboodle will add a general signup flow (no .edu requirement). No changes needed in RIZE.

**Q: Can I use this for mobile apps?**
A: The current implementation is web-only. For mobile, you'd need to implement OAuth 2.0 authorization code flow with PKCE.

**Q: How do I logout users?**
A: Delete the cookies:
```typescript
// In API route or server action
cookies().delete('manaboodle_sso_token');
cookies().delete('manaboodle_sso_refresh');
```

**Q: Can I customize the login page?**
A: Not from RIZE side. The login page is hosted on Manaboodle. It shows Harvard branding and the requesting app name.

## Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review middleware logs for errors
3. Test the manual flow with the provided URL
4. Contact Manaboodle team with:
   - Error message
   - Steps to reproduce
   - Browser console logs
   - Network tab showing SSO requests

## Example: Complete RIZE Implementation

Minimal working example:

```
rize/
├── middleware.ts              # SSO middleware (from Step 1)
├── lib/
│   └── auth.ts               # User helper (from Step 2)
└── app/
    ├── dashboard/
    │   └── page.tsx          # Protected page
    └── api/
        └── startups/
            └── route.ts      # Protected API route
```

**dashboard/page.tsx:**
```typescript
import { getUser } from '@/lib/auth';

export default async function Dashboard() {
  const user = await getUser();
  return <h1>Welcome, {user?.name}!</h1>;
}
```

**api/startups/route.ts:**
```typescript
import { getUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Fetch startups for this user
  const startups = await db.startups.findMany({
    where: { userId: user.id }
  });
  
  return NextResponse.json({ startups });
}
```

That's it! Your app is now protected with Manaboodle SSO.
