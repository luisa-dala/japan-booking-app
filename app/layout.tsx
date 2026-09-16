import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Japan Stay — Find your perfect stay in Japan',
  description: 'Discover hotels, ryokans, and guesthouses across all of Japan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-stone-50 text-stone-900 antialiased">{children}</body>
    </html>
  );
}
