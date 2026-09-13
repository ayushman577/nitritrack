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
      setResendTimer((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  // -----------------------------
  // RESET PASSWORD
  // -----------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

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
          data.message || "Failed to reset password."
        );
        return;
      }

      setMessage(
        "Password reset successfully! Redirecting to login..."
      );

      window.setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error("RESET PASSWORD ERROR:", error);

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
      /*
       * This endpoint must be the same endpoint used
       * when requesting the first OTP.
       */
      const response = await fetch(
        "/api/request-otp",
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
          data.message || "Failed to resend OTP."
        );
        return;
      }

      setMessage(
        "A new OTP has been sent to your email."
      );

      setResendTimer(30);
      setOtp("");
    } catch (error) {
      console.error("RESEND OTP ERROR:", error);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#0a0a0c] p-3 font-sans text-[#f4f4f5] antialiased selection:bg-white selection:text-[#0a0a0c] sm:p-5">
      {/* Ambient Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-[220px] w-[320px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08)_0%,transparent_70%)] blur-[80px]"
      />

      {/* Background Precision Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_25%,#000_35%,transparent_100%)] sm:bg-[size:36px_36px]"
      />

      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/[0.08] bg-[#111114]/90 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-8">
          {/* Logo / Header */}
          <div className="mb-6 text-center">
            <span className="mb-3 block text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              SECURITY CREDENTIALS
            </span>

            <img
              src="/logo.svg"
              alt="NITRiTrack"
              className="mx-auto h-12 w-auto object-contain"
            />

            <p className="mt-2 text-xs text-zinc-400 sm:text-sm">
              Reset your password
            </p>
          </div>

          {/* Email Target Notice */}
          <div className="mb-5 rounded-xl border border-white/[0.06] bg-[#0a0a0c]/80 p-3 text-center">
            <p className="text-[11px] font-mono text-zinc-400">
              Verification code sent to
            </p>

            <p className="mt-0.5 break-all text-xs font-mono font-bold text-white">
              {email || "your registered email"}
            </p>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mb-4 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3.5 py-2.5 text-xs font-mono text-rose-300">
              {error}
            </div>
          )}

          {/* Success Notice */}
          {message && (
            <div className="mb-4 flex items-center gap-1.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2.5 text-xs font-mono text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
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
                className="mb-1.5 block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400"
              >
                Verification Code{" "}
                <span className="text-rose-400">*</span>
              </label>

              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                required
                value={otp}
                onChange={(event) => {
                  const value = event.target.value.replace(
                    /\D/g,
                    ""
                  );

                  setOtp(value);
                }}
                placeholder="------"
                className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-3.5 py-2.5 text-center font-mono text-xl tracking-[0.5em] text-white outline-none transition-all placeholder:text-zinc-700 focus:border-white/[0.28] focus:bg-[#0e0e11] sm:py-3"
              />
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400"
              >
                New Password{" "}
                <span className="text-rose-400">*</span>
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter new password (min. 8 chars)"
                className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-3.5 py-2.5 text-xs text-white outline-none transition-all placeholder:text-zinc-600 focus:border-white/[0.28] focus:bg-[#0e0e11] sm:py-3 sm:text-sm"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400"
              >
                Confirm Password{" "}
                <span className="text-rose-400">*</span>
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Confirm new password"
                className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-3.5 py-2.5 text-xs text-white outline-none transition-all placeholder:text-zinc-600 focus:border-white/[0.28] focus:bg-[#0e0e11] sm:py-3 sm:text-sm"
              />
            </div>

            {/* Reset Password Button */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="group relative mt-1 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white py-3 text-xs font-bold text-[#0a0a0c] transition-all duration-300 hover:bg-zinc-200 hover:shadow-[0_0_28px_rgba(255,255,255,0.2)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
            >
              {!loading && (
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
              )}

              {loading ? (
                <span className="flex items-center gap-2">
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
                </span>
              ) : (
                <span>Reset Password →</span>
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-5 text-center text-xs">
            <span className="font-mono text-zinc-500">
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
                className="font-mono font-bold text-white underline transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>

          {/* Back to Login */}
          <div className="mt-4 border-t border-white/[0.06] pt-4 text-center">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-xs font-mono uppercase tracking-wider text-zinc-400 transition-colors hover:text-white"
            >
              ← Back to Login
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
        <main className="relative flex min-h-[100dvh] w-full items-center justify-center bg-[#0a0a0c] font-sans text-[#f4f4f5]">
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