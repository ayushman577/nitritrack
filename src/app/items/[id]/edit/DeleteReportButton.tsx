"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

type DeleteReportButtonProps = {
  itemId: string;
};

export default function DeleteReportButton({
  itemId,
}: DeleteReportButtonProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, loading]);

  async function handleDelete() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to delete report.");
        return;
      }

      setIsOpen(false);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("DELETE ITEM ERROR:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const modalContent = isOpen && (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] grid place-items-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      {/* Backdrop Dismiss */}
      <div
        className="fixed inset-0"
        onClick={() => !loading && setIsOpen(false)}
      />

      {/* Confirmation Window */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-rose-500/20 bg-[#111114] p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
        
        {/* Header Strip */}
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.08]">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-rose-400">
            DANGER ZONE
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
        </div>

        {/* Notice */}
        <h3 className="text-base sm:text-lg font-black tracking-[-0.03em] text-white">
          Delete this report?
        </h3>
        <p className="mt-1.5 text-xs text-zinc-400 font-normal leading-relaxed">
          This will permanently remove the item listing and its attached media from the NITRiTrack campus registry. This action cannot be undone.
        </p>

        {/* Error Notice */}
        {error && (
          <div className="mt-3 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-[11px] font-mono text-rose-300">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={loading}
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center rounded-xl border border-white/[0.08] bg-[#18181b] py-2.5 text-xs font-semibold text-zinc-300 transition-all hover:bg-white/[0.06] hover:text-white active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            className="group relative inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-600 py-2.5 text-xs font-bold text-white transition-all hover:bg-rose-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_0_16px_rgba(244,63,94,0.2)]"
          >
            {loading ? (
              <div className="flex items-center gap-1.5">
                <svg
                  className="h-3.5 w-3.5 animate-spin text-white"
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
                <span>Deleting...</span>
              </div>
            ) : (
              <span>Permanently Delete</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );

  return (
    <div className="mt-2 pt-2">
      <button
        type="button"
        onClick={() => {
          setError("");
          setIsOpen(true);
        }}
        disabled={loading}
        className="w-full rounded-xl border border-rose-500/20 bg-rose-950/20 px-4 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest text-rose-400 transition-all hover:border-rose-500/40 hover:bg-rose-950/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Delete Report
      </button>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </div>
  );
}