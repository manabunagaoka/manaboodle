// Simple test to debug the edu access API
export default function TestPage() {
  const testAPI = async () => {
    try {
      console.log('🧪 Testing API...')
      const response = await fetch('/api/edu-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: 'Test User',
          universityEmail: 'test@harvard.edu',
          organization: 'Harvard University',
          researchFocus: 'Testing the API',
          feedbackConsent: true,
          betaInterest: true,
        })
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      const result = await response.json()
      console.log('Response data:', result)

      if (response.ok) {
        alert('✅ API Test Success: ' + JSON.stringify(result, null, 2))
      } else {
        alert('❌ API Test Failed: ' + JSON.stringify(result, null, 2))
      }
    } catch (error) {
      console.error('Test error:', error)
      alert('💥 Test Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      <button
        onClick={testAPI}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        🧪 Test Edu Access API
      </button>
      <p className="mt-4 text-gray-600">
        Check the browser console (F12) for detailed logs
      </p>
    </div>
  )
}
