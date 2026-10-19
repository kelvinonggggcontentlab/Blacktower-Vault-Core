'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LockKeyhole } from 'lucide-react';
import {
  BlacktowerBrand,
  BlacktowerFooter,
} from '@/components/portal/PortalChrome';
import { validateRecoveryPassword } from '@/lib/portal/portal-auth';

export default function BlacktowerResetPasswordPage() {
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [verifyingLink, setVerifyingLink] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const hasToken = Boolean(
      params.get('token') ||
        params.get('type') === 'recovery' ||
        hashParams.get('type') === 'recovery'
    );

    const timer = window.setTimeout(
      () => {
        if (hasToken) {
          setRecoveryReady(true);
        }
        setVerifyingLink(false);
      },
      hasToken ? 0 : 1500
    );
    return () => window.clearTimeout(timer);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!recoveryReady || submitting) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const validation = validateRecoveryPassword(
      formData.get('password'),
      formData.get('confirm')
    );

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      form.reset();
      setUpdated(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-svh bg-[oklch(10.5%_0.003_160)] text-[oklch(95.5%_0.004_150)]">
      <header className="border-b border-[oklch(29%_0.008_160)] flex items-center justify-between h-[76px] px-[6%] min-[761px]:h-[92px] min-[761px]:px-[5%]">
        <BlacktowerBrand />
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-20">
        <section className="w-full max-w-sm rounded-[8px] border border-[oklch(29%_0.008_160)] border-t-[color-mix(in_oklch,oklch(87.2%_0.283_140.5)_25%,oklch(29%_0.008_160))] bg-[oklch(16%_0.005_160/0.88)] bg-[linear-gradient(140deg,oklch(38%_0.02_150/0.09),transparent_48%)] backdrop-blur-[20px] shadow-[0_28px_70px_oklch(0%_0_0/0.25),inset_0_1px_0_oklch(100%_0_0/0.03)] pt-[29px] px-[29px] pb-8">
          <span className="w-[44px] h-[44px] mb-6 rounded-[6px] border border-[oklch(29%_0.008_160)] bg-[oklch(87.2%_0.283_140.5/0.04)] text-[oklch(87.2%_0.283_140.5)] grid place-items-center">
            <LockKeyhole size={22} />
          </span>

          <h2 className="font-[family-name:var(--font-display)] m-0 text-[26px] font-medium text-[oklch(95.5%_0.004_150)]">
            Restore access.
          </h2>

          {recoveryReady && !updated ? (
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-busy={submitting}
              className="mt-[30px]"
            >
              <fieldset disabled={submitting}>
                <label
                  htmlFor="new-password"
                  className="font-[family-name:var(--font-mono)] text-[9px] font-normal text-[oklch(64%_0.006_160)] block"
                >
                  NEW PASSWORD
                </label>
                <input
                  id="new-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={12}
                  maxLength={256}
                  className="flex w-full h-[50px] mt-3 pl-3 pr-3 py-1 rounded-[5px] border border-[oklch(30%_0.006_160)] bg-[oklch(10.5%_0.003_160/0.63)] text-[11px] text-[oklch(95.5%_0.004_150)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[oklch(87.2%_0.283_140.5)]"
                />
                <p className="text-[oklch(64%_0.006_160)] mt-[11px] mb-[20px] text-[10px] leading-[1.6]">
                  Use at least 12 characters.
                </p>

                <label
                  htmlFor="confirm-password"
                  className="font-[family-name:var(--font-mono)] text-[9px] font-normal text-[oklch(64%_0.006_160)] block"
                >
                  CONFIRM PASSWORD
                </label>
                <input
                  id="confirm-password"
                  name="confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={12}
                  maxLength={256}
                  className="flex w-full h-[50px] mt-3 pl-3 pr-3 py-1 rounded-[5px] border border-[oklch(30%_0.006_160)] bg-[oklch(10.5%_0.003_160/0.63)] text-[11px] text-[oklch(95.5%_0.004_150)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[oklch(87.2%_0.283_140.5)]"
                />

                {error && (
                  <p
                    role="alert"
                    className="text-[oklch(72%_0.17_25)] mt-[11px] mb-[20px] text-[10px] leading-[1.6]"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-[49px] mt-[25px] px-[18px] rounded-[5px] bg-[oklch(87.2%_0.283_140.5)] hover:bg-[color-mix(in_oklch,oklch(87.2%_0.283_140.5)_85%,oklch(95.5%_0.004_150))] text-[oklch(12%_0.02_145)] text-[11px] font-bold inline-flex items-center justify-center cursor-pointer transition-colors"
                >
                  {submitting ? 'Updating password…' : 'Set new password'}
                </button>
              </fieldset>
            </form>
          ) : (
            <p
              role="status"
              className="text-[oklch(64%_0.006_160)] mt-[8px] text-[11px] leading-[1.6]"
            >
              {updated
                ? 'Password updated. Sign in with your new password.'
                : verifyingLink
                  ? 'Verifying recovery link…'
                  : 'This recovery link is missing, invalid, or expired. Request a new link.'}
            </p>
          )}

          <Link
            href="/auth"
            className="w-full h-9 mt-5 px-4 py-2 rounded-md inline-flex items-center justify-center text-[11px] font-medium text-[oklch(64%_0.006_160)] hover:bg-[oklch(24%_0.014_150)] hover:text-[oklch(95.5%_0.004_150)] transition-colors"
          >
            Back to sign in
          </Link>
        </section>
      </main>

      <BlacktowerFooter />
    </div>
  );
}
