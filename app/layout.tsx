import type { Metadata } from 'next';
import { Space_Grotesk, Manrope, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BLACKTOWER VAULT™ — Zero-Knowledge Personal Vault',
  description:
    'Security-first, zero-knowledge personal password and digital identity vault with four-tier AES-256-GCM & Argon2id key hierarchy.',
  openGraph: {
    title: 'BLACKTOWER VAULT™ — Zero-Knowledge Personal Vault',
    description:
      'Security-first, zero-knowledge personal password and digital identity vault with four-tier AES-256-GCM & Argon2id key hierarchy.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BLACKTOWER VAULT™ — Zero-Knowledge Personal Vault',
    description:
      'Security-first, zero-knowledge personal password and digital identity vault with four-tier AES-256-GCM & Argon2id key hierarchy.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${manrope.variable} ${ibmPlexMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="bg-[oklch(10.5%_0.003_160)] text-[oklch(95.5%_0.004_150)] antialiased selection:bg-[oklch(87.2%_0.283_140.5)] selection:text-[oklch(12%_0.02_145)] font-[family-name:var(--font-sans)] min-h-screen"
      >
        {children}
      </body>
    </html>
  );
}
