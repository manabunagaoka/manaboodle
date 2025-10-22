'use client';

export default function SSOTestPage() {
  const handleTestSSO = () => {
    const currentUrl = window.location.origin + '/sso/test/callback';
    const ssoUrl = `/sso/login?return_url=${encodeURIComponent(currentUrl)}&app_name=SSO%20Test`;
    window.location.href = ssoUrl;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          SSO Test Page
        </h1>
        <p className="text-gray-600 mb-6">
          This page simulates how your Ranking Tool will redirect users to SSO login.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-blue-900 mb-2">What will happen:</h2>
          <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
            <li>You&apos;ll be redirected to SSO login page</li>
            <li>Login with your Harvard credentials</li>
            <li>You&apos;ll be redirected back here with a token</li>
            <li>Token will be displayed on the callback page</li>
          </ol>
        </div>
        
        <button
          onClick={handleTestSSO}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Test SSO Login Flow
        </button>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Or test API endpoints directly:</h3>
          <div className="space-y-2 text-sm">
            <div>
              <code className="bg-gray-100 px-2 py-1 rounded">POST /api/sso/token</code>
              <span className="text-gray-600 ml-2">- Get authentication token</span>
            </div>
            <div>
              <code className="bg-gray-100 px-2 py-1 rounded">GET /api/sso/verify</code>
              <span className="text-gray-600 ml-2">- Verify token</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
