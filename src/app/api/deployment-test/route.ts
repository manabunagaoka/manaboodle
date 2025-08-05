// Simple deployment test endpoint
import { NextRequest, NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'DEPLOYMENT_ACTIVE',
    timestamp: new Date().toISOString(),
    version: 'Harvard-Business-School-v2.1',
    build_time: Date.now(),
    node_env: process.env.NODE_ENV,
    has_openai_key: !!process.env.OPENAI_API_KEY
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    
    return NextResponse.json({
      status: 'POST_WORKING',
      received_data: body,
      timestamp: new Date().toISOString(),
      version: 'Harvard-v2.1-POST-TEST'
    });
  } catch (error) {
    return NextResponse.json({
      error: 'POST failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
