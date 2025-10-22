'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CallbackContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('sso_token');
  const refreshToken = searchParams.get('sso_refresh');

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">No Token Received</h1>
          <p className="text-gray-600 mb-4">
            The SSO login did not return a token. This might mean:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Login failed</li>
            <li>User is not in HarvardUser table</li>
            <li>Incorrect credentials</li>
          </ul>
          <a
            href="/sso/test"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">✅</span>
          <h1 className="text-3xl font-bold text-green-600">SSO Login Successful!</h1>
        </div>
        
        <p className="text-gray-600 mb-6">
          You&apos;ve successfully authenticated with Manaboodle SSO. Your external app (Ranking Tool, Clusters, etc.) 
          would now store this token and use it to verify your identity.
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-green-900 mb-2">Access Token (First 50 chars):</h2>
          <code className="text-xs text-green-800 break-all block bg-white p-3 rounded">
            {token.substring(0, 50)}...
          </code>
        </div>
        
        {refreshToken && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-blue-900 mb-2">Refresh Token (First 50 chars):</h2>
            <code className="text-xs text-blue-800 break-all block bg-white p-3 rounded">
              {refreshToken.substring(0, 50)}...
            </code>
          </div>
        )}
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">Next Steps in Real App:</h2>
          <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
            <li>Middleware stores token in httpOnly cookie</li>
            <li>Token is validated on every request</li>
            <li>User data is extracted and available in your app</li>
            <li>Token expires in 7 days (auto-refresh with refresh token)</li>
          </ol>
        </div>
        
        <button
          onClick={() => testTokenVerification(token)}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition mb-3"
        >
          Test Token Verification
        </button>
        
        <a
          href="/sso/test"
          className="block text-center text-blue-600 hover:text-blue-700"
        >
          Run Test Again
        </a>
      </div>
    </div>
  );
}

async function testTokenVerification(token: string) {
  try {
    const response = await fetch('/api/sso/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.valid) {
      alert(`✅ Token Valid!\n\nUser: ${data.user.name}\nEmail: ${data.user.email}\nClass: ${data.user.classCode}`);
    } else {
      alert(`❌ Token Invalid: ${data.error}`);
    }
  } catch (error) {
    alert(`❌ Verification Error: ${error}`);
  }
}

export default function SSOCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
