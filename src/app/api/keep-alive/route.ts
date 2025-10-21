// Keep Supabase active by pinging database
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Simple query to keep database active
    const { data, error } = await supabase
      .from('HarvardUser')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Ping failed:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase pinged successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to ping' }, { status: 500 })
  }
}
