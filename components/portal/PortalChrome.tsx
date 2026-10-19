'use client';

import React from 'react';
import Link from 'next/link';

export function BlacktowerBrand() {
  return (
    <Link
      href="/"
      aria-label="BLACKTOWER home"
      className="font-[family-name:var(--font-display)] text-[oklch(95.5%_0.004_150)] flex items-center gap-[12px] text-[16px] min-[761px]:text-[19px] font-bold shrink-0 whitespace-nowrap"
    >
      <span
        aria-hidden="true"
        className="flex items-end gap-[3px] w-[24px] h-[27px] shrink-0"
      >
        <i className="bg-[oklch(95.5%_0.004_150)] w-[5px] h-[21px] block" />
        <i className="bg-[oklch(87.2%_0.283_140.5)] w-[5px] h-[27px] block" />
        <i className="bg-[oklch(95.5%_0.004_150)] w-[5px] h-[24px] block" />
      </span>
      <span>
        BLACKTOWER
        <span className="font-[family-name:var(--font-sans)] align-super ml-[2px] text-[10px]">
          ™
        </span>
      </span>
    </Link>
  );
}

export function BlacktowerFooter() {
  return (
    <footer className="mt-auto flex flex-wrap items-center justify-between gap-[23px] py-[24px] px-[6%] min-[761px]:py-[29px] min-[761px]:px-[5%] font-[family-name:var(--font-mono)] text-[7px] min-[761px]:text-[8px] font-normal text-[oklch(49%_0.007_160)]">
      <span>
        © 2026 BLACKTOWER™ <span className="mx-[10px]">/</span> ALL RIGHTS
        RESERVED
      </span>
      <span className="flex items-center gap-[9px] text-[7px] ml-auto min-[761px]:ml-0">
        POWERED BY{' '}
        <strong className="font-[family-name:var(--font-display)] text-[oklch(64%_0.006_160)] text-[13px] font-bold">
          NEXUS
        </strong>
        <span
          aria-hidden="true"
          className="text-[oklch(87.2%_0.283_140.5)] ml-[4px] text-[18px] leading-none"
        >
          ✳
        </span>
      </span>
    </footer>
  );
}
