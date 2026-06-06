"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User, Heart } from "lucide-react";
import DavinciLogo from "@/components/layout/DavinciLogo";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, password: form.password, name: form.fullName }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Registration failed.");
      setLoading(false);
      return;
    }
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    setLoading(false);
    router.push("/dashboard");
    router.refresh();
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
          Join Our Community
        </h1>
        <p className="mt-1.5 text-sm text-dv-muted">
          Create your account to get started
        </p>
      </div>

      {/* Card */}
      <div
        className="mt-8 w-full max-w-[420px] mx-4 bg-white rounded-2xl p-8 shadow-sm"
        style={{ border: "1.5px solid #f2d9c4" }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-dv-text mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 pointer-events-none">
                <User size={16} />
              </span>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 rounded-full text-sm text-dv-text placeholder-gray-400 outline-none transition-all"
                style={{
                  backgroundColor: "#eef2f7",
                  border: "1.5px solid transparent",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.border = "1.5px solid #e8934a")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.border = "1.5px solid transparent")
                }
                required
              />
            </div>
          </div>

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
                name="email"
                value={form.email}
                onChange={handleChange}
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
                  (e.currentTarget.style.border = "1.5px solid transparent")
                }
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-dv-text mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 pointer-events-none">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full pl-10 pr-12 py-3 rounded-full text-sm text-dv-text placeholder-gray-400 outline-none transition-all"
                style={{
                  backgroundColor: "#eef2f7",
                  border: "1.5px solid transparent",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.border = "1.5px solid #e8934a")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.border = "1.5px solid transparent")
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-dv-text transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-dv-muted pl-2">
              Must be at least 6 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-dv-text mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 pointer-events-none">
                <Lock size={16} />
              </span>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full pl-10 pr-12 py-3 rounded-full text-sm text-dv-text placeholder-gray-400 outline-none transition-all"
                style={{
                  backgroundColor: "#eef2f7",
                  border: "1.5px solid transparent",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.border = "1.5px solid #e8934a")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.border = "1.5px solid transparent")
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-dv-text transition-colors"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded accent-orange-400 cursor-pointer flex-shrink-0"
              required
            />
            <span className="text-sm text-dv-muted leading-relaxed">
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-medium underline underline-offset-2 transition-colors"
                style={{ color: "#e8934a" }}
              >
                Terms and Conditions
              </Link>
              and{" "}
              <Link
                href="/privacy"
                className="font-medium underline underline-offset-2 transition-colors"
                style={{ color: "#e8934a" }}
              >
                Privacy Policy
              </Link>
            </span>
          </label>

          {error && (
            <p className="text-sm text-red-500 text-center -mb-1">{error}</p>
          )}

          {/* Create Account button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60"
            style={{
              background: "linear-gradient(90deg, #f5954a 0%, #e8804a 100%)",
            }}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">Or sign up with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center gap-2.5 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-medium text-dv-text hover:bg-gray-50 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
              <path d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.7 29.4 4 24 4 12.95 4 4 12.95 4 24s8.95 20 20 20c11 0 20-9 20-20 0-1.2-.1-2.5-.4-3.5z" fill="#FFC107" />
              <path d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.7 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" fill="#FF3D00" />
              <path d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.7-3.3-11.3-8H6.3C9.7 35.7 16.3 44 24 44z" fill="#4CAF50" />
              <path d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4 5.3l.1-.1 6.2 5.2C37.1 38.7 44 33.5 44 24c0-1.2-.1-2.5-.4-3.5z" fill="#1976D2" />
            </svg>
            Google
          </button>

          <button
            type="button"
            onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center gap-2.5 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-medium text-dv-text hover:bg-gray-50 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>

        {/* Mission banner */}
        <div
          className="mt-5 rounded-xl p-4"
          style={{ backgroundColor: "#fff4ec" }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Heart size={16} fill="#e8934a" stroke="none" />
            <span
              className="text-sm font-semibold"
              style={{ color: "#e8934a" }}
            >
              Join Our Mission
            </span>
          </div>
          <p className="text-xs text-dv-muted leading-relaxed">
            By creating an account, you&apos;re supporting special-needs
            artists. 60% of every purchase goes directly to the artists.
          </p>
        </div>

        {/* Sign in link */}
        <p className="mt-6 text-center text-sm text-dv-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold transition-colors"
            style={{ color: "#e8934a" }}
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Footer */}
      <p className="mt-10 mb-8 text-xs text-gray-400">
        © 2025 DaVinci Project by SHINKAIBI
      </p>
    </div>
  );
}
