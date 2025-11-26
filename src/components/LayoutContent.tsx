'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Hide header/footer for SSO pages and admin pages
  const isSSO = pathname?.startsWith('/sso')
  const isAdmin = pathname?.startsWith('/academic-portal/admin')
  
  if (isSSO || isAdmin) {
    return <>{children}</>
  }
  
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
