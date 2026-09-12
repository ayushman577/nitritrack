"use client";

import {
  FormEvent,
  Suspense,
  useEffect,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email =
    searchParams.get("email")?.trim().toLowerCase() || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [resending, setResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  // Verify OTP
  async function handleVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email) {
      setError(
        "Email is missing. Please register again."
      );
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Invalid OTP"
        );
        return;
      }

      setMessage(
        "Email verified successfully! Redirecting..."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (error) {
      console.error(error);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // Resend OTP
  async function handleResendOTP() {
    if (resendTimer > 0 || resending) {
      return;
    }

    if (!email) {
      setError(
        "Email is missing. Please register again."
      );
      return;
    }

    setError("");
    setMessage("");
    setResending(true);

    try {
      const response = await fetch(
        "/api/auth/resend-otp",
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
          data.message || "Failed to resend OTP"
        );
        return;
      }

      setMessage(
        "A new OTP has been sent to your email."
      );

      setResendTimer(30);
      setOtp("");
    } catch (error) {
      console.error(error);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="relative min-h-[100dvh] bg-[#0a0a0c] text-[#f4f4f5] font-sans overflow-x-hidden flex flex-col justify-between selection:bg-[#ffffff] selection:text-[#0a0a0c] antialiased">

      {/* 1. Atmospheric Spotlight Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 sm:-top-32 left-1/2 -translate-x-1/2 w-[340px] sm:w-[680px] md:w-[940px] h-[280px] sm:h-[420px] rounded-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_40%,transparent_75%)] blur-[80px] sm:blur-[120px] -z-10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-[-10%] w-[220px] sm:w-[400px] h-[200px] sm:h-[320px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_0%,transparent_70%)] blur-[90px] sm:blur-[120px] -z-10"
      />

      {/* 2. Precision Mesh Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px] sm:bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_25%,#000_35%,transparent_100%)]"
      />

      {/* 3. Floating Minimal Navbar */}
      <header className="pt-4 sm:pt-6 px-4 sm:px-6 max-w-5xl mx-auto w-full z-20">
        <div className="flex items-center justify-between py-2 px-3 sm:px-4 rounded-full border border-white/[0.08] bg-[#111114]/60 backdrop-blur-xl">

          <Link
            href="/"
            className="flex items-center gap-2 pl-1 sm:pl-2 group"
          >
            <span className="text-[#ffffff] font-bold tracking-tight text-sm sm:text-base transition-opacity group-hover:opacity-80">
              NITRiTrack
            </span>
          </Link>

          <Link
            href="/login"
            className="text-xs sm:text-sm font-medium text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/[0.05]"
          >
            Login
          </Link>

        </div>
      </header>

      {/* 4. Form Card Section */}
      <section className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6 py-8 my-auto">

        {/* Title & Email Recipient Info */}
        <div className="mb-6 sm:mb-8 text-center">

          <h1 className="text-2xl sm:text-3xl font-black tracking-[-0.035em] text-white">
            Verify your email
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-zinc-400 font-normal">
            We sent a 6-digit verification code to
          </p>

          <p className="text-white font-mono text-xs sm:text-sm mt-1 break-all bg-white/[0.04] py-1 px-3 rounded-full inline-block border border-white/[0.08]">
            {email || "your email"}
          </p>

        </div>

        {/* Matte Hardware Card Form */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#111114]/80 backdrop-blur-xl p-5 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">

          {/* Error Message */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/25 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300 font-mono">
              {error}
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="mb-5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-300 font-mono">
              {message}
            </div>
          )}

          {/* Verification Form */}
          <form
            onSubmit={handleVerify}
            className="space-y-4"
          >
            <div>

              <label
                htmlFor="otp"
                className="block text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-2 text-center"
              >
                Verification Code
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
                placeholder="······"
                disabled={loading}
                className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-4 py-3.5 text-center text-2xl font-mono tracking-[0.4em] text-white outline-none placeholder:text-zinc-600 transition-all focus:border-white/[0.28] focus:bg-[#0e0e11] disabled:opacity-50"
              />

            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="group relative w-full overflow-hidden rounded-full bg-[#ffffff] hover:bg-zinc-200 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-[#0a0a0c] transition-all duration-300 hover:shadow-[0_0_28px_rgba(255,255,255,0.2)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-2 mt-2"
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

                  <span>Verifying...</span>

                </div>
              ) : (
                <span>Verify Email</span>
              )}
            </button>

          </form>

          {/* Resend Section */}
          <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">

            <p className="text-xs text-zinc-500">
              Didn't receive the code?
            </p>

            {resendTimer > 0 ? (
              <p className="mt-1 text-xs text-zinc-500 font-mono">
                Resend OTP{" "}
                <span className="font-semibold text-white">
                  in {resendTimer}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resending}
                className="mt-1 text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {resending
                  ? "Sending..."
                  : "Resend OTP →"}
              </button>
            )}

          </div>

        </div>

        {/* Back to Login */}
        <p className="mt-6 text-center">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-xs sm:text-sm text-zinc-500 hover:text-white transition-colors"
          >
            ← Back to Login
          </button>
        </p>

      </section>

      {/* 5. Minimal Footer */}
      <footer className="w-full py-5 px-4 sm:px-6 border-t border-white/[0.06] flex items-center justify-center text-[11px] sm:text-xs text-zinc-500 max-w-5xl mx-auto z-10 text-center tracking-wide font-mono">
        <div>
          © {new Date().getFullYear()} NITRiTrack. Built for NIT Rourkela.
        </div>
      </footer>

    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[100dvh] bg-[#0a0a0c] flex items-center justify-center px-4">
          <div className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            Loading...
          </div>
        </main>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
