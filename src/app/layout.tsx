import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Deedsie — See the kindness happening around you',
  description: 'Join your town. Share a Deed. Make the world brighter.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
