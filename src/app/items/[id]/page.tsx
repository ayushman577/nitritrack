import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { expireOldItems } from "@/lib/item-expiry";
import CloseReportButton from "./CloseReportButton";

const categoryLabels: Record<string, string> = {
  ID_CARD: "ID Card",
  MONEY: "Money",
  WALLET: "Wallet",
  PHONE: "Phone",
  LAPTOP: "Laptop",
  EARPHONES: "Earphones",
  WATCH: "Watch",
  KEYS: "Keys",
  BAG: "Bag",
  BOOKS: "Books",
  CLOTHING: "Clothing",
  DOCUMENTS: "Documents",
  ACCESSORIES: "Accessories",
  ELECTRONICS: "Electronics",
  OTHER: "Other",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

type ItemPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ItemDetailsPage({
  params,
}: ItemPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  await expireOldItems();

  const { id } = await params;

  const item = await prisma.item.findUnique({
    where: {
      id,
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
        },
      },
    },
  });

  if (!item) {
    notFound();
  }

  const contactSubject = `NITRiTrack - Regarding your ${item.type.toLowerCase()} report: ${item.title}`;

  const contactBody = `Hi ${item.owner.name || "there"},

I am contacting you regarding your NITRiTrack ${item.type.toLowerCase()} report.

Report: ${item.title}
Category: ${categoryLabels[item.category] || item.category}
Location: ${item.location}

I believe I may have information regarding this item.

Please let me know.

Regards,
${user.name || "NITR Student"}`;

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

      {/* Header Navbar */}
      <header className="mx-auto mb-2 sm:mb-3 w-full max-w-5xl shrink-0">
        <div className="flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-[#111114]/80 px-3.5 py-2 backdrop-blur-xl sm:px-4 sm:py-2.5">
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

      {/* Main Single-Viewport Card */}
      <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col justify-center">
        <article className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111114]/90 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl md:grid md:grid-cols-12 min-h-0">
          
          {/* MEDIA PANE */}
          <div className="relative flex h-[32vh] xs:h-[35vh] sm:h-[38vh] md:h-auto md:min-h-[440px] shrink-0 items-center justify-center border-b border-white/[0.08] bg-[#16161a] p-3 md:col-span-5 md:border-b-0 md:border-r">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-contain max-h-[380px]"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                  NO PHOTO ATTACHED
                </span>
              </div>
            )}

            {/* High-Visibility Status Pill */}
            <div className="absolute left-3 top-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-mono font-black uppercase tracking-widest shadow-lg ${
                  item.type === "LOST"
                    ? "border border-rose-400/50 bg-rose-600 text-white"
                    : "border border-emerald-400/50 bg-emerald-600 text-white"
                }`}
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                {item.type}
              </span>
            </div>
          </div>

          {/* INFORMATION DECK */}
          <div className="flex min-h-0 flex-1 flex-col justify-between p-3.5 sm:p-5 md:col-span-7">
            <div className="space-y-2.5 sm:space-y-3">
              
              {/* Category & Lifecycle Status Header */}
              <div className="flex items-center justify-between gap-2">
                <span className="rounded border border-white/[0.1] bg-white/[0.06] px-2.5 py-1 text-[10px] font-mono font-extrabold uppercase tracking-widest text-zinc-300">
                  {categoryLabels[item.category] || item.category}
                </span>

                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      item.status === "ACTIVE"
                        ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                        : item.status === "CLOSED"
                        ? "bg-zinc-400"
                        : "bg-amber-400"
                    }`}
                  />
                  <span
                    className={
                      item.status === "ACTIVE"
                        ? "text-emerald-400"
                        : item.status === "CLOSED"
                        ? "text-zinc-400"
                        : "text-amber-400"
                    }
                  >
                    {item.status === "ACTIVE"
                      ? "Active"
                      : item.status === "CLOSED"
                      ? "Resolved"
                      : "Expired"}
                  </span>
                </span>
              </div>

              {/* Item Title */}
              <h1 className="text-base sm:text-xl md:text-2xl font-black leading-snug tracking-[-0.03em] text-white">
                {item.title}
              </h1>

              {/* Key Details Matrix (Location & Date) */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-white/[0.06] bg-[#0a0a0c]/80 p-2.5 sm:p-3">
                  <span className="block text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                    LOCATION
                  </span>
                  <p className="mt-0.5 truncate text-xs sm:text-sm font-bold text-white">
                    {item.location}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-[#0a0a0c]/80 p-2.5 sm:p-3">
                  <span className="block text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                    DATE REPORTED
                  </span>
                  <p className="mt-0.5 text-xs sm:text-sm font-mono font-bold text-white">
                    {formatDate(item.itemDate)}
                  </p>
                </div>
              </div>

              {/* Description / Notes Box */}
              {item.description && (
                <div className="rounded-xl border border-white/[0.06] bg-[#0a0a0c]/60 p-2.5 sm:p-3 max-h-20 sm:max-h-28 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#27272a_transparent]">
                  <span className="mb-0.5 block text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                    DETAILS & NOTES
                  </span>
                  <p className="text-[11px] sm:text-xs font-normal leading-relaxed text-zinc-300">
                    {item.description}
                  </p>
                </div>
              )}
            </div>

            {/* Poster Info & Action Buttons */}
            <div className="mt-3.5 border-t border-white/[0.08] pt-3">
              
              

              {/* Action Buttons Matrix */}
              {item.owner.id !== user.id ? (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {/* Call Mobile */}
                  {item.owner.phone ? (
                    <a
                      href={`tel:${item.owner.phone}`}
                      className="group flex items-center justify-between rounded-xl border border-white/[0.1] bg-[#0a0a0c] px-3 py-2 sm:px-3.5 sm:py-2.5 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/[0.05] active:scale-[0.98]"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="block text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                          CALL MOBILE
                        </span>
                        <span className="mt-0.5 block truncate text-xs font-mono font-bold text-white">
                          {item.owner.phone}
                        </span>
                      </div>

                      <span className="text-xs font-bold text-zinc-400 transition-colors group-hover:text-emerald-400">
                        &rarr;
                      </span>
                    </a>
                  ) : null}

                  {/* Send Email */}
                  <a
                    href={`mailto:${item.owner.email}?subject=${encodeURIComponent(
                      contactSubject
                    )}&body=${encodeURIComponent(contactBody)}`}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 transition-all active:scale-[0.98] ${
                      item.owner.phone
                        ? "border border-white/[0.1] bg-[#0a0a0c] hover:border-blue-500/40 hover:bg-blue-500/[0.05]"
                        : "col-span-full bg-white text-[#0a0a0c] hover:bg-zinc-200"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <span
                        className={`block text-[8px] font-mono font-bold uppercase tracking-widest ${
                          item.owner.phone ? "text-zinc-400" : "text-black/70"
                        }`}
                      >
                        SEND EMAIL
                      </span>
                
                    </div>

                    <span
                      className={`text-xs font-bold transition-colors ${
                        item.owner.phone
                          ? "text-zinc-400"
                          : "text-black"
                      }`}
                    >
                      &rarr;
                    </span>
                  </a>
                </div>
              ) : (
                /* OWNER ACTIONS: Symmetric Pair */
                item.status === "ACTIVE" && (
                  <div className="grid grid-cols-2 gap-2">
                    {/* Edit Report */}
                    <Link
                      href={`/items/${item.id}/edit`}
                      className="group flex items-center justify-between rounded-xl border border-blue-500/30 bg-blue-500/[0.08] px-3 py-2 sm:px-3.5 sm:py-2.5 transition-all hover:border-blue-500/50 hover:bg-blue-500/[0.14] active:scale-[0.98]"
                    >
                      <div className="min-w-0 pr-2">
                        
                        <span className="mt-0.5 block text-xs font-bold text-white truncate">
                          Edit Report
                        </span>
                      </div>

                      <span className="text-xs font-bold text-blue-400 group-hover:translate-x-0.5 transition-transform">
                        &rarr;
                      </span>
                    </Link>

                    {/* Close Report Button */}
                    <CloseReportButton itemId={item.id} />
                  </div>
                )
              )}
            </div>

          </div>
        </article>
      </div>

      {/* Footer */}
      <footer className="mt-2 w-full shrink-0 py-1.5 text-center text-[10px] font-mono tracking-wide text-zinc-500">
        © 2026 NITRiTrack. Built for NIT Rourkela.
      </footer>
    </main>
  );
}