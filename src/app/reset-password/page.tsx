"use client";

import {
  FormEvent,
  Suspense,
  useEffect,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email =
    searchParams.get("email")?.trim().toLowerCase() || "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [resendTimer, setResendTimer] = useState(30);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // -----------------------------
  // 30 SECOND COUNTDOWN
  // -----------------------------

  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  // -----------------------------
  // RESET PASSWORD
  // -----------------------------

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email) {
      setError(
        "Email is missing. Please request a password reset again."
      );
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to reset password."
        );
        return;
      }

      setMessage(
        "Password reset successfully! Redirecting to login..."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error(
        "RESET PASSWORD ERROR:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // RESEND OTP
  // -----------------------------

  async function handleResendOTP() {
    if (resendTimer > 0 || resending) {
      return;
    }

    if (!email) {
      setError(
        "Email is missing. Please request a password reset again."
      );
      return;
    }

    setError("");
    setMessage("");
    setResending(true);

    try {
      const response = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to resend OTP."
        );
        return;
      }

      setMessage(
        "A new OTP has been sent to your email."
      );

      setResendTimer(30);
      setOtp("");
    } catch (error) {
      console.error(
        "RESEND OTP ERROR:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="relative min-h-[100dvh] w-full bg-[#0a0a0c] font-sans text-[#f4f4f5] antialiased selection:bg-white selection:text-[#0a0a0c] flex items-center justify-center p-3 sm:p-5">
      {/* Ambient Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-[220px] w-[320px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08)_0%,transparent_70%)] blur-[80px]"
      />

      {/* Background Precision Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] sm:bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_25%,#000_35%,transparent_100%)]"
      />

      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/[0.08] bg-[#111114]/90 p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">

          {/* Logo / Header */}
          <div className="text-center mb-6">
            <span className="block text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-1">
              SECURITY CREDENTIALS
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-[-0.035em] text-white">
              NITRiTrack
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Reset your password
            </p>
          </div>

          {/* Email Target Notice */}
          <div className="mb-5 rounded-xl border border-white/[0.06] bg-[#0a0a0c]/80 p-3 text-center">
            <p className="text-[11px] font-mono text-zinc-400">
              Verification code sent to
            </p>
            <p className="text-xs font-mono font-bold text-white mt-0.5 break-all">
              {email || "your registered email"}
            </p>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mb-4 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-300 font-mono">
              {error}
            </div>
          )}

          {/* Success Notice */}
          {message && (
            <div className="mb-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-300 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{message}</span>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* OTP */}
            <div>
              <label
                htmlFor="otp"
                className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1.5"
              >
                Verification Code <span className="text-rose-400">*</span>
              </label>

              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const value =
                    e.target.value.replace(/\D/g, "");

                  setOtp(value);
                }}
                placeholder="------"
                className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-3.5 py-2.5 sm:py-3 text-center font-mono text-xl tracking-[0.5em] text-white placeholder:text-zinc-700 outline-none transition-all focus:border-white/[0.28] focus:bg-[#0e0e11]"
              />
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1.5"
              >
                New Password <span className="text-rose-400">*</span>
              </label>

              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter new password (min. 8 chars)"
                className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-white/[0.28] focus:bg-[#0e0e11]"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1.5"
              >
                Confirm Password <span className="text-rose-400">*</span>
              </label>

              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Confirm new password"
                className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-white/[0.28] focus:bg-[#0e0e11]"
              />
            </div>

            {/* Reset Password Button */}
            <button
              type="submit"
              disabled={
                loading ||
                otp.length !== 6
              }
              className="group relative w-full overflow-hidden rounded-xl bg-white py-3 text-xs sm:text-sm font-bold text-[#0a0a0c] transition-all duration-300 hover:bg-zinc-200 hover:shadow-[0_0_28px_rgba(255,255,255,0.2)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-2 mt-1"
            >
              {!loading && (
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-black/10 to-transparent pointer-events-none" />
              )}

              {loading ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin text-[#0a0a0c]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Resetting Password...</span>
                </div>
              ) : (
                <span>Reset Password &rarr;</span>
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-5 text-center text-xs">
            <span className="text-zinc-500 font-mono">
              Didn't receive code?{" "}
            </span>

            {resendTimer > 0 ? (
              <span className="font-mono font-bold text-zinc-400">
                Resend in {resendTimer}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resending}
                className="font-mono font-bold text-white underline hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>

          {/* Back to Login */}
          <div className="mt-4 pt-4 border-t border-white/[0.06] text-center">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
            >
              &larr; Back to Login
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="relative min-h-[100dvh] w-full bg-[#0a0a0c] font-sans text-[#f4f4f5] flex items-center justify-center">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
            Loading...
          </div>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}