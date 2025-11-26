import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json(
        { error: 'Username parameter required' },
        { status: 400 }
      )
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { 
          available: false, 
          error: 'Username must be 3-20 characters, letters, numbers, and underscores only'
        },
        { status: 200 }
      )
    }

    const supabase = createServiceClient()
    
    // Check if username exists (case-insensitive)
    const { data, error } = await supabase
      .from('ManaboodleUser')
      .select('username')
      .ilike('username', username)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Database error checking username:', error)
      return NextResponse.json(
        { error: 'Error checking username availability' },
        { status: 500 }
      )
    }

    const available = !data

    return NextResponse.json(
      { 
        available,
        username: username,
        message: available ? 'Username is available' : 'Username is already taken'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Check username error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
