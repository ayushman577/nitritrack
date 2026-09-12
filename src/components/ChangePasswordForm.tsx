"use client";

import { FormEvent, useState } from "react";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from your current password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to change password.");
        return;
      }

      setMessage("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Current Password */}
      <div>
        <label
          htmlFor="currentPassword"
          className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1"
        >
          Current Password
        </label>
        <input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          placeholder="Enter current password"
          autoComplete="current-password"
          className="h-9 sm:h-10 w-full rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-3 text-xs sm:text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-white/[0.28] focus:bg-[#0e0e11]"
        />
      </div>

      {/* New Password */}
      <div>
        <label
          htmlFor="newPassword"
          className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1"
        >
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="Enter new password (min. 8 characters)"
          autoComplete="new-password"
          className="h-9 sm:h-10 w-full rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-3 text-xs sm:text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-white/[0.28] focus:bg-[#0e0e11]"
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1"
        >
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirm new password"
          autoComplete="new-password"
          className="h-9 sm:h-10 w-full rounded-xl border border-white/[0.08] bg-[#0a0a0c]/80 px-3 text-xs sm:text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-white/[0.28] focus:bg-[#0e0e11]"
        />
      </div>

      {/* Error Notice */}
      {error && (
        <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-[11px] sm:text-xs text-rose-300 font-mono">
          {error}
        </div>
      )}

      {/* Success Notice */}
      {message && (
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-[11px] sm:text-xs text-emerald-300 font-mono flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white py-2.5 px-4 text-xs font-bold text-[#0a0a0c] transition-all duration-200 hover:bg-zinc-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 mt-1"
      >
        {!loading && (
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        )}

        {loading ? (
          <div className="flex items-center gap-2">
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
            <span className="font-mono text-[11px] uppercase tracking-wider">
              Updating...
            </span>
          </div>
        ) : (
          <span>Update Password &rarr;</span>
        )}
      </button>
    </form>
  );
}