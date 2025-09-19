import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing OpenAI API key availability...');
    console.log('Full process.env object keys:', Object.keys(process.env).length);
    
    // Check if the key exists with multiple approaches
    const apiKey = process.env.OPENAI_API_KEY;
    const alternativeKey = process.env['OPENAI_API_KEY']; 
    const processEnvOpenai = (process.env as any).OPENAI_API_KEY;
    
    console.log('API key exists:', !!apiKey);
    console.log('API key starts with:', apiKey ? apiKey.substring(0, 10) + '...' : 'undefined');
    
    // Log all environment variable names containing 'KEY' to see if the naming is different
    const keyVars = Object.keys(process.env).filter(key => key.includes('KEY'));
    
    if (!apiKey) {
      return NextResponse.json({
        error: 'No API key found',
        env_vars: Object.keys(process.env).filter(key => key.includes('OPENAI')),
        all_env_count: Object.keys(process.env).length,
        sample_env_vars: Object.keys(process.env).slice(0, 20), // Show first 20 env vars
        vercel_env_vars: Object.keys(process.env).filter(key => key.startsWith('VERCEL')).slice(0, 5),
        vars_with_key: keyVars,
        api_vars: Object.keys(process.env).filter(key => key.includes('API')),
        openai_variants: [
          process.env.OPENAI_API_KEY ? 'OPENAI_API_KEY exists' : 'OPENAI_API_KEY missing',
          process.env.OPENAI_KEY ? 'OPENAI_KEY exists' : 'OPENAI_KEY missing',
          process.env.OPENAI ? 'OPENAI exists' : 'OPENAI missing'
        ],
        alternative_access: {
          bracket_notation: !!alternativeKey,
          any_cast: !!processEnvOpenai
        }
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