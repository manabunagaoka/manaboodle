// utils/auth.ts
// Helper utilities to access user information in your app

import { headers } from 'next/headers';

export interface ManaboodleUser {
  id: string;
  email: string;
  name: string;
  classCode: string;
}

/**
 * Get the authenticated user from request headers
 * Use this in Server Components and API Routes
 */
export async function getUser(): Promise<ManaboodleUser | null> {
  const headersList = await headers();
  
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

/**
 * Example usage in a Server Component:
 * 
 * import { getUser } from '@/utils/auth';
 * 
 * export default async function DashboardPage() {
 *   const user = await getUser();
 *   
 *   if (!user) {
 *     return <div>Not authenticated</div>;
 *   }
 *   
 *   return (
 *     <div>
 *       <h1>Welcome, {user.name}</h1>
 *       <p>Email: {user.email}</p>
 *       <p>Class: {user.classCode}</p>
 *     </div>
 *   );
 * }
 */

/**
 * Example usage in an API Route:
 * 
 * import { getUser } from '@/utils/auth';
 * import { NextResponse } from 'next/server';
 * 
 * export async function GET() {
 *   const user = await getUser();
 *   
 *   if (!user) {
 *     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 *   }
 *   
 *   // Your API logic here
 *   return NextResponse.json({ 
 *     message: `Hello ${user.name}`,
 *     data: { ... }
 *   });
 * }
 */
