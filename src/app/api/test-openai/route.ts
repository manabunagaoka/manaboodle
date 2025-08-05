// Simple test endpoint to verify OpenAI integration
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET(): Promise<NextResponse> {
  try {
    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: 'No OpenAI API key found',
        timestamp: new Date().toISOString(),
        version: 'test-v1.0'
      }, { status: 500 });
    }

    // Test OpenAI connection
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a Harvard Business School consultant." },
        { role: "user", content: "Say 'Harvard Business School prompts are working!' in exactly 7 words." }
      ],
      max_tokens: 20,
      temperature: 0
    });

    return NextResponse.json({
      success: true,
      message: response.choices[0].message.content,
      timestamp: new Date().toISOString(),
      version: 'Harvard-v2.1-WORKING'
    });

  } catch (error) {
    return NextResponse.json({
      error: 'OpenAI test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      version: 'test-v1.0-FAILED'
    }, { status: 500 });
  }
}
