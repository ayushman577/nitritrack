"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import DeleteReportButton from "./DeleteReportButton";

const categoryOptions = [
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
  { value: "ELECTRONICS", label: "ElectRONICS" },
  { value: "OTHER", label: "Other" },
];

type EditItemFormProps = {
  itemId: string;
  type: "LOST" | "FOUND";
  category: string;
  title: string;
  description: string;
  location: string;
  itemDate: string;
  imageUrl: string;
};

export default function EditItemForm({
  itemId,
  type: initialType,
  category: initialCategory,
  title: initialTitle,
  description: initialDescription,
  location: initialLocation,
  itemDate: initialItemDate,
  imageUrl,
}: EditItemFormProps) {
  const router = useRouter();

  const [type, setType] =
    useState<"LOST" | "FOUND">(initialType);

  const [category, setCategory] =
    useState(initialCategory);

  const [title, setTitle] =
    useState(initialTitle);

  const [description, setDescription] =
    useState(initialDescription);

  const [location, setLocation] =
    useState(initialLocation);

  const [itemDate, setItemDate] =
    useState(initialItemDate);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/items/${itemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type,
            category,
            title,
            description,
            location,
            itemDate,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to update report."
        );
        return;
      }

      setSuccess(
        "Report updated successfully."
      );

      setTimeout(() => {
        router.push(`/items/${itemId}`);
        router.refresh();
      }, 600);
    } catch (err) {
      console.error(
        "EDIT ITEM ERROR:",
        err
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="rounded-2xl border border-white/[0.08] bg-[#111114]/90 p-4 sm:p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-4">

        {/* REPORT TYPE */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            Report Type{" "}
            <span className="text-rose-400">
              *
            </span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                setType("LOST")
              }
              className={`rounded-xl border py-2.5 text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                type === "LOST"
                  ? "border-rose-400/60 bg-rose-950/80 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.15)]"
                  : "border-white/[0.08] bg-[#0a0a0c]/80 text-zinc-400 hover:text-white hover:border-white/[0.2]"
              }`}
            >
              Lost Report
            </button>

            <button
              type="button"
              onClick={() =>
                setType("FOUND")
              }
              className={`rounded-xl border py-2.5 text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                type === "FOUND"
                  ? "border-emerald-400/60 bg-emerald-950/80 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.15)]"
                  : "border-white/[0.08] bg-[#0a0a0c]/80 text-zinc-400 hover:text-white hover:border-white/[0.2]"
              }`}
            >
              Found Report
            </button>
          </div>
        </div>

        {/* TITLE */}
        <div>
          <label
            htmlFor="title"
            className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1.5"
          >
            Item Title{" "}
            <span className="text-rose-400">
              *
            </span>
          </label>

          <input
            id="title"
            type="text"
            required
            maxLength={100}
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="h-10 sm:h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-3.5 text-xs sm:text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-white/[0.28] focus:bg-[#0e0e11]"
          />
        </div>

        {/* CATEGORY + DATE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

          {/* CATEGORY */}
          <div>
            <label
              htmlFor="category"
              className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1.5"
            >
              Category{" "}
              <span className="text-rose-400">
                *
              </span>
            </label>

            <div className="relative flex items-center">
              <select
                id="category"
                required
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                className="h-10 sm:h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 pl-3.5 pr-10 text-xs sm:text-sm text-white outline-none transition-all focus:border-white/[0.28] focus:bg-[#0e0e11] cursor-pointer"
              >
                {categoryOptions.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-[#111114] text-white"
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>

              <div className="pointer-events-none absolute right-3.5 text-zinc-400">
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* DATE */}
          <div>
            <label
              htmlFor="itemDate"
              className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1.5"
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
              required
              value={itemDate}
              onChange={(e) =>
                setItemDate(
                  e.target.value
                )
              }
              className="h-10 sm:h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-3.5 text-xs sm:text-sm text-white outline-none transition-all focus:border-white/[0.28] focus:bg-[#0e0e11] [color-scheme:dark]"
            />
          </div>
        </div>

        {/* LOCATION */}
        <div>
          <label
            htmlFor="location"
            className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1.5"
          >
            Location on Campus{" "}
            <span className="text-rose-400">
              *
            </span>
          </label>

          <input
            id="location"
            type="text"
            required
            maxLength={150}
            value={location}
            onChange={(e) =>
              setLocation(
                e.target.value
              )
            }
            className="h-10 sm:h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-3.5 text-xs sm:text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-white/[0.28] focus:bg-[#0e0e11]"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label
            htmlFor="description"
            className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1.5"
          >
            Description & Notes
          </label>

          <textarea
            id="description"
            required
            maxLength={2000}
            rows={4}
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed text-white outline-none transition-all placeholder:text-zinc-600 focus:border-white/[0.28] focus:bg-[#0e0e11]"
          />
        </div>

        {/* IMAGE PREVIEW */}
        <div>
          <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            Attached Media
          </span>

          {imageUrl ? (
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 p-2">

              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#16161a] border border-white/[0.06] flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt={title}
                  className="h-full w-full object-contain p-1"
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  Image Attached
                </p>

                <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                  Existing photo remains active with this report.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/[0.08] bg-[#0a0a0c]/40 p-3 text-center">
              <span className="text-[10px] font-mono text-zinc-500">
                No image attached to this report
              </span>
            </div>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-3.5 py-2 text-xs text-rose-300 font-mono">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2 text-xs text-emerald-300 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

            <span>
              {success}
            </span>
          </div>
        )}

        {/* ACTIONS */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/[0.06]">

          <button
            type="button"
            onClick={() =>
              router.push(
                `/items/${itemId}`
              )
            }
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl border border-white/[0.08] bg-[#18181b] py-2.5 text-xs font-semibold text-zinc-300 transition-all hover:bg-white/[0.06] hover:text-white active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="group relative inline-flex items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 text-xs font-bold text-[#0a0a0c] transition-all hover:bg-zinc-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_0_16px_rgba(255,255,255,0.12)]"
          >
            {loading ? (
              <div className="flex items-center gap-1.5">
                <svg
                  className="h-3.5 w-3.5 animate-spin text-[#0a0a0c]"
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
                  Saving...
                </span>
              </div>
            ) : (
              <span>
                Save Changes &rarr;
              </span>
            )}
          </button>
        </div>
      </div>

      {/* DELETE REPORT */}
      <div className="pt-1">
        <DeleteReportButton
          itemId={itemId}
        />
      </div>
    </form>
  );
}