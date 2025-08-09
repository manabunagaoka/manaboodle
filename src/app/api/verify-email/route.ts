import { NextRequest, NextResponse } from 'next/server'
import dns from 'dns'
import { promisify } from 'util'

const resolveMx = promisify(dns.resolveMx)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { valid: false, reason: 'Email is required' },
        { status: 400 }
      )
    }

    const emailLower = email.toLowerCase().trim()

    // Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailLower)) {
      return NextResponse.json({
        valid: false,
        reason: 'Invalid email format'
      })
    }

    // Must be .edu
    if (!emailLower.endsWith('.edu')) {
      return NextResponse.json({
        valid: false,
        reason: 'Must use a .edu email address'
      })
    }

    // Check for obvious fake domains
    const domain = emailLower.split('@')[1]
    const suspiciousDomains = [
      'fake.edu', 'test.edu', 'example.edu', 'dummy.edu', 
      'notreal.edu', '123.edu', 'xyz.edu', 'sample.edu'
    ]

    if (suspiciousDomains.includes(domain)) {
      return NextResponse.json({
        valid: false,
        reason: 'Please use your actual university email address'
      })
    }

    // Try to verify the domain has MX records (indicates it's a real domain)
    try {
      const mxRecords = await resolveMx(domain)
      if (!mxRecords || mxRecords.length === 0) {
        return NextResponse.json({
          valid: false,
          reason: 'University domain does not appear to be valid',
          warning: 'This email domain may not be active'
        })
      }
    } catch (dnsError) {
      // DNS lookup failed - domain might not exist
      console.log(`DNS lookup failed for ${domain}:`, dnsError)
      return NextResponse.json({
        valid: false,
        reason: 'University domain could not be verified',
        warning: 'Please ensure you are using a valid university email address'
      })
    }

    // Basic validation passed
    return NextResponse.json({
      valid: true,
      domain: domain,
      university: domain.replace('.edu', '').toUpperCase()
    })

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { 
        valid: false, 
        reason: 'Email verification service unavailable',
        warning: 'Please ensure you use a valid university email'
      },
      { status: 500 }
    )
  }
}
