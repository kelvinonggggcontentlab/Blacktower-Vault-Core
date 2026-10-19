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
    <div className="flex flex-col min-h-svh bg-[oklch(10.5%_0.003_160)] text-[oklch(95.5%_0.004_150)]">
      <header className="border-b border-[oklch(29%_0.008_160)] flex items-center justify-between h-[76px] px-[6%] min-[761px]:h-[92px] min-[761px]:px-[5%]">
        <BlacktowerBrand />
        <span className="font-[family-name:var(--font-mono)] font-normal text-[oklch(64%_0.006_160)] flex items-center gap-0 text-[0px] min-[761px]:gap-[17px] min-[761px]:text-[9px]">
          PRIVATE INFRASTRUCTURE
          <span className="bg-[oklch(87.2%_0.283_140.5)] w-[5px] h-[5px] shadow-[0_0_12px_oklch(87.2%_0.283_140.5/0.32)] rounded-full shrink-0 inline-block" />
        </span>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
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
