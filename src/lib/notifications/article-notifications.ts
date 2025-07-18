// src/lib/notifications/article-notifications.ts
import { createClient } from '@supabase/supabase-js';
import type { ArticleMetadata } from '@/components/ArticleTemplate';

// Types for the notification system
export interface NotificationPreferences {
  email: string;
  categories: {
    casestudies: boolean;
    concepts: boolean;
    projects: boolean;
    random: boolean;
  };
  frequency: 'instant' | 'daily' | 'weekly';
  tiers: ('free' | 'premium' | 'enterprise')[];
}

export interface NotificationJob {
  id: string;
  articleId: string;
  action: 'published' | 'updated';
  scheduledFor: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  recipientCount: number;
  metadata: ArticleMetadata;
}

// Initialize Supabase client (update with your credentials)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Use service key for server-side operations
);

/**
 * Get subscribers who should be notified about an article
 */
export async function getArticleSubscribers(
  article: ArticleMetadata,
  action: 'published' | 'updated'
): Promise<NotificationPreferences[]> {
  try {
    // Query subscribers based on their preferences
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email_notifications', true)
      .contains('categories', [article.category]);

    if (error) throw error;

    // Filter by tier preferences if article is paid
    let filteredSubscribers = subscribers || [];
    
    if (article.isPaid && article.tier) {
      filteredSubscribers = filteredSubscribers.filter(sub => 
        sub.subscription_tier === article.tier || 
        (sub.subscription_tier === 'enterprise' && article.tier !== 'enterprise')
      );
    }

    // Filter by notification frequency
    const now = new Date();
    filteredSubscribers = filteredSubscribers.filter(sub => {
      if (sub.frequency === 'instant') return true;
      
      // For daily/weekly, check last notification date
      const lastNotified = sub.last_notified ? new Date(sub.last_notified) : null;
      if (!lastNotified) return true;
      
      if (sub.frequency === 'daily') {
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return lastNotified < oneDayAgo;
      }
      
      if (sub.frequency === 'weekly') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return lastNotified < oneWeekAgo;
      }
      
      return false;
    });

    return filteredSubscribers;
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return [];
  }
}

/**
 * Queue notifications for an article
 */
export async function queueArticleNotifications(
  article: ArticleMetadata,
  action: 'published' | 'updated'
): Promise<NotificationJob> {
  try {
    // Get eligible subscribers
    const subscribers = await getArticleSubscribers(article, action);
    
    // Create notification job
    const job: NotificationJob = {
      id: `${article.id}-${Date.now()}`,
      articleId: article.id,
      action,
      scheduledFor: new Date(),
      status: 'pending',
      recipientCount: subscribers.length,
      metadata: article,
    };

    // Store job in database (you'll need to create this table)
    const { error } = await supabase
      .from('notification_jobs')
      .insert([{
        ...job,
        subscribers: subscribers.map(s => s.email),
      }]);

    if (error) throw error;

    // In production, this would trigger a background job
    // For now, just log
    console.log(`Queued notifications for ${subscribers.length} subscribers`);

    return job;
  } catch (error) {
    console.error('Error queueing notifications:', error);
    throw error;
  }
}

/**
 * Send notification email (placeholder for actual implementation)
 */
export async function sendArticleNotificationEmail(
  subscriber: NotificationPreferences,
  article: ArticleMetadata,
  action: 'published' | 'updated'
): Promise<boolean> {
  try {
    // This is where you'd integrate with your email service
    // (SendGrid, AWS SES, Resend, etc.)
    
    const subject = action === 'published' 
      ? `New ${article.category}: ${article.title}`
      : `Updated: ${article.title}`;
    
    const body = `
      <h2>${article.title}</h2>
      <p>${article.excerpt}</p>
      <p><a href="${process.env.NEXT_PUBLIC_URL}/${article.category}/${article.id}">Read more →</a></p>
      
      <hr>
      <p><small>
        You're receiving this because you're subscribed to ${article.category} updates.
        <a href="${process.env.NEXT_PUBLIC_URL}/preferences?email=${subscriber.email}">Update preferences</a>
      </small></p>
    `;

    // Log for development
    console.log('Would send email:', {
      to: subscriber.email,
      subject,
      preview: article.excerpt,
    });

    // Update last notified timestamp
    await supabase
      .from('subscribers')
      .update({ last_notified: new Date().toISOString() })
      .eq('email', subscriber.email);

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Process a notification job
 */
export async function processNotificationJob(jobId: string): Promise<void> {
  try {
    // Get job details
    const { data: job, error } = await supabase
      .from('notification_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error || !job) throw error || new Error('Job not found');

    // Update status
    await supabase
      .from('notification_jobs')
      .update({ status: 'processing' })
      .eq('id', jobId);

    // Send emails
    let successCount = 0;
    for (const email of job.subscribers) {
      const success = await sendArticleNotificationEmail(
        { email, ...job.metadata },
        job.metadata,
        job.action
      );
      if (success) successCount++;
    }

    // Update job completion
    await supabase
      .from('notification_jobs')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString(),
        success_count: successCount,
      })
      .eq('id', jobId);

  } catch (error) {
    console.error('Error processing notification job:', error);
    
    // Mark job as failed
    await supabase
      .from('notification_jobs')
      .update({ 
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      .eq('id', jobId);
  }
}

/**
 * Hook to trigger notifications when article is published/updated
 * This would be called from your article publishing flow
 */
export async function onArticlePublished(article: ArticleMetadata): Promise<void> {
  try {
    const job = await queueArticleNotifications(article, 'published');
    
    // In production, trigger background job processor
    // For now, process immediately
    await processNotificationJob(job.id);
  } catch (error) {
    console.error('Error in article publish hook:', error);
  }
}

export async function onArticleUpdated(
  article: ArticleMetadata,
  previousVersion: ArticleMetadata
): Promise<void> {
  try {
    // Only notify if significant changes
    const significantChange = 
      article.title !== previousVersion.title ||
      article.excerpt !== previousVersion.excerpt ||
    
    if (significantChange) {
      const job = await queueArticleNotifications(article, 'updated');
      await processNotificationJob(job.id);
    }
  } catch (error) {
    console.error('Error in article update hook:', error);
  }
}

// Database schema for notification_jobs table
export const notificationJobsSchema = `
CREATE TABLE notification_jobs (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('published', 'updated')),
  scheduled_for TIMESTAMP NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  recipient_count INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL,
  subscribers TEXT[] NOT NULL,
  completed_at TIMESTAMP,
  success_count INTEGER DEFAULT 0,
  error TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notification_jobs_status ON notification_jobs(status);
CREATE INDEX idx_notification_jobs_scheduled ON notification_jobs(scheduled_for);
`;