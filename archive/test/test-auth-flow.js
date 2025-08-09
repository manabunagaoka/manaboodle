// Simple test script to verify the university access flow
// Run with: node test-auth-flow.js

const testData = {
  fullName: "Test Researcher",
  universityEmail: "test@harvard.edu",
  organization: "Harvard University", 
  researchFocus: "Testing the authentication flow",
  feedbackConsent: true,
  betaInterest: true,
  notificationsConsent: true,
  ageVerification: true
};

console.log('🧪 Testing University Access Flow');
console.log('=================================');

// Test the edu-access API
async function testEduAccessAPI() {
  try {
    console.log('\n1. Testing /api/edu-access endpoint...');
    
    const response = await fetch('http://localhost:3000/api/edu-access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Edu access API working:', result);
      return true;
    } else {
      console.log('❌ Edu access API failed:', result);
      return false;
    }
  } catch (error) {
    console.log('💥 Edu access API error:', error.message);
    return false;
  }
}

// Test the verify-edu-access API
async function testVerifyAPI() {
  try {
    console.log('\n2. Testing /api/verify-edu-access endpoint...');
    
    const response = await fetch('http://localhost:3000/api/verify-edu-access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testData.universityEmail })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Verify API working:', result);
      return true;
    } else {
      console.log('❌ Verify API failed:', result);
      return false;
    }
  } catch (error) {
    console.log('💥 Verify API error:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  const eduAccessWorking = await testEduAccessAPI();
  const verifyWorking = await testVerifyAPI();
  
  console.log('\n📊 Test Results:');
  console.log('================');
  console.log(`Edu Access API: ${eduAccessWorking ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Verify API: ${verifyWorking ? '✅ PASS' : '❌ FAIL'}`);
  
  if (eduAccessWorking && verifyWorking) {
    console.log('\n🎉 All APIs working! The university access flow should work correctly.');
    console.log('\n📝 Manual Testing Steps:');
    console.log('1. Go to http://localhost:3000/tools');
    console.log('2. Click on "Research Clusters Analysis" card');
    console.log('3. Fill out the university form with a .edu email');
    console.log('4. Submit and verify redirect to clusters page');
    console.log('5. Check that "Back to Tools" link works from clusters page');
  } else {
    console.log('\n⚠️  Some APIs are not working. Check the server logs.');
  }
}

// Check if server is running
fetch('http://localhost:3000')
  .then(() => {
    console.log('🟢 Next.js server is running on localhost:3000');
    runTests();
  })
  .catch(() => {
    console.log('🔴 Next.js server is not running on localhost:3000');
    console.log('Please run: npm run dev');
  });
