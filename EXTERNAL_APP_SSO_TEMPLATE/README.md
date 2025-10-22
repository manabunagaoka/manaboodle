# Manaboodle SSO Integration Guide
## For External Apps (Ranking Tool, Clusters, etc.)

This guide shows you how to integrate your Next.js app with Manaboodle's SSO system in **5 simple steps**.

---

## ✅ Prerequisites

- Next.js 13+ app with App Router
- Your app deployed and accessible via HTTPS
- Students already signed up in Manaboodle Academic Portal

---

## 🚀 Quick Start (5 Steps)

### Step 1: Copy Middleware File

Copy `middleware.ts` from `EXTERNAL_APP_SSO_TEMPLATE/` to the **root** of your Next.js project:

```bash
your-ranking-tool/
├── middleware.ts          ← Copy here
├── src/
│   ├── app/
│   └── utils/
├── package.json
└── next.config.js
```

### Step 2: Configure App Name

Open `middleware.ts` and update the `APP_NAME` constant:

```typescript
// Line 10 in middleware.ts
const APP_NAME = 'Ranking Tool'; // Change to your app name
```

This name will appear on the SSO login page: "Sign in to **Ranking Tool**"

### Step 3: Copy Auth Utilities (Optional but Recommended)

Copy `utils/auth.ts` to your project:

```bash
your-ranking-tool/
└── src/
    └── utils/
        └── auth.ts        ← Copy here
```

This provides a simple `getUser()` function to access authenticated user data.

### Step 4: Use Authentication in Your App

**In Server Components:**
```typescript
// src/app/page.tsx
import { getUser } from '@/utils/auth';

export default async function HomePage() {
  const user = await getUser();
  
  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <p>Class: {user?.classCode}</p>
    </div>
  );
}
```

**In API Routes:**
```typescript
// src/app/api/rankings/route.ts
import { getUser } from '@/utils/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Your API logic here
  return NextResponse.json({ rankings: [...] });
}
```

### Step 5: Deploy and Test

1. **Deploy your app** to Vercel/wherever
2. **Visit your app URL** (e.g., `https://ranking-tool.vercel.app`)
3. **Automatic redirect** to Manaboodle SSO login
4. **Login with Harvard credentials** (.edu email + password)
5. **Redirected back** to your app - authenticated!

---

## 🎯 How It Works

```
┌─────────────────────────────────────────────────────────────┐
│ User Flow                                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User visits ranking-tool.vercel.app                    │
│     └─> No token in cookies                                │
│                                                             │
│  2. Middleware redirects to:                                │
│     https://manaboodle.com/sso/login                       │
│     ?return_url=https://ranking-tool.vercel.app            │
│     &app_name=Ranking Tool                                 │
│                                                             │
│  3. User logs in with Harvard credentials                   │
│     └─> Manaboodle validates .edu email                   │
│     └─> Generates JWT token                                │
│                                                             │
│  4. Redirects back with token:                              │
│     https://ranking-tool.vercel.app?sso_token=eyJ...       │
│                                                             │
│  5. Middleware stores token in cookie                       │
│     └─> Redirects to clean URL (removes token param)      │
│                                                             │
│  6. Future requests:                                        │
│     └─> Middleware validates token with Manaboodle        │
│     └─> Adds user headers (x-user-id, x-user-email, etc.) │
│     └─> Your app gets authenticated user data              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 User Data Available

After authentication, you can access these fields:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique user ID | `"123e4567-e89b-12d3-a456-426614174000"` |
| `email` | string | Harvard email | `"student@harvard.edu"` |
| `name` | string | Full name | `"John Smith"` |
| `classCode` | string | Class enrolled | `"T565"`, `"T566"`, `"T595"` |

---

## 🔧 Advanced Configuration

### Adding Public Routes

If you have pages that don't require authentication (e.g., landing page, health check):

```typescript
// middleware.ts
const PUBLIC_PATHS = [
  '/',              // Landing page
  '/about',         // About page
  '/health',        // Health check
  '/api/health',    // API health check
];
```

### Custom Error Handling

Add error boundary in your root layout:

```typescript
// src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary fallback={<div>Authentication Error</div>}>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

### Token Refresh (Automatic)

The middleware handles token refresh automatically:
- Access token: 7 days
- Refresh token: 30 days
- Auto-renews when expired

---

## 🐛 Troubleshooting

### Issue: Infinite redirect loop
**Solution:** Check `PUBLIC_PATHS` - make sure you're not trying to auth on static files

