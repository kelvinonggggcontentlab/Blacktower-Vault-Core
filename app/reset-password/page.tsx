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
    <div className="flex flex-col min-h-svh bg-[#0B0F17] text-slate-100">
      <header className="border-b border-slate-800/80 flex items-center justify-between h-[72px] px-4 sm:px-8">
        <BlacktowerBrand subtitle="ACCESS RECOVERY" />
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-20">
        <section className="w-full max-w-md rounded-xl border border-slate-800 border-t-sky-500/40 bg-[#111827] shadow-[0_24px_60px_rgba(0,0,0,0.45)] p-7">
          <span className="w-11 h-11 mb-5 rounded-lg border border-slate-800 bg-sky-500/10 text-sky-400 grid place-items-center">
            <LockKeyhole size={20} />
          </span>

          <h2 className="font-[family-name:var(--font-display)] m-0 text-2xl font-bold text-white">
            Restore access.
          </h2>

          {recoveryReady && !updated ? (
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-busy={submitting}
              className="mt-6"
            >
              <fieldset disabled={submitting}>
                <label
                  htmlFor="new-password"
                  className="font-[family-name:var(--font-mono)] text-[10px] font-medium text-slate-300 tracking-wider block"
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
                  className="flex w-full h-11 mt-2 px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white focus-visible:outline-none focus-visible:border-sky-500"
                />
                <p className="text-slate-400 mt-2 mb-4 text-xs">
                  Use at least 12 characters.
                </p>

                <label
                  htmlFor="confirm-password"
                  className="font-[family-name:var(--font-mono)] text-[10px] font-medium text-slate-300 tracking-wider block"
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
                  className="flex w-full h-11 mt-2 px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white focus-visible:outline-none focus-visible:border-sky-500"
                />

                {error && (
                  <p
                    role="alert"
                    className="text-rose-300 bg-rose-950/60 border border-rose-800/80 rounded-lg px-3 py-2 mt-3 mb-4 text-xs"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 mt-6 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold inline-flex items-center justify-center cursor-pointer transition-colors"
                >
                  {submitting ? 'Updating password…' : 'Set new password'}
                </button>
              </fieldset>
            </form>
          ) : (
            <p
              role="status"
              className="text-slate-400 mt-2 text-xs leading-relaxed"
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
            className="w-full h-9 mt-5 px-4 py-2 rounded-lg inline-flex items-center justify-center text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            Back to sign in
          </Link>
        </section>
      </main>

      <BlacktowerFooter />
    </div>
  );
}
