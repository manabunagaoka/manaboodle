import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email format
    if (!email || !email.endsWith('.edu')) {
      return NextResponse.json({ authorized: false, reason: 'Invalid email' })
    }

    try {
      // Try to check database first
      const { data: subscriber, error } = await supabase
        .from('university_access')
        .select('id, email, status, full_name, organization')
        .eq('email', email)
        .eq('status', 'active')
        .single()

      if (error && error.code !== '42P01' && error.code !== 'PGRST116') {
        // Error other than "table doesn't exist" or "no rows"
        throw error
      }

      if (subscriber) {
        // Found in database
        console.log(`✅ University access verified from database: ${email} (${subscriber.organization || 'Unknown org'})`)
        return NextResponse.json({ 
          authorized: true,
          user: {
            email: subscriber.email,
            name: subscriber.full_name || 'University Researcher',
            organization: subscriber.organization || email.split('@')[1].replace('.edu', '')
          }
        })
      }
    } catch (dbError: any) {
      console.log('⚠️ Database not available, using email validation fallback:', dbError.message)
    }

    // Fallback: verify by email format only
    console.log(`✅ University access verified by email format: ${email}`)
    return NextResponse.json({ 
      authorized: true,
      user: {
        email: email,
        name: 'University Researcher',
        organization: email.split('@')[1].replace('.edu', '').toUpperCase()
      }
    })

  } catch (error) {
    console.error('Access verification error:', error)
    return NextResponse.json({ authorized: false, reason: 'Verification failed' })
  }
}
