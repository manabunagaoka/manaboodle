import { useState } from 'react';

interface EmailCollectorProps {
  onSubmit: (email: string, interests: string) => Promise<void>;
  onClose: () => void;
}

export default function EmailCollector({ onSubmit, onClose }: EmailCollectorProps) {
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setLoading(true);
    try {
      await onSubmit(email, interests);
      onClose();
    } catch (error) {
      console.error('Email submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="export-modal" style={{ display: 'flex' }}>
      <div className="export-modal-content">
        <div className="export-modal-title">Get Full Access to Clusters</div>
        <p style={{ marginBottom: '1.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
          Want to analyze your own research data? Enter your email to get notified when full access becomes available.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '0.875rem'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <textarea
              placeholder="What type of research or data would you like to analyze? (optional)"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '0.875rem',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              type="submit" 
              disabled={loading || !email.trim()}
              style={{
                flex: 1,
                padding: '0.875rem',
                background: 'linear-gradient(135deg, #0F766E, #14B8A6)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Submitting...' : 'Get Early Access'}
            </button>
            
            <button 
              type="button" 
              onClick={onClose}
              style={{
                padding: '0.875rem 1rem',
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                color: '#6b7280',
                cursor: 'pointer'
              }}
            >
              Maybe Later
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
