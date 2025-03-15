import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import DebugProvider from '@/components/debug/DebugProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Interchange CC',
  description: 'A modern Next.js application with Neon database integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DebugProvider enabled={true}>
          {children}
        </DebugProvider>
      </body>
    </html>
  );
}
