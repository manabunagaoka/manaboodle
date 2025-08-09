import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Clusters - Manaboodle',
  description: 'Advanced clustering analysis for JTBD interviews and research insights',
}

export default function ClustersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
