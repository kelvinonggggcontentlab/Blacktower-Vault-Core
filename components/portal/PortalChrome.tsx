'use client';

import React from 'react';
import Link from 'next/link';

export function BlacktowerBrand({ subtitle }: { subtitle?: string }) {
  return (
    <Link
      href="/"
      aria-label="BLACKTOWER home"
      className="font-[family-name:var(--font-display)] text-white flex items-center gap-3 text-base sm:text-lg font-bold tracking-tight shrink-0 whitespace-nowrap group"
    >
      <span
        aria-hidden="true"
        className="flex items-end gap-[3px] w-[22px] h-[24px] shrink-0"
      >
        <i className="bg-slate-200 group-hover:bg-white transition-colors w-[4px] h-[18px] block rounded-[1px]" />
        <i className="bg-sky-400 w-[4px] h-[24px] block rounded-[1px]" />
        <i className="bg-slate-200 group-hover:bg-white transition-colors w-[4px] h-[21px] block rounded-[1px]" />
      </span>
      <span className="flex items-center gap-2">
        <span>
          BLACKTOWER
          <span className="font-[family-name:var(--font-sans)] align-super ml-[2px] text-[10px] text-sky-400">
            ™
          </span>
        </span>
        {subtitle && (
          <span className="hidden sm:inline-block text-[11px] font-[family-name:var(--font-mono)] font-normal text-slate-400 border-l border-slate-800 pl-2.5 tracking-wider">
            {subtitle}
          </span>
        )}
      </span>
    </Link>
  );
}

export function BlacktowerFooter() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-[#0B0F17] flex flex-wrap items-center justify-between gap-4 py-5 px-4 sm:px-6 font-[family-name:var(--font-mono)] text-[10px] font-normal text-slate-400">
      <span>
        © 2026 BLACKTOWER™ <span className="mx-2 text-slate-700">/</span> ALL
        RIGHTS RESERVED
      </span>
      <span className="flex items-center gap-2 text-[10px] ml-auto sm:ml-0">
        <span>SIMPLE OUTSIDE. BRUTAL SECURITY INSIDE.</span>
        <span className="text-slate-700">·</span>
        <strong className="font-[family-name:var(--font-display)] text-slate-200 text-xs font-bold">
          BLACKTOWER OS™
        </strong>
        <span
          aria-hidden="true"
          className="text-sky-400 ml-0.5 text-sm leading-none"
        >
          ✳
        </span>
      </span>
    </footer>
  );
}
