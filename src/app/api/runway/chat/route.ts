import { NextResponse } from 'next/server';

// Runway is retired. The OpenAI-backed chat was removed so the endpoint
// can't be used to run up API costs. See git history to restore it.
export async function POST() {
  return NextResponse.json(
    { error: 'Runway is no longer available.' },
    { status: 410 }
  );
}
