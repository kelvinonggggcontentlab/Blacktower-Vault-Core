'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Archive,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Cpu,
  Database,
  DatabaseBackup,
  EyeOff,
  KeyRound,
  LayoutGrid,
  ListTodo,
  Lock,
  LogOut,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import {
  COMMAND_CENTRE_NOTION_URL,
  PORTAL_WORKSPACES,
  type PortalSessionUser,
  type PortalWorkspaceItem,
  filterWorkspaces,
  getApprovedShowcaseProducts,
  getPreservedInternalWorkspaces,
  sanitizeExternalHttpsUrl,
  savePortalSession,
  toggleProjectVisibility,
} from '@/lib/portal/portal-auth';
import { BlacktowerBrand, BlacktowerFooter } from './PortalChrome';

interface CommandDashboardViewProps {
  user: PortalSessionUser;
  onSignOut?: () => void;
}

type PortalViewTab = 'showcase' | 'architecture' | 'internal';

function renderWorkspaceIcon(iconKey: PortalWorkspaceItem['iconKey']) {
  const props = { size: 20, strokeWidth: 1.6, 'aria-hidden': true as const };
  switch (iconKey) {
    case 'shield-lock':
      return <ShieldCheck {...props} />;
    case 'eye-off':
      return <EyeOff {...props} />;
    case 'database-lock':
      return <Database {...props} />;
    case 'cpu-check':
      return <Cpu {...props} />;
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
    default:
      return <ShieldCheck {...props} />;
  }
}

