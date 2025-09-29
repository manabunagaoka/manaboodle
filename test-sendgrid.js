// Test SendGrid configuration
const sgMail = require('@sendgrid/mail');

// Set API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function testSendGrid() {
  try {
    console.log('Testing SendGrid API...');
    console.log('API Key present:', !!process.env.SENDGRID_API_KEY);
    console.log('API Key starts with:', process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.substring(0, 10) : 'MISSING');
    
    // Try to send a test email
    const msg = {
      to: 'hello@manaboodle.com',
      from: 'hello@manaboodle.com',
      subject: 'SendGrid Test',
      text: 'This is a test email to verify SendGrid is working.',
    };

    const response = await sgMail.send(msg);
    console.log('✅ SendGrid test successful!');
    console.log('Response:', response[0].statusCode);
  } catch (error) {
    console.error('❌ SendGrid test failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    if (error.response && error.response.body) {
      console.error('Error response:', JSON.stringify(error.response.body, null, 2));
    }
  }
}

testSendGrid();