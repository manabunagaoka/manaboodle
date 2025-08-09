import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Currently no middleware needed for MVP direct access
  // Future: Add pro marketplace authentication here
  
  console.log(`🚀 MVP Access: ${request.nextUrl.pathname}`)
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Future: Protect pro marketplace routes when authentication is added
    // '/tools/promarketplace/:path*'
  ]
}
