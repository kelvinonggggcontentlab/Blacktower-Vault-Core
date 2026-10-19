'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CommandDashboardView from '@/components/portal/CommandDashboardView';
import {
  type PortalSessionUser,
  loadPortalSession,
  savePortalSession,
} from '@/lib/portal/portal-auth';

export default function BlacktowerCommandPage() {
  const router = useRouter();
  const [user, setUser] = useState<PortalSessionUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    queueMicrotask(() => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        const demoOperator: PortalSessionUser = {
          uid: 'bt-op-ed48f81c',
          email: 'blackmaster.blacktower@blacktowermail.com',
          verifiedAt: new Date().toISOString(),
        };
        savePortalSession(demoOperator);
        setUser(demoOperator);
        setChecking(false);
        return;
      }

      const stored = loadPortalSession();
      if (!stored) {
        router.replace('/auth');
        return;
      }
      setUser(stored);
      setChecking(false);
    });
  }, [router]);

  if (checking || !user) {
    return (
      <main
        role="status"
        className="flex min-h-svh items-center justify-center bg-[#0B0F17] text-slate-100 text-sm"
      >
        Verifying private access…
      </main>
    );
  }

  return (
    <CommandDashboardView
      user={user}
      onSignOut={() => {
        setUser(null);
      }}
    />
  );
}
