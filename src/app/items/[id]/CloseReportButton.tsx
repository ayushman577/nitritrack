"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type CloseReportButtonProps = {
  itemId: string;
};

export default function CloseReportButton({
  itemId,
}: CloseReportButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle ESC key to dismiss modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading]);

  async function handleConfirmClose() {
    setErrorMessage("");
    try {
      setLoading(true);

      const response = await fetch(`/api/items/${itemId}/close`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Failed to close the report.");
        return;
      }

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("CLOSE REPORT ERROR:", error);
      setErrorMessage("Something went wrong while closing the report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Primary Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setErrorMessage("");
          setIsOpen(true);
        }}
        className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-[#0a0a0c] transition-all duration-200 hover:bg-zinc-200 hover:shadow-[0_0_24px_rgba(255,255,255,0.18)] active:scale-[0.98]"
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        
        <svg
          className="h-3.5 w-3.5 shrink-0 text-[#0a0a0c]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span>Mark as Resolved</span>
      </button>

      {/* Dark Minimal Confirmation Modal */}
      {isOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
        >
          {/* Backdrop Click Dismiss */}
          <div 
            className="absolute inset-0" 
            onClick={() => !loading && setIsOpen(false)} 
          />

          {/* Modal Hardware Panel */}
          <div className="relative w-full max-w-sm rounded-2xl border border-white/[0.12] bg-[#111114] p-5 sm:p-6 shadow-[0_16px_48px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
            
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                REPORT RESOLUTION
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </div>

            {/* Title & Body */}
            <h3 className="text-base sm:text-lg font-black tracking-[-0.03em] text-white">
              Close this report?
            </h3>
            <p className="mt-1.5 text-xs text-zinc-400 font-normal leading-relaxed">
              Once marked as resolved, this item will no longer appear as an active report in the campus registry.
            </p>

            {/* Error Message if any */}
            {errorMessage && (
              <div className="mt-3 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-[11px] font-mono text-red-300">
                {errorMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={loading}
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center rounded-xl border border-white/[0.08] bg-[#18181b] px-3.5 py-2 text-xs font-semibold text-zinc-300 transition-all hover:bg-white/[0.06] hover:text-white active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleConfirmClose}
                className="group relative inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-[#0a0a0c] transition-all hover:bg-zinc-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_0_16px_rgba(255,255,255,0.12)]"
              >
                {loading ? (
                  <>
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
                    <span>Closing...</span>
                  </>
                ) : (
                  <span>Confirm</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}