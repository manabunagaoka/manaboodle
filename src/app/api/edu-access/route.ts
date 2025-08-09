import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🎓 Edu access request:', body)
    
    const { 
      fullName, 
      universityEmail, 
      organization, 
      researchFocus, 
      feedbackConsent, 
      betaInterest,
      notificationsConsent,
      ageVerification 
    } = body

    // Validate required fields
    if (!fullName || !universityEmail || !organization || !researchFocus || !ageVerification) {
      console.error('❌ Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields including age verification' },
        { status: 400 }
      )
    }

    // Validate .edu email
    if (!universityEmail.toLowerCase().endsWith('.edu')) {
      console.error('❌ Invalid email domain:', universityEmail)
      return NextResponse.json(
        { error: 'Must use a .edu email address' },
        { status: 400 }
      )
    }

    try {
      // Try to use Supabase database
      const { data: existing, error: selectError } = await supabase
        .from('university_access')
        .select('id, email')
        .eq('email', universityEmail)
        .maybeSingle()

      if (selectError && selectError.code !== '42P01') {
        // Error other than "table doesn't exist"
        throw selectError
      }

      if (selectError?.code === '42P01') {
        // Table doesn't exist - just log the data
        console.log('📊 Database table not ready - logging university access:', {
          email: universityEmail,
          name: fullName,
          organization: organization,
          research: researchFocus,
          consent: feedbackConsent,
          beta: betaInterest,
          notifications: notificationsConsent,
          ageVerified: ageVerification,
          timestamp: new Date().toISOString()
        })
      } else if (existing) {
        // Update existing record
        console.log('📧 Updating existing university access:', universityEmail)
        const { error: updateError } = await supabase
          .from('university_access')
          .update({
            full_name: fullName,
            organization: organization,
            research_focus: researchFocus,
            feedback_consent: feedbackConsent,
            beta_interest: betaInterest,
            newsletter_consent: notificationsConsent,
            age_verification: ageVerification,
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('email', universityEmail)

        if (updateError) {
          throw updateError
        }
      } else {
        // Create new record
        console.log('✨ Creating new university access record:', universityEmail)
        const { error: insertError } = await supabase
          .from('university_access')
          .insert([{
            email: universityEmail,
            status: 'active',
            full_name: fullName,
            organization: organization,
            research_focus: researchFocus,
            feedback_consent: feedbackConsent,
            beta_interest: betaInterest,
            newsletter_consent: notificationsConsent,
            age_verification: ageVerification,
            access_granted_at: new Date().toISOString()
          }])

        if (insertError) {
          throw insertError
        }
      }
    } catch (dbError: any) {
      // Database error - log the data but don't fail the request
      console.error('⚠️ Database error (continuing anyway):', dbError)
      console.log('📊 Fallback - logging university access:', {
        email: universityEmail,
        name: fullName,
        organization: organization,
        research: researchFocus,
        consent: feedbackConsent,
        beta: betaInterest,
        notifications: notificationsConsent,
        ageVerified: ageVerification,
        timestamp: new Date().toISOString(),
        error: dbError.message
      })
    }

    console.log('✅ University access granted for:', universityEmail)

    // Create response with cookie
    const response = NextResponse.json({ 
      success: true, 
      message: 'University access granted' 
    })
    
    // Set cookie for middleware
    response.cookies.set('manaboodle_edu_access', 'granted', {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })

    return response

  } catch (error) {
    console.error('💥 API error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
