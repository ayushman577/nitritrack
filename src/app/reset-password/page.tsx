"use client";

import {
  FormEvent,
  Suspense,
  useEffect,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email =
    searchParams.get("email")?.trim().toLowerCase() || "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [resendTimer, setResendTimer] = useState(30);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // -----------------------------
  // 30 SECOND COUNTDOWN
  // -----------------------------

  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  // -----------------------------
  // RESET PASSWORD
  // -----------------------------

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email) {
      setError(
        "Email is missing. Please request a password reset again."
      );
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to reset password."
        );
        return;
      }

      setMessage(
        "Password reset successfully! Redirecting to login..."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error(
        "RESET PASSWORD ERROR:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // RESEND OTP
  // -----------------------------

  async function handleResendOTP() {
    if (resendTimer > 0 || resending) {
      return;
    }

    if (!email) {
      setError(
        "Email is missing. Please request a password reset again."
      );
      return;
    }

    setError("");
    setMessage("");
    setResending(true);

    try {
      const response = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to resend OTP."
        );
        return;
      }

      setMessage(
        "A new OTP has been sent to your email."
      );

      setResendTimer(30);
      setOtp("");
    } catch (error) {
      console.error(
        "RESEND OTP ERROR:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-2xl">

          {/* Logo / Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-500">
              NITRiTrack
            </h1>

            <p className="text-gray-400 mt-2">
              Reset your password
            </p>
          </div>

          {/* Email */}
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-400">
              Enter the OTP sent to
            </p>

            <p className="text-white font-medium mt-1 break-all">
              {email || "your email"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="mb-5 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3">
              <p className="text-sm text-green-400">
                {message}
              </p>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* OTP */}
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Verification Code
              </label>

              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const value =
                    e.target.value.replace(/\D/g, "");

                  setOtp(value);
                }}
                placeholder="Enter 6-digit OTP"
                className="
                  w-full
                  rounded-lg
                  border
                  border-[#30363d]
                  bg-[#0d1117]
                  px-4
                  py-3
                  text-center
                  text-xl
                  tracking-[0.5em]
                  text-white
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-1
                  focus:ring-blue-500
                "
              />
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                New Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter new password"
                className="
                  w-full
                  rounded-lg
                  border
                  border-[#30363d]
                  bg-[#0d1117]
                  px-4
                  py-3
                  text-white
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-1
                  focus:ring-blue-500
                "
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Confirm new password"
                className="
                  w-full
                  rounded-lg
                  border
                  border-[#30363d]
                  bg-[#0d1117]
                  px-4
                  py-3
                  text-white
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-1
                  focus:ring-blue-500
                "
              />
            </div>

            {/* Reset Password Button */}
            <button
              type="submit"
              disabled={
                loading ||
                otp.length !== 6
              }
              className="
                w-full
                rounded-lg
                bg-blue-600
                px-4
                py-3
                font-semibold
                text-white
                transition
                hover:bg-blue-500
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading
                ? "Resetting Password..."
                : "Reset Password"}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Didn't receive the OTP?
            </p>

            {resendTimer > 0 ? (
              <p className="mt-2 text-sm text-gray-500">
                Resend OTP{" "}
                <span className="font-semibold text-blue-400">
                  in {resendTimer}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resending}
                className="
                  mt-2
                  text-sm
                  font-semibold
                  text-blue-400
                  transition
                  hover:text-blue-300
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {resending
                  ? "Sending..."
                  : "Resend OTP"}
              </button>
            )}
          </div>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="
                text-sm
                text-gray-500
                transition
                hover:text-gray-300
              "
            >
              Back to Login
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-400">
            Loading...
          </div>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
