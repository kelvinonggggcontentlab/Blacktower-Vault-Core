'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Fingerprint,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import {
  type PortalSessionUser,
  savePortalSession,
  validatePortalEmail,
  validatePortalPassword,
  verifyAuthorizedPortalCredentials,
} from '@/lib/portal/portal-auth';

interface AccessPanelProps {
  user: PortalSessionUser | null;
  checking?: boolean;
  onUserChange?: (user: PortalSessionUser | null) => void;
}

export default function AccessPanel({
  user,
  checking = false,
  onUserChange,
}: AccessPanelProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  function switchRecoverMode(nextRecovering: boolean) {
    setIsRecovering(nextRecovering);
    setError('');
    setRecoverySent(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const rawEmail = formData.get('email');

    const emailCheck = validatePortalEmail(rawEmail);
    if (!emailCheck.valid) {
      setError(emailCheck.error);
      return;
    }

    const rawPassword = formData.get('password');
    if (!isRecovering) {
      const passCheck = validatePortalPassword(rawPassword);
      if (!passCheck.valid) {
        setError(passCheck.error);
        return;
      }
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (isRecovering) {
        await fetch('/api/portal/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'recover', email: emailCheck.email }),
        }).catch(() => null);
        setRecoverySent(true);
        return;
      }

      const localCheck = verifyAuthorizedPortalCredentials(
        emailCheck.email,
        rawPassword
      );
      if (!localCheck.ok) {
        setError(localCheck.error);
        return;
      }

      // Verify & register session with server endpoint
      let verifiedUser = localCheck.user;
      try {
        const res = await fetch('/api/portal/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: 'signin',
            email: emailCheck.email,
            password: rawPassword,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(
            typeof data.error === 'string'
              ? data.error
              : 'Access could not be verified. Check your email and password.'
          );
          return;
        }
        const data = await res.json();
        if (data?.user) {
          verifiedUser = data.user;
        }
      } catch {
        // Fallback to verified local session if offline
      }

      form.reset();
      setShowPassword(false);
      savePortalSession(verifiedUser);
      onUserChange?.(verifiedUser);
      router.push('/command');
    } catch {
      setError('Access service is unavailable. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignOut() {
    setIsSubmitting(true);
    try {
      savePortalSession(null);
      onUserChange?.(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      aria-labelledby="access-title"
      className="w-full max-w-[440px] min-[761px]:max-w-none justify-self-center rounded-xl border border-slate-800 border-t-sky-500/40 bg-[#111827]/95 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.45)] pt-7 px-7 max-[360px]:px-5 pb-0"
    >
      <div className="flex items-center justify-between mb-6">
        <span className="w-11 h-11 rounded-lg border border-slate-800 bg-sky-500/10 text-sky-400 grid place-items-center">
          <Fingerprint size={22} strokeWidth={1.6} />
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[10px] font-normal text-slate-400 tracking-wider">
          ACCESS POINT / 01
        </span>
      </div>

      <h2
        id="access-title"
        className="font-[family-name:var(--font-display)] m-0 text-2xl font-bold text-white tracking-tight"
      >
        {user && !checking
          ? 'Access verified.'
          : isRecovering
            ? 'Recover access.'
            : 'Welcome back.'}
      </h2>
      <p className="text-slate-400 mt-1.5 text-xs">
        {isRecovering
          ? 'A fresh start. The same private world.'
          : 'Authorized gateway to the BLACKTOWER™ product showcase.'}
      </p>

      {user && !checking ? (
        <div className="mt-6">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-[10px] font-[family-name:var(--font-mono)] text-sky-400 uppercase tracking-wider">
              Authenticated Operator
            </div>
            <p className="text-slate-200 mt-1 text-xs font-mono break-all">
              {user.email}
            </p>
          </div>
          <Link
            href="/command"
            className="w-full h-11 mt-5 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold inline-flex items-center justify-between cursor-pointer transition-colors whitespace-nowrap"
          >
            <span>Open product showcase</span>
            <ArrowRight size={16} />
          </Link>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSignOut}
            className="w-full h-9 my-4 px-4 py-2 rounded-lg inline-flex items-center justify-center gap-2 text-xs font-medium text-slate-400 hover:bg-slate-800/80 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            <LogOut size={15} />
            <span>Sign out</span>
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-busy={isSubmitting}
          className="mt-6"
        >
          <fieldset disabled={isSubmitting} className="min-w-0">
            <label
              htmlFor="access-email"
              className="font-[family-name:var(--font-mono)] text-[10px] font-medium text-slate-300 tracking-wider block"
            >
              EMAIL ADDRESS
            </label>
            <div className="mt-2 relative">
              <Mail
                size={16}
                aria-hidden="true"
                className="text-slate-500 absolute top-3.5 left-3.5 pointer-events-none"
              />
              <input
                id="access-email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="you@company.com"
                required
                maxLength={254}
                aria-describedby={error ? 'access-error' : undefined}
                className="flex w-full h-11 pl-10 pr-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-sky-500 transition-colors"
              />
            </div>

            {!isRecovering && (
              <>
                <div className="flex items-center justify-between mt-5">
                  <label
                    htmlFor="access-password"
                    className="font-[family-name:var(--font-mono)] text-[10px] font-medium text-slate-300 tracking-wider block"
                  >
                    PASSWORD
                  </label>
                  <button
                    type="button"
                    onClick={() => switchRecoverMode(true)}
                    className="h-auto p-0 text-xs font-medium text-slate-400 hover:text-sky-400 underline-offset-4 hover:underline transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="mt-2 relative">
                  <LockKeyhole
                    size={16}
                    aria-hidden="true"
                    className="text-slate-500 absolute top-3.5 left-3.5 pointer-events-none"
                  />
                  <input
                    id="access-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    maxLength={256}
                    aria-describedby={error ? 'access-error' : undefined}
                    className="flex w-full h-11 pl-10 pr-11 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-sky-500 transition-colors"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1.5 right-1.5 h-8 w-8 rounded-md inline-flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </>
            )}

            {error && (
              <p
                id="access-error"
                role="alert"
                className="text-rose-300 bg-rose-950/60 border border-rose-800/80 rounded-lg px-3 py-2 mt-3 mb-4 text-xs leading-relaxed"
              >
                {error}
              </p>
            )}

            {recoverySent && (
              <p
                role="status"
                className="text-sky-300 bg-sky-950/50 border border-sky-800/70 rounded-lg px-3 py-2 mt-3 mb-4 text-xs leading-relaxed"
              >
                If this email belongs to an authorized account, a recovery link
                will arrive shortly.
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || recoverySent}
              className="w-full h-11 mt-6 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold inline-flex items-center justify-between cursor-pointer transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              <span>
                {isSubmitting
                  ? 'Verifying credentials…'
                  : isRecovering
                    ? 'Send recovery link'
                    : 'Enter command portal'}
              </span>
              {isSubmitting ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <ArrowRight size={16} />
              )}
            </button>

            <p
              role="status"
              className="text-slate-400 mt-3 mb-5 text-[11px] leading-relaxed"
            >
              Authorized accounts only. No public registration.
            </p>

            {isRecovering && (
              <button
                type="button"
                onClick={() => switchRecoverMode(false)}
                className="w-full h-9 mb-4 px-4 py-2 rounded-lg inline-flex items-center justify-center gap-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft size={15} />
                <span>Back to sign in</span>
              </button>
            )}
          </fieldset>
        </form>
      )}

      <div className="border-t border-slate-800/80 font-[family-name:var(--font-mono)] text-slate-400 flex items-center justify-center gap-2 -mx-7 max-[360px]:-mx-5 px-7 max-[360px]:px-5 py-4 text-[10px] font-normal tracking-wider">
        <ShieldCheck size={14} className="text-sky-400" />
        <span>PRIVATE ACCESS. BY INVITATION ONLY.</span>
      </div>
    </section>
  );
}
