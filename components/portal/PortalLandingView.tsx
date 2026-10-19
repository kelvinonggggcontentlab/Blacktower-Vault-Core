'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight, Layers, ShieldCheck, Zap } from 'lucide-react';
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
    <div className="flex flex-col min-h-svh bg-[oklch(10.5%_0.003_160)] text-[oklch(95.5%_0.004_150)]">
      <header className="border-b border-[oklch(29%_0.008_160)] flex items-center justify-between h-[76px] px-[6%] min-[761px]:h-[92px] min-[761px]:px-[5%]">
        <BlacktowerBrand />
        <span className="font-[family-name:var(--font-mono)] font-normal text-[oklch(64%_0.006_160)] flex items-center gap-0 text-[0px] min-[761px]:gap-[17px] min-[761px]:text-[9px]">
          PRIVATE INFRASTRUCTURE{' '}
          <span className="bg-[oklch(87.2%_0.283_140.5)] w-[5px] h-[5px] shadow-[0_0_12px_oklch(87.2%_0.283_140.5/0.32)] rounded-full shrink-0 inline-block" />
        </span>
      </header>

      <main>
        <section className="relative isolate flex items-center min-h-auto min-[761px]:min-h-[680px] min-[1500px]:min-h-[740px] overflow-hidden">
          <Image
            src="/assets/blacktower-monolith.jpg"
            alt=""
            width={1920}
            height={1088}
            priority
            referrerPolicy="no-referrer"
            className="object-cover object-[69%_center] min-[761px]:object-center opacity-55 min-[761px]:opacity-100 -z-30 w-full h-[520px] min-[761px]:h-full absolute inset-0 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="bg-[linear-gradient(90deg,oklch(10.5%_0.003_160)_0%,oklch(10.5%_0.003_160/0.77)_36%,oklch(10.5%_0.003_160/0.09)_68%,oklch(10.5%_0.003_160/0.3)_100%)] -z-20 absolute inset-0 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="opacity-11 -z-10 bg-[linear-gradient(oklch(29%_0.008_160)_1px,transparent_1px),linear-gradient(90deg,oklch(29%_0.008_160)_1px,transparent_1px)] bg-[size:72px_72px] absolute inset-0 [mask-image:linear-gradient(90deg,black,transparent_65%)] pointer-events-none"
          >
            <div className="bg-[oklch(87.2%_0.283_140.5)] opacity-40 h-[1px] absolute top-0 left-0 right-0" />
          </div>

          <div className="grid grid-cols-1 min-[761px]:grid-cols-[minmax(0,1fr)_350px] min-[1051px]:grid-cols-[minmax(0,1fr)_376px] items-center gap-[37px] min-[761px]:gap-[25px] min-[1051px]:gap-[45px] w-full max-w-[1440px] mx-auto pt-[36px] px-[6%] pb-[60px] min-[761px]:pt-[65px] min-[761px]:px-[5%] min-[761px]:pb-[78px] min-[1500px]:px-0">
            <div className="min-w-0">
              <div className="font-[family-name:var(--font-mono)] font-normal text-[oklch(87.2%_0.283_140.5)] border border-[oklch(87.2%_0.283_140.5/0.2)] bg-[oklch(87.2%_0.283_140.5/0.03)] inline-flex items-center gap-[6px] min-[1051px]:gap-[9px] rounded-[3px] py-[9px] px-[11px] max-[360px]:text-[6px] text-[7px] min-[1051px]:text-[8px]">
                <span className="bg-[oklch(87.2%_0.283_140.5)] w-[5px] h-[5px] shadow-[0_0_12px_oklch(87.2%_0.283_140.5/0.32)] rounded-full shrink-0 inline-block" />
                SECURE ACCESS{' '}
                <span className="text-[oklch(49%_0.007_160)]">•</span>{' '}
                AUTHORIZED USERS ONLY
              </div>

              <p className="font-[family-name:var(--font-mono)] font-normal text-[oklch(64%_0.006_160)] flex items-center gap-[10px] mt-[33px] min-[761px]:mt-[43px] mb-[15px] text-[9px]">
                <span className="bg-[oklch(87.2%_0.283_140.5)] w-[20px] h-[1px] shrink-0" />
                THE NEXUS ECOSYSTEM
              </p>

              <h1 className="font-[family-name:var(--font-display)] tracking-normal m-0 max-[360px]:text-[42px] text-[52px] min-[761px]:text-[48px] min-[1051px]:text-[66px] min-[1500px]:text-[84px] font-semibold leading-[1.02]">
                BLACKTOWER
                <span className="text-[oklch(87.2%_0.283_140.5)] flex items-center gap-[22px]">
                  OS
                  <span
                    aria-hidden="true"
                    className="bg-[oklch(87.2%_0.283_140.5)] w-[14px] h-[14px] shadow-[0_0_12px_oklch(87.2%_0.283_140.5/0.32)] mt-[17px] inline-block"
                  />
                </span>
              </h1>

              <p className="font-[family-name:var(--font-mono)] text-[oklch(95.5%_0.004_150)] mt-[20px] text-[12px]">
                PRIVATE COMMAND PORTAL
              </p>

              <p className="mt-[24px] min-[761px]:mt-[33px] text-[15px] min-[761px]:text-[17px] font-medium">
                One gateway. Your entire ecosystem.
              </p>

              <p className="text-[oklch(64%_0.006_160)] mt-[13px] text-[12px] leading-[1.9]">
                Intelligence. Operations. Everything connected.
                <br />
                Built for the way you move.
              </p>

              <div className="font-[family-name:var(--font-mono)] font-normal text-[oklch(49%_0.007_160)] flex items-center gap-[11px] mt-[22px] min-[761px]:mt-[38px] text-[8px]">
                <span
                  aria-hidden="true"
                  className="text-[oklch(87.2%_0.283_140.5)] text-[18px] leading-none"
                >
                  +
                </span>{' '}
                ONE IDENTITY. TOTAL CONTROL.
              </div>
            </div>

            <AccessPanel
              user={user}
              checking={checking}
              onUserChange={onUserChange}
            />
          </div>

          <div
            aria-hidden="true"
            className="font-[family-name:var(--font-mono)] font-normal text-[oklch(49%_0.007_160)] flex justify-between text-[8px] absolute bottom-[21px] left-[5%] right-[5%] pointer-events-none"
          >
            BT / NEXUS <span>01 — PRIVATE NETWORK</span>
          </div>
        </section>

        <section
          aria-label="The BLACKTOWER ecosystem"
          className="border-y border-[oklch(29%_0.008_160)] bg-[oklch(10.5%_0.003_160)] block min-[761px]:flex items-center justify-between gap-[40px] py-[26px] px-[6%] min-[761px]:py-[30px] min-[761px]:px-[5%]"
        >
          <div className="text-[oklch(49%_0.007_160)] flex items-center justify-between min-[761px]:justify-start gap-[23px] mb-[24px] min-[761px]:mb-0">
            <span className="font-[family-name:var(--font-mono)] font-normal text-[8px]">
              A CONNECTED ECOSYSTEM
            </span>
            <ArrowUpRight size={18} />
          </div>

          <div className="flex items-start min-[761px]:items-center justify-between min-[761px]:justify-start gap-[18px] min-[761px]:gap-[22px] min-[1051px]:gap-[55px]">
            <div className="font-[family-name:var(--font-mono)] text-[oklch(64%_0.006_160)] flex flex-col min-[761px]:flex-row items-start min-[761px]:items-center gap-[10px] min-[761px]:gap-[11px] max-w-[90px] min-[761px]:max-w-none text-[7px] min-[761px]:text-[9px] leading-[1.8] min-[761px]:leading-normal">
              <Zap className="w-[17px] h-[17px] stroke-[1.3px] text-[oklch(64%_0.006_160)] shrink-0" />
              <span>NEXUS INTELLIGENCE</span>
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[oklch(64%_0.006_160)] flex flex-col min-[761px]:flex-row items-start min-[761px]:items-center gap-[10px] min-[761px]:gap-[11px] max-w-[90px] min-[761px]:max-w-none text-[7px] min-[761px]:text-[9px] leading-[1.8] min-[761px]:leading-normal">
              <Layers className="w-[17px] h-[17px] stroke-[1.3px] text-[oklch(64%_0.006_160)] shrink-0" />
              <span>UNIFIED OPERATIONS</span>
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[oklch(64%_0.006_160)] flex flex-col min-[761px]:flex-row items-start min-[761px]:items-center gap-[10px] min-[761px]:gap-[11px] max-w-[90px] min-[761px]:max-w-none text-[7px] min-[761px]:text-[9px] leading-[1.8] min-[761px]:leading-normal">
              <ShieldCheck className="w-[17px] h-[17px] stroke-[1.3px] text-[oklch(64%_0.006_160)] shrink-0" />
              <span>PRIVATE BY DESIGN</span>
            </div>
          </div>
        </section>
      </main>

      <BlacktowerFooter />
    </div>
  );
}
