'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calculator, Users, MapPin, Building2, DollarSign, X, MessageCircle, Send, HelpCircle, Menu, Home, Wrench, RotateCcw, GraduationCap } from 'lucide-react';
import Link from 'next/link';

interface Employee {
  id: number;
  role: string;
  salary: number;
}

interface ChatMessage {
  id: number;
  type: 'user' | 'bot';
  text: string;
  isTyping?: boolean;
  isStreaming?: boolean;
  displayedText?: string;
  suggestedValue?: number | null;
  category?: string | null;
}

interface EmployeeCosts {
  baseSalary: number;
  taxes: number;
  benefits: number;
  total: number;
}

interface LocationData {
  name: string;
  stateTax: number;
  localTax: number;
  unemploymentRate: number;
  workersComp: number;
}

interface EntityType {
  name: string;
  federalTax: number;
  stateFiling: number;
  annualFees: number;
  compliance: string;
}

interface RoleTemplate {
  title: string;
  low: number;
  mid: number;
  high: number;
}

interface KnowledgeBaseItem {
  text: string;
  suggestedValue: number | null;
  category: string | null;
}

// Typewriter animation component
const TypewriterText: React.FC<{ 
  text: string; 
  speed?: number; 
  onComplete?: () => void;
}> = ({ text, speed = 10, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return (
    <span className="whitespace-pre-line">
      {displayedText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

const StartupBudgetCalculator = () => {
  const [location, setLocation] = useState('cambridge-ma');
  const [entityType, setEntityType] = useState('llc');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState({
    rent: 8000,
    utilities: 500,
    insurance: 800,
    legal: 1500,
    accounting: 1000,
    software: 2000,
    marketing: 3000,
    miscellaneous: 1000
  });
  
  // Navigation state
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (menuOpen && !target.closest('.hamburger-menu')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Chat system state
  const [chatOpen, setChatOpen] = useState(false);
  const initialChatMessage: ChatMessage = { id: 1, type: 'bot', text: 'Hi! I can help explain startup costs. Ask me about insurance, legal fees, benefits, or any other expense categories.' };
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    initialChatMessage
  ]);
  const [currentMessage, setCurrentMessage] = useState('');

  // Reset chat to initial state
  const resetChat = () => {
    setChatMessages([initialChatMessage]);
    setCurrentMessage('');
  };
  const [gettingStartedExpanded, setGettingStartedExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Location data
  const locations: Record<string, LocationData> = {
    'cambridge-ma': { name: 'Cambridge, MA', stateTax: 5.0, localTax: 0, unemploymentRate: 2.9, workersComp: 0.75 },
    'nyc-ny': { name: 'New York City, NY', stateTax: 6.85, localTax: 3.876, unemploymentRate: 3.4, workersComp: 1.2 },
    'sf-ca': { name: 'San Francisco, CA', stateTax: 9.3, localTax: 0, unemploymentRate: 2.1, workersComp: 0.9 },
    'austin-tx': { name: 'Austin, TX', stateTax: 0, localTax: 0, unemploymentRate: 3.2, workersComp: 0.6 },
    'denver-co': { name: 'Denver, CO', stateTax: 4.25, localTax: 0, unemploymentRate: 3.8, workersComp: 0.8 },
    'seattle-wa': { name: 'Seattle, WA', stateTax: 0, localTax: 0, unemploymentRate: 4.1, workersComp: 1.1 }
  };

  // Currency formatting helper
  const formatCurrency = (amount: number): string => {
    return Math.round(amount).toLocaleString('en-US');
  };

  const entityTypes: Record<string, EntityType> = {
    'sole-prop': { name: 'Sole Proprietorship', federalTax: 0, stateFiling: 100, annualFees: 50, compliance: 'Minimal' },
    'llc': { name: 'LLC', federalTax: 0, stateFiling: 500, annualFees: 300, compliance: 'Low' },
    'delaware-c': { name: 'Delaware C-Corp', federalTax: 21, stateFiling: 300, annualFees: 450, compliance: 'High' },
    'state-c-corp': { name: 'State C-Corp', federalTax: 21, stateFiling: 800, annualFees: 600, compliance: 'High' },
    's-corp': { name: 'S-Corporation', federalTax: 0, stateFiling: 800, annualFees: 500, compliance: 'Medium' },
    'b-corp': { name: 'B-Corporation', federalTax: 21, stateFiling: 500, annualFees: 650, compliance: 'High' },
    'nonprofit': { name: 'Non-Profit (501c3)', federalTax: 0, stateFiling: 400, annualFees: 200, compliance: 'High' },
    'pbc': { name: 'Public Benefit Corp', federalTax: 21, stateFiling: 600, annualFees: 700, compliance: 'High' }
  };

  const roleTemplates: Record<string, RoleTemplate> = {
    'founder-ceo': { title: 'Founder/CEO', low: 60000, mid: 120000, high: 200000 },
    'co-founder': { title: 'Co-Founder', low: 60000, mid: 110000, high: 180000 },
    'cto': { title: 'CTO/Tech Lead', low: 120000, mid: 180000, high: 280000 },
    'engineer-senior': { title: 'Senior Engineer', low: 120000, mid: 160000, high: 220000 },
    'engineer': { title: 'Software Engineer', low: 85000, mid: 130000, high: 180000 },
    'engineer-junior': { title: 'Junior Engineer', low: 65000, mid: 95000, high: 130000 },
    'designer-senior': { title: 'Senior Designer', low: 95000, mid: 130000, high: 170000 },
    'designer': { title: 'Product Designer', low: 75000, mid: 110000, high: 150000 },
    'marketing-director': { title: 'Marketing Director', low: 100000, mid: 140000, high: 190000 },
    'marketing': { title: 'Marketing Manager', low: 65000, mid: 95000, high: 130000 },
    'sales-director': { title: 'Sales Director', low: 90000, mid: 130000, high: 180000 },
    'sales': { title: 'Sales Rep', low: 50000, mid: 75000, high: 120000 },
    'operations': { title: 'Operations Manager', low: 70000, mid: 100000, high: 140000 },
    'customer-success': { title: 'Customer Success', low: 55000, mid: 80000, high: 110000 },
    'admin': { title: 'Admin/Assistant', low: 40000, mid: 55000, high: 75000 }
  };

  const getKnowledgeBaseFallback = (message: string): KnowledgeBaseItem => {
    const lowerMessage = message.toLowerCase();
    const knowledgeBase: Record<string, KnowledgeBaseItem> = {
      'insurance': {
        text: `**Business Insurance Types:**\n\n**General Liability:** $200-800/month\n**Professional Liability:** $150-600/month\n**Cyber Liability:** $100-500/month\n**Workers' Comp:** Varies by state\n\n**Total typical range:** $500-2,000/month`,
        suggestedValue: 800,
        category: 'insurance'
      },
      'legal': {
        text: `**Legal & Professional Services:**\n\n**Business Formation:** $500-3,000 one-time\n**Contract Review:** $300-800/month\n**Compliance:** $200-1,000/month\n**IP Protection:** $500-2,000/month\n\n**Total typical range:** $800-2,500/month`,
        suggestedValue: 1200,
        category: 'legal'
      },
      'accounting': {
        text: `**Accounting & Bookkeeping:**\n\n**Monthly Bookkeeping:** $300-800/month\n**Tax Preparation:** $150-500/month\n**CFO Services:** $2,000-5,000/month\n**Payroll Processing:** $50-200/month\n\n**Total typical range:** $500-1,500/month`,
        suggestedValue: 800,
        category: 'accounting'
      },
      'software': {
        text: `**Essential SaaS tools:**\n\n**Development:** $100-500/month\n**Business Operations:** $200-800/month\n**Marketing Tools:** $100-500/month\n**Security:** $100-500/month\n\n**Total typical range:** $1,000-4,000/month`,
        suggestedValue: 2000,
        category: 'software'
      },
      'marketing': {
        text: `**Marketing budget:**\n\n**Digital Advertising:** $1,000-10,000/month\n**Content & Creative:** $500-2,000/month\n**Tools & Software:** $200-800/month\n\n**General rule:** 7-12% of revenue for B2B\n**Early stage:** $2,000-8,000/month typical`,
        suggestedValue: 3000,
        category: 'marketing'
      }
    };
    
    for (const [key, data] of Object.entries(knowledgeBase)) {
      if (lowerMessage.includes(key)) {
        return data;
      }
    }
    
    return {
      text: `I can help explain costs for: insurance, legal, accounting, software, or marketing. What would you like to know more about?`,
      suggestedValue: null,
      category: null
    };
  };

  const getChatResponse = async (message: string): Promise<KnowledgeBaseItem> => {
    try {
      const context = {
        location: locations[location].name,
        entityType: entityTypes[entityType].name,
        teamSize: employees.length,
        monthlyBudget: Math.round(totalMonthlyCosts)
      };

      const response = await fetch('/api/runway/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context }),
      });

      if (!response.ok) throw new Error('API request failed');
      return await response.json();
    } catch (error) {
      console.error('Chat API error:', error);
      return getKnowledgeBaseFallback(message);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    const userMessage: ChatMessage = { id: Date.now(), type: 'user', text: currentMessage };
    setChatMessages(prev => [...prev, userMessage]);
    
    const typingMessage: ChatMessage = { id: Date.now() + 1, type: 'bot', text: 'Thinking...', isTyping: true };
    setChatMessages(prev => [...prev, typingMessage]);
    setCurrentMessage('');

    try {
      const response = await getChatResponse(currentMessage);
      
      // Create a streaming message that will be animated
      const streamingMessage: ChatMessage = {
        id: Date.now() + 2,
        type: 'bot',
        text: response.text,
        isStreaming: true,
        suggestedValue: response.suggestedValue,
        category: response.category
      };
      
      setChatMessages(prev => prev.filter(msg => !msg.isTyping).concat([streamingMessage]));
    } catch (error) {
      setChatMessages(prev => prev.filter(msg => !msg.isTyping).concat([{
        id: Date.now() + 2,
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        suggestedValue: null,
        category: null
      }]));
    }
  };

  const handleTypingComplete = (messageId: number) => {
    setChatMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isStreaming: false }
          : msg
      )
    );
  };

  const applySuggestedValue = (category: string | null, value: number | null) => {
    if (category && value) {
      setMonthlyExpenses(prev => ({ ...prev, [category]: value }));
    }
  };

  const calculateEmployeeCost = (salary: number): EmployeeCosts => {
    const locationData = locations[location];
    const socialSecurity = salary * 0.062;
    const medicare = salary * 0.0145;
    const futa = Math.min(salary, 7000) * 0.006;
    const suta = salary * (locationData.unemploymentRate / 100);
    const workersComp = salary * (locationData.workersComp / 100);
    const healthInsurance = 7200;
    const retirement401k = salary * 0.03;
    const ptoValue = salary * 0.08;
    const totalTaxes = socialSecurity + medicare + futa + suta + workersComp;
    const totalBenefits = healthInsurance + retirement401k + ptoValue;
    
    return {
      baseSalary: salary,
      taxes: totalTaxes,
      benefits: totalBenefits,
      total: salary + totalTaxes + totalBenefits
    };
  };

  const addEmployee = (roleKey: string) => {
    const role = roleTemplates[roleKey];
    setEmployees([...employees, { id: Date.now(), role: role.title, salary: role.mid }]);
  };

  const updateEmployee = (id: number, field: string, value: any) => {
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, [field]: value } : emp));
  };

  const removeEmployee = (id: number) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const totalEmployeeCosts = employees.reduce((total, emp) => {
    const costs = calculateEmployeeCost(emp.salary);
    return total + costs.total;
  }, 0);

  const totalMonthlyOperating = Object.values(monthlyExpenses).reduce((a, b) => a + b, 0);
  const totalMonthlyCosts = (totalEmployeeCosts / 12) + totalMonthlyOperating;
  const annualCosts = totalMonthlyCosts * 12;

  return (
    <div className="runway-calculator">
      <style jsx>{`
        /* Global responsive styles */
        * {
          box-sizing: border-box;
        }
        
        .runway-calculator * {
          max-width: 100%;
        }
        
        /* Hide header and footer for full-screen experience */
        :global(header) {
          display: none !important;
        }
        :global(footer) {
          display: none !important;
        }
        
        .runway-calculator {
          min-height: 100vh;
          background: linear-gradient(135deg, #fdf2f8 0%, #fcf2ff 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          overflow-x: hidden;
        }
        /* Hide main site header and footer for full-screen experience */
        :global(.header),
        :global(.footer) {
          display: none !important;
        }
        
        .runway-calculator {
          --brand: #ec4899;
          --brand-hover: #db2777;
          min-height: 100vh;
          background: #f7f8fb;
          color: #0f172a;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          -webkit-tap-highlight-color: transparent;
        }
        
        .runway-header {
          background: white;
          border-bottom: 3px solid var(--brand);
          padding: 1rem 2rem;
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .runway-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 800;
          color: var(--brand);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .hamburger-menu {
          position: relative !important;
        }
        
        .hamburger-button {
          background: none !important;
          border: none !important;
          cursor: pointer !important;
          padding: 0.75rem !important;
          border-radius: 8px !important;
          transition: background-color 0.2s !important;
          min-width: 44px !important;
          min-height: 44px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          -webkit-tap-highlight-color: transparent !important;
          touch-action: manipulation !important;
        }
        
        .hamburger-button:hover {
          background-color: #f3f4f6 !important;
        }
        
        .hamburger-icon {
          width: 24px !important;
          height: 24px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-around !important;
        }
        
        .hamburger-line {
          width: 100% !important;
          height: 2px !important;
          background-color: #ec4899 !important;
          transition: all 0.3s ease !important;
        }
        
        .hamburger-dropdown {
          position: absolute !important;
          top: 100% !important;
          right: 0 !important;
          background: white !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
          min-width: 160px !important;
          z-index: 9999 !important;
          margin-top: 0.5rem !important;
          overflow: hidden !important;
          max-height: calc(100vh - 100px) !important;
          overflow-y: auto !important;
        }
        
        .hamburger-dropdown a {
          display: flex !important;
          align-items: center !important;
          gap: 0.75rem !important;
          padding: 1rem 1.25rem !important;
          color: #374151 !important;
          text-decoration: none !important;
          font-weight: 500 !important;
          font-size: 0.95rem !important;
          transition: all 0.2s ease !important;
          border-bottom: 1px solid #f3f4f6 !important;
          -webkit-tap-highlight-color: transparent !important;
          touch-action: manipulation !important;
        }
        
        .hamburger-dropdown a:last-child {
          border-bottom: none !important;
        }
        
        .hamburger-dropdown a:hover {
          background-color: #f8fafc !important;
          color: #ec4899 !important;
          transform: translateX(2px) !important;
        }
        
        .hamburger-dropdown a svg {
          color: #6b7280 !important;
          transition: color 0.2s ease !important;
        }
        
        .hamburger-dropdown a:hover svg {
          color: #ec4899 !important;
        }
        
        .runway-content {
          max-width: 1800px;
          width: 100%;
          margin: 0 auto;
          padding: 1.5rem 2rem 6rem;
          position: relative;
          overflow-x: hidden;
          box-sizing: border-box;
        }
        
        .intro-section {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          padding: 2rem;
          margin-bottom: 2rem;
          width: 100%;
          box-sizing: border-box;
        }
        
        .intro-section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1rem;
        }
        
        .intro-section p {
          color: #6b7280;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }
        
        .templates-toggle {
          color: var(--brand);
          background: none;
          border: none;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: color 0.2s;
        }
        
        .templates-toggle:hover {
          color: var(--brand-hover);
        }
        
        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f3f4f6;
        }
        
        .template-card {
          background: none;
          border: 2px solid #d1d5db;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .template-card:hover {
          border-color: var(--brand);
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.15);
        }
        
        .template-title {
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.5rem;
        }
        
        .template-description {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.75rem;
        }
        
        .template-cost {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--brand);
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
          width: 100%;
          box-sizing: border-box;
        }
        
        .form-section {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          padding: 1.25rem;
          width: 100%;
          box-sizing: border-box;
          min-width: 0;
        }
        
        .form-section h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        
        .form-input, .form-select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
          min-width: 0;
          box-sizing: border-box;
        }
        
        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: var(--brand);
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
        }
        
        .form-help {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.5rem;
        }
        
        .employee-card {
          background: #f9fafb;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .employee-header {
          display: flex;
          align-items: center;
          justify-content: between;
          margin-bottom: 1rem;
        }
        
        .employee-title {
          font-weight: 600;
          color: #111827;
          flex: 1;
        }
        
        .remove-btn {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .remove-btn:hover {
          color: #ef4444;
        }
        
        .employee-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          width: 100%;
          box-sizing: border-box;
        }
        
        .cost-breakdown {
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          padding: 1rem;
        }
        
        .cost-line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }
        
        .cost-total {
          display: flex;
          justify-content: space-between;
          padding-top: 0.5rem;
          border-top: 1px solid #e5e7eb;
          font-weight: 600;
          color: #111827;
        }
        
        .summary-sidebar {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          padding: 1.5rem;
          height: fit-content;
        }
        
        .summary-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1.5rem;
        }
        
        .summary-section {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .summary-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        .summary-line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
        }
        
        .summary-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.5rem;
        }
        
        .summary-monthly {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .chat-fab {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: var(--brand);
          color: white;
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.2s;
          z-index: 1000;
        }
        
        .chat-fab:hover {
          background: var(--brand-hover);
          transform: translateY(-2px);
        }
        
        .chat-panel {
          position: fixed;
          bottom: 5rem;
          right: 2rem;
          width: 350px;
          max-width: calc(100vw - 4rem);
          max-height: calc(100vh - 10rem);
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          border: 1px solid #e5e7eb;
          z-index: 1001;
          display: flex;
          flex-direction: column;
        }
        
        .chat-header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 1rem;
          border-radius: 12px 12px 0 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .chat-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #111827;
        }
        
        .chat-header-buttons {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .chat-refresh {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          transition: color 0.2s;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .chat-refresh:hover {
          color: #6b7280;
          background-color: #f3f4f6;
        }
        
        .chat-close {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .chat-close:hover {
          color: #6b7280;
        }
        
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          max-height: calc(100vh - 250px);
          min-height: 200px;
        }
        
        .message {
          display: flex;
          margin-bottom: 1rem;
        }
        
        .message.user {
          justify-content: flex-end;
        }
        
        .message-bubble {
          max-width: 280px;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-size: 0.875rem;
          line-height: 1.4;
        }
        
        .message.user .message-bubble {
          background: var(--brand);
          color: white;
        }
        
        .message.bot .message-bubble {
          background: #f3f4f6;
          color: #374151;
        }
        
        .suggested-action {
          background: var(--brand);
          color: white;
          border: none;
          border-radius: 6px;
          padding: 0.375rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: all 0.2s;
        }
        
        .suggested-action:hover {
          background: var(--brand-hover);
        }
        
        .chat-input {
          border-top: 1px solid #e5e7eb;
          padding: 1rem;
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
        }
        
        .chat-input textarea {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.875rem;
          font-family: inherit;
          line-height: 1.5;
          transition: height 0.2s ease;
        }
        
        .chat-input textarea:focus {
          outline: none;
          border-color: var(--brand);
        }
        
        .send-btn {
          background: var(--brand);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.75rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .send-btn:hover {
          background: var(--brand-hover);
        }
        
        .main-layout {
          display: grid;
          grid-template-columns: 1fr minmax(280px, 320px);
          gap: 1.5rem;
        }
        
        @media (max-width: 1200px) {
          .main-layout {
            grid-template-columns: 1fr;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .employee-details {
            grid-template-columns: 1fr;
          }
          
          .chat-panel {
            width: 320px;
            max-width: calc(100% - 2rem);
          }
          
          .chat-fab {
            right: 1rem;
          }
        }
        
        @media (max-width: 1024px) {
          .runway-content {
            padding: 1.5rem 1.5rem 4rem !important;
            max-width: 100% !important;
          }
          
          .runway-header {
            padding: 1rem 1.5rem !important;
          }
          
          .form-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          
          .employee-details {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
        
        @media (max-width: 768px) {
          .runway-header {
            padding: 0.75rem 1rem !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
          }
          
          .runway-header h1 {
            font-size: 1.5rem !important;
            flex: 1 !important;
          }
          
          .runway-content {
            padding: 1rem 1rem 4rem !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          
          .form-grid {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
            width: 100% !important;
          }
          
          .form-section {
            padding: 1rem !important;
            width: 100% !important;
            margin: 0 !important;
          }
          
          .employee-details {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
            width: 100% !important;
          }
          
          .intro-section {
            padding: 1.5rem !important;
            width: 100% !important;
            margin-bottom: 1rem !important;
          }
          
          .chat-panel {
            width: calc(100% - 1.5rem) !important;
            right: 0.75rem !important;
          }
          
          .chat-fab {
            right: 0.75rem !important;
          }
          
          .hamburger-dropdown {
            right: 0 !important;
            min-width: 160px !important;
            margin-top: 0.25rem !important;
          }
          
          .hamburger-dropdown a {
            padding: 0.875rem 1rem !important;
            font-size: 0.9rem !important;
            min-height: 44px !important;
            gap: 0.5rem !important;
          }
          
          .hamburger-button {
            padding: 0.75rem !important;
            min-width: 44px !important;
            min-height: 44px !important;
          }
          
          .hamburger-icon {
            width: 20px !important;
            height: 20px !important;
          }
          
          .templates-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (max-width: 480px) {
          .runway-header {
            padding: 0.5rem 0.75rem !important;
          }
          
          .runway-header h1 {
            font-size: 1.25rem !important;
          }
          
          .runway-header h1 svg {
            width: 24px !important;
            height: 24px !important;
          }
          
          .runway-content {
            padding: 0.75rem 0.75rem 3rem !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          
          .intro-section {
            padding: 1rem !important;
            margin-bottom: 0.75rem !important;
            width: 100% !important;
          }
          
          .form-section {
            padding: 0.75rem !important;
            width: 100% !important;
            margin: 0 !important;
          }
          
          .form-grid {
            gap: 0.5rem !important;
            width: 100% !important;
          }
          
          .employee-details {
            grid-template-columns: 1fr !important;
            gap: 0.5rem !important;
            width: 100% !important;
          }
          
          .hamburger-dropdown {
            right: 0 !important;
            min-width: 140px !important;
            margin-top: 0.125rem !important;
          }
          
          .hamburger-dropdown a {
            padding: 0.75rem 0.875rem !important;
            font-size: 0.85rem !important;
            min-height: 40px !important;
          }
          
          .hamburger-button {
            padding: 0.625rem !important;
            min-width: 40px !important;
            min-height: 40px !important;
          }
          
          .hamburger-icon {
            width: 18px !important;
            height: 18px !important;
          }
          
          .chat-fab {
            right: 1rem !important;
            bottom: 1rem !important;
            width: 50px !important;
            height: 50px !important;
          }
          
          .chat-panel {
            right: 1rem !important;
            bottom: 6rem !important;
            width: calc(100vw - 2rem) !important;
            max-height: calc(100vh - 8rem) !important;
          }
          
          .chat-messages {
            max-height: calc(100vh - 200px) !important;
            min-height: 150px !important;
          }
        }
      `}</style>

      <div className="runway-calculator">
        
        <div className="runway-header">
          <h1>
            <Calculator size={32} />
            Runway Budget Calculator
          </h1>
          <div className="hamburger-menu">
            <button className="hamburger-button" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="hamburger-icon">
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
              </div>
            </button>
            {menuOpen && (
              <div className="hamburger-dropdown">
                <a href="/academic-portal/dashboard" onClick={() => setMenuOpen(false)}>
                  <GraduationCap size={16} /> Academic Portal
                </a>
                <a href="/" onClick={() => setMenuOpen(false)}>
                  <Home size={16} /> Home
                </a>
                <a href="/tools" onClick={() => setMenuOpen(false)}>
                  <Wrench size={16} /> Tools
                </a>
              </div>
            )}
          </div>
        </div>

      <div className="runway-content">
        <div className="intro-section">
          <h2>Plan Your Startup Budget</h2>
          <p>
            Build a comprehensive budget by selecting your location, business type, team, and expenses. 
            We'll calculate taxes, benefits, and compliance costs automatically.
          </p>
          
          <button
            onClick={() => setGettingStartedExpanded(!gettingStartedExpanded)}
            className="templates-toggle"
          >
            {gettingStartedExpanded ? 'Hide' : 'See'} example budgets
            <span style={{ transform: gettingStartedExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              ▼
            </span>
          </button>
          
          {gettingStartedExpanded && (
            <div className="templates-grid">
              <button 
                onClick={() => {
                  setEmployees([]);
                  addEmployee('founder-ceo');
                  addEmployee('engineer');
                  setMonthlyExpenses(prev => ({...prev, rent: 3000, software: 800, marketing: 1000, insurance: 500}));
                  setGettingStartedExpanded(false);
                }}
                className="template-card"
              >
                <div className="template-title">Bootstrap Startup</div>
                <div className="template-description">2 people • Minimal office • Remote-friendly</div>
                <div className="template-cost">~$18,000/month total</div>
              </button>
              
              <button 
                onClick={() => {
                  setEmployees([]);
                  addEmployee('founder-ceo');
                  addEmployee('cto');
                  addEmployee('engineer');
                  addEmployee('engineer');
                  addEmployee('designer');
                  setMonthlyExpenses(prev => ({...prev, rent: 8000, software: 2000, marketing: 4000, insurance: 1000}));
                  setGettingStartedExpanded(false);
                }}
                className="template-card"
              >
                <div className="template-title">Product Team</div>
                <div className="template-description">5 people • Professional office • Full benefits</div>
                <div className="template-cost">~$55,000/month total</div>
              </button>
              
              <button 
                onClick={() => {
                  setEmployees([]);
                  ['founder-ceo', 'cto', 'engineer', 'engineer', 'engineer', 'designer', 'marketing', 'sales', 'operations'].forEach(role => addEmployee(role));
                  setMonthlyExpenses(prev => ({...prev, rent: 15000, software: 4000, marketing: 8000, insurance: 1500}));
                  setGettingStartedExpanded(false);
                }}
                className="template-card"
              >
                <div className="template-title">Growth Stage</div>
                <div className="template-description">9 people • Full operations • Enterprise ready</div>
                <div className="template-cost">~$95,000/month total</div>
              </button>
            </div>
          )}
        </div>

        <div className="main-layout">
          <div>
            <div className="form-grid">
              <div className="form-section">
                <h3>
                  <MapPin size={20} />
                  Business Location
                </h3>
                <div className="form-group">
                  <select 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)}
                    className="form-select"
                  >
                    {Object.entries(locations).map(([key, loc]) => (
                      <option key={key} value={key}>
                        {loc.name.split(', ')[0]} / {loc.name.split(', ')[1]}
                      </option>
                    ))}
                  </select>
                  <div className="form-help">
                    State Income Tax: {locations[location].stateTax}%
                    {locations[location].localTax > 0 && ` + Local: ${locations[location].localTax}%`}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>
                  <Building2 size={20} />
                  Business Entity
                </h3>
                <div className="form-group">
                  <select 
                    value={entityType} 
                    onChange={(e) => setEntityType(e.target.value)}
                    className="form-select"
                  >
                    {Object.entries(entityTypes).map(([key, entity]) => (
                      <option key={key} value={key}>
                        {entity.name} / {entity.federalTax}% Tax
                      </option>
                    ))}
                  </select>
                  <div className="form-help">
                    Federal Tax: {entityTypes[entityType].federalTax}% | Compliance: {entityTypes[entityType].compliance}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>
                  <Users size={20} />
                  Team Planning
                </h3>
                <select 
                  onChange={(e) => e.target.value && addEmployee(e.target.value)}
                  className="form-select"
                  value=""
                  style={{ width: '100%', maxWidth: '300px' }}
                >
                  <option value="">+ Add Role</option>
                  {Object.entries(roleTemplates).map(([key, role]) => (
                    <option key={key} value={key}>{role.title}</option>
                  ))}
                </select>
              </div>

              {employees.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                  <Users size={48} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
                  <p>Add your first team member to get started</p>
                </div>
              ) : (
                <div>
                  {employees.map((emp) => {
                    const costs = calculateEmployeeCost(emp.salary);
                    const roleData = Object.values(roleTemplates).find(r => r.title === emp.role);
                    return (
                      <div key={emp.id} className="employee-card">
                        <div className="employee-header">
                          <h4 className="employee-title">{emp.role}</h4>
                          <button 
                            onClick={() => removeEmployee(emp.id)}
                            className="remove-btn"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="employee-details">
                          <div>
                            <label className="form-label">Annual Salary</label>
                            <input 
                              type="text" 
                              value={formatCurrency(emp.salary)}
                              onChange={(e) => {
                                const numValue = parseInt(e.target.value.replace(/[,$]/g, '')) || 0;
                                updateEmployee(emp.id, 'salary', numValue);
                              }}
                              onFocus={(e) => e.target.select()}
                              className="form-input"
                              placeholder="Enter salary"
                            />
                            {roleData && (
                              <div className="form-help">
                                Market range: ${formatCurrency(roleData.low)} - ${formatCurrency(roleData.high)}
                              </div>
                            )}
                          </div>
                          <div className="cost-breakdown">
                            <div className="cost-line">
                              <span style={{ color: '#6b7280' }}>Base Salary:</span>
                              <span style={{ fontWeight: 600 }}>${formatCurrency(costs.baseSalary)}</span>
                            </div>
                            <div className="cost-line">
                              <span style={{ color: '#6b7280' }}>+ Taxes:</span>
                              <span>${formatCurrency(costs.taxes)}</span>
                            </div>
                            <div className="cost-line">
                              <span style={{ color: '#6b7280' }}>+ Benefits:</span>
                              <span>${formatCurrency(costs.benefits)}</span>
                            </div>
                            <div className="cost-total">
                              <span>Total Cost:</span>
                              <span>${formatCurrency(costs.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="form-section">
              <h3>
                <DollarSign size={20} />
                Monthly Operating Expenses
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <div className="form-group">
                    <label className="form-label">Office Rent</label>
                    <input 
                      type="text" 
                      value={formatCurrency(monthlyExpenses.rent)}
                      onChange={(e) => {
                        const numValue = parseInt(e.target.value.replace(/[,$]/g, '')) || 0;
                        setMonthlyExpenses({...monthlyExpenses, rent: numValue});
                      }}
                      onFocus={(e) => e.target.select()}
                      className="form-input"
                      placeholder="Enter monthly rent"
                    />
                  </div>

                  <div className="form-group">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>Insurance</label>
                      <button 
                        onClick={() => {
                          setChatOpen(true);
                          const response = getKnowledgeBaseFallback('insurance');
                          setChatMessages(prev => [...prev, {
                            id: Date.now(),
                            type: 'bot',
                            text: response.text,
                            isStreaming: true,
                            suggestedValue: response.suggestedValue,
                            category: response.category
                          }]);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--brand)', cursor: 'pointer' }}
                      >
                        <HelpCircle size={16} />
                      </button>
                    </div>
                    <input 
                      type="text" 
                      value={formatCurrency(monthlyExpenses.insurance)}
                      onChange={(e) => {
                        const numValue = parseInt(e.target.value.replace(/[,$]/g, '')) || 0;
                        setMonthlyExpenses({...monthlyExpenses, insurance: numValue});
                      }}
                      onFocus={(e) => e.target.select()}
                      className="form-input"
                    />
                    <div className="form-help">General liability, professional, cyber</div>
                  </div>

                  <div className="form-group">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>Legal & Professional</label>
                      <button 
                        onClick={() => {
                          setChatOpen(true);
                          const response = getKnowledgeBaseFallback('legal');
                          setChatMessages(prev => [...prev, {
                            id: Date.now(),
                            type: 'bot',
                            text: response.text,
                            isStreaming: true,
                            suggestedValue: response.suggestedValue,
                            category: response.category
                          }]);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--brand)', cursor: 'pointer' }}
                      >
                        <HelpCircle size={16} />
                      </button>
                    </div>
                    <input 
                      type="text" 
                      value={formatCurrency(monthlyExpenses.legal)}
                      onChange={(e) => {
                        const numValue = parseInt(e.target.value.replace(/[,$]/g, '')) || 0;
                        setMonthlyExpenses({...monthlyExpenses, legal: numValue});
                      }}
                      onFocus={(e) => e.target.select()}
                      className="form-input"
                    />
                    <div className="form-help">Legal counsel, business licenses</div>
                  </div>

                  <div className="form-group">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>Accounting & Bookkeeping</label>
                      <button 
                        onClick={() => {
                          setChatOpen(true);
                          const response = getKnowledgeBaseFallback('accounting');
                          setChatMessages(prev => [...prev, {
                            id: Date.now(),
                            type: 'bot',
                            text: response.text,
                            isStreaming: true,
                            suggestedValue: response.suggestedValue,
                            category: response.category
                          }]);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--brand)', cursor: 'pointer' }}
                      >
                        <HelpCircle size={16} />
                      </button>
                    </div>
                    <input 
                      type="text" 
                      value={formatCurrency(monthlyExpenses.accounting)}
                      onChange={(e) => {
                        const numValue = parseInt(e.target.value.replace(/[,$]/g, '')) || 0;
                        setMonthlyExpenses({...monthlyExpenses, accounting: numValue});
                      }}
                      onFocus={(e) => e.target.select()}
                      className="form-input"
                    />
                    <div className="form-help">Bookkeeping, tax prep, payroll</div>
                  </div>
                </div>

                <div>
                  <div className="form-group">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>Software & Tools</label>
                      <button 
                        onClick={() => {
                          setChatOpen(true);
                          const response = getKnowledgeBaseFallback('software');
                          setChatMessages(prev => [...prev, {
                            id: Date.now(),
                            type: 'bot',
                            text: response.text,
                            isStreaming: true,
                            suggestedValue: response.suggestedValue,
                            category: response.category
                          }]);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--brand)', cursor: 'pointer' }}
                      >
                        <HelpCircle size={16} />
                      </button>
                    </div>
                    <input 
                      type="text" 
                      value={formatCurrency(monthlyExpenses.software)}
                      onChange={(e) => {
                        const numValue = parseInt(e.target.value.replace(/[,$]/g, '')) || 0;
                        setMonthlyExpenses({...monthlyExpenses, software: numValue});
                      }}
                      onFocus={(e) => e.target.select()}
                      className="form-input"
                    />
                    <div className="form-help">SaaS subscriptions, development tools</div>
                  </div>

                  <div className="form-group">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>Marketing & Sales</label>
                      <button 
                        onClick={() => {
                          setChatOpen(true);
                          const response = getKnowledgeBaseFallback('marketing');
                          setChatMessages(prev => [...prev, {
                            id: Date.now(),
                            type: 'bot',
                            text: response.text,
                            isStreaming: true,
                            suggestedValue: response.suggestedValue,
                            category: response.category
                          }]);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--brand)', cursor: 'pointer' }}
                      >
                        <HelpCircle size={16} />
                      </button>
                    </div>
                    <input 
                      type="text" 
                      value={formatCurrency(monthlyExpenses.marketing)}
                      onChange={(e) => {
                        const numValue = parseInt(e.target.value.replace(/[,$]/g, '')) || 0;
                        setMonthlyExpenses({...monthlyExpenses, marketing: numValue});
                      }}
                      onFocus={(e) => e.target.select()}
                      className="form-input"
                    />
                    <div className="form-help">Advertising, content, events</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Utilities</label>
                    <input 
                      type="text" 
                      value={formatCurrency(monthlyExpenses.utilities)}
                      onChange={(e) => {
                        const numValue = parseInt(e.target.value.replace(/[,$]/g, '')) || 0;
                        setMonthlyExpenses({...monthlyExpenses, utilities: numValue});
                      }}
                      onFocus={(e) => e.target.select()}
                      className="form-input"
                    />
                    <div className="form-help">Electric, internet, phone, water</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Other Expenses</label>
                    <input 
                      type="text" 
                      value={formatCurrency(monthlyExpenses.miscellaneous)}
                      onChange={(e) => {
                        const numValue = parseInt(e.target.value.replace(/[,$]/g, '')) || 0;
                        setMonthlyExpenses({...monthlyExpenses, miscellaneous: numValue});
                      }}
                      onFocus={(e) => e.target.select()}
                      className="form-input"
                    />
                    <div className="form-help">Equipment, supplies, travel, meals</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="summary-sidebar">
            <h3 className="summary-title">Budget Summary</h3>
            
            <div className="summary-section">
              <div className="summary-line">
                <span style={{ color: '#6b7280' }}>Team Costs (Annual)</span>
                <span style={{ fontWeight: 600 }}>${formatCurrency(totalEmployeeCosts)}</span>
              </div>
            </div>
            
            <div className="summary-section">
              <div className="summary-line">
                <span style={{ color: '#6b7280' }}>Operating (Monthly)</span>
                <span style={{ fontWeight: 600 }}>${formatCurrency(totalMonthlyOperating)}</span>
              </div>
            </div>
            
            <div className="summary-section">
              <div className="summary-line">
                <span style={{ color: '#6b7280' }}>Operating (Annual)</span>
                <span style={{ fontWeight: 600 }}>${formatCurrency(totalMonthlyOperating * 12)}</span>
              </div>
            </div>

            <div className="summary-section">
              <div className="summary-total">
                <span>Total Annual</span>
                <span>${formatCurrency(annualCosts)}</span>
              </div>
              <div className="summary-monthly">
                <span>Monthly Average</span>
                <span>${formatCurrency(totalMonthlyCosts)}</span>
              </div>
            </div>

            <div className="summary-section">
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Key Metrics</h4>
              <div style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                <div className="summary-line">
                  <span style={{ color: '#6b7280' }}>Team Size:</span>
                  <span style={{ fontWeight: 600 }}>{employees.length} employees</span>
                </div>
                {employees.length > 0 && (
                  <div className="summary-line">
                    <span style={{ color: '#6b7280' }}>Avg. loaded cost:</span>
                    <span style={{ fontWeight: 600 }}>${formatCurrency(totalEmployeeCosts / employees.length)}</span>
                  </div>
                )}
                <div className="summary-line">
                  <span style={{ color: '#6b7280' }}>Entity Type:</span>
                  <span style={{ fontWeight: 600 }}>{entityTypes[entityType].name}</span>
                </div>
                <div className="summary-line">
                  <span style={{ color: '#6b7280' }}>Tax Rate:</span>
                  <span style={{ fontWeight: 600 }}>{(locations[location].stateTax + (locations[location].localTax || 0)).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="summary-section">
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Funding Requirements</h4>
              <div style={{ fontSize: '0.875rem' }}>
                <div className="summary-line">
                  <span style={{ color: '#6b7280' }}>12-month runway:</span>
                  <span style={{ fontWeight: 600 }}>${formatCurrency(annualCosts)}</span>
                </div>
                <div className="summary-line">
                  <span style={{ color: '#6b7280' }}>18-month runway:</span>
                  <span style={{ fontWeight: 600 }}>${formatCurrency(annualCosts * 1.5)}</span>
                </div>
                <div className="summary-line">
                  <span style={{ color: '#6b7280' }}>24-month runway:</span>
                  <span style={{ fontWeight: 600 }}>${formatCurrency(annualCosts * 2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat System */}
      {chatOpen ? (
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-title">
              <MessageCircle size={20} style={{ color: 'var(--brand)' }} />
              Cost Assistant
            </div>
            <div className="chat-header-buttons">
              <button 
                onClick={resetChat}
                className="chat-refresh"
                title="Reset chat"
              >
                <RotateCcw size={16} />
              </button>
              <button 
                onClick={() => setChatOpen(false)}
                className="chat-close"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="chat-messages">
            {chatMessages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-bubble">
                  {message.isStreaming ? (
                    <TypewriterText 
                      text={message.text} 
                      onComplete={() => handleTypingComplete(message.id)}
                    />
                  ) : (
                    <div style={{ whiteSpace: 'pre-line' }}>{message.text}</div>
                  )}
                  {message.suggestedValue != null && message.category != null && !message.isStreaming && (
                    <button 
                      onClick={() => applySuggestedValue(message.category as string, message.suggestedValue as number)}
                      className="suggested-action"
                    >
                      Apply ${formatCurrency(message.suggestedValue)}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chat-input">
            <textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Ask about costs..."
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
              rows={1}
              style={{ 
                resize: 'none',
                minHeight: '44px',
                maxHeight: '120px',
                overflow: 'auto'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = '44px';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
            />
            <button
              onClick={sendMessage}
              className="send-btn"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setChatOpen(true)}
          className="chat-fab"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
    </div>
  );
};

export default StartupBudgetCalculator;