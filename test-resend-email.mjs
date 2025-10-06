// Test script to verify Resend email is working
import { Resend } from 'resend'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: resolve(__dirname, '.env.local') })

const resend = new Resend(process.env.RESEND_API_KEY)

async function testEmail() {
  console.log('🧪 Testing Resend Email Configuration\n')
  console.log('API Key exists:', !!process.env.RESEND_API_KEY)
  console.log('API Key preview:', process.env.RESEND_API_KEY?.substring(0, 15) + '...\n')

  const testEmail = process.argv[2] || 'test@example.com'
  
  console.log(`Sending test email to: ${testEmail}\n`)

  try {
    const result = await resend.emails.send({
      from: 'Harvard Portal <hello@manaboodle.com>',
      to: testEmail,
      subject: 'Test Email from Harvard Portal',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from the Harvard Academic Portal.</p>
        <p>If you received this, your email configuration is working!</p>
        <p>Time: ${new Date().toISOString()}</p>
      `,
    })

    console.log('✅ Email sent successfully!')
    console.log('Response:', JSON.stringify(result, null, 2))
    
  } catch (error) {
    console.error('❌ Failed to send email')
    console.error('Error:', error)
    console.error('Message:', error?.message)
    console.error('Status:', error?.statusCode)
    console.error('Response:', error?.response?.data)
  }
}

testEmail()
