import { Metadata } from 'next';
import './harvardclusters/globals.css';

export const metadata: Metadata = {
  title: 'Harvard Clusters - JTBD Analysis Tool',
  description: 'Customer interview analysis with AI-powered insights',
};

export default function IsolatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
