import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clusters - Manaboodle',
  description: 'Advanced clustering analysis for JTBD interviews and research insights',
}

export default function ClustersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="clusters-isolated">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="clusters-body">
        <div className="clusters-app-wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}
