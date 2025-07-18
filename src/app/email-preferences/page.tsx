'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import styles from './page.module.css'

interface EmailPreferences {
 newsletter: boolean
 caseStudies: boolean
 concepts: boolean
 projects: boolean
 frequency: 'weekly' | 'monthly' | 'immediate'
}

function EmailPreferencesContent() {
 const searchParams = useSearchParams()
 const email = searchParams.get('email')
 const token = searchParams.get('token')
 
 const [preferences, setPreferences] = useState<EmailPreferences>({
   newsletter: true,
   caseStudies: true,
   concepts: true,
   projects: true,
   frequency: 'weekly'
 })
 
 const [loading, setLoading] = useState(false)
 const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

 useEffect(() => {
   // Load existing preferences if user is authenticated
   if (email && token) {
     loadPreferences()
   }
 }, [email, token])

 const loadPreferences = async () => {
   try {
     const response = await fetch(`/api/preferences?email=${email}&token=${token}`)
     if (response.ok) {
       const data = await response.json()
       setPreferences(data.preferences)
     }
   } catch (error) {
     console.error('Error loading preferences:', error)
   }
 }

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault()
   setLoading(true)
   setMessage(null)

   try {
     const response = await fetch('/api/preferences', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         email,
         token,
         preferences
       })
     })

     if (response.ok) {
       setMessage({
         type: 'success',
         text: 'Your email preferences have been updated successfully!'
       })
     } else {
       throw new Error('Failed to update preferences')
     }
   } catch (error) {
     setMessage({
       type: 'error',
       text: 'Sorry, we couldn\'t update your preferences. Please try again.'
     })
   } finally {
     setLoading(false)
   }
 }

 if (!email || !token) {
   return (
     <div className={styles.preferencesPage}>
       <div className={styles.unauthorizedMessage}>
         <h1 className={styles.unauthorizedTitle}>Email Preferences</h1>
         <p className={styles.unauthorizedText}>
           Please access this page through the link in your email to manage your preferences.
         </p>
       </div>
     </div>
   )
 }

 return (
   <div className={styles.preferencesPage}>
     <h1 className={styles.pageTitle}>Email Preferences</h1>
     
     <div className={styles.emailInfo}>
       <p className={styles.emailText}>
         Managing preferences for: <span className={styles.emailAddress}>{email}</span>
       </p>
     </div>

     <form onSubmit={handleSubmit} className={styles.form}>
       <div className={styles.section}>
         <h2 className={styles.sectionTitle}>Content Types</h2>
         <p className={styles.sectionDescription}>
           Choose what types of content you'd like to receive:
         </p>
         
         <div className={styles.optionsList}>
           <label className={styles.optionLabel}>
             <input
               type="checkbox"
               checked={preferences.newsletter}
               onChange={(e) => setPreferences({...preferences, newsletter: e.target.checked})}
               className={styles.checkbox}
             />
             <div className={styles.optionContent}>
               <span className={styles.optionTitle}>General Newsletter</span>
               <p className={styles.optionDescription}>Updates, announcements, and curated content</p>
             </div>
           </label>

           <label className={styles.optionLabel}>
             <input
               type="checkbox"
               checked={preferences.caseStudies}
               onChange={(e) => setPreferences({...preferences, caseStudies: e.target.checked})}
               className={styles.checkbox}
             />
             <div className={styles.optionContent}>
               <span className={styles.optionTitle}>Case Studies</span>
               <p className={styles.optionDescription}>In-depth analysis and real-world examples</p>
             </div>
           </label>

           <label className={styles.optionLabel}>
             <input
               type="checkbox"
               checked={preferences.concepts}
               onChange={(e) => setPreferences({...preferences, concepts: e.target.checked})}
               className={styles.checkbox}
             />
             <div className={styles.optionContent}>
               <span className={styles.optionTitle}>Concepts</span>
               <p className={styles.optionDescription}>Theoretical explorations and ideas</p>
             </div>
           </label>

           <label className={styles.optionLabel}>
             <input
               type="checkbox"
               checked={preferences.projects}
               onChange={(e) => setPreferences({...preferences, projects: e.target.checked})}
               className={styles.checkbox}
             />
             <div className={styles.optionContent}>
               <span className={styles.optionTitle}>Projects</span>
               <p className={styles.optionDescription}>Updates on ongoing projects and initiatives</p>
             </div>
           </label>
         </div>
       </div>

       <div className={styles.section}>
         <h2 className={styles.sectionTitle}>Email Frequency</h2>
         <p className={styles.sectionDescription}>
           How often would you like to hear from us?
         </p>
         
         <div className={styles.optionsList}>
           <label className={styles.optionLabel}>
             <input
               type="radio"
               name="frequency"
               value="immediate"
               checked={preferences.frequency === 'immediate'}
               onChange={(e) => setPreferences({...preferences, frequency: 'immediate'})}
               className={styles.radio}
             />
             <div className={styles.optionContent}>
               <span className={styles.optionTitle}>As Published</span>
               <p className={styles.optionDescription}>Get notified immediately when new content is published</p>
             </div>
           </label>

           <label className={styles.optionLabel}>
             <input
               type="radio"
               name="frequency"
               value="weekly"
               checked={preferences.frequency === 'weekly'}
               onChange={(e) => setPreferences({...preferences, frequency: 'weekly'})}
               className={styles.radio}
             />
             <div className={styles.optionContent}>
               <span className={styles.optionTitle}>Weekly Digest</span>
               <p className={styles.optionDescription}>Receive a summary of the week's content</p>
             </div>
           </label>

           <label className={styles.optionLabel}>
             <input
               type="radio"
               name="frequency"
               value="monthly"
               checked={preferences.frequency === 'monthly'}
               onChange={(e) => setPreferences({...preferences, frequency: 'monthly'})}
               className={styles.radio}
             />
             <div className={styles.optionContent}>
               <span className={styles.optionTitle}>Monthly Roundup</span>
               <p className={styles.optionDescription}>Get a monthly summary of all content</p>
             </div>
           </label>
         </div>
       </div>

       {message && (
         <div className={`${styles.message} ${
           message.type === 'success' ? styles.successMessage : styles.errorMessage
         }`}>
           {message.text}
         </div>
       )}

       <div className={styles.actions}>
         <button
           type="submit"
           disabled={loading}
           className={styles.saveButton}
         >
           {loading ? 'Saving...' : 'Save Preferences'}
         </button>
         
         
           href={`/unsubscribe?email=${email}&token=${token}`}
           className={styles.unsubscribeLink}
         >
           Unsubscribe from all emails
         </a>
       </div>
     </form>
   </div>
 )
}

export default function EmailPreferencesPage() {
 return (
   <Suspense fallback={<div>Loading...</div>}>
     <EmailPreferencesContent />
   </Suspense>
 )
}