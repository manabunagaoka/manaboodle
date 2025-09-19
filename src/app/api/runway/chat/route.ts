import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Lazy initialization of OpenAI client
const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }
  
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

interface ChatContext {
  location: string;
  entityType: string;
  teamSize: number;
  monthlyBudget: number;
}

interface ChatRequest {
  message: string;
  context: ChatContext;
}

const getLocationMultiplier = (location?: string) => {
  if (!location) return 1.0;
  
  const locationMultipliers: Record<string, number> = {
    'San Francisco, CA': 1.8,
    'New York, NY': 1.7,
    'Boston, MA': 1.4,
    'Austin, TX': 1.1,
    'Denver, CO': 1.2,
    'Miami, FL': 1.3
  };
  
  return locationMultipliers[location] || 1.0;
};

// Check if query is about startup costs specifically
const isStartupCostQuery = (message: string) => {
  const lowerMessage = message.toLowerCase();
  
  // Very specific startup cost keywords that should use the existing logic
  const specificCostKeywords = [
    'rent', 'office space', 'coworking', 'insurance', 'legal fees', 'accounting', 
    'bookkeeping', 'software costs', 'saas', 'marketing budget', 'advertising costs',
    'compare rent', 'office costs', 'business insurance', 'legal services'
  ];
  
  // Check for location-based cost comparisons
  const hasLocationComparison = (lowerMessage.includes('compare') || lowerMessage.includes('vs')) && 
    (lowerMessage.includes('nyc') || lowerMessage.includes('boston') || lowerMessage.includes('san francisco') || 
     lowerMessage.includes('austin') || lowerMessage.includes('new york'));
  
  // Use existing logic for very specific cost categories and location comparisons
  return specificCostKeywords.some(keyword => lowerMessage.includes(keyword)) || hasLocationComparison;
};

// Enhanced OpenAI response for startup-related queries
const getOpenAIResponse = async (message: string, context?: ChatContext) => {
  try {
    console.log('Calling OpenAI with message:', message);
    
    const systemPrompt = `You are an expert startup advisor specializing in business planning, compensation, and financial strategy. Provide practical, data-driven advice for entrepreneurs and startup founders.

User context: ${context ? `Location: ${context.location}, Team size: ${context.teamSize}, Entity type: ${context.entityType}, Budget: $${context.monthlyBudget}` : 'No specific context provided'}

Guidelines:
- For salary questions: Provide realistic market rates based on location, role, company stage, and equity considerations
- For business questions: Give actionable, experienced-based advice
- Include location-based variations when discussing compensation (especially for tech roles)
- Consider startup stage (seed, Series A, etc.) when discussing compensation and equity
- Be concise but comprehensive
- Focus on practical next steps and industry standards
- When discussing CEO/executive compensation, consider both cash and equity components`;

    console.log('Making OpenAI API call...');
    
    const openai = getOpenAIClient();
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    console.log('OpenAI response received:', completion.choices[0]?.message?.content);

    const response = {
      text: completion.choices[0]?.message?.content || 'I apologize, but I encountered an issue generating a response. Please try again.',
      suggestedValue: null,
      category: null
    };
    
    console.log('Final response:', response);
    return response;
    
  } catch (error) {
    console.error('OpenAI API error details:', error);
    
    // Check if it's an API key issue
    if (error instanceof Error && error.message.includes('apiKey')) {
      return {
        text: 'AI features are temporarily unavailable. Please contact support if this persists.',
        suggestedValue: null,
        category: null
      };
    }
    
    return {
      text: 'I apologize, but I\'m having trouble accessing my knowledge base right now. Please try again in a moment.',
      suggestedValue: null,
      category: null
    };
  }
};

