"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Lock } from "lucide-react";
import DavinciLogo from "@/components/layout/DavinciLogo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Password reset via email requires a mail server — configure SMTP in production
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ backgroundColor: "#fdf8f4" }}
    >
      {/* Back to Home */}
      <div className="w-full max-w-xl pt-8 px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-dv-muted hover:text-dv-text transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Home
        </Link>
      </div>

      {/* Logo */}
      <div className="mt-6 flex flex-col items-center">
        <DavinciLogo />
      </div>

      {/* Heading */}
      <div className="mt-6 text-center">
        <h1
          className="text-4xl font-bold italic"
          style={{ color: "#e8934a", fontFamily: "Georgia, serif" }}
        >
          Reset Password
        </h1>
        <p className="mt-1.5 text-sm text-dv-muted">
          Enter your email to reset your password
        </p>
      </div>

      {/* Card */}
      <div
        className="mt-8 w-full max-w-[420px] mx-4 bg-white rounded-2xl p-8 shadow-sm"
        style={{ border: "1.5px solid #f2d9c4" }}
      >
        {submitted ? (
          /* Success state */
          <div className="text-center py-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#fff4ec" }}
            >
              <Mail size={24} style={{ color: "#e8934a" }} />
            </div>
            <h2 className="text-base font-semibold text-dv-text mb-2">
              Check your inbox
            </h2>
            <p className="text-sm text-dv-muted leading-relaxed mb-6">
              We&apos;ve sent a password reset link to{" "}
              <span className="font-medium text-dv-text">{email}</span>. It may
              take a minute to arrive.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-sm transition-colors"
              style={{ color: "#e8934a" }}
            >
              Didn&apos;t receive it? Send again
            </button>
          </div>
        ) : (
          /* Form state */
          <>
            {/* Lock icon */}
            <div className="flex justify-center mb-5">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#fff4ec" }}
              >
                <Lock size={24} style={{ color: "#e8934a" }} />
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-dv-muted text-center leading-relaxed mb-6">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-dv-text mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 pointer-events-none">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-full text-sm text-dv-text placeholder-gray-400 outline-none transition-all"
                    style={{
                      backgroundColor: "#eef2f7",
                      border: "1.5px solid transparent",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.border = "1.5px solid #e8934a")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.border =
                        "1.5px solid transparent")
                    }
                    required
                  />
                </div>
              </div>

              {/* Send button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90 active:opacity-80"
                style={{
                  background:
                    "linear-gradient(90deg, #f5954a 0%, #e8804a 100%)",
                }}
              >
                Send Reset Link
              </button>
            </form>

            {/* Sign in link */}
            <p className="mt-6 text-center text-sm text-dv-muted">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-semibold transition-colors"
                style={{ color: "#e8934a" }}
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>

      {/* Footer */}
      <p className="mt-10 mb-8 text-xs text-gray-400">
        © 2025 DaVinci Project by SHINKAIBI
      </p>
    </div>
  );
}
