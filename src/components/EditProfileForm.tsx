"use client";

import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  name: string;
  phone: string;
};

export default function EditProfileForm({ name, phone }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [newName, setNewName] = useState(name);
  const [newPhone, setNewPhone] = useState(phone);

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!newName.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName.trim(),
          phone: newPhone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update profile.");
        return;
      }

      setIsOpen(false);
      window.location.reload();
    } catch {
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
      {/* Click outside to dismiss */}
      <div
        className="fixed inset-0"
        onClick={() => !loading && setIsOpen(false)}
      />

      {/* Centered Modal Window */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/[0.12] bg-[#111114] p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 mb-3.5 border-b border-white/[0.08]">
          <div>
            
            <h2 className="text-sm sm:text-base font-black tracking-[-0.03em] text-white mt-0.5">
              Edit Profile
            </h2>
          </div>
          <button
            type="button"
            onClick={() => !loading && setIsOpen(false)}
            className="text-zinc-400 hover:text-white transition-colors text-xs font-mono p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Name */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="Your full name"
              required
              className="h-10 w-full rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-3 text-xs sm:text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-white/[0.28] focus:bg-[#0e0e11]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Contact Phone Number
            </label>
            <input
              type="tel"
              value={newPhone}
              onChange={(event) => setNewPhone(event.target.value)}
              placeholder="e.g. 9876543210"
              className="h-10 w-full rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-3 text-xs sm:text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-white/[0.28] focus:bg-[#0e0e11]"
            />
          </div>

          {/* Error Notice */}
          {error && (
            <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-[11px] font-mono text-rose-300">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              disabled={loading}
              onClick={() => setIsOpen(false)}
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
                  <span>Saving...</span>
                </div>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setNewName(name);
          setNewPhone(phone);
          setError("");
          setIsOpen(true);
        }}
        className="rounded-lg sm:rounded-xl border border-white/[0.1] bg-[#18181b] px-3 py-1.5 text-[11px] sm:text-xs font-bold text-zinc-200 transition-all hover:border-white/[0.25] hover:bg-white/[0.06] hover:text-white active:scale-95 shadow-sm"
      >
        Edit Profile
      </button>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}