'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
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
  
  useEffect(() => {
    if (!returnUrl) {
      setError('Missing return_url parameter. Please access this page from your application.');
    }
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
