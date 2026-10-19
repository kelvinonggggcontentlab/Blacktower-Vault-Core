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
      className="w-full max-w-[440px] min-[761px]:max-w-none justify-self-center rounded-[8px] border border-[oklch(29%_0.008_160)] border-t-[color-mix(in_oklch,oklch(87.2%_0.283_140.5)_25%,oklch(29%_0.008_160))] bg-[oklch(16%_0.005_160/0.88)] bg-[linear-gradient(140deg,oklch(38%_0.02_150/0.09),transparent_48%)] backdrop-blur-[20px] shadow-[0_28px_70px_oklch(0%_0_0/0.25),inset_0_1px_0_oklch(100%_0_0/0.03)] pt-[29px] px-[29px] max-[360px]:px-[23px] pb-0"
    >
      <div className="flex items-center justify-between mb-[26px]">
        <span className="w-[44px] h-[44px] rounded-[6px] border border-[oklch(29%_0.008_160)] bg-[oklch(87.2%_0.283_140.5/0.04)] text-[oklch(87.2%_0.283_140.5)] grid place-items-center">
          <Fingerprint size={23} strokeWidth={1.5} />
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[8px] font-normal text-[oklch(49%_0.007_160)]">
          ACCESS POINT / 01
        </span>
      </div>

      <h2
        id="access-title"
        className="font-[family-name:var(--font-display)] m-0 text-[26px] font-medium text-[oklch(95.5%_0.004_150)]"
      >
        {user && !checking
          ? 'Access verified.'
          : isRecovering
            ? 'Recover access.'
            : 'Welcome back.'}
      </h2>
      <p className="text-[oklch(64%_0.006_160)] mt-[8px] text-[11px]">
        {isRecovering
          ? 'A fresh start. The same private world.'
          : 'Your command center awaits.'}
      </p>

      {user && !checking ? (
        <div className="mt-[30px]">
          <p className="text-[oklch(64%_0.006_160)] mt-[8px] text-[11px] break-all">
            {user.email}
          </p>
          <Link
            href="/command"
            className="w-full h-[49px] mt-[25px] px-[18px] rounded-[5px] bg-[oklch(87.2%_0.283_140.5)] hover:bg-[color-mix(in_oklch,oklch(87.2%_0.283_140.5)_85%,oklch(95.5%_0.004_150))] text-[oklch(12%_0.02_145)] text-[11px] font-bold inline-flex items-center justify-between cursor-pointer transition-colors whitespace-nowrap"
          >
            <span>Open command portal</span>
            <ArrowRight size={17} />
          </Link>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSignOut}
            className="w-full h-9 my-5 px-4 py-2 rounded-md inline-flex items-center justify-center gap-2 text-[11px] font-medium text-[oklch(64%_0.006_160)] hover:bg-[oklch(24%_0.014_150)] hover:text-[oklch(95.5%_0.004_150)] transition-colors cursor-pointer whitespace-nowrap"
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-busy={isSubmitting}
          className="mt-[30px]"
        >
          <fieldset disabled={isSubmitting} className="min-w-0">
            <label
              htmlFor="access-email"
              className="font-[family-name:var(--font-mono)] text-[9px] font-normal text-[oklch(64%_0.006_160)] block"
            >
              EMAIL ADDRESS
            </label>
            <div className="mt-[10px] relative">
              <Mail
                size={16}
                aria-hidden="true"
                className="text-[oklch(49%_0.007_160)] absolute top-[17px] left-[14px] pointer-events-none"
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
                className="flex w-full h-[50px] pl-[41px] pr-3 py-1 rounded-[5px] border border-[oklch(30%_0.006_160)] bg-[oklch(10.5%_0.003_160/0.63)] text-[11px] text-[oklch(95.5%_0.004_150)] placeholder:text-[oklch(49%_0.007_160)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[oklch(87.2%_0.283_140.5)] transition-colors"
              />
            </div>

            {!isRecovering && (
              <>
                <div className="flex items-center justify-between mt-[23px]">
                  <label
                    htmlFor="access-password"
                    className="font-[family-name:var(--font-mono)] text-[9px] font-normal text-[oklch(64%_0.006_160)] block"
                  >
                    PASSWORD
                  </label>
                  <button
                    type="button"
                    onClick={() => switchRecoverMode(true)}
                    className="h-auto p-0 text-[10px] font-medium text-[oklch(64%_0.006_160)] hover:text-[oklch(87.2%_0.283_140.5)] underline-offset-4 hover:underline transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="mt-[10px] relative">
                  <LockKeyhole
                    size={16}
                    aria-hidden="true"
                    className="text-[oklch(49%_0.007_160)] absolute top-[17px] left-[14px] pointer-events-none"
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
                    className="flex w-full h-[50px] pl-[41px] pr-[45px] py-1 rounded-[5px] border border-[oklch(30%_0.006_160)] bg-[oklch(10.5%_0.003_160/0.63)] text-[11px] text-[oklch(95.5%_0.004_150)] placeholder:text-[oklch(49%_0.007_160)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[oklch(87.2%_0.283_140.5)] transition-colors"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-[7px] right-[7px] h-9 w-9 rounded-md inline-flex items-center justify-center text-[oklch(64%_0.006_160)] hover:bg-[oklch(24%_0.014_150)] hover:text-[oklch(95.5%_0.004_150)] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </>
            )}

            {error && (
              <p
                id="access-error"
                role="alert"
                className="text-[oklch(72%_0.17_25)] mt-[11px] mb-[20px] text-[10px] leading-[1.6]"
              >
                {error}
              </p>
            )}

            {recoverySent && (
              <p
                role="status"
                className="text-[oklch(64%_0.006_160)] mt-[11px] mb-[20px] text-[10px] leading-[1.6]"
              >
                If this email belongs to an authorized account, a recovery link
                will arrive shortly.
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || recoverySent}
              className="w-full h-[49px] mt-[25px] px-[18px] rounded-[5px] bg-[oklch(87.2%_0.283_140.5)] hover:bg-[color-mix(in_oklch,oklch(87.2%_0.283_140.5)_85%,oklch(95.5%_0.004_150))] text-[oklch(12%_0.02_145)] text-[11px] font-bold inline-flex items-center justify-between cursor-pointer transition-colors disabled:opacity-65 whitespace-nowrap"
            >
              <span>
                {isSubmitting
                  ? 'Please wait…'
                  : isRecovering
                    ? 'Send recovery link'
                    : 'Enter command portal'}
              </span>
              {isSubmitting ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <ArrowRight size={17} />
              )}
            </button>

            <p
              role="status"
              className="text-[oklch(64%_0.006_160)] mt-[11px] mb-[20px] text-[10px] leading-[1.6]"
            >
              Authorized accounts only. No public registration.
            </p>

            {isRecovering && (
              <button
                type="button"
                onClick={() => switchRecoverMode(false)}
                className="w-full h-9 mb-4 px-4 py-2 rounded-md inline-flex items-center justify-center gap-2 text-[11px] font-medium text-[oklch(64%_0.006_160)] hover:bg-[oklch(24%_0.014_150)] hover:text-[oklch(95.5%_0.004_150)] transition-colors cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft size={16} />
                <span>Back to sign in</span>
              </button>
            )}
          </fieldset>
        </form>
      )}

      <div className="border-t border-[oklch(29%_0.008_160)] font-[family-name:var(--font-mono)] text-[oklch(49%_0.007_160)] flex items-center justify-center gap-[8px] -mx-[29px] max-[360px]:-mx-[23px] px-[29px] max-[360px]:px-[23px] py-[18px] text-[7px] font-normal">
        <ShieldCheck size={15} />
        <span>PRIVATE ACCESS. BY INVITATION ONLY.</span>
      </div>
    </section>
  );
}
