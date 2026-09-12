import { redirect } from "next/navigation";
import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { expireOldItems } from "@/lib/item-expiry";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import EditProfileForm from "@/components/EditProfileForm";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  await expireOldItems();

  const reports = await prisma.item.findMany({
    where: {
      ownerId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  const lostReports = reports.filter((item) => item.type === "LOST").length;
  const foundReports = reports.filter((item) => item.type === "FOUND").length;
  const activeReports = reports.filter((item) => item.status === "ACTIVE").length;

  return (
    <main className="relative min-h-[100dvh] w-full bg-[#0a0a0c] font-sans text-[#f4f4f5] antialiased selection:bg-white selection:text-[#0a0a0c] flex flex-col justify-between p-2.5 sm:p-4 md:p-5">
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

      {/* Top Header */}
      <header className="w-full max-w-5xl mx-auto shrink-0 mb-2 sm:mb-3">
        <div className="flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-[#111114]/80 px-3.5 py-2 backdrop-blur-xl">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-400 transition-colors hover:text-white"
          >
            <span>&larr;</span>
            <span>Dashboard</span>
          </Link>

          <Link
            href="/dashboard"
            className="text-xs sm:text-sm font-bold tracking-tight text-white hover:opacity-85 transition-opacity"
          >
            NITRiTrack
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col gap-3 sm:gap-4">
        
        {/* 1. TOP FULL-WIDTH SECTION: Identity & Metrics Overview */}
        <section className="rounded-2xl border border-white/[0.08] bg-[#111114]/90 p-3.5 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {/* Identity Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-base sm:text-xl font-black tracking-[-0.03em] text-white">
                  {user.name || "NITR User"}
                </h1>
                <span className="rounded border border-white/[0.1] bg-white/[0.04] px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400 hidden sm:inline-block">
                  Verified Student
                </span>
              </div>
              <p className="truncate text-xs font-mono text-zinc-400 mt-0.5">
                {user.email}
              </p>
            </div>

            <div className="shrink-0">
              <EditProfileForm
                name={user.name || ""}
                phone={user.phone || ""}
              />
            </div>
          </div>

          {/* Metrics Row */}
          <div className="mt-3.5 grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-xl border border-white/[0.06] bg-[#0a0a0c]/80 p-2.5 sm:p-3 text-center">
              <span className="block text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                TOTAL
              </span>
              <p className="mt-0.5 text-base sm:text-xl font-black text-white">
                {reports.length}
              </p>
            </div>

            <div className="rounded-xl border border-rose-900/30 bg-rose-950/20 p-2.5 sm:p-3 text-center">
              <span className="block text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-widest text-rose-400">
                LOST
              </span>
              <p className="mt-0.5 text-base sm:text-xl font-black text-rose-300">
                {lostReports}
              </p>
            </div>

            <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/20 p-2.5 sm:p-3 text-center">
              <span className="block text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                FOUND
              </span>
              <p className="mt-0.5 text-base sm:text-xl font-black text-emerald-300">
                {foundReports}
              </p>
            </div>
          </div>

          {/* Account Details Footer */}
          <div className="mt-3.5 pt-3 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="flex sm:flex-col justify-between">
              <span className="font-mono font-bold uppercase tracking-wider text-zinc-400 text-[9px]">
                PHONE CONTACT
              </span>
              <span className="font-mono font-bold text-white truncate">
                {user.phone || "Not provided"}
              </span>
            </div>

            <div className="flex sm:flex-col justify-between">
              <span className="font-mono font-bold uppercase tracking-wider text-zinc-400 text-[9px]">
                ACTIVE REPORTS
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {activeReports} unresolved
              </span>
            </div>

            <div className="flex sm:flex-col justify-between">
              <span className="font-mono font-bold uppercase tracking-wider text-zinc-400 text-[9px]">
                MEMBER SINCE
              </span>
              <span className="font-mono font-bold text-zinc-300">
                {formatDate(user.createdAt)}
              </span>
            </div>
          </div>
        </section>

        {/* 2. BOTTOM BALANCED 50/50 GRID: Change Password (Left) & My Reports (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-stretch">
          
          {/* Card 1: Change Password (Balanced 50%) */}
          <section className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#111114]/90 p-3.5 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.06]">
                <h2 className="text-sm sm:text-base font-black tracking-[-0.03em] text-white">
                  Change Password
                </h2>
                
              </div>
              
            </div>

            <div className="mt-auto">
              <ChangePasswordForm />
            </div>
          </section>

          {/* Card 2: My Reports (Balanced 50% with Height Parity) */}
          <section className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#111114]/90 p-3.5 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.06]">
                <h2 className="text-sm sm:text-base font-black tracking-[-0.03em] text-white">
                  My Reports
                </h2>
                <span className="text-[10px] font-mono font-bold text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-full">
                  {reports.length} {reports.length === 1 ? "ITEM" : "ITEMS"}
                </span>
              </div>
            </div>

            {/* Scrollable list matching the height of password card */}
            <div className="h-[240px] sm:h-[260px] overflow-y-auto space-y-2 pr-1 [scrollbar-width:thin] [scrollbar-color:#27272a_transparent]">
              {reports.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-[#0a0a0c]/40 p-4 text-center text-xs font-mono text-zinc-500">
                  No reports logged yet.
                </div>
              ) : (
                reports.map((item) => (
                  <Link
                    key={item.id}
                    href={`/items/${item.id}`}
                    className="group flex items-center justify-between gap-2.5 rounded-xl border border-white/[0.06] bg-[#0a0a0c]/80 p-2.5 sm:px-3 sm:py-2.5 transition-all hover:border-white/[0.2] hover:bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[8px] font-mono font-black uppercase tracking-wider ${
                          item.type === "LOST"
                            ? "border border-rose-800/60 bg-rose-950 text-rose-300"
                            : "border border-emerald-800/60 bg-emerald-950 text-emerald-300"
                        }`}
                      >
                        {item.type}
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-white group-hover:text-zinc-200">
                          {item.title}
                        </p>
                        <p className="text-[9px] font-mono text-zinc-500">
                          Filed {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`text-[9px] font-mono font-bold uppercase tracking-wider ${
                          item.status === "ACTIVE"
                            ? "text-emerald-400"
                            : item.status === "CLOSED"
                            ? "text-zinc-400"
                            : "text-amber-400"
                        }`}
                      >
                        {item.status}
                      </span>

                      <span className="text-[11px] font-bold text-zinc-400 transition-colors group-hover:text-white">
                        &rarr;
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

        </div>

      </div>

      {/* Minimal Footer */}
      <footer className="mt-2.5 w-full shrink-0 py-1 text-center text-[10px] font-mono tracking-wide text-zinc-500">
        © 2026 NITRiTrack. Built for NIT Rourkela.
      </footer>
    </main>
  );
}