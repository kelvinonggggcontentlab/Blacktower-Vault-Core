'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  CheckCircle2,
  Layers,
  Lock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import type { PortalSessionUser } from '@/lib/portal/portal-auth';
import AccessPanel from './AccessPanel';
import { BlacktowerBrand, BlacktowerFooter } from './PortalChrome';

interface PortalLandingViewProps {
  user: PortalSessionUser | null;
  checking?: boolean;
  onUserChange?: (user: PortalSessionUser | null) => void;
}

export default function PortalLandingView({
  user,
  checking = false,
  onUserChange,
}: PortalLandingViewProps) {
  return (
    <div className="flex flex-col min-h-svh bg-[#0B0F17] text-slate-100">
      <header className="border-b border-slate-800/80 bg-[#0B0F17]/95 backdrop-blur-md flex items-center justify-between h-[72px] px-4 sm:px-8 sticky top-0 z-30">
        <BlacktowerBrand subtitle="ECOSYSTEM GATEWAY" />
        <div className="flex items-center gap-4">
          <span className="hidden md:inline-flex font-[family-name:var(--font-mono)] font-normal text-slate-400 items-center gap-2.5 text-[10px] tracking-wider">
            PRIVATE INFRASTRUCTURE
            <span className="bg-sky-400 w-1.5 h-1.5 shadow-[0_0_10px_rgba(56,189,248,0.6)] rounded-full shrink-0 inline-block" />
          </span>
          <Link
            href="/vault"
            className="px-3 py-1.5 rounded-lg border border-slate-800 hover:border-sky-500/50 bg-[#111827] text-xs font-medium text-slate-200 hover:text-white inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Lock size={13} className="text-sky-400" />
            <span>BLACKTOWER VAULT™</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <section className="relative isolate flex items-center flex-1 min-h-auto min-[761px]:min-h-[660px] overflow-hidden">
          <Image
            src="/assets/blacktower-monolith.jpg"
            alt=""
            width={1920}
            height={1088}
            priority
            referrerPolicy="no-referrer"
            className="object-cover object-[69%_center] min-[761px]:object-center opacity-35 min-[761px]:opacity-65 -z-30 w-full h-[520px] min-[761px]:h-full absolute inset-0 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="bg-[linear-gradient(90deg,#0B0F17_0%,rgba(11,15,23,0.88)_42%,rgba(11,15,23,0.45)_72%,rgba(11,15,23,0.75)_100%)] -z-20 absolute inset-0 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="opacity-15 -z-10 bg-[linear-gradient(rgba(30,41,59,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.6)_1px,transparent_1px)] bg-[size:72px_72px] absolute inset-0 [mask-image:linear-gradient(90deg,black,transparent_65%)] pointer-events-none"
          >
            <div className="bg-sky-400 opacity-35 h-[1px] absolute top-0 left-0 right-0" />
          </div>

          <div className="grid grid-cols-1 min-[761px]:grid-cols-[minmax(0,1fr)_370px] min-[1051px]:grid-cols-[minmax(0,1fr)_400px] items-center gap-9 min-[761px]:gap-8 min-[1051px]:gap-12 w-full max-w-7xl mx-auto pt-9 px-4 sm:px-8 pb-14 min-[761px]:py-16">
            <div className="min-w-0">
              <div className="font-[family-name:var(--font-mono)] font-normal text-sky-400 border border-sky-500/30 bg-sky-500/10 inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-[10px] tracking-wider">
                <span className="bg-sky-400 w-1.5 h-1.5 shadow-[0_0_10px_rgba(56,189,248,0.6)] rounded-full shrink-0 inline-block" />
                SECURE ACCESS <span className="text-slate-600">•</span>{' '}
                AUTHORIZED USERS ONLY
              </div>

              <p className="font-[family-name:var(--font-mono)] font-normal text-slate-400 flex items-center gap-2.5 mt-7 mb-3 text-[11px] tracking-wider">
                <span className="bg-sky-400 w-5 h-[1px] shrink-0" />
                THE BLACKTOWER™ ECOSYSTEM SHOWCASE
              </p>

              <h1 className="font-[family-name:var(--font-display)] tracking-tight m-0 text-4xl sm:text-5xl min-[1051px]:text-6xl font-bold leading-[1.05] text-white">
                BLACKTOWER{' '}
                <span className="text-sky-400 inline-flex items-center gap-3">
                  OS™
                  <span
                    aria-hidden="true"
                    className="bg-sky-400 w-3 h-3 shadow-[0_0_12px_rgba(56,189,248,0.5)] inline-block rounded-[2px]"
                  />
                </span>
              </h1>

              <p className="font-[family-name:var(--font-mono)] text-slate-200 mt-4 text-xs tracking-wider">
                PRODUCT SHOWCASE &amp; PRIVATE COMMAND GATEWAY
              </p>

              <p className="mt-5 text-base sm:text-lg font-semibold text-white">
                One gateway. Completed, cryptographically verifiable systems.
              </p>

              <p className="text-slate-300 mt-2.5 text-sm leading-relaxed max-w-xl">
                Explore approved BLACKTOWER™ security applications and
                zero-knowledge infrastructure—led by{' '}
                <strong className="text-white font-semibold">
                  BLACKTOWER VAULT™
                </strong>
                , our personal password and digital identity vault.
              </p>

              {/* Flagship Completed Product Preview Strip */}
              <div className="mt-6 p-4 rounded-xl bg-[#111827]/90 border border-slate-800 max-w-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 size={11} />
                      COMPLETED &amp; APPROVED
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      BT-PROD-01
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white font-[family-name:var(--font-display)]">
                    BLACKTOWER VAULT™ — Zero-Knowledge Vault
                  </div>
                  <p className="text-xs text-slate-400">
                    Argon2id v1.3 · 4-Tier AES-256-GCM · Screen Exposure
                    Protection · Cloud SQL Sync
                  </p>
                </div>
                <Link
                  href="/vault"
                  className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1.5 shrink-0 self-start sm:self-center transition-colors whitespace-nowrap"
                >
                  <span>Explore Vault</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="font-[family-name:var(--font-mono)] font-normal text-slate-400 flex items-center gap-2.5 mt-6 text-[10px] tracking-wider">
                <span
                  aria-hidden="true"
                  className="text-sky-400 text-base leading-none font-bold"
                >
                  +
                </span>{' '}
                SIMPLE OUTSIDE. BRUTAL SECURITY INSIDE.
              </div>
            </div>

            <AccessPanel
              user={user}
              checking={checking}
              onUserChange={onUserChange}
            />
          </div>
        </section>

        <section
          aria-label="The BLACKTOWER ecosystem"
          className="border-t border-slate-800/80 bg-[#0B0F17] flex flex-col min-[761px]:flex-row items-start min-[761px]:items-center justify-between gap-6 py-6 px-4 sm:px-8 max-w-7xl w-full mx-auto"
        >
          <div className="text-slate-400 flex items-center gap-3">
            <span className="font-[family-name:var(--font-mono)] font-normal text-[10px] tracking-wider">
              APPROVED ECOSYSTEM ARCHITECTURE
            </span>
            <ArrowUpRight size={15} className="text-sky-400" />
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <div className="font-[family-name:var(--font-mono)] text-slate-300 flex items-center gap-2.5 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <span>ZERO-KNOWLEDGE VAULT</span>
            </div>
            <div className="font-[family-name:var(--font-mono)] text-slate-300 flex items-center gap-2.5 text-[11px]">
              <Layers className="w-4 h-4 text-sky-400 shrink-0" />
              <span>4-TIER KEY HIERARCHY</span>
            </div>
            <div className="font-[family-name:var(--font-mono)] text-slate-300 flex items-center gap-2.5 text-[11px]">
              <Zap className="w-4 h-4 text-sky-400 shrink-0" />
              <span>9 LIVE SECURITY TESTS</span>
            </div>
          </div>
        </section>
      </main>

      <BlacktowerFooter />
    </div>
  );
}
