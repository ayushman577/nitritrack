"use client";

import {
  ChangeEvent,
  FormEvent,
  Suspense,
  useState,
} from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import Link from "next/link";

const categories = [
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

function ReportForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const typeParam = searchParams.get("type");
  const type =
    typeParam === "FOUND" ? "FOUND" : "LOST";

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [itemDate, setItemDate] = useState("");
  const [description, setDescription] =
    useState("");

  const [imageFile, setImageFile] =
    useState<File | null>(null);
  const [imagePreview, setImagePreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);
  const [error, setError] = useState("");

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image size must be less than 5 MB."
      );
      return;
    }

    setError("");
    setImageFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("type", type);
      formData.append("category", category);
      formData.append("title", title);
      formData.append(
        "description",
        description
      );
      formData.append(
        "location",
        location
      );
      formData.append(
        "itemDate",
        new Date(itemDate).toISOString()
      );

      if (imageFile) {
        formData.append(
          "image",
          imageFile
        );
      }

      const response = await fetch(
        "/api/items",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to create report."
        );
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      console.error(
        "REPORT SUBMIT ERROR:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-[100dvh] w-full bg-[#0a0a0c] font-sans text-[#f4f4f5] antialiased selection:bg-white selection:text-[#0a0a0c] flex flex-col justify-between p-2.5 sm:p-4 md:p-6">

      {/* Ambient Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-[200px] w-[280px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08)_0%,transparent_70%)] blur-[80px] sm:-top-32 sm:h-[300px] sm:w-[680px]"
      />

      {/* Background Precision Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] sm:bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_25%,#000_35%,transparent_100%)]"
      />

      {/* Header Navbar */}
      <header className="w-full max-w-2xl mx-auto shrink-0 mb-2 sm:mb-4">
        <div className="flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-[#111114]/80 px-3.5 py-2 backdrop-blur-xl sm:px-4 sm:py-2.5">

          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-400 transition-colors hover:text-white"
          >
            <span>&larr;</span>
            <span>Back</span>
          </button>

          <Link
            href="/dashboard"
            className="text-xs sm:text-sm font-bold tracking-tight text-white hover:opacity-85 transition-opacity"
          >
            NITRiTrack
          </Link>

        </div>
      </header>

      {/* Main Form Section */}
      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center">

        {/* Title Header */}
        <div className="mb-3 sm:mb-5">

          <div className="flex flex-wrap items-center justify-between gap-2.5">

            <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-[-0.035em] text-white leading-tight">
              {type === "LOST"
                ? "Report a Lost Item"
                : "Log a Found Item"}
            </h1>

            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-0.5 sm:px-3.5 sm:py-1 text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider shadow-lg ${
                type === "LOST"
                  ? "border border-rose-400/60 bg-rose-600 text-white"
                  : "border border-emerald-400/60 bg-emerald-600 text-white"
              }`}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />

              {type === "LOST"
                ? "LOST REPORT"
                : "FOUND REPORT"}
            </span>

          </div>

          <p className="mt-1 text-[11px] sm:text-xs md:text-sm text-zinc-400 font-normal">
            {type === "LOST"
              ? "Submit missing details to alert the campus peer and security network."
              : "Document found property so the verified owner can claim and recover it."}
          </p>

        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/[0.08] bg-[#111114]/90 p-3.5 sm:p-6 lg:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl space-y-3 sm:space-y-4"
        >

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1 sm:mb-1.5"
            >
              Item Title{" "}
              <span className="text-rose-400">
                *
              </span>
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="e.g. Realme Narzo 50, Blue colour"
              required
              maxLength={100}
              className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-white/[0.28] focus:bg-[#0e0e11]"
            />
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1 sm:mb-1.5"
              >
                Category{" "}
                <span className="text-rose-400">
                  *
                </span>
              </label>

              <div className="relative flex items-center">
                <select
                  id="category"
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                  required
                  className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 pl-3 pr-9 py-2 sm:pl-3.5 sm:pr-10 sm:py-2.5 text-xs sm:text-sm text-white outline-none transition-all focus:border-white/[0.28] focus:bg-[#0e0e11] cursor-pointer"
                >
                  <option
                    value=""
                    className="bg-[#111114] text-zinc-500"
                  >
                    Select Category
                  </option>

                  {categories.map(
                    (cat) => (
                      <option
                        key={cat.value}
                        value={cat.value}
                        className="bg-[#111114] text-white"
                      >
                        {cat.label}
                      </option>
                    )
                  )}
                </select>

                <div className="pointer-events-none absolute right-3 text-zinc-400">
                  <svg
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
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
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="itemDate"
                className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1 sm:mb-1.5"
              >
                Date{" "}
                {type === "LOST"
                  ? "Lost"
                  : "Found"}{" "}
                <span className="text-rose-400">
                  *
                </span>
              </label>

              <input
                id="itemDate"
                type="date"
                value={itemDate}
                onChange={(e) =>
                  setItemDate(
                    e.target.value
                  )
                }
                required
                className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm text-white outline-none transition-all focus:border-white/[0.28] focus:bg-[#0e0e11] [color-scheme:dark]"
              />
            </div>

          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1 sm:mb-1.5"
            >
              Location on Campus{" "}
              <span className="text-rose-400">
                *
              </span>
            </label>

            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value
                )
              }
              placeholder="e.g. Main Gate, LA Hall 102, Central Library"
              required
              maxLength={200}
              className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-white/[0.28] focus:bg-[#0e0e11]"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1 sm:mb-1.5"
            >
              Description & Identifying Marks
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Add details like brand, case colour, scratch marks, stickers, etc."
              maxLength={1000}
              rows={3}
              className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-white/[0.28] focus:bg-[#0e0e11]"
            />
          </div>

          {/* Image Upload */}
          <div>

            <div className="flex items-center justify-between mb-1 sm:mb-1.5">

              <label
                htmlFor="image"
                className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400"
              >
                Item Photo
              </label>

              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                Optional · Max 5 MB
              </span>

            </div>

            <input
              id="image"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageChange}
              className="block w-full cursor-pointer rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 text-xs text-zinc-400 file:mr-2.5 file:cursor-pointer file:border-0 file:bg-white file:px-2.5 file:py-1.5 sm:file:px-3 sm:file:py-2 file:text-xs file:font-bold file:text-black hover:file:bg-zinc-200"
            />

            {/* Photo Preview */}
            {imagePreview && (
              <div className="mt-2.5 sm:mt-3 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a0c]/90">

                <div className="relative h-36 sm:h-44 w-full bg-[#16161a] p-2 flex items-center justify-center">

                  <img
                    src={imagePreview}
                    alt="Selected item"
                    className="h-full w-full object-contain"
                  />

                </div>

                <div className="flex items-center justify-between px-3 py-2 border-t border-white/[0.06] text-xs">

                  <span className="truncate max-w-[200px] text-zinc-300 font-mono text-[11px]">
                    {imageFile?.name} (
                    {imageFile
                      ? (
                          imageFile.size /
                          (1024 * 1024)
                        ).toFixed(2)
                      : "0"}{" "}
                    MB)
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                    }}
                    className="text-[11px] font-mono font-bold text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Remove
                  </button>

                </div>
              </div>
            )}

          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs text-rose-300 font-mono">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={
              loading || !category
            }
            className="group relative w-full overflow-hidden rounded-xl bg-white py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[#0a0a0c] transition-all duration-300 hover:bg-zinc-200 hover:shadow-[0_0_28px_rgba(255,255,255,0.2)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-2 mt-1 sm:mt-2"
          >
            {!loading && (
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-black/10 to-transparent pointer-events-none" />
            )}

            {loading ? (
              <div className="flex items-center gap-2">

                <svg
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin text-[#0a0a0c]"
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

                <span>
                  Publishing Report...
                </span>

              </div>
            ) : (
              <span>
                {type === "LOST"
                  ? "Publish Lost Report"
                  : "Publish Found Report"}{" "}
                &rarr;
              </span>
            )}
          </button>

        </form>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-2 text-[10px] font-mono tracking-wide text-zinc-500 shrink-0 mt-2 sm:mt-4">
        © 2026 NITRiTrack. Built for NIT Rourkela.
      </footer>

    </main>
  );
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[100dvh] w-full bg-[#0a0a0c] flex items-center justify-center text-zinc-400">
          <div className="text-xs font-mono uppercase tracking-widest">
            Loading Report...
          </div>
        </main>
      }
    >
      <ReportForm />
    </Suspense>
  );
}