### Issue: "Not a Harvard user" error
**Solution:** User needs to sign up at `https://manaboodle.com/academic-portal/signup` first

### Issue: Token expired immediately
**Solution:** Check your system time - JWT tokens are time-sensitive

### Issue: CORS errors
**Solution:** Manaboodle SSO endpoints already have CORS enabled - shouldn't happen

### Issue: Can't access user data
**Solution:** Make sure you're using `getUser()` in Server Components, not Client Components

---

## 🧪 Testing Locally

### 1. Update Middleware for Local Testing

```typescript
// middleware.ts
const MANABOODLE_SSO_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'  // If running Manaboodle locally
  : 'https://manaboodle.com';
```

### 2. Test the Flow

```bash
# Terminal 1: Run your Ranking tool
cd ranking-tool
npm run dev  # Runs on http://localhost:3001

# Terminal 2: Run Manaboodle (if testing locally)
cd manaboodle
npm run dev  # Runs on http://localhost:3000
```

### 3. Visit Local App
- Go to `http://localhost:3001`
- Should redirect to Manaboodle login
- Login and get redirected back

---

## 📦 Complete Example Project Structure

```
your-ranking-tool/
├── middleware.ts                    ← SSO authentication
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 ← Homepage (requires auth)
│   │   ├── rankings/
│   │   │   └── page.tsx             ← Rankings page
│   │   └── api/
│   │       └── submit-ranking/
│   │           └── route.ts         ← API with auth
│   └── utils/
│       └── auth.ts                  ← getUser() helper
├── package.json
└── next.config.js
```

---

## 🎓 Example: Complete Page Implementation

```typescript
// src/app/rankings/page.tsx
import { getUser } from '@/utils/auth';
import { redirect } from 'next/navigation';

async function getRankings(userId: string) {
  // Your database logic here
  return [
    { id: 1, item: 'Item A', score: 95 },
    { id: 2, item: 'Item B', score: 87 },
  ];
}

export default async function RankingsPage() {
  const user = await getUser();
  
  if (!user) {
    // This shouldn't happen (middleware handles auth)
    // But good to have as fallback
    redirect('/');
  }
  
  const rankings = await getRankings(user.id);
  
  return (
    <div className="container mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Your Rankings</h1>
        <p className="text-gray-600">
          Welcome, {user.name} ({user.email})
        </p>
        <p className="text-sm text-gray-500">
          Class: {user.classCode}
        </p>
      </header>
      
      <main>
        <ul className="space-y-4">
          {rankings.map(ranking => (
            <li key={ranking.id} className="border p-4 rounded">
              <h2 className="font-semibold">{ranking.item}</h2>
              <p>Score: {ranking.score}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
```

---

## ✅ Checklist for Your Ranking Tool

Use this checklist when integrating:

- [ ] Copy `middleware.ts` to project root
- [ ] Update `APP_NAME` in middleware
- [ ] Copy `utils/auth.ts` to project
- [ ] Test authentication flow locally
- [ ] Use `getUser()` in pages that need user data
- [ ] Add error handling for unauthenticated users
- [ ] Test with a real Harvard account
- [ ] Deploy to production
- [ ] Test SSO flow in production
- [ ] Monitor logs for any auth errors

---

## 🚨 Important Security Notes

1. **Never modify the middleware** verification logic - it's already secure
2. **Don't store tokens** in localStorage - cookies are httpOnly and secure
3. **Always use `getUser()`** to access user data - don't trust client-side data
4. **HTTPS required** in production - tokens won't work over HTTP
5. **Validate user input** even though users are authenticated

---

## 📞 Need Help?

If you run into issues:

1. Check the console for error messages
2. Verify user exists in Manaboodle Academic Portal
3. Check that middleware.ts is in the correct location (project root)
4. Test the SSO endpoints directly:
   - https://manaboodle.com/api/sso/token (POST)
   - https://manaboodle.com/api/sso/verify (GET)

---

## 🎉 You're Done!

Your Ranking Tool now has:
- ✅ Harvard-verified authentication
- ✅ Single sign-on with Academic Portal
- ✅ Secure JWT tokens
- ✅ User data (name, email, class)
- ✅ Zero authentication code to maintain

Students can now:
1. Sign up once at Manaboodle Academic Portal
2. Access Ranking Tool automatically
3. Access Clusters automatically
4. Access any future tools you build

**One signup, access everywhere!**
