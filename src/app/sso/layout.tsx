import { Newsreader, Karla } from 'next/font/google'

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-newsreader',
})

const karla = Karla({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-karla',
})

// The SSO pages use their own typefaces; the site header and footer are
// already hidden for /sso by LayoutContent.
export default function SsoLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${newsreader.variable} ${karla.variable}`}>{children}</div>
}