const getKnowledgeBaseFallback = (message: string, context?: ChatContext) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('rent') || lowerMessage.includes('office')) {
    if (lowerMessage.includes('new york') || lowerMessage.includes('nyc')) {
      return {
        text: 'NYC Office Costs: Coworking $300-750/person/month, Shared Office $700-1800/person/month. NYC is 70% above national average.',
        suggestedValue: context?.teamSize ? 500 * context.teamSize : 2500,
        category: 'rent'
      };
    }
    
    if (lowerMessage.includes('boston')) {
      return {
        text: 'Boston Office Costs: Coworking $250-600/person/month, Shared Office $600-1400/person/month. Boston is 40% above national average.',
        suggestedValue: context?.teamSize ? 400 * context.teamSize : 2000,
        category: 'rent'
      };
    }
    
    if (lowerMessage.includes('san francisco') || lowerMessage.includes('sf')) {
      return {
        text: 'San Francisco Office Costs: Coworking $350-800/person/month, Shared Office $800-2000/person/month. SF is 80% above national average.',
        suggestedValue: context?.teamSize ? 550 * context.teamSize : 2750,
        category: 'rent'
      };
    }
    
    if (lowerMessage.includes('austin')) {
      return {
        text: 'Austin Office Costs: Coworking $180-450/person/month, Shared Office $400-1000/person/month. Austin is 10% above national average.',
        suggestedValue: context?.teamSize ? 300 * context.teamSize : 1500,
        category: 'rent'
      };
    }
  }
  
  if (lowerMessage.includes('compare') || lowerMessage.includes('vs')) {
    if ((lowerMessage.includes('new york') || lowerMessage.includes('nyc')) && lowerMessage.includes('boston')) {
      return {
        text: 'NYC vs Boston: NYC coworking $300-750/person vs Boston $250-600/person. NYC is 25% more expensive but offers larger talent pool.',
        suggestedValue: null,
        category: 'comparison'
      };
    }
  }
  
  if (lowerMessage.includes('insurance')) {
    const locationMultiplier = getLocationMultiplier(context?.location);
    const baseInsurance = 600;
    const adjustedCost = Math.round(baseInsurance * locationMultiplier);
    
    return {
      text: `Business Insurance: General Liability $${Math.round(adjustedCost * 0.6)}-${Math.round(adjustedCost * 1.5)}/month, Professional Liability $${Math.round(adjustedCost * 0.4)}-${Math.round(adjustedCost * 1.2)}/month. Total range: $${adjustedCost}-${Math.round(adjustedCost * 2)}/month`,
      suggestedValue: adjustedCost,
      category: 'insurance'
    };
  }
  
  if (lowerMessage.includes('legal')) {
    const locationMultiplier = getLocationMultiplier(context?.location);
    const baseLegal = 900;
    const adjustedCost = Math.round(baseLegal * locationMultiplier);
    
    return {
      text: `Legal Services: Contract Review $${Math.round(adjustedCost * 0.4)}-${Math.round(adjustedCost * 0.8)}/month, Compliance $${Math.round(adjustedCost * 0.3)}-${Math.round(adjustedCost * 0.6)}/month. Total range: $${adjustedCost}-${Math.round(adjustedCost * 2)}/month`,
      suggestedValue: adjustedCost,
      category: 'legal'
    };
  }
  
  if (lowerMessage.includes('accounting') || lowerMessage.includes('bookkeeping')) {
    const locationMultiplier = getLocationMultiplier(context?.location);
    const baseAccounting = 700;
    const adjustedCost = Math.round(baseAccounting * locationMultiplier);
    
    return {
      text: `Accounting: Monthly Bookkeeping $${Math.round(adjustedCost * 0.6)}-${Math.round(adjustedCost * 1.2)}/month, Tax Prep $${Math.round(adjustedCost * 0.3)}-${Math.round(adjustedCost * 0.6)}/month. Total range: $${adjustedCost}-${Math.round(adjustedCost * 1.8)}/month`,
      suggestedValue: adjustedCost,
      category: 'accounting'
    };
  }
  
  if (lowerMessage.includes('software') || lowerMessage.includes('saas')) {
    return {
      text: 'SaaS Tools: Development $100-500/month, Business Operations $200-800/month, Marketing $100-500/month. Total range: $1000-4000/month. Start lean with free tiers.',
      suggestedValue: 2000,
      category: 'software'
    };
  }
  
  if (lowerMessage.includes('marketing') || lowerMessage.includes('advertising')) {
    return {
      text: 'Marketing: Digital Advertising $1000-10000/month, Content $500-2000/month. General rule: 7-12% of revenue for B2B. Early stage typical: $2000-8000/month.',
      suggestedValue: 3000,
      category: 'marketing'
    };
  }
  
  let contextInfo = '';
  if (context) {
    const details = [];
    if (context.teamSize > 0) details.push(`${context.teamSize} person team`);
    if (context.location && context.location !== 'National Average') details.push(context.location);
    if (details.length > 0) {
      contextInfo = ` Your Context: ${details.join(', ')}`;
    }
  }
  
  return {
    text: `I can help with startup costs! Ask about: Location comparisons ("Compare rent in NYC vs Boston"), Specific costs ("How much is insurance in San Francisco?"), Cost categories (insurance, legal, accounting, software, marketing, rent), Team planning.${contextInfo}`,
    suggestedValue: null,
    category: null
  };
};

export async function POST(request: NextRequest) {
  try {
    console.log('Chat API called');
    const body: ChatRequest = await request.json();
    const { message, context } = body;
    
    console.log('Received message:', message);
    console.log('Context:', context);
    
    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Check if this is a specific startup cost query or a general question
    const isSpecificCostQuery = isStartupCostQuery(message);
    console.log('Is startup cost query:', isSpecificCostQuery);
    
    if (isSpecificCostQuery) {
      // Use existing cost logic for specific startup cost queries
      console.log('Using existing cost logic');
      const response = getKnowledgeBaseFallback(message, context);
      return NextResponse.json(response);
    } else {
      // Use OpenAI for general questions like "How much is CEO salary?"
      console.log('Using OpenAI for general query');
      const response = await getOpenAIResponse(message, context);
      console.log('OpenAI response:', response);
      return NextResponse.json(response);
    }
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        text: 'Sorry, I encountered an error. Please try again.',
        suggestedValue: null,
        category: null
      },
      { status: 500 }
    );
  }
}
