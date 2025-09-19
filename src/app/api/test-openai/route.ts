import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing OpenAI API key availability...');
    
    // Check if the key exists
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('API key exists:', !!apiKey);
    console.log('API key starts with:', apiKey ? apiKey.substring(0, 10) + '...' : 'undefined');
    
    if (!apiKey) {
      return NextResponse.json({
        error: 'No API key found',
        env_vars: Object.keys(process.env).filter(key => key.includes('OPENAI')),
        all_env_count: Object.keys(process.env).length
      });
    }

    // Try to import OpenAI
    const OpenAI = (await import('openai')).default;
    console.log('OpenAI imported successfully');
    
    // Try to create client
    const openai = new OpenAI({ apiKey });
    console.log('OpenAI client created successfully');
    
    // Try a simple API call
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Say hello" }],
      max_tokens: 10,
    });
    
    console.log('OpenAI API call successful');
    
    return NextResponse.json({
      success: true,
      response: completion.choices[0]?.message?.content,
      key_prefix: apiKey.substring(0, 10) + '...',
    });
    
  } catch (error) {
    console.error('Test OpenAI error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      type: typeof error,
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}