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
  title: 'BLACKTOWER OS™ — Ecosystem Showcase & Zero-Knowledge Gateway',
  description:
    'BLACKTOWER OS™ is the official product showcase and private gateway for the BLACKTOWER™ ecosystem, featuring BLACKTOWER VAULT™.',
  openGraph: {
    title: 'BLACKTOWER OS™ — Ecosystem Showcase & Zero-Knowledge Gateway',
    description:
      'Official product showcase and private gateway for completed BLACKTOWER™ security applications and zero-knowledge infrastructure.',
    type: 'website',
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
      className={`${spaceGrotesk.variable} ${manrope.variable} ${ibmPlexMono.variable} dark`}
    >
      <body className="bg-[#0B0F17] text-slate-100 font-[family-name:var(--font-sans)] antialiased selection:bg-sky-400 selection:text-slate-950 min-h-svh">
        {children}
      </body>
    </html>
  );
}
