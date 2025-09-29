import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tool = searchParams.get('tool');

  // Define tool redirects
  const redirects: { [key: string]: string } = {
    clusters: 'https://clusters-git-main-manabunagaokas-projects.vercel.app?_vercel_share=H0UCEGCTYBqbBKWTg3cMSxFYhV7PrXQf'
  };

  const targetUrl = redirects[tool || ''];
  
  if (!targetUrl) {
    return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
  }

  return NextResponse.redirect(targetUrl);
}