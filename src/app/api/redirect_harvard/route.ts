// app/api/redirect_harvard/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🎓 Harvard University portal access attempt');
  
  try {
    // Redirect to Harvard signin page
    const baseUrl = request.nextUrl.origin;
    return NextResponse.redirect(`${baseUrl}/harvard/signin`);
  } catch (error) {
    console.error('❌ Harvard redirect error:', error);
    return NextResponse.json(
      { error: 'Failed to redirect to Harvard portal' },
      { status: 500 }
    );
  }
}