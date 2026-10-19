import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BLACKTOWER VAULT™ — Zero-Knowledge Personal Vault',
  description: 'Security-first, zero-knowledge personal password and digital identity vault with four-tier AES-256-GCM & Argon2id key hierarchy.',
  openGraph: {
    title: 'BLACKTOWER VAULT™ — Zero-Knowledge Personal Vault',
    description: 'Security-first, zero-knowledge personal password and digital identity vault with four-tier AES-256-GCM & Argon2id key hierarchy.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BLACKTOWER VAULT™ — Zero-Knowledge Personal Vault',
    description: 'Security-first, zero-knowledge personal password and digital identity vault with four-tier AES-256-GCM & Argon2id key hierarchy.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang="en"
      className="dark [--font-display:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif] [--font-sans:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif] [--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation_Mono','Courier_New',monospace]"
    >
      <body
        suppressHydrationWarning
        className="bg-[#0B0F17] text-slate-100 antialiased selection:bg-sky-500/30 selection:text-sky-100 font-sans min-h-screen"
      >
        {children}
      </body>
    </html>
  );
}

