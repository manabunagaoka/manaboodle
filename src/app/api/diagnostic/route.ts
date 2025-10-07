import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const diagnostics: {
      timestamp: string
      environment: string | undefined
      supabaseUrl: string
      supabaseAnonKey: string
      supabaseServiceKey: string
      resendApiKey: string
      databaseUrl: string
      supabaseConnection?: string
    } = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set (length: ' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length + ')' : '❌ Missing',
      supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY ? '✅ Set (length: ' + process.env.SUPABASE_SERVICE_KEY.length + ')' : '❌ Missing',
      resendApiKey: process.env.RESEND_API_KEY ? '✅ Set (starts with: ' + process.env.RESEND_API_KEY.substring(0, 6) + ')' : '❌ Missing',
      databaseUrl: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
    }

    // Test Supabase connection
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
    
    try {
      const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )

      // Try a simple query
      const { data, error } = await supabase.from('HarvardUser').select('count').limit(1)
      
      diagnostics.supabaseConnection = error ? '❌ Error: ' + error.message : '✅ Connected'
    } catch (err) {
      diagnostics.supabaseConnection = '❌ Exception: ' + (err as Error).message
    }

    return NextResponse.json(diagnostics, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Diagnostic failed',
        message: (error as Error).message,
        stack: (error as Error).stack
      },
      { status: 500 }
    )
  }
}
