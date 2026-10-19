'use client';

import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  Fingerprint,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface LockScreenProps {
  hasExistingVault: boolean;
  vaultId?: string;
  lastLockedReason: string | null;
  onUnlockWithPassword: (password: string) => Promise<void>;
  onUnlockWithRecoveryKey: (recoveryKey: string) => Promise<void>;
  onCreateNewVault: (password: string, includeSampleItems: boolean) => Promise<void>;
}

export default function LockScreen({
  hasExistingVault,
  vaultId,
  lastLockedReason,
  onUnlockWithPassword,
  onUnlockWithRecoveryKey,
  onCreateNewVault,
}: LockScreenProps) {
  const [mode, setMode] = useState<'unlock' | 'recovery' | 'setup'>(
    hasExistingVault ? 'unlock' : 'setup'
  );
  const [password, setPassword] = useState(
    hasExistingVault ? '' : 'Blacktower!Master#2026'
  );
  const [confirmPassword, setConfirmPassword] = useState(
    hasExistingVault ? '' : 'Blacktower!Master#2026'
  );
  const [recoveryInput, setRecoveryInput] = useState('');
  const [includeSampleItems, setIncludeSampleItems] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showBiometricNotice, setShowBiometricNotice] = useState(false);

  const handlePasswordUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!password.trim()) {
      setErrorMsg('Enter your Master Password to derive the unlocking key.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onUnlockWithPassword(password);
      setPassword('');
    } catch {
      setErrorMsg(
        'Authentication failed. The derived key could not verify the Account Root Key authentication tag.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecoveryUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!recoveryInput.trim()) {
      setErrorMsg('Enter your 256-bit Recovery Key (BTVK-...).');
      return;
    }
    setIsSubmitting(true);
    try {
      await onUnlockWithRecoveryKey(recoveryInput);
      setRecoveryInput('');
    } catch {
      setErrorMsg(
        'Recovery verification failed. Ensure the 256-bit Recovery Key matches this vault.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetupVault = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (password.length < 10) {
      setErrorMsg('Master Password must be at least 10 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Master Password confirmation does not match.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onCreateNewVault(password, includeSampleItems);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to initialize vault hierarchy.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col justify-between">
      {/* Top Bar Contract: 3 zones */}
      <header className="flex items-center justify-between gap-4 md:gap-8 px-4 sm:px-6 py-4 border-b border-slate-800/80 bg-[#0B0F17]">
        <a
          href="#top"
          className="text-sm sm:text-base font-bold tracking-tight text-slate-100 whitespace-nowrap shrink-0"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          BLACKTOWER VAULT™
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <span className="whitespace-nowrap">Zero-Knowledge Architecture</span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span className="whitespace-nowrap">Four-Tier Key Hierarchy</span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span className="whitespace-nowrap">Fail-Closed Storage</span>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {hasExistingVault ? (
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setMode(mode === 'recovery' ? 'unlock' : 'recovery');
              }}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              {mode === 'recovery' ? 'Use Master Password' : 'Recovery Key Unlock'}
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-mono tabular-nums whitespace-nowrap">
              STATE: UNINITIALIZED
            </span>
          )}
        </div>
      </header>

      {/* Main Content Split */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Value Proposition & Honest Platform Posture */}
        <div className="lg:col-span-7 space-y-6">
          <div className="text-xs font-medium text-sky-400 tracking-wide">
            Personal Password & Digital Identity Vault · Client-Side Encrypted
          </div>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]"
            style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
          >
            Simple outside. Brutal security inside.
          </h1>
          <p className="text-base text-slate-300 leading-relaxed max-w-xl">
            Every password, note, identity, and payment card is sealed locally using an independent 256-bit item key before touching storage. Your Master Password never leaves memory and is never transmitted.
          </p>

          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-semibold text-slate-100">Four-Tier Key Separation</div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Master Password derives KEK via Argon2id v1.3 to unwrap Root, Vault, and Per-Item AES-256-GCM keys.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100">Zero Plaintext Persistence</div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Local storage and cloud sync hold authenticated ciphertext envelopes only. Memory zeroized on lock.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100">Verifiable Diagnostics</div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Nine live cryptographic regression tests execute directly in your runtime—never simulated.
              </p>
            </div>
          </div>

          {lastLockedReason && (
            <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Session locked ({lastLockedReason}). Sensitive key buffers and decrypted records were cleared from memory.
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Authentication / Provisioning Card (Single Elevation Depth) */}
        <div className="lg:col-span-5">
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
            {/* Mode Switch Tabs when vault exists */}
            {hasExistingVault && (
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setMode('unlock');
                  }}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    mode === 'unlock'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Master Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setMode('recovery');
                  }}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    mode === 'recovery'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Recovery Key
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setMode('setup');
                  }}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    mode === 'setup'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Reset / New
                </button>
              </div>
            )}

            {mode === 'unlock' && (
              <form onSubmit={handlePasswordUnlock} className="space-y-5">
                <div>
                  <h2
                    className="text-xl font-semibold text-white"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Unlock Vault
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {vaultId ? `Encrypted Container · ${vaultId}` : 'Local Encrypted Vault'}
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="unlock-master-password"
                    className="block text-xs font-medium text-slate-300"
                  >
                    Master Password
                  </label>
                  <div className="relative">
                    <input
                      id="unlock-master-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Master Password"
                      autoComplete="current-password"
                      className="w-full px-3.5 py-2.5 pr-10 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide Master Password' : 'Show Master Password'}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div
                    role="alert"
                    className="p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-xs text-rose-200 flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Deriving Key & Unwrapping...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Unlock Vault</span>
                    </>
                  )}
                </button>

                {/* Honest Biometric Entry Point */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowBiometricNotice(!showBiometricNotice)}
                    className="w-full py-2 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-slate-500" />
                      <span>Biometric authentication — Unavailable in Preview</span>
                    </span>
                    <span className="text-slate-500 underline">Why?</span>
                  </button>

                  {showBiometricNotice && (
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                      Platform Honesty Policy: Browser preview does not have access to native Android Keystore or StrongBox hardware-backed biometric key wrapping (`BiometricPrompt.CryptoObject`). BLACKTOWER VAULT™ never simulates hardware biometric unlock in a browser.
                    </div>
                  )}
                </div>
              </form>
            )}

            {mode === 'recovery' && (
              <form onSubmit={handleRecoveryUnlock} className="space-y-5">
                <div>
                  <h2
                    className="text-xl font-semibold text-white"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Recovery Key Restore
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Unwraps the Account Root Key using your 256-bit emergency Recovery Key.
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="recovery-key-input"
                    className="block text-xs font-medium text-slate-300"
                  >
                    256-Bit Recovery Key
                  </label>
                  <textarea
                    id="recovery-key-input"
                    rows={3}
                    value={recoveryInput}
                    onChange={(e) => setRecoveryInput(e.target.value)}
                    placeholder="BTVK-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX"
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {errorMsg && (
                  <div
                    role="alert"
                    className="p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-xs text-rose-200 flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isSubmitting ? 'Verifying Recovery Key...' : 'Verify & Unlock Vault'}</span>
                </button>
              </form>
            )}

            {mode === 'setup' && (
              <form onSubmit={handleSetupVault} className="space-y-4">
                <div>
                  <h2
                    className="text-xl font-semibold text-white"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {hasExistingVault ? 'Provision Fresh Vault' : 'Initialize Encrypted Vault'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Generates a fresh 16-byte salt, derives an Argon2id v1.3 KEK, and wraps a new 256-bit Root Key and Vault Key.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="setup-master-password"
                    className="block text-xs font-medium text-slate-300"
                  >
                    Master Password
                  </label>
                  <div className="relative">
                    <input
                      id="setup-master-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 10 characters"
                      className="w-full px-3.5 py-2 pr-10 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide Master Password' : 'Show Master Password'}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="setup-confirm-password"
                    className="block text-xs font-medium text-slate-300"
                  >
                    Confirm Master Password
                  </label>
                  <input
                    id="setup-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Master Password"
                    className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeSampleItems}
                    onChange={(e) => setIncludeSampleItems(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-950 text-sky-500 focus:ring-sky-500"
                  />
                  <span className="text-xs text-slate-300 leading-snug">
                    Encrypt sample records (Passwords, Secure Note, Identity, Credit Card, WireGuard Key) using per-item AES-256-GCM keys
                  </span>
                </label>

                {errorMsg && (
                  <div
                    role="alert"
                    className="p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-xs text-rose-200 flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating Four-Tier Key Hierarchy...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Initialize Vault & Unlock</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="px-6 py-4 border-t border-slate-800/60 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4">
        <span>BLACKTOWER VAULT™ · Zero-Knowledge Personal Vault</span>
        <span>Browser Preview Environment · Native Android Keystore Unavailable in Preview</span>
      </footer>
    </div>
  );
}
