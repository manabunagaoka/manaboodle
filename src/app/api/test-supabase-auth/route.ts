import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    
    // Test Supabase connection
    const { data: dbTest, error: dbError } = await supabase
      .from('HarvardUser')
      .select('count')
      .limit(1)
    
    if (dbError) {
      return NextResponse.json({
        success: false,
        step: 'Database connection',
        error: dbError.message,
        details: dbError
      }, { status: 500 })
    }
    
    // Test auth signup
    const testEmail = `test-${Date.now()}@test.edu`
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'testpassword123',
      options: {
        data: { name: 'Test User' }
      }
    })
    
    if (authError) {
      return NextResponse.json({
        success: false,
        step: 'Supabase Auth signup',
        error: authError.message,
        details: authError
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'All tests passed',
      authUserId: authData.user?.id,
      dbTest: dbTest
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      step: 'Unexpected error',
      error: (error as Error).message,
      stack: (error as Error).stack
    }, { status: 500 })
  }
}
