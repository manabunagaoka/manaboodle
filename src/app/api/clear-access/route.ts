import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })
  
  // Clear the access cookie
  response.cookies.set('manaboodle_edu_access', '', {
    maxAge: 0,
    path: '/'
  })
  
  return response
}
