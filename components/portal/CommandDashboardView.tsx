'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarCheck,
  ClipboardCheck,
  DatabaseBackup,
  LayoutGrid,
  ListTodo,
  LogOut,
  Search,
  ShieldCheck,
  Unplug,
  X,
} from 'lucide-react';
import {
  COMMAND_CENTRE_NOTION_URL,
  PORTAL_WORKSPACES,
  type PortalSessionUser,
  type PortalWorkspaceItem,
  filterWorkspaces,
  sanitizeExternalHttpsUrl,
  savePortalSession,
} from '@/lib/portal/portal-auth';
import { BlacktowerBrand, BlacktowerFooter } from './PortalChrome';

interface CommandDashboardViewProps {
  user: PortalSessionUser;
  onSignOut?: () => void;
}

function renderWorkspaceIcon(iconKey: PortalWorkspaceItem['iconKey']) {
  const props = { size: 22, strokeWidth: 1.4, 'aria-hidden': true as const };
  switch (iconKey) {
    case 'list-todo':
      return <ListTodo {...props} />;
    case 'calendar-check':
      return <CalendarCheck {...props} />;
    case 'layout-grid':
      return <LayoutGrid {...props} />;
    case 'briefcase-business':
      return <BriefcaseBusiness {...props} />;
    case 'database-backup':
      return <DatabaseBackup {...props} />;
    case 'clipboard-check':
      return <ClipboardCheck {...props} />;
    case 'book-open':
      return <BookOpen {...props} />;
    case 'shield-lock':
      return <ShieldCheck {...props} />;
    default:
      return <LayoutGrid {...props} />;
  }
}

