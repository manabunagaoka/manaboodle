# 🎓 Harvard Authentication Implementation - Handoff Prompt

## 📋 Project Context

You are taking over implementation of a **Harvard Academic Portal authentication system** for the Manaboodle project. The existing UI is complete but currently uses localStorage (demo only). Your task is to implement a **real authentication backend** using the established technology stack.

## 🎯 Specific Implementation Scope

**IMPLEMENT:**
- ✅ Harvard user registration with database storage
- ✅ Harvard user login with NextAuth.js 
- ✅ Small admin panel to manage Harvard registrants
- ✅ Real database instead of localStorage demo

**DO NOT TOUCH:**
- ❌ Main manaboodle.com site functionality
- ❌ Email system (Resend integration)
- ❌ Article/blog content system  
- ❌ Tools page design (Harvard card UI is finalized)
- ❌ Any existing working features

## 🏗️ Required Technology Stack

Based on `AUTH_DATABASE_GUIDE.md` from `https://github.com/manabunagaoka/sse_dog_demo`, the project deliberately uses **self-hosted authentication** instead of third-party services:

```
✅ NextAuth.js - Self-hosted authentication
✅ Prisma ORM - Type-safe database queries  
✅ SQLite (dev) / PostgreSQL (production-ready)
✅ bcrypt - Password hashing (10 rounds)
✅ JWT tokens - HTTP-only cookies for sessions
```

**Why NOT Supabase/Clerk:** Full data control, zero monthly costs, no vendor lock-in, production-ready stack used by Netflix/Vercel.

## 📁 Current File Status

### ✅ **Working UI Files (DO NOT BREAK):**
- `src/app/tools/page.tsx` - Harvard card integration (finalized design)
- `src/app/tools/tools.module.css` - Harvard card styling (complete)
- `src/app/academic-portal/login/page.tsx` - Login form UI (needs backend)
- `src/app/academic-portal/signup/page.tsx` - Registration form UI (needs backend)
- `src/app/admin/page.tsx` - Admin panel UI (needs real data)

### 🔧 **Current Demo Implementation:**
```typescript
// Currently using localStorage (demo only):
localStorage.setItem('harvardUser', JSON.stringify(userData))
const users = JSON.parse(localStorage.getItem('harvardUsers') || '[]')
```

### 🎨 **UI Components Working:**
- Harvard University logo integration
- Login/signup forms with validation
- Admin panel with user table design
- Responsive styling with CSS modules
- Error handling UI components

## 📊 Required Database Schema

Create Harvard-specific user model:

```prisma
model HarvardUser {
  id          String   @id @default(cuid())
  email       String   @unique
  password    String   // bcrypt hashed
  name        String
  classCode   String?  // Harvard course/class identifier  
  affiliation String   // "student" | "faculty" | "staff"
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🔗 Implementation Steps

1. **Install Dependencies:**
```bash
npm install next-auth @next-auth/prisma-adapter prisma @prisma/client bcryptjs
npm install -D prisma
```

2. **Environment Variables:** (`.env.local`)
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"  
NEXTAUTH_SECRET="your-secret-key-here"
```

3. **Key Files to Create:**
- `prisma/schema.prisma` - Database schema
- `lib/prisma.ts` - Prisma client singleton
- `app/api/register/route.ts` - Registration endpoint
- `app/api/auth/[...nextauth]/route.ts` - NextAuth config

4. **Files to Update:**
- `src/app/academic-portal/signup/page.tsx` - Replace localStorage with API calls
- `src/app/academic-portal/login/page.tsx` - Replace localStorage with NextAuth
- `src/app/admin/page.tsx` - Replace localStorage with Prisma queries
- `src/app/layout.tsx` - Add SessionProvider wrapper

## 🧪 Testing Requirements

**Test Flow:**
1. Register new Harvard user at `/academic-portal/signup`
2. Login at `/academic-portal/login` 
3. View registered users in `/admin` (password: harvard2024)
4. Logout functionality
5. Route protection (redirect to login if not authenticated)

**Demo Account for Testing:**
- Email: `demo@harvard.edu`
- Password: `harvard2024`

## 🚨 Critical Implementation Notes

1. **Follow AUTH_DATABASE_GUIDE.md patterns exactly** - The reference implementation is production-tested
2. **bcrypt password hashing** - Never store plain text passwords
3. **Prisma parameterized queries** - Prevents SQL injection
4. **HTTP-only JWT cookies** - Secure session management
5. **Preserve existing UI styling** - Only add backend functionality

## 🎯 Success Criteria

**Complete when:**
- ✅ Users can register with real database storage
- ✅ Users can login with NextAuth.js authentication  
- ✅ Admin panel shows real database users
- ✅ No localStorage dependencies remain
- ✅ All existing UI functionality preserved
- ✅ Password security with bcrypt hashing
- ✅ Session management with JWT tokens

## 📚 Reference Materials

- **Main Guide:** `AUTH_DATABASE_GUIDE.md` in `https://github.com/manabunagaoka/sse_dog_demo`
- **Working Example:** Complete auth system in sse_dog_demo repository
- **NextAuth Docs:** https://next-auth.js.org/
- **Prisma Docs:** https://www.prisma.io/docs

## 🏁 Next Phase

After authentication is complete, the next phase will be implementing the actual Harvard portal tools and functionality. Keep the auth system modular and reusable for future tool integrations.

---

**START HERE:** Begin with installing dependencies and creating the database schema, following the exact patterns from AUTH_DATABASE_GUIDE.md.