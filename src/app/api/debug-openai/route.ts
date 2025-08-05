// Simple OpenAI test endpoint
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  try {
    console.log('🔍 Debug OpenAI Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      hasKey: !!process.env.OPENAI_API_KEY,
      keyLength: process.env.OPENAI_API_KEY?.length || 0,
      keyStart: process.env.OPENAI_API_KEY?.substring(0, 15) || 'MISSING',
      keyEnd: process.env.OPENAI_API_KEY?.substring(-10) || 'MISSING',
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('OPENAI')),
    });

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        error: 'No OpenAI key found',
        environment: process.env.NODE_ENV,
        availableKeys: Object.keys(process.env).filter(key => key.includes('OPENAI'))
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log('🤖 Testing simple OpenAI call...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Say 'OpenAI test successful!'" }],
      max_tokens: 10
    });

    const result = response.choices[0].message.content;
    console.log('✅ OpenAI test successful:', result);

    return NextResponse.json({
      success: true,
      message: result,
      keyInfo: {
        hasKey: true,
        keyLength: process.env.OPENAI_API_KEY.length,
        keyStart: process.env.OPENAI_API_KEY.substring(0, 15)
      }
    });

  } catch (error) {
    console.error('❌ OpenAI test failed:', error);
    
    return NextResponse.json({
      error: 'OpenAI test failed',
      details: {
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : 'Unknown',
        status: (error as any)?.status || 'Unknown'
      }
    });
  }
}
