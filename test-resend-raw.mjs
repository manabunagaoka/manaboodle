// Test Resend API with raw HTTP request
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: resolve(__dirname, '.env.local') })

const apiKey = process.env.RESEND_API_KEY
const testEmail = process.argv[2] || 'test@example.com'

console.log('🧪 Testing Resend API with Raw HTTP Request\n')
console.log('API Key exists:', !!apiKey)
console.log('API Key:', apiKey)
console.log('Sending to:', testEmail)

const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: 'hello@manaboodle.com',
    to: [testEmail],
    subject: 'Test Email from Harvard Portal',
    html: '<h2>Test Email</h2><p>This is a test email from the Harvard Academic Portal.</p>'
  })
})

const data = await response.json()

console.log('\nResponse Status:', response.status)
console.log('Response:', JSON.stringify(data, null, 2))

if (response.ok) {
  console.log('\n✅ Email sent successfully!')
} else {
  console.log('\n❌ Failed to send email')
}