export default function CommandDashboardView({
  user,
  onSignOut,
}: CommandDashboardViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PortalViewTab>('showcase');
  const [items, setItems] = useState<PortalWorkspaceItem[]>(PORTAL_WORKSPACES);
  const [query, setQuery] = useState('');
  const [signingOut, setSigningOut] = useState(false);
  const [updatingSlug, setUpdatingSlug] = useState<string | null>(null);

  // Synchronize preserved project catalog from Cloud SQL PostgreSQL
  useEffect(() => {
    let active = true;
    fetch('/api/portal/projects')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && Array.isArray(data?.items) && data.items.length > 0) {
          setItems(data.items);
        }
      })
      .catch(() => null);
    return () => {
      active = false;
    };
  }, []);

  const showcaseProducts = getApprovedShowcaseProducts(items);
  const internalWorkspaces = getPreservedInternalWorkspaces(items);

  const filteredShowcase = filterWorkspaces(showcaseProducts, query);
  const filteredInternal = filterWorkspaces(internalWorkspaces, query);
  const commandCentreHref = sanitizeExternalHttpsUrl(COMMAND_CENTRE_NOTION_URL);

  async function handleToggleVisibility(item: PortalWorkspaceItem) {
    const nextVisibility =
      item.visibility === 'primary_showcase'
        ? 'internal_archive'
        : 'primary_showcase';
    setUpdatingSlug(item.id);
    setItems((prev) => toggleProjectVisibility(prev, item.id));
    try {
      const res = await fetch('/api/portal/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: item.id, visibility: nextVisibility }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.items)) {
          setItems(data.items);
        }
      }
    } catch {
      // Local state update remains intact
    } finally {
      setUpdatingSlug(null);
    }
  }

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
    <div className="flex flex-col min-h-svh bg-[#0B0F17] text-slate-100">
      {/* Unified 3-Zone Top Bar matching BLACKTOWER VAULT™ Design Authority */}
      <header className="border-b border-slate-800/80 bg-[#0B0F17]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center justify-between gap-2 sm:gap-6 px-4 sm:px-6 py-3 sm:py-3.5 max-w-7xl mx-auto">
          {/* Zone 1: Brand Wordmark */}
          <BlacktowerBrand subtitle="OS SHOWCASE" />

          {/* Zone 2 (Desktop): Primary View Navigation Tabs */}
          <nav
            aria-label="BLACKTOWER OS Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium"
          >
            <button
              type="button"
              onClick={() => {
                setActiveTab('showcase');
                setQuery('');
              }}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
                activeTab === 'showcase'
                  ? 'border-sky-400 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-100'
              }`}
            >
              Product Showcase ({showcaseProducts.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('architecture');
                setQuery('');
              }}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
                activeTab === 'architecture'
                  ? 'border-sky-400 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-100'
              }`}
            >
              Security Architecture
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('internal');
                setQuery('');
              }}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
                activeTab === 'internal'
                  ? 'border-sky-400 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-100'
              }`}
            >
              Internal Workspaces ({internalWorkspaces.length})
            </button>
          </nav>

          {/* Zone 3: Operator Session & Direct Vault Launch */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="hidden xl:inline-block font-[family-name:var(--font-mono)] text-xs text-slate-400 truncate max-w-[200px]">
              {user.email}
            </span>
            <Link
              href="/vault"
              className="px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-sky-500 hover:bg-sky-400 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Open Vault</span>
            </Link>
            <button
              type="button"
              disabled={signingOut}
              aria-label="Sign out"
              title="Sign out"
              onClick={handleSignOut}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-slate-800 hover:border-slate-700 inline-flex items-center justify-center text-slate-400 hover:bg-slate-800/80 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

        {/* Zone 2 (Mobile): Compact Full-Width Navigation Bar */}
        <nav
          aria-label="BLACKTOWER OS Mobile Navigation"
          className="flex md:hidden items-center justify-between gap-2 px-4 py-2 border-t border-slate-800/60 text-xs font-medium"
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab('showcase');
              setQuery('');
            }}
            className={`py-1 transition-colors whitespace-nowrap border-b-2 cursor-pointer ${
              activeTab === 'showcase'
                ? 'border-sky-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-100'
            }`}
          >
            Showcase ({showcaseProducts.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('architecture');
              setQuery('');
            }}
            className={`py-1 transition-colors whitespace-nowrap border-b-2 cursor-pointer ${
              activeTab === 'architecture'
                ? 'border-sky-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-100'
            }`}
          >
            Architecture
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('internal');
              setQuery('');
            }}
            className={`py-1 transition-colors whitespace-nowrap border-b-2 cursor-pointer ${
              activeTab === 'internal'
                ? 'border-sky-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-100'
            }`}
          >
            Internal ({internalWorkspaces.length})
          </button>
        </nav>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
        {/* ================================================================ */}
        {/* TAB 1: PRIMARY PRODUCT SHOWCASE (DEFAULT)                        */}
        {/* ================================================================ */}
        {activeTab === 'showcase' && (
          <>
            {/* Executive Showcase Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800/80 pb-6">
              <div className="space-y-2.5 max-w-3xl">
                <div className="inline-flex items-center gap-2 text-xs font-[family-name:var(--font-mono)] text-sky-400 tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span>BLACKTOWER™ ECOSYSTEM · COMPLETED &amp; APPROVED PRODUCTS</span>
                </div>
                <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  BLACKTOWER OS™ Product Showcase
                </h1>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Verified systems built and approved by BLACKTOWER™. Explore
                  our production zero-knowledge password vault, display exposure
                  defense engine, Cloud SQL ciphertext sync, and live
                  cryptographic verification suite.
                </p>
              </div>

              {/* Search Approved Products */}
              <div className="relative flex items-center w-full lg:w-80 shrink-0">
                <Search
                  size={16}
                  aria-hidden="true"
                  className="text-slate-400 pointer-events-none absolute left-3.5"
                />
                <input
                  type="search"
                  aria-label="Search approved products"
                  placeholder="Search approved products…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex w-full h-10 pl-10 pr-9 py-1.5 rounded-lg border border-slate-800 bg-[#111827] text-xs text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-sky-500 transition-colors"
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setQuery('')}
                    className="w-8 h-8 absolute right-1 inline-flex items-center justify-center rounded-md text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Ecosystem Posture Metrics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
                <div className="text-[11px] font-[family-name:var(--font-mono)] text-slate-400 uppercase tracking-wider">
                  Flagship Application
                </div>
                <div className="text-base font-bold text-white mt-1 flex items-center gap-2 font-[family-name:var(--font-display)]">
                  <span>BLACKTOWER VAULT™</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    COMPLETED
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Authorized for full interactive exploration
                </p>
              </div>

              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
                <div className="text-[11px] font-[family-name:var(--font-mono)] text-slate-400 uppercase tracking-wider">
                  Cryptographic Standard
                </div>
                <div className="text-base font-bold text-sky-400 mt-1 font-[family-name:var(--font-display)]">
                  Argon2id + AES-256-GCM
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  4-tier key hierarchy · 96-bit nonce · v1 AAD
                </p>
              </div>

              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
                <div className="text-[11px] font-[family-name:var(--font-mono)] text-slate-400 uppercase tracking-wider">
                  Database Persistence
                </div>
                <div className="text-base font-bold text-white mt-1 font-[family-name:var(--font-display)]">
                  Cloud SQL PostgreSQL
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Zero-knowledge ciphertext envelopes only
                </p>
              </div>

              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
                <div className="text-[11px] font-[family-name:var(--font-mono)] text-slate-400 uppercase tracking-wider">
                  Authorized Operator
                </div>
                <div className="text-sm font-bold text-emerald-400 mt-1 truncate font-mono">
                  {user.email}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Full showcase &amp; vault access verified
                </p>
              </div>
            </div>

            {/* Flagship Featured Product Hero Card: BLACKTOWER VAULT™ */}
            <section
              aria-labelledby="flagship-product-heading"
              className="bg-[#111827] border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-[family-name:var(--font-mono)] text-[11px] font-medium inline-flex items-center gap-1.5">
                    <CheckCircle2 size={13} />
                    <span>COMPLETED &amp; APPROVED FOR DISPLAY</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-400 font-[family-name:var(--font-mono)] text-[11px] font-medium">
                    AUTHORIZED TO EXPLORE
                  </span>
                </div>
                <span className="font-[family-name:var(--font-mono)] text-xs text-slate-400 tabular-nums">
                  PRODUCT ID: BT-VAULT-01
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-400 grid place-items-center shrink-0">
                      <ShieldCheck size={26} />
                    </span>
                    <div>
                      <h2
                        id="flagship-product-heading"
                        className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-display)] tracking-tight"
                      >
                        BLACKTOWER VAULT™
                      </h2>
                      <p className="text-xs sm:text-sm text-sky-400 font-medium">
                        Zero-Knowledge Personal Password &amp; Digital Identity
                        Vault
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    Engineered under the core mandate{' '}
                    <strong className="text-white font-semibold">
                      &ldquo;Simple Outside. Brutal Security Inside.&rdquo;
                    </strong>{' '}
                    BLACKTOWER VAULT™ protects passwords, secure notes, payment
                    cards, digital identities, and TOTP seeds using client-side
                    four-tier key separation. Neither the backend server nor
                    Cloud SQL PostgreSQL ever receives plaintext records or
                    unwrapped encryption keys.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/90">
                      <div className="text-xs font-semibold text-white flex items-center gap-2">
                        <KeyRound size={14} className="text-sky-400 shrink-0" />
                        <span>4-Tier Key Separation</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Master Password → Argon2id v1.3 KEK → Root Key → Vault
                        Key → Per-Item 256-Bit AES-GCM Key.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/90">
                      <div className="text-xs font-semibold text-white flex items-center gap-2">
                        <EyeOff size={14} className="text-sky-400 shrink-0" />
                        <span>Screen Exposure Defense</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Fail-closed Privacy Shield, pre-render reveal gate, and
                        timed clipboard auto-clear.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/90">
                      <div className="text-xs font-semibold text-white flex items-center gap-2">
                        <Database size={14} className="text-sky-400 shrink-0" />
                        <span>Zero-Knowledge Cloud SQL</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        PostgreSQL stores wrapped key envelopes only; server
                        rejects any unencrypted payload.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/90">
                      <div className="text-xs font-semibold text-white flex items-center gap-2">
                        <Cpu size={14} className="text-sky-400 shrink-0" />
                        <span>9 Live Security Tests</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Real-time browser execution of TEST-01 through TEST-09
                        with zero simulated results.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Authorized Exploration & Direct Module Launchers */}
                <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div>
                    <div className="text-[11px] font-[family-name:var(--font-mono)] text-sky-400 uppercase tracking-wider">
                      Authorized Product Exploration
                    </div>
                    <h3 className="text-base font-bold text-white mt-1 font-[family-name:var(--font-display)]">
                      Launch BLACKTOWER VAULT™
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Open the main encrypted workspace or jump directly to a
                      verified security module.
                    </p>
                  </div>

                  <Link
                    href="/vault"
                    className="w-full py-3 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs sm:text-sm inline-flex items-center justify-between transition-colors"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Lock size={15} />
                      <span>Open BLACKTOWER VAULT™ Workspace</span>
                    </span>
                    <ArrowRight size={16} />
                  </Link>

                  <div className="space-y-2 pt-1">
                    <div className="text-[10px] font-[family-name:var(--font-mono)] text-slate-400 uppercase tracking-wider">
                      Direct Module Entry Points
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Link
                        href="/vault?tab=generator"
                        className="p-2.5 rounded-lg bg-[#111827] hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 hover:text-white flex items-center justify-between transition-colors"
                      >
                        <span>Password Generator</span>
                        <ArrowUpRight size={14} className="text-sky-400" />
                      </Link>
                      <Link
                        href="/vault?tab=security"
                        className="p-2.5 rounded-lg bg-[#111827] hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 hover:text-white flex items-center justify-between transition-colors"
                      >
                        <span>9 Security Tests</span>
                        <ArrowUpRight size={14} className="text-sky-400" />
                      </Link>
                      <Link
                        href="/vault?tab=settings"
                        className="p-2.5 rounded-lg bg-[#111827] hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 hover:text-white flex items-center justify-between transition-colors"
                      >
                        <span>Cloud SQL Sync</span>
                        <ArrowUpRight size={14} className="text-sky-400" />
                      </Link>
                      <Link
                        href="/vault?autostart=1"
                        className="p-2.5 rounded-lg bg-[#111827] hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 text-xs text-sky-400 hover:text-sky-300 flex items-center justify-between transition-colors"
                      >
                        <span className="inline-flex items-center gap-1">
                          <Sparkles size={12} />
                          <span>Demo Unlock</span>
                        </span>
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Completed & Approved Ecosystem Systems Grid */}
            <section aria-labelledby="approved-systems-heading" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2
                    id="approved-systems-heading"
                    className="font-[family-name:var(--font-display)] text-xl font-bold text-white"
                  >
                    Completed &amp; Approved BLACKTOWER™ Systems
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Showing {filteredShowcase.length} of{' '}
                    {showcaseProducts.length} approved showcase systems
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredShowcase.map((item) => {
                  const externalHref = sanitizeExternalHttpsUrl(item.url);
                  return (
                    <article
                      key={item.id}
                      className="bg-[#111827] border border-slate-800 hover:border-slate-700 rounded-xl p-6 flex flex-col justify-between transition-colors"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400 grid place-items-center shrink-0">
                              {renderWorkspaceIcon(item.iconKey)}
                            </span>
                            <div>
                              <span className="text-[10px] font-[family-name:var(--font-mono)] text-sky-400 uppercase tracking-wider block">
                                {item.category}
                              </span>
                              <h3 className="font-[family-name:var(--font-display)] font-bold text-lg text-white leading-snug">
                                {item.name}
                              </h3>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              {item.completionStatus === 'COMPLETED'
                                ? 'COMPLETED'
                                : 'APPROVED'}
                            </span>
                            <span className="font-[family-name:var(--font-mono)] text-xs text-slate-400 tabular-nums">
                              {item.indexLabel}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs font-medium text-slate-200">
                          {item.tagline}
                        </p>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {item.description}
                        </p>

                        {item.architectureSummary && (
                          <div className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800/80 font-[family-name:var(--font-mono)] text-[11px] text-slate-300">
                            {item.architectureSummary}
                          </div>
                        )}

                        {item.capabilities && item.capabilities.length > 0 && (
                          <ul className="space-y-1.5 pt-1">
                            {item.capabilities.map((cap, idx) => (
                              <li
                                key={idx}
                                className="text-xs text-slate-400 flex items-start gap-2"
                              >
                                <CheckCircle2
                                  size={13}
                                  className="text-emerald-400 shrink-0 mt-0.5"
                                />
                                <span>{cap}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="border-t border-slate-800/80 mt-6 pt-4 flex items-center justify-between gap-3">
                        {item.internalRoute ? (
                          <Link
                            href={item.internalRoute}
                            aria-label={`Open ${item.name}`}
                            className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs inline-flex items-center gap-2 transition-colors"
                          >
                            <span>{item.actionLabel ?? 'Explore System'}</span>
                            <ArrowUpRight size={15} />
                          </Link>
                        ) : externalHref ? (
                          <a
                            href={externalHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs inline-flex items-center gap-2 transition-colors"
                          >
                            <span>{item.actionLabel ?? 'Open in Notion'}</span>
                            <ArrowUpRight size={15} />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-500 font-mono">
                            Link to be configured
                          </span>
                        )}

                        <span className="text-[10px] font-[family-name:var(--font-mono)] text-slate-400 uppercase tracking-wider">
                          {item.authorizationStatus}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>

              {filteredShowcase.length === 0 && (
                <div className="bg-[#111827] border border-slate-800 rounded-xl p-8 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-sm text-slate-300">
                    No approved showcase products match &ldquo;{query}&rdquo;.
                  </p>
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-xs font-medium text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </section>

            {/* Non-Cluttering Preserved Backend Records Callout */}
            <section
              aria-label="Preserved internal workspaces notice"
              className="bg-[#111827]/70 border border-slate-800/80 rounded-xl p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-3">
                <Archive
                  size={18}
                  className="text-slate-400 shrink-0 mt-0.5 sm:mt-0"
                />
                <div className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-slate-200 font-medium">
                    Backend Preservation Active:
                  </strong>{' '}
                  {internalWorkspaces.length} internal Notion planning &amp;
                  workspace references remain safely preserved in PostgreSQL and
                  separated from the primary product showcase.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('internal')}
                className="px-3.5 py-2 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950 text-xs font-medium text-sky-400 hover:text-sky-300 inline-flex items-center gap-1.5 shrink-0 self-start sm:self-center transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>
                  View Internal Workspaces ({internalWorkspaces.length})
                </span>
                <ArrowRight size={14} />
              </button>
            </section>
          </>
        )}

        {/* ================================================================ */}
        {/* TAB 2: ECOSYSTEM SECURITY ARCHITECTURE                           */}
        {/* ================================================================ */}
        {activeTab === 'architecture' && (
          <section className="space-y-6">
            <div className="border-b border-slate-800/80 pb-5">
              <div className="text-xs font-[family-name:var(--font-mono)] text-sky-400 uppercase tracking-wider">
                BLACKTOWER™ CRYPTOGRAPHIC &amp; SYSTEM SPECIFICATION
              </div>
              <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-white mt-1">
                Zero-Knowledge Ecosystem Architecture
              </h1>
              <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
                Every completed BLACKTOWER™ product is governed by strict
                client-side encryption, fail-closed display protection, and
                verifiable runtime diagnostics.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-3">
                <div className="text-xs font-[family-name:var(--font-mono)] text-sky-400">
                  01 / KEY HIERARCHY
                </div>
                <h2 className="text-lg font-bold text-white font-[family-name:var(--font-display)]">
                  Four-Tier Key Separation
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Master Password derives a 256-bit KEK via Argon2id v1.3, which
                  unwraps the Account Root Key, Vault Key, and unique Per-Item
                  256-bit AES-GCM keys.
                </p>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                  <div>Master Password → Argon2id v1.3</div>
                  <div>→ KEK → Account Root Key</div>
                  <div>→ Vault Key → Per-Item Key</div>
                  <div>→ AES-256-GCM (96-bit Nonce + v1 AAD)</div>
                </div>
              </div>

              <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-3">
                <div className="text-xs font-[family-name:var(--font-mono)] text-sky-400">
                  02 / DISPLAY DEFENSE
                </div>
                <h2 className="text-lg font-bold text-white font-[family-name:var(--font-display)]">
                  Screen Exposure Protection Engine
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Assumes external displays or capture environments may expose
                  secrets. Enforces pre-render reveal gates, Privacy Shield
                  lockdown, and volatile key zeroization.
                </p>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                  <div>Web: Visibility / Focus / Extended Screen</div>
                  <div>Android: FLAG_SECURE + DisplayManager</div>
                  <div>Action: Immediate Redaction + Key Purge</div>
                </div>
              </div>

              <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-3">
                <div className="text-xs font-[family-name:var(--font-mono)] text-sky-400">
                  03 / PERSISTENCE &amp; VERIFICATION
                </div>
                <h2 className="text-lg font-bold text-white font-[family-name:var(--font-display)]">
                  Cloud SQL &amp; 9-Test Suite
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Cloud SQL PostgreSQL stores only wrapped key hierarchies and
                  ciphertext envelopes. All 9 security regression tests run live
                  in the browser runtime.
                </p>
                <div className="pt-2">
                  <Link
                    href="/vault?tab=security"
                    className="w-full py-2.5 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs inline-flex items-center justify-between transition-colors"
                  >
                    <span>Execute Live 9-Test Suite in Vault</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 3: PRESERVED INTERNAL WORKSPACES & NOTION ARCHIVE            */}
        {/* ================================================================ */}
        {activeTab === 'internal' && (
          <section aria-labelledby="internal-workspaces" className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800/80 pb-6">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 text-xs font-[family-name:var(--font-mono)] text-slate-400 uppercase tracking-wider">
                  <Archive size={13} className="text-sky-400" />
                  <span>PRESERVED BACKEND RECORDS · INTERNAL PLANNING &amp; NOTION</span>
                </div>
                <h1
                  id="internal-workspaces"
                  className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-white tracking-tight"
                >
                  Internal Workspaces &amp; Planning Archive
                </h1>
                <p className="text-sm text-slate-300 leading-relaxed">
                  All existing Notion workspace references, planning documents,
                  and internal records are preserved intact in the backend. You
                  can open any link below or reversibly promote an item to the
                  Primary Showcase.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {commandCentreHref && (
                  <a
                    href={commandCentreHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open Command Centre in Notion (new tab)"
                    className="h-10 px-4 rounded-lg border border-slate-800 hover:border-slate-700 bg-[#111827] text-slate-100 text-xs font-medium inline-flex items-center gap-2 hover:bg-slate-800/80 transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Command Centre (Notion)</span>
                    <ArrowUpRight size={15} className="text-sky-400" />
                  </a>
                )}

                <div className="relative flex items-center w-full sm:w-64">
                  <Search
                    size={15}
                    aria-hidden="true"
                    className="text-slate-400 pointer-events-none absolute left-3.5"
                  />
                  <input
                    type="search"
                    aria-label="Search internal workspaces"
                    placeholder="Search internal records…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex w-full h-10 pl-9 pr-8 py-1.5 rounded-lg border border-slate-800 bg-[#111827] text-xs text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-sky-500 transition-colors"
                  />
                  {query && (
                    <button
                      type="button"
                      aria-label="Clear workspace search"
                      onClick={() => setQuery('')}
                      className="w-8 h-8 absolute right-1 inline-flex items-center justify-center rounded-md text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <p
              role="status"
              className="text-slate-400 text-xs font-[family-name:var(--font-mono)] tabular-nums"
            >
              Showing {filteredInternal.length} of {internalWorkspaces.length}{' '}
              preserved internal workspace records
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInternal.map((item) => {
                const externalHref = sanitizeExternalHttpsUrl(item.url);
                return (
                  <article
                    key={item.id}
                    className="border border-slate-800 bg-[#111827] rounded-xl flex flex-col p-5 justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3.5">
                        <span className="w-10 h-10 rounded-lg border border-slate-800 bg-slate-950 text-sky-400 grid place-items-center">
                          {renderWorkspaceIcon(item.iconKey)}
                        </span>
                        <span className="font-[family-name:var(--font-mono)] text-[11px] text-slate-400 tabular-nums">
                          {item.indexLabel}
                        </span>
                      </div>

                      <div className="text-[10px] font-[family-name:var(--font-mono)] text-slate-400 uppercase tracking-wider">
                        {item.category}
                      </div>
                      <h3 className="font-[family-name:var(--font-display)] font-semibold text-base text-white mt-0.5">
                        {item.name}
                      </h3>
                      <p className="text-slate-400 mt-1.5 mb-4 text-xs leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="border-t border-slate-800/80 pt-3 mt-auto flex items-center justify-between gap-2">
                      {item.internalRoute ? (
                        <Link
                          href={item.internalRoute}
                          className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
                        >
                          <span>{item.actionLabel ?? 'Open application'}</span>
                          <ArrowUpRight size={14} />
                        </Link>
                      ) : externalHref ? (
                        <a
                          href={externalHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${item.name} in Notion (new tab)`}
                          className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
                        >
                          <span>Open in Notion</span>
                          <ArrowUpRight size={14} />
                        </a>
                      ) : (
                        <span className="text-slate-500 text-xs font-medium">
                          Link to be configured
                        </span>
                      )}

                      <button
                        type="button"
                        disabled={updatingSlug === item.id}
                        onClick={() => handleToggleVisibility(item)}
                        className="px-2.5 py-1 rounded border border-slate-800 hover:border-slate-700 bg-slate-950 text-[10px] font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        Promote to Showcase
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <BlacktowerFooter />
    </div>
  );
}
