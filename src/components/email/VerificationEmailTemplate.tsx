import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Button,
} from '@react-email/components'

interface VerificationEmailProps {
  username: string
  verificationUrl: string
}

export default function VerificationEmailTemplate({ 
  username, 
  verificationUrl 
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Text style={heading}>Welcome to Manaboodle Academic Portal!</Text>
            
            <Text style={text}>
              Hi {username},
            </Text>
            
            <Text style={text}>
              Thank you for creating an account. To complete your registration and access the portal, 
              please verify your email address by clicking the button below:
            </Text>
            
            <Button style={button} href={verificationUrl}>
              Verify Email Address
            </Button>
            
            <Text style={text}>
              Or copy and paste this link into your browser:
            </Text>
            
            <Link href={verificationUrl} style={link}>
              {verificationUrl}
            </Link>
            
            <Text style={footer}>
              This verification link will expire in 24 hours.
              If you didn't create an account with Manaboodle, you can safely ignore this email.
            </Text>
            
            <Text style={footer}>
              Questions? Visit <Link href="https://www.manaboodle.com" style={link}>manaboodle.com</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const section = {
  padding: '0 48px',
}

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '32px 0',
  color: '#333333',
}

const text = {
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
  color: '#333333',
  margin: '16px 0',
}

const button = {
  backgroundColor: '#0066cc',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
  margin: '24px auto',
  width: '200px',
}

const link = {
  color: '#0066cc',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
}

const footer = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#666666',
  marginTop: '32px',
}
