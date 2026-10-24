// Email domains whose sign-ups are approved without a guest pass.
// Subdomains count too: 'harvard.edu' also covers 'gse.harvard.edu'.
// To approve another organization, add a line here. Both the sign-up page
// and the register API read this list.
export const AUTO_APPROVED_DOMAINS: { domain: string; accessType: string }[] = [
  { domain: 'harvard.edu', accessType: 'harvard' },
  { domain: 'manaboodle.com', accessType: 'harvard' }, // admin email, treated like harvard
]

// Returns the access type for an auto-approved email, or null if it needs a guest pass.
export function autoApprovedAccessType(email: string): string | null {
  const host = email.toLowerCase().split('@')[1]
  if (!host) return null
  const match = AUTO_APPROVED_DOMAINS.find(
    ({ domain }) => host === domain || host.endsWith('.' + domain)
  )
  return match ? match.accessType : null
}
