import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  if (!email || !token) {
    return NextResponse.json(
      { error: 'Email and token are required' },
      { status: 400 }
    )
  }

  try {
    
    // Verify the token matches the subscriber
    const { data: subscriber, error } = await supabase
      .from('subscribers')
      .select('id, preferences, unsubscribe_token')
      .eq('email', email)
      .eq('unsubscribe_token', token)
      .single()

    if (error || !subscriber) {
      return NextResponse.json(
        { error: 'Invalid email or token' },
        { status: 401 }
      )
    }

    // Return current preferences or defaults
    const preferences = subscriber.preferences || {
      generalUpdates: true,
      caseStudies: true,
      concepts: true,
      projects: true,
      frequency: 'weekly'
    }

    return NextResponse.json({ preferences })
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, token, preferences } = body

    if (!email || !token || !preferences) {
      return NextResponse.json(
        { error: 'Email, token, and preferences are required' },
        { status: 400 }
      )
    }

    
    // Verify the token matches the subscriber
    const { data: subscriber, error: fetchError } = await supabase
      .from('subscribers')
      .select('id, unsubscribe_token')
      .eq('email', email)
      .eq('unsubscribe_token', token)
      .single()

    if (fetchError || !subscriber) {
      return NextResponse.json(
        { error: 'Invalid email or token' },
        { status: 401 }
      )
    }

    // Update preferences
    const { error: updateError } = await supabase
      .from('subscribers')
      .update({
        preferences,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriber.id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ 
      success: true,
      message: 'Preferences updated successfully' 
    })
  } catch (error) {
    console.error('Error updating preferences:', error)
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    )
  }
}