"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setIsError(false);

    const normalizedEmail = email.trim().toLowerCase();

    /*
     * STEP 1:
     * Check the institute email domain on the frontend.
     * The backend will also check this for security.
     */
    if (!normalizedEmail.endsWith("@nitrkl.ac.in")) {
      setIsError(true);
      setMessage(
        "Please use your NIT Rourkela institute email (@nitrkl.ac.in)."
      );
      setLoading(false);
      return;
    }

    try {
      /*
       * IMPORTANT:
       * Use /api/request-otp because this route checks:
       * 1. NIT Rourkela email domain
       * 2. Whether the email is registered
       * 3. Sends OTP only after both checks pass
       */
      const response = await fetch(
        "/api/request-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
          }),
        }
      );

      const data = await response.json();

      /*
       * Do not redirect if the backend rejects the email.
       */
      if (!response.ok) {
        setIsError(true);
        setMessage(
          data.message ||
            "Failed to send reset instructions."
        );
        return;
      }

      /*
       * Redirect only when OTP was successfully sent.
       */
      setMessage(
        data.message ||
          "Reset OTP sent successfully."
      );

      router.push(
        `/reset-password?email=${encodeURIComponent(
          normalizedEmail
        )}`
      );
    } catch (error) {
      console.error(
        "FORGOT PASSWORD ERROR:",
        error
      );

      setIsError(true);
      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-[100dvh] flex-col justify-between overflow-x-hidden bg-[#0a0a0c] font-sans text-[#f4f4f5] antialiased selection:bg-white selection:text-[#0a0a0c]">
      {/* Atmospheric Spotlight Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[280px] w-[340px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_40%,transparent_75%)] blur-[80px] sm:-top-32 sm:h-[420px] sm:w-[680px] sm:blur-[120px] md:w-[940px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-[-10%] -z-10 h-[200px] w-[220px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_0%,transparent_70%)] blur-[90px] sm:h-[320px] sm:w-[400px] sm:blur-[120px]"
      />

      {/* Precision Mesh Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_25%,#000_35%,transparent_100%)] sm:bg-[size:44px_44px]"
      />

      {/* Navbar */}
      <header className="z-20 mx-auto w-full max-w-5xl px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between rounded-full border border-white/[0.08] bg-[#111114]/60 px-3 py-2 backdrop-blur-xl sm:px-4">
          <Link
            href="/"
            className="group flex items-center gap-2 pl-1 sm:pl-2"
          >
            <span className="text-sm font-bold tracking-tight text-white transition-opacity group-hover:opacity-80 sm:text-base">
              NITRiTrack
            </span>
          </Link>

          <Link
            href="/login"
            className="rounded-full px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-white sm:text-sm"
          >
            Back to Login
          </Link>
        </div>
      </header>

      {/* Forgot Password Section */}
      <section className="relative z-10 mx-auto my-auto w-full max-w-md px-4 py-8 sm:px-6">
        {/* Title */}
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="text-2xl font-black tracking-[-0.035em] text-white sm:text-3xl">
            Forgot password
          </h1>

          <p className="mt-2 text-xs font-normal text-zinc-400 sm:text-sm">
            Enter your institute email to receive a recovery OTP code
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="space-y-3.5 rounded-2xl border border-white/[0.08] bg-[#111114]/80 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:space-y-4 sm:p-7"
        >
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400"
            >
              Institute Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="yourname@nitrkl.ac.in"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
              disabled={loading}
              autoComplete="email"
              className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-4 py-3 text-xs text-white outline-none transition-all placeholder:text-zinc-500 focus:border-white/[0.28] focus:bg-[#0e0e11] disabled:opacity-50 sm:text-sm"
            />
          </div>

          {/* Feedback Message */}
          {message && (
            <div
              role="alert"
              className={`rounded-xl border px-3.5 py-2.5 text-xs font-mono ${
                isError
                  ? "border-red-500/25 bg-red-500/10 text-red-300"
                  : "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-white py-3 text-xs font-semibold text-[#0a0a0c] transition-all duration-300 hover:bg-zinc-200 hover:shadow-[0_0_28px_rgba(255,255,255,0.2)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:py-3.5 sm:text-sm"
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

                <span>Sending OTP...</span>
              </span>
            ) : (
              <span>Send OTP</span>
            )}
          </button>
        </form>

        {/* Footer Redirect Link */}
        <p className="mt-6 text-center text-xs text-zinc-500 sm:text-sm">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-white underline decoration-zinc-600 underline-offset-4 transition-colors hover:decoration-white"
          >
            Login
          </Link>
        </p>
      </section>

      {/* Footer */}
      <footer className="z-10 mx-auto flex w-full max-w-5xl items-center justify-center border-t border-white/[0.06] px-4 py-5 text-center text-[11px] font-mono tracking-wide text-zinc-500 sm:px-6 sm:text-xs">
        <div>
          © {new Date().getFullYear()} NITRiTrack. Built for NIT Rourkela.
        </div>
      </footer>
    </main>
  );
}