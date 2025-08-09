import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({ success: true, message: 'Authentication cleared' })
    
    // Clear the authentication cookie
    response.cookies.set('manaboodle_edu_access', '', {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Clear auth error:', error)
    return NextResponse.json(
      { error: 'Failed to clear authentication' },
      { status: 500 }
    )
  }
}
