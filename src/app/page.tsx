import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-[100dvh] bg-[#0a0a0c] text-[#f4f4f5] font-sans overflow-x-hidden flex flex-col justify-between selection:bg-[#ffffff] selection:text-[#0a0a0c] antialiased">
      
      {/* 1. Atmospheric Spotlight Glow */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 sm:-top-32 md:-top-44 left-1/2 -translate-x-1/2 w-[340px] sm:w-[680px] md:w-[940px] h-[280px] sm:h-[420px] md:h-[500px] rounded-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_40%,transparent_75%)] blur-[80px] sm:blur-[120px] -z-10"
      />

      <div 
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-[-10%] sm:right-[-5%] w-[220px] sm:w-[400px] h-[200px] sm:h-[320px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_0%,transparent_70%)] blur-[90px] sm:blur-[120px] -z-10"
      />

      {/* 2. Precision Mesh Grid */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px] sm:bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_20%,#000_35%,transparent_100%)]"
      />

      {/* 3. Floating Minimal Navbar */}
      <header className="pt-4 sm:pt-6 px-4 sm:px-6 max-w-5xl mx-auto w-full z-20">
        <div className="flex items-center justify-between py-2 px-3 sm:px-4 rounded-full border border-white/[0.08] bg-[#111114]/60 backdrop-blur-xl">
          <div className="flex items-center gap-2 pl-1 sm:pl-2">
            <span className="text-[#ffffff] font-bold tracking-tight text-sm sm:text-base">
              NITRiTrack
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-medium text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/[0.05]"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#ffffff] text-[#0a0a0c] hover:bg-zinc-200 transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.12)] active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* 4. Main Hero Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 text-center my-auto flex flex-col items-center justify-center">
        
        {/* Hero Title with Monochrome Contrast */}
        <div className="relative inline-block w-full max-w-3xl">
          <h1 className="text-[clamp(2.35rem,8.5vw,4.85rem)] leading-[1.02] font-black tracking-[-0.035em]">
            <span className="text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.12)]">
              Find what’s lost.
            </span>
            <br />
            <span className="text-zinc-500 hover:text-zinc-400 transition-colors">
              Return what’s found!
            </span>
          </h1>
        </div>

        {/* Subtitle with Refined Typography */}
        <p className="mt-5 sm:mt-7 max-w-[340px] sm:max-w-md md:max-w-xl text-sm sm:text-base md:text-[17px] text-zinc-400 leading-relaxed font-normal px-2">
          NITRiTrack helps the campus community quickly document, track, and
          safely recover misplaced belongings with verified claims.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 sm:mt-11 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-[320px] sm:max-w-none">
          
          {/* Primary Action Button */}
          <Link
            href="/register"
            className="group relative w-full sm:w-auto overflow-hidden rounded-full bg-[#ffffff] hover:bg-zinc-200 px-7 py-3.5 text-xs sm:text-sm font-semibold text-[#0a0a0c] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-black/10 to-transparent pointer-events-none" />
            <span>Register as a new user</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>

          {/* Secondary Action Button */}
          <Link
            href="/login"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-white/[0.1] hover:border-white/[0.22] bg-[#141417]/70 hover:bg-[#1a1a1f] text-zinc-300 hover:text-white transition-all duration-200 text-xs sm:text-sm font-medium backdrop-blur-md active:scale-[0.98] flex items-center justify-center"
          >
            Log in to dashboard
          </Link>
        </div>

      </section>

      {/* 5. Footer Bar */}
      <footer className="w-full py-5 px-4 sm:px-6 border-t border-white/[0.06] flex items-center justify-center text-[11px] sm:text-xs text-zinc-500 max-w-5xl mx-auto z-10 text-center tracking-wide font-mono">
        <div>© 2026 NITRiTrack. Built for NIT Rourkela.</div>
      </footer>

    </main>
  );
}