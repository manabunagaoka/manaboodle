'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SSOLoginForm() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('return_url');
  const appName = searchParams.get('app_name') || 'Application';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!returnUrl) {
      setError('Missing return_url parameter. Please access this page from your application.');
    }
  }, [returnUrl]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/sso/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Redirect back to requesting app with token
      const redirectUrl = new URL(returnUrl!);
      redirectUrl.searchParams.set('sso_token', data.token);
      redirectUrl.searchParams.set('sso_refresh', data.refresh_token);
      window.location.href = redirectUrl.toString();
      
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sign in to {appName}
            </h1>
            <p className="text-sm text-gray-600">
              Use your Harvard Academic Portal credentials
            </p>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Harvard Email (.edu)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="your.email@harvard.edu"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !returnUrl}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <a 
                href="/academic-portal/signup" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up here
              </a>
            </p>
            <p className="text-xs text-gray-500">
              By signing in, you&apos;ll be returned to {appName}
            </p>
          </div>
        </div>
        
        {/* Security Notice */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            🔒 Secured by Manaboodle Academic Portal
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SSOLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <SSOLoginForm />
    </Suspense>
  );
}
