'use client';

import React, { useEffect, useState } from 'react';
import PortalLandingView from '@/components/portal/PortalLandingView';
import CommandDashboardView from '@/components/portal/CommandDashboardView';
import {
  type PortalSessionUser,
  loadPortalSession,
  savePortalSession,
} from '@/lib/portal/portal-auth';

export default function BlacktowerPortalHomePage() {
  const [user, setUser] = useState<PortalSessionUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [autostartCommand, setAutostartCommand] = useState(false);

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
        setAutostartCommand(true);
        setChecking(false);
        return;
      }

      const stored = loadPortalSession();
      setUser(stored);
      setChecking(false);
    });
  }, []);

  if (autostartCommand && user) {
    return (
      <CommandDashboardView
        user={user}
        onSignOut={() => {
          setAutostartCommand(false);
          setUser(null);
        }}
      />
    );
  }

  return (
    <PortalLandingView
      user={user}
      checking={checking}
      onUserChange={(nextUser) => setUser(nextUser)}
    />
  );
}
