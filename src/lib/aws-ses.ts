import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Initialize SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  from?: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = process.env.SES_FROM_EMAIL || "hello@manaboodle.com",
  replyTo,
}: EmailOptions) {
  // Ensure 'to' is always an array
  const toAddresses = Array.isArray(to) ? to : [to];

  const params = {
    Source: from,
    Destination: {
      ToAddresses: toAddresses,
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: html,
          Charset: "UTF-8",
        },
        Text: {
          Data: text,
          Charset: "UTF-8",
        },
      },
    },
    ...(replyTo && {
      ReplyToAddresses: [replyTo],
    }),
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    return { success: true, messageId: response.MessageId };
  } catch (error) {
    console.error("SES send error:", error);
    throw error;
  }
}

// Specific email functions for different purposes
export async function sendContactNotification({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; margin-bottom: 20px;">📬 New Contact Form Submission</h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 8px 0;"><strong>From:</strong> ${name}</p>
        <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 8px 0;"><strong>Subject:</strong> ${subject}</p>
      </div>
      
      <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
        <h3 style="color: #333; margin-top: 0;">Message:</h3>
        <p style="white-space: pre-wrap; line-height: 1.6; color: #555;">${message}</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">
      <p style="color: #6c757d; font-size: 12px; text-align: center;">
        This message was sent from the Manaboodle contact form.<br>
        Submitted at: ${new Date().toLocaleString()}
      </p>
    </div>
  `;

  const text = `
New contact form submission from ${name} (${email})

Subject: ${subject}

Message:
${message}

Submitted at: ${new Date().toLocaleString()}
  `;

  return sendEmail({
    to: process.env.SES_CONTACT_EMAIL || "hello@manaboodle.com",
    subject: `Contact Form: ${subject}`,
    html,
    text,
    replyTo: email,
  });
}

export async function sendWelcomeEmail({
  email,
  unsubscribeToken,
}: {
  email: string;
  unsubscribeToken: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://manaboodle.com';
  const unsubscribeUrl = `${baseUrl}/unsubscribe/${unsubscribeToken}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; margin-bottom: 20px;">🎉 Welcome to Manaboodle!</h2>
      
      <p style="color: #666; line-height: 1.6; font-size: 16px;">
        Thanks for subscribing to article notifications! You'll now receive an email whenever I publish new content.
      </p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="color: #555; margin: 0; font-size: 14px;">
          <strong>What to expect:</strong><br>
          • Notifications for new articles and insights<br>
          • No spam, just quality content<br>
          • Easy unsubscribe anytime
        </p>
      </div>
      
      <p style="color: #666; line-height: 1.6;">
        Best regards,<br>
        Manabu Nagaoka<br>
        <a href="https://manaboodle.com" style="color: #0066cc;">manaboodle.com</a>
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">
        You're receiving this because you subscribed to Manaboodle updates.<br>
        <a href="${unsubscribeUrl}" style="color: #0066cc;">Unsubscribe instantly</a> | 
        <a href="${baseUrl}/unsubscribe" style="color: #0066cc;">Manage preferences</a>
      </p>
    </div>
  `;

  const text = `
Welcome to Manaboodle!

Thanks for subscribing to article notifications! You'll now receive an email whenever I publish new content.

What to expect:
• Notifications for new articles and insights  
• No spam, just quality content
• Easy unsubscribe anytime

Best regards,
Manabu Nagaoka
manaboodle.com

To unsubscribe: ${unsubscribeUrl}
Or visit: ${baseUrl}/unsubscribe
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to Manaboodle Updates!',
    html,
    text,
    from: process.env.SES_NEWSLETTER_EMAIL || "subscription@manaboodle.com",
  });
}

// For future use: Send article notification
export async function sendArticleNotification({
  email,
  articleTitle,
  articleUrl,
  articleExcerpt,
  unsubscribeToken,
}: {
  email: string;
  articleTitle: string;
  articleUrl: string;
  articleExcerpt: string;
  unsubscribeToken: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://manaboodle.com';
  const unsubscribeUrl = `${baseUrl}/unsubscribe/${unsubscribeToken}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; margin-bottom: 20px;">📚 New Article on Manaboodle</h2>
      
      <h3 style="color: #0066cc; margin: 20px 0;">
        <a href="${articleUrl}" style="color: #0066cc; text-decoration: none;">${articleTitle}</a>
      </h3>
      
      <p style="color: #666; line-height: 1.6; font-size: 16px; margin-bottom: 20px;">
        ${articleExcerpt}
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${articleUrl}" style="background-color: #0066cc; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Read Full Article
        </a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">
        You're receiving this because you subscribed to Manaboodle updates.<br>
        <a href="${unsubscribeUrl}" style="color: #0066cc;">Unsubscribe</a>
      </p>
    </div>
  `;

  const text = `
New Article on Manaboodle

${articleTitle}

${articleExcerpt}

Read full article: ${articleUrl}

---
Unsubscribe: ${unsubscribeUrl}
  `;

  return sendEmail({
    to: email,
    subject: `New Article: ${articleTitle}`,
    html,
    text,
    from: process.env.SES_NEWSLETTER_EMAIL || "subscription@manaboodle.com",
  });
}