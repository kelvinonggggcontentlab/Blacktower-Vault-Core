'use client';

import React, { useEffect, useState } from 'react';
import AccessPanel from '@/components/portal/AccessPanel';
import {
  BlacktowerBrand,
  BlacktowerFooter,
} from '@/components/portal/PortalChrome';
import {
  type PortalSessionUser,
  loadPortalSession,
} from '@/lib/portal/portal-auth';

export default function BlacktowerAuthPage() {
  const [user, setUser] = useState<PortalSessionUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    queueMicrotask(() => {
      setUser(loadPortalSession());
      setChecking(false);
    });
  }, []);

  return (
    <div className="flex flex-col min-h-svh bg-[#0B0F17] text-slate-100">
      <header className="border-b border-slate-800/80 flex items-center justify-between h-[72px] px-4 sm:px-8">
        <BlacktowerBrand subtitle="PRIVATE ACCESS" />
        <span className="hidden sm:inline-flex font-[family-name:var(--font-mono)] font-normal text-slate-400 items-center gap-2.5 text-[10px] tracking-wider">
          PRIVATE INFRASTRUCTURE
          <span className="bg-sky-400 w-1.5 h-1.5 shadow-[0_0_10px_rgba(56,189,248,0.6)] rounded-full shrink-0 inline-block" />
        </span>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <AccessPanel
            user={user}
            checking={checking}
            onUserChange={(nextUser) => setUser(nextUser)}
          />
        </div>
      </main>

      <BlacktowerFooter />
    </div>
  );
}
