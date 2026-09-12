"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
          <Link href="/" className="flex items-center gap-2 pl-1 sm:pl-2 group">
            <span className="text-[#ffffff] font-bold tracking-tight text-sm sm:text-base transition-opacity group-hover:opacity-80">
              NITRiTrack
            </span>
          </Link>

          <Link
            href="/register"
            className="text-xs sm:text-sm font-medium text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/[0.05]"
          >
            Register
          </Link>
        </div>
      </header>

      {/* 4. Login Card Section */}
      <section className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6 py-8 my-auto">
        
        {/* Title & Subtitle */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-black tracking-[-0.035em] text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 font-normal">
            Login to your NITRiTrack account
          </p>
        </div>

        {/* Matte Hardware Card Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-3.5 sm:space-y-4 rounded-2xl border border-white/[0.08] bg-[#111114]/80 backdrop-blur-xl p-5 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          {/* Email Field */}
          <div>
            <input
              type="email"
              placeholder="Institute email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-4 py-3 text-xs sm:text-sm text-white outline-none placeholder:text-zinc-500 transition-all focus:border-white/[0.28] focus:bg-[#0e0e11] disabled:opacity-50"
            />
          </div>

          {/* Password Field */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-4 py-3 text-xs sm:text-sm text-white outline-none placeholder:text-zinc-500 transition-all focus:border-white/[0.28] focus:bg-[#0e0e11] disabled:opacity-50"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right pt-0.5">
            <Link
              href="/forgot-password"
              className="text-xs text-zinc-400 hover:text-white transition-colors underline decoration-zinc-700 underline-offset-4 hover:decoration-white"
            >
              Forgot password?
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300 font-mono">
              {error}
            </div>
          )}

          {/* Submit Button with Loading State */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-full bg-[#ffffff] hover:bg-zinc-200 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-[#0a0a0c] transition-all duration-300 hover:shadow-[0_0_28px_rgba(255,255,255,0.2)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {/* Shimmer sweep animation */}
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
                <span>Logging in...</span>
              </div>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>

        {/* Footer Redirect Link */}
        <p className="mt-6 text-center text-xs sm:text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[#ffffff] underline decoration-zinc-600 underline-offset-4 hover:decoration-white transition-colors"
          >
            Create account
          </Link>
        </p>

      </section>

      {/* 5. Minimal Footer */}
      <footer className="w-full py-5 px-4 sm:px-6 border-t border-white/[0.06] flex items-center justify-center text-[11px] sm:text-xs text-zinc-500 max-w-5xl mx-auto z-10 text-center tracking-wide font-mono">
        <div>© {new Date().getFullYear()} NITRiTrack. Built for NIT Rourkela.</div>
      </footer>

    </main>
  );
}