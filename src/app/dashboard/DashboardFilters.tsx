"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const categories = [
  { value: "", label: "All Categories" },
  { value: "ID_CARD", label: "ID Card" },
  { value: "MONEY", label: "Money" },
  { value: "WALLET", label: "Wallet" },
  { value: "PHONE", label: "Phone" },
  { value: "LAPTOP", label: "Laptop" },
  { value: "EARPHONES", label: "Earphones" },
  { value: "WATCH", label: "Watch" },
  { value: "KEYS", label: "Keys" },
  { value: "BAG", label: "Bag" },
  { value: "BOOKS", label: "Books" },
  { value: "CLOTHING", label: "Clothing" },
  { value: "DOCUMENTS", label: "Documents" },
  { value: "ACCESSORIES", label: "Accessories" },
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "OTHER", label: "Other" },
];

function DashboardFiltersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(currentSearch);

  function updateFilters(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/dashboard?${params.toString()}`);
  }

  function handleSearch(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    updateFilters("search", search.trim());
  }

  function clearFilters() {
    setSearch("");
    router.push("/dashboard");
  }

  const hasFilters = Boolean(
    currentType || currentCategory || currentSearch
  );

  return (
    <section className="mb-6 space-y-3">

      {/* Search Input Bar */}
      <form
        onSubmit={handleSearch}
        className="w-full"
      >
        <div className="relative flex items-center">

          <span
            className="pointer-events-none absolute left-3.5 text-zinc-400"
            aria-hidden="true"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
          </span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search lost or found items..."
            className="h-10 sm:h-11 w-full rounded-xl sm:rounded-2xl border border-white/[0.08] bg-[#111114]/80 pl-10 pr-20 text-xs sm:text-sm text-white placeholder:text-zinc-500 outline-none backdrop-blur-xl transition-all focus:border-white/[0.28] focus:bg-[#141418] focus:ring-1 focus:ring-white/20"
          />

          <button
            type="submit"
            className="absolute right-1 h-8 sm:h-9 rounded-lg sm:rounded-xl bg-white px-3 sm:px-4 text-[11px] sm:text-xs font-semibold text-[#0a0a0c] hover:bg-zinc-200 transition-colors active:scale-95"
          >
            Search
          </button>

        </div>
      </form>

      {/* Unified Single-Line Filter Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:justify-between">

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">

          <button
            type="button"
            onClick={() =>
              updateFilters("type", "")
            }
            className={`whitespace-nowrap rounded-full px-3 sm:px-4 py-1 text-[11px] sm:text-xs font-medium transition-all ${
              currentType === ""
                ? "bg-white text-[#0a0a0c] font-semibold shadow-[0_0_16px_rgba(255,255,255,0.15)]"
                : "border border-white/[0.08] bg-[#111114]/80 text-zinc-300 hover:text-white hover:border-white/[0.2] hover:bg-white/[0.05]"
            }`}
          >
            All
          </button>

          <button
            type="button"
            onClick={() =>
              updateFilters("type", "LOST")
            }
            className={`whitespace-nowrap rounded-full px-3 sm:px-4 py-1 text-[11px] sm:text-xs font-medium transition-all ${
              currentType === "LOST"
                ? "border border-rose-800/60 bg-rose-950/80 text-rose-300 font-semibold"
                : "border border-white/[0.08] bg-[#111114]/80 text-zinc-300 hover:text-rose-300 hover:border-rose-900/40 hover:bg-white/[0.05]"
            }`}
          >
            Lost
          </button>

          <button
            type="button"
            onClick={() =>
              updateFilters("type", "FOUND")
            }
            className={`whitespace-nowrap rounded-full px-3 sm:px-4 py-1 text-[11px] sm:text-xs font-medium transition-all ${
              currentType === "FOUND"
                ? "border border-emerald-800/60 bg-emerald-950/80 text-emerald-300 font-semibold"
                : "border border-white/[0.08] bg-[#111114]/80 text-zinc-300 hover:text-emerald-300 hover:border-emerald-900/40 hover:bg-white/[0.05]"
            }`}
          >
            Found
          </button>

        </div>

        {/* Separator Line */}
        <div className="h-4 w-[1px] bg-white/[0.08] shrink-0 sm:hidden" />

        {/* Category Dropdown + Clear Trigger */}
        <div className="flex items-center gap-1.5 shrink-0">

          <div className="relative flex items-center">

            <select
              value={currentCategory}
              onChange={(event) =>
                updateFilters(
                  "category",
                  event.target.value
                )
              }
              className="h-7 sm:h-8 appearance-none rounded-lg sm:rounded-xl border border-white/[0.08] bg-[#111114]/80 pl-2.5 pr-7 text-[11px] sm:text-xs font-medium text-zinc-200 outline-none backdrop-blur-xl transition-colors focus:border-white/[0.28] cursor-pointer"
            >
              {categories.map((category) => (
                <option
                  key={category.value}
                  value={category.value}
                  className="bg-[#111114] text-white"
                >
                  {category.label}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute right-2 text-zinc-400">
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="h-7 sm:h-8 whitespace-nowrap rounded-lg sm:rounded-xl border border-white/[0.08] bg-[#111114]/80 px-2.5 text-[11px] sm:text-xs font-medium text-zinc-400 hover:text-rose-300 hover:border-rose-900/40 hover:bg-white/[0.05] transition-colors"
            >
              Clear
            </button>
          )}

        </div>

      </div>
    </section>
  );
}

export default function DashboardFilters() {
  return (
    <Suspense fallback={null}>
      <DashboardFiltersContent />
    </Suspense>
  );
}