export default function CommandDashboardView({
  user,
  onSignOut,
}: CommandDashboardViewProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [signingOut, setSigningOut] = useState(false);

  const filtered = filterWorkspaces(PORTAL_WORKSPACES, query);
  const commandCentreHref = sanitizeExternalHttpsUrl(COMMAND_CENTRE_NOTION_URL);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      savePortalSession(null);
      onSignOut?.();
      router.push('/auth');
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="flex flex-col min-h-svh bg-[oklch(10.5%_0.003_160)] text-[oklch(95.5%_0.004_150)]">
      <header className="border-b border-[oklch(29%_0.008_160)] flex items-center justify-between h-[76px] px-[6%] min-[761px]:h-[92px] min-[761px]:px-[5%]">
        <BlacktowerBrand />
        <div className="flex items-center gap-[18px]">
          <span className="hidden min-[761px]:inline font-[family-name:var(--font-mono)] text-[10px] font-normal text-[oklch(64%_0.006_160)]">
            PRIVATE WORKSPACE
          </span>
          <button
            type="button"
            disabled={signingOut}
            aria-label="Sign out"
            title="Sign out"
            onClick={handleSignOut}
            className="w-[44px] h-[44px] rounded-md inline-flex items-center justify-center text-[oklch(64%_0.006_160)] hover:bg-[oklch(24%_0.014_150)] hover:text-[oklch(95.5%_0.004_150)] transition-colors cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className="w-full max-w-[1400px] mx-auto py-[28px] px-[6%] min-[761px]:pt-[40px] min-[761px]:px-[5%] min-[761px]:pb-[30px]">
        <div className="flex flex-col items-start gap-[18px] min-[761px]:flex-row min-[761px]:items-center min-[761px]:justify-between min-[761px]:gap-[24px]">
          <div>
            <p className="font-[family-name:var(--font-mono)] font-normal text-[oklch(64%_0.006_160)] flex items-center gap-[10px] mt-0 mb-[15px] text-[9px]">
              <span className="bg-[oklch(87.2%_0.283_140.5)] w-[20px] h-[1px] shrink-0" />
              PRIVATE COMMAND PORTAL
            </p>
            <h1 className="font-[family-name:var(--font-display)] font-medium text-[28px] min-[761px]:text-[36px] leading-[1.2] m-0">
              BLACKTOWER{' '}
              <span className="block min-[761px]:inline text-[oklch(87.2%_0.283_140.5)]">
                NEXUS OS
              </span>
            </h1>
            <h2 className="font-[family-name:var(--font-display)] font-medium text-[20px] leading-[1.4] mt-[20px]">
              Today / Command Centre
            </h2>
            <p className="text-[oklch(64%_0.006_160)] mt-[6px] text-[15px] leading-[1.6]">
              Daily priorities, project plans and workspace references.
            </p>
            <p className="text-[oklch(64%_0.006_160)] wrap-anywhere mt-[10px] text-[12px]">
              {user.email}
            </p>
          </div>

          {commandCentreHref && (
            <a
              href={commandCentreHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Command Centre in Notion (new tab)"
              className="min-h-[44px] px-4 py-2 rounded-md border border-[oklch(30%_0.006_160)] bg-[oklch(10.5%_0.003_160)] text-[oklch(95.5%_0.004_150)] text-sm font-medium inline-flex items-center gap-2 hover:bg-[oklch(24%_0.014_150)] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Command Centre</span>
              <ArrowUpRight size={16} />
            </a>
          )}
        </div>

        <section aria-labelledby="workspaces">
          <div className="flex flex-col items-stretch gap-[12px] min-[761px]:flex-row min-[761px]:items-center min-[761px]:justify-between min-[761px]:gap-[16px] mt-[32px] mb-[10px]">
            <h2
              id="workspaces"
              className="font-[family-name:var(--font-display)] font-medium text-[20px]"
            >
              Your workspaces
            </h2>

            <div className="relative flex items-center w-full min-[761px]:w-[320px] max-w-full">
              <Search
                size={18}
                aria-hidden="true"
                className="text-[oklch(64%_0.006_160)] pointer-events-none absolute left-[14px]"
              />
              <input
                type="search"
                aria-label="Search workspaces"
                placeholder="Search workspaces…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex w-full h-[44px] pl-[42px] pr-[44px] py-1 rounded-md border border-[oklch(30%_0.006_160)] bg-[oklch(16%_0.004_160)] text-[14px] text-[oklch(95.5%_0.004_150)] placeholder:text-[oklch(64%_0.006_160)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[oklch(87.2%_0.283_140.5)] transition-colors"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear workspace search"
                  title="Clear search"
                  onClick={() => setQuery('')}
                  className="w-[44px] h-[44px] absolute right-0 inline-flex items-center justify-center rounded-md text-[oklch(64%_0.006_160)] hover:bg-[oklch(24%_0.014_150)] hover:text-[oklch(95.5%_0.004_150)] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <p
            role="status"
            className="text-[oklch(64%_0.006_160)] mb-[16px] text-[12px] tabular-nums"
          >
            {filtered.length} of {PORTAL_WORKSPACES.length} workspaces
          </p>

          <div className="grid grid-cols-1 gap-[12px] min-[761px]:grid-cols-2 min-[761px]:gap-[18px] min-[1051px]:grid-cols-3">
            {filtered.map((item) => {
              const externalHref = sanitizeExternalHttpsUrl(item.url);
              return (
                <article
                  key={item.id}
                  className="border border-[oklch(29%_0.008_160)] bg-[oklch(16%_0.004_160)] bg-[linear-gradient(140deg,oklch(38%_0.02_150/0.09),transparent_48%)] rounded-[8px] flex flex-col p-[20px]"
                >
                  <div className="flex items-center justify-between mb-[14px]">
                    <span className="w-[44px] h-[44px] rounded-[6px] border border-[oklch(29%_0.008_160)] bg-[oklch(87.2%_0.283_140.5/0.04)] text-[oklch(87.2%_0.283_140.5)] grid place-items-center">
                      {renderWorkspaceIcon(item.iconKey)}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[10px] font-normal text-[oklch(64%_0.006_160)] tabular-nums">
                      {item.indexLabel}
                    </span>
                  </div>

                  <h3 className="font-[family-name:var(--font-display)] font-medium text-[18px] leading-[1.4] wrap-anywhere">
                    {item.name}
                  </h3>
                  <p className="text-[oklch(64%_0.006_160)] mt-[6px] mb-[16px] text-[14px] leading-[1.5]">
                    {item.description}
                  </p>

                  {item.internalRoute ? (
                    <Link
                      href={item.internalRoute}
                      aria-label={`Open ${item.name}`}
                      className="border-t border-[oklch(29%_0.008_160)] w-full min-h-[44px] text-[oklch(87.2%_0.283_140.5)] hover:text-[oklch(95.5%_0.004_150)] inline-flex items-center justify-between mt-auto pt-[10px] text-[14px] font-medium transition-colors"
                    >
                      <span>{item.actionLabel ?? 'Open application'}</span>
                      <ArrowUpRight size={16} />
                    </Link>
                  ) : externalHref ? (
                    <a
                      href={externalHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${item.name} in Notion (new tab)`}
                      className="border-t border-[oklch(29%_0.008_160)] w-full min-h-[44px] text-[oklch(87.2%_0.283_140.5)] hover:text-[oklch(95.5%_0.004_150)] inline-flex items-center justify-between mt-auto pt-[10px] text-[14px] font-medium transition-colors"
                    >
                      <span>Open in Notion</span>
                      <ArrowUpRight size={16} />
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="border-t border-[oklch(29%_0.008_160)] w-full min-h-[44px] text-[oklch(64%_0.006_160)] inline-flex items-center justify-start mt-auto pt-[10px] text-[14px] font-medium cursor-not-allowed"
                    >
                      Link to be configured
                    </button>
                  )}
                </article>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-wrap items-center gap-[18px] py-[36px] wrap-anywhere">
              <p>No workspaces match “{query}”.</p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="min-h-[44px] px-4 py-2 rounded-md border border-[oklch(30%_0.006_160)] bg-[oklch(10.5%_0.003_160)] text-[oklch(95.5%_0.004_150)] text-sm font-medium hover:bg-[oklch(24%_0.014_150)] transition-colors cursor-pointer"
              >
                Clear search
              </button>
            </div>
          )}
        </section>

        <section
          aria-labelledby="system-status"
          className="border-y border-[oklch(29%_0.008_160)] flex flex-wrap min-[761px]:flex-nowrap items-start gap-[16px] mt-[28px] py-[22px]"
        >
          <Unplug
            aria-hidden="true"
            className="text-[oklch(64%_0.006_160)] shrink-0 w-[22px] h-[22px]"
          />
          <div className="flex-1 min-w-0">
            <h2
              id="system-status"
              className="font-[family-name:var(--font-display)] font-medium text-[17px] leading-[1.4] mb-[6px]"
            >
              System status
            </h2>
            <p className="text-[14px] leading-[1.6]">
              Workspace integrations are not connected yet.
            </p>
            <p className="text-[oklch(64%_0.006_160)] text-[13px] leading-[1.6]">
              Mirror, backup and audit are planning links only — no live sync or
              metrics.
            </p>
          </div>
          <span className="font-[family-name:var(--font-mono)] text-[10px] font-normal text-[oklch(64%_0.006_160)] whitespace-nowrap ml-[38px] min-[761px]:ml-auto pt-[3px]">
            NOT CONNECTED
          </span>
        </section>
      </main>

      <BlacktowerFooter />
    </div>
  );
}
