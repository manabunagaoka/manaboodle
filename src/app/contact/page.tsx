'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './contact.module.css';

export default function ContactPage() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactStatus, setContactStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json();

      if (response.ok) {
        setContactStatus('success');
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setContactStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setContactStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>← Back to Home</Link>
      
      <header className={styles.header}>
        <h1 className={styles.title}>Contact</h1>
        <p className={styles.subtitle}>
          Whether you have feedback, partnership ideas, or just want to say hello - I'm always excited to connect with fellow creators and thinkers.
        </p>
      </header>

      <div className={styles.dividerLine}></div>

      {/* Contact Form Section */}
      <section className={styles.contactSection}>
        <form onSubmit={handleContact} className={styles.contactForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Name</label>
              <input
                type="text"
                id="name"
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                className={styles.input}
                required
                maxLength={100}
                disabled={contactStatus === 'submitting'}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                className={styles.input}
                required
                disabled={contactStatus === 'submitting'}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subject" className={styles.label}>Subject</label>
            <input
              type="text"
              id="subject"
              value={contactForm.subject}
              onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
              className={styles.input}
              required
              maxLength={200}
              disabled={contactStatus === 'submitting'}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>Message</label>
            <textarea
              id="message"
              value={contactForm.message}
              onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
              className={styles.textarea}
              rows={6}
              required
              maxLength={2000}
              disabled={contactStatus === 'submitting'}
            />
            <small className={styles.charCount}>
              {contactForm.message.length}/2000 characters
            </small>
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={contactStatus === 'submitting'}
          >
            {contactStatus === 'submitting' ? 'Sending Message...' : 'Send Message'}
          </button>

          {contactStatus === 'success' && (
            <div className={styles.successMessage}>
              ✨ Message sent successfully! I'll get back to you as soon as possible. Check your email for a confirmation.
            </div>
          )}

          {contactStatus === 'error' && (
            <div className={styles.errorMessage}>
              ❌ {errorMessage}
            </div>
          )}
        </form>
      </section>
    </div>
  );
}