import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Container,
  Hr,
} from '@react-email/components';

interface ContactEmailTemplateProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactEmailTemplate = ({
  name,
  email,
  subject,
  message,
}: ContactEmailTemplateProps) => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>New contact form submission from {name}</Preview>
      
      <Container style={containerStyle}>
        <Section style={headerStyle}>
          <Heading style={headingStyle}>
            📬 New Contact Form Submission
          </Heading>
        </Section>
        
        <Section style={contentStyle}>
          <Text style={labelStyle}>From:</Text>
          <Text style={valueStyle}>{name} ({email})</Text>
          
          <Text style={labelStyle}>Subject:</Text>
          <Text style={valueStyle}>{subject}</Text>
          
          <Text style={labelStyle}>Message:</Text>
          <Text style={messageStyle}>{message}</Text>
        </Section>
        
        <Hr style={hrStyle} />
        
        <Section style={footerStyle}>
          <Text style={footerTextStyle}>
            This message was sent from the Manaboodle contact form.
          </Text>
          <Text style={footerTextStyle}>
            Submitted at: {new Date().toLocaleString()}
          </Text>
        </Section>
      </Container>
    </Html>
  );
};

// Styles
const containerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '20px',
  fontFamily: 'Inter, Helvetica, Arial, sans-serif',
};

const headerStyle = {
  backgroundColor: '#f8fafc',
  padding: '20px',
  borderRadius: '8px 8px 0 0',
  textAlign: 'center' as const,
};

const headingStyle = {
  color: '#1e293b',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0',
};

const contentStyle = {
  backgroundColor: '#ffffff',
  padding: '20px',
  border: '1px solid #e2e8f0',
};

const labelStyle = {
  color: '#64748b',
  fontSize: '14px',
  fontWeight: '500',
  margin: '16px 0 4px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const valueStyle = {
  color: '#1e293b',
  fontSize: '16px',
  margin: '0 0 16px 0',
  lineHeight: '1.5',
};

const messageStyle = {
  color: '#1e293b',
  fontSize: '16px',
  margin: '0',
  lineHeight: '1.6',
  backgroundColor: '#f8fafc',
  padding: '16px',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  whiteSpace: 'pre-wrap' as const,
};

const hrStyle = {
  border: 'none',
  borderTop: '1px solid #e2e8f0',
  margin: '20px 0',
};

const footerStyle = {
  backgroundColor: '#f8fafc',
  padding: '16px',
  borderRadius: '0 0 8px 8px',
  textAlign: 'center' as const,
};

const footerTextStyle = {
  color: '#64748b',
  fontSize: '12px',
  margin: '4px 0',
};