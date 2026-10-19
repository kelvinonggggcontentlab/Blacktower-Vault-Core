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
          uid: 'bt-op-7f8a9c12',
          email: 'kelvinong.private@outlook.my',
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
        className="flex min-h-svh items-center justify-center bg-[oklch(10.5%_0.003_160)] text-[oklch(95.5%_0.004_150)] text-sm"
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
