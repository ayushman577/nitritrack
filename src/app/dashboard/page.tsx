import { redirect } from "next/navigation";
import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { expireOldItems } from "@/lib/item-expiry";

import DashboardFilters from "./DashboardFilters";

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

type DashboardPageProps = {
    searchParams: Promise<{
        type?: string;
        category?: string;
        search?: string;
    }>;
};

export default async function DashboardPage({
    searchParams,
}: DashboardPageProps) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    // Expire reports whose 7-day lifetime has passed
    await expireOldItems();

    /*
    ============================================================
    READ FILTERS FROM URL
    ============================================================
    */
    const params = await searchParams;

    const type =
        params.type === "LOST" || params.type === "FOUND"
            ? params.type
            : undefined;

    const validCategories = [
        "ID_CARD",
        "MONEY",
        "WALLET",
        "PHONE",
        "LAPTOP",
        "EARPHONES",
        "WATCH",
        "KEYS",
        "BAG",
        "BOOKS",
        "CLOTHING",
        "DOCUMENTS",
        "ACCESSORIES",
        "ELECTRONICS",
        "OTHER",
    ];

    const category =
        params.category &&
            validCategories.includes(params.category)
            ? params.category
            : undefined;

    const search = params.search?.trim() || undefined;

    /*
    ============================================================
    FETCH FILTERED REPORTS
    ============================================================
    */
    const items = await prisma.item.findMany({
        where: {
            status: "ACTIVE",

            ...(type && {
                type,
            }),

            ...(category && {
                category: category as any,
            }),

            ...(search && {
                OR: [
                    {
                        title: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        description: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        location: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }),
        },

        orderBy: {
            createdAt: "desc",
        },

        take: 30,
    });

    /*
    ============================================================
    PAGE TITLE
    ============================================================
    */
    let reportTitle = "Recent Reports";

    if (type === "LOST") {
        reportTitle = "Lost Items";
    }

    if (type === "FOUND") {
        reportTitle = "Found Items";
    }

    if (category) {
        reportTitle = `${categoryLabels[category]} Reports`;
    }

    return (
        <main className="relative min-h-[100dvh] bg-[#0a0a0c] text-[#f4f4f5] font-sans overflow-x-hidden flex flex-col justify-between selection:bg-[#ffffff] selection:text-[#0a0a0c] antialiased">

            {/* Atmospheric Ambient Glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 sm:-top-32 left-1/2 -translate-x-1/2 w-[300px] sm:w-[680px] md:w-[940px] h-[240px] sm:h-[420px] rounded-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_40%,transparent_75%)] blur-[70px] sm:blur-[120px] -z-10"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 right-[-10%] w-[180px] sm:w-[400px] h-[180px] sm:h-[320px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_0%,transparent_70%)] blur-[80px] sm:blur-[120px] -z-10"
            />

            {/* Background Precision Grid */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] sm:bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_25%,#000_35%,transparent_100%)]"
            />

            {/* Header Navbar */}
            <header className="pt-3 sm:pt-6 px-3 sm:px-6 max-w-5xl mx-auto w-full z-20">
                <div className="flex items-center justify-between py-2 px-3 sm:px-4 rounded-full border border-white/[0.08] bg-[#111114]/80 backdrop-blur-xl">

                    {/* Brand */}
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 pl-1 sm:pl-2 group shrink-0"
                    >
                        <span className="text-white font-bold tracking-tight text-sm sm:text-base transition-opacity group-hover:opacity-85">
                            NITRiTrack
                        </span>
                    </Link>

                    {/* Profile Pill */}
                    <Link
                        href="/profile"
                        className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#0a0a0c] pl-1 sm:pl-1.5 pr-3 py-1 text-xs font-medium text-zinc-200 hover:text-white hover:border-white/[0.22] transition-all focus:outline-none focus:ring-2 focus:ring-white/20 group max-w-[65%] sm:max-w-none"
                        aria-label="User profile"
                    >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold text-black group-hover:bg-zinc-200 transition-colors">
                            {(user.name || "U").charAt(0).toUpperCase()}
                        </span>

                        <span className="text-xs font-bold text-white whitespace-nowrap">
                            {user.name || "Account"}
                        </span>

                        <svg
                            className="w-3 h-3 shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-colors"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </Link>
                </div>
            </header>

            {/* Main Dashboard Area */}
            <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-6 py-5 sm:py-8 w-full my-auto">

                {/* Welcome Header */}
                <section className="mb-4 sm:mb-5 flex items-end justify-between border-b border-white/[0.06] pb-3 sm:pb-4">
                    <div>
                        <h1 className="text-lg sm:text-2xl font-black tracking-[-0.035em] text-white">
                            Welcome, {user.name || "User"}!
                        </h1>

                        <p className="mt-0.5 text-xs sm:text-sm text-zinc-400 font-normal">
                            Quickly claim misplaced items or record found belongings.
                        </p>
                    </div>

                    <span className="hidden sm:inline-block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                        Registry Active
                    </span>
                </section>

                {/* Quick Report Actions Strip */}
                <section className="mb-5 sm:mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">

                    {/* Report Lost */}
                    <Link
                        href="/report?type=LOST"
                        className="group flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/[0.08] bg-[#111114]/80 backdrop-blur-xl hover:border-white/[0.22] hover:bg-[#141418] transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.3)] active:scale-[0.99]"
                    >
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                            <span className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-300 font-mono font-bold text-xs sm:text-sm">
                                !
                            </span>

                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight truncate">
                                        I Lost an Item
                                    </span>

                                    <span className="text-[9px] font-mono font-black uppercase text-white bg-rose-600 px-1.5 py-0.2 rounded shadow">
                                        Missing
                                    </span>
                                </div>

                                <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate font-medium">
                                    Request peer & security search
                                </p>
                            </div>
                        </div>

                        <span className="ml-2 inline-flex items-center justify-center h-7 sm:h-8 px-3 sm:px-3.5 rounded-full bg-white text-[#0a0a0c] text-[11px] sm:text-xs font-bold shrink-0 group-hover:bg-zinc-200 transition-colors">
                            Report &rarr;
                        </span>
                    </Link>

                    {/* Found Item */}
                    <Link
                        href="/report?type=FOUND"
                        className="group flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/[0.08] bg-[#111114]/80 backdrop-blur-xl hover:border-white/[0.22] hover:bg-[#141418] transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.3)] active:scale-[0.99]"
                    >
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                            <span className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 font-mono font-bold text-xs sm:text-sm">
                                +
                            </span>

                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight truncate">
                                        I Found an Item
                                    </span>

                                    <span className="text-[9px] font-mono font-black uppercase text-white bg-emerald-600 px-1.5 py-0.2 rounded shadow">
                                        Found
                                    </span>
                                </div>

                                <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate font-medium">
                                    Post details for verified claim
                                </p>
                            </div>
                        </div>

                        <span className="ml-2 inline-flex items-center justify-center h-7 sm:h-8 px-3 sm:px-3.5 rounded-full border border-white/[0.15] bg-[#1a1a1f] text-white text-[11px] sm:text-xs font-bold shrink-0 group-hover:bg-white group-hover:text-black transition-colors">
                            Submit &rarr;
                        </span>
                    </Link>
                </section>

                {/* Filters & Search */}
                <DashboardFilters />

                {/* Reports Feed */}
                <section className="mt-5 sm:mt-6">
                    <div className="mb-3.5 flex items-center justify-between border-b border-white/[0.08] pb-2">
                        <h2 className="text-xs sm:text-sm font-bold tracking-tight text-white uppercase">
                            {reportTitle}
                        </h2>

                        <span className="text-[10px] sm:text-xs font-mono font-bold text-zinc-400">
                            {items.length > 0
                                ? `${items.length} ${items.length === 1 ? "REPORT" : "REPORTS"
                                }`
                                : "0 REPORTS"}
                        </span>
                    </div>

                    {/* Empty State */}
                    {items.length === 0 && (
                        <div className="flex min-h-48 sm:min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-[#111114]/40 p-6 sm:p-8 text-center">
                            <h3 className="text-xs sm:text-sm font-bold text-white">
                                No matching reports
                            </h3>

                            <p className="mt-1 max-w-sm text-[11px] sm:text-xs text-zinc-400 font-medium">
                                Try modifying your search query or clearing active category
                                filters.
                            </p>
                        </div>
                    )}

                    {/* Report Grid */}
                    {items.length > 0 && (
                        <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                            {items.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/items/${item.id}`}
                                    className="group flex flex-row items-stretch overflow-hidden rounded-xl sm:rounded-2xl border border-white/[0.08] bg-[#111114]/90 backdrop-blur-xl transition-all duration-200 hover:border-white/[0.25] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/20 p-2.5 sm:p-3.5 gap-3 sm:gap-4 shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
                                >
                                    {/* Media Container */}
                                    <div className="relative w-28 xs:w-32 sm:w-36 md:w-40 shrink-0 overflow-hidden rounded-lg sm:rounded-xl bg-[#16161a] border border-white/[0.1] flex items-center justify-center p-2">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-500">
                                                    NO PHOTO
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info Column */}
                                    <div className="flex flex-1 flex-col justify-between py-0.5 min-w-0">
                                        <div>
                                            {/* Status + Category */}
                                            <div className="flex items-center justify-between gap-1.5 mb-1.5 flex-wrap">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-black tracking-wider uppercase shadow-md ${item.type === "LOST"
                                                            ? "bg-rose-600 text-white border border-rose-400/50"
                                                            : "bg-emerald-600 text-white border border-emerald-400/50"
                                                        }`}
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                    {item.type}
                                                </span>

                                                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-zinc-300 font-bold bg-white/[0.06] border border-white/[0.1] px-1.5 sm:px-2 py-0.5 rounded truncate max-w-[120px] sm:max-w-none">
                                                    {categoryLabels[item.category] || item.category}
                                                </span>
                                            </div>

                                            {/* Item Title */}
                                            <h3 className="text-xs sm:text-sm md:text-base font-black text-white tracking-tight leading-snug line-clamp-2">
                                                {item.title}
                                            </h3>

                                            {/* Description */}
                                            {item.description && (
                                                <p className="mt-1 line-clamp-1 sm:line-clamp-2 text-[11px] sm:text-xs text-zinc-400 font-normal leading-relaxed">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Property Matrix */}
                                        <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-white/[0.06] flex flex-col gap-1 sm:gap-1.5 text-[11px] sm:text-xs">
                                            <div className="flex items-baseline justify-between gap-2">
                                                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 shrink-0">
                                                    LOCATION:
                                                </span>

                                                <span className="font-bold text-white truncate text-right text-[11px] sm:text-xs">
                                                    {item.location}
                                                </span>
                                            </div>

                                            <div className="flex items-baseline justify-between gap-2">
                                                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 shrink-0">
                                                    DATE:
                                                </span>

                                                <span className="font-mono font-bold text-white text-right text-[10px] sm:text-xs">
                                                    {formatDate(item.itemDate)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Footer */}
            <footer className="w-full py-4 sm:py-5 px-3 sm:px-6 border-t border-white/[0.06] flex items-center justify-center text-[10px] sm:text-xs text-zinc-500 max-w-5xl mx-auto z-10 text-center tracking-wide font-mono">
                <div>© 2026 NITRiTrack. Built for NIT Rourkela.</div>
            </footer>
        </main>
    );
}
