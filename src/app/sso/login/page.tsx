'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import styles from '../../academic-portal/auth.module.css';

function SSOLoginForm() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('return_url');
  const appName = searchParams.get('app_name') || 'Application';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checking, setChecking] = useState(true);
  
  useEffect(() => {
    if (!returnUrl) {
      setError('Missing return_url parameter. Please access this page from your application.');
      setChecking(false);
      return;
    }
    
    // Check if user is already authenticated
    const checkExistingSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session check error:', sessionError);
          setChecking(false);
          return;
        }
        
        if (session?.user) {
          // User is already authenticated, verify they're in HarvardUser table
          const { data: harvardUser, error: userError } = await supabase
            .from('HarvardUser')
            .select('id, email, name, classCode')
            .eq('email', session.user.email)
            .single();
          
          if (!userError && harvardUser) {
            // Valid Harvard user with active session - redirect immediately
            const redirectUrl = new URL(returnUrl);
            redirectUrl.searchParams.set('sso_token', session.access_token);
            redirectUrl.searchParams.set('sso_refresh', session.refresh_token || '');
            window.location.href = redirectUrl.toString();
            return;
          }
        }
        
        // No valid session - show login form
        setChecking(false);
      } catch (err) {
        console.error('Error checking session:', err);
        setChecking(false);
      }
    };
    
    checkExistingSession();
  }, [returnUrl]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validate .edu email
    if (!email.endsWith('.edu')) {
      setError('Please use a valid .edu email address');
      setLoading(false);
      return;
    }
    
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
  
  // Show loading state while checking for existing session
  if (checking) {
    return (
      <div className={styles.authPage}>
        <div className={styles.authContainer}>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ color: '#666', marginBottom: '12px' }}>Checking authentication...</p>
            <p style={{ fontSize: '14px', color: '#888' }}>
              If you&apos;re already logged in, you&apos;ll be redirected automatically
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        {/* Header */}
        <div className={styles.authHeader}>
          <div className={styles.logoSection}>
            <Image 
              src="/images/Harvard_University_logo.png" 
              alt="Harvard" 
              width={50}
              height={50}
              className={styles.logo}
            />
            <span className={styles.universityName}>Harvard University</span>
          </div>
          <h1 className={styles.title}>Sign in to {appName}</h1>
          <p className={styles.subtitle}>
            Use your Harvard Academic Portal credentials
          </p>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        {/* Login Form */}
        <form onSubmit={handleLogin} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Harvard Email (.edu)
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="your.email@harvard.edu"
              required
              disabled={loading}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.togglePassword}
                disabled={loading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading || !returnUrl}
            className={styles.submitButton}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        {/* Footer Links */}
        <div className={styles.authFooter}>
          <p>
            Don&apos;t have an account?{' '}
            <a href="/academic-portal/signup">Sign up here</a>
          </p>
          <p className={styles.returnNotice}>
            You&apos;ll be returned to {appName} after signing in
          </p>
        </div>
        
        {/* Security Notice */}
        <div className={styles.securityNotice}>
          🔒 Secured by Manaboodle Academic Portal
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
