import './globals.css';

export const metadata = {
  title: 'Clusters - JTBD Analysis Tool',
  description: 'Customer interview analysis with AI-powered insights',
};

export default function HarvardClustersLayout({
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
