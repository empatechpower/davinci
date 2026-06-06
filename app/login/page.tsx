"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import DavinciLogo from "@/components/layout/DavinciLogo";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
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
          Welcome Back
        </h1>
        <p className="mt-1.5 text-sm text-dv-muted">Sign in to your account</p>
      </div>

      {/* Card */}
      <div
        className="mt-8 w-full max-w-[420px] mx-4 bg-white rounded-2xl p-8 shadow-sm"
        style={{ border: "1.5px solid #f2d9c4" }}
      >
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded accent-orange-400 cursor-pointer"
              />
              <span className="text-sm text-dv-muted">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium transition-colors"
              style={{ color: "#e8934a" }}
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center -mb-1">{error}</p>
          )}

          {/* Sign In button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60"
            style={{
              background: "linear-gradient(90deg, #f5954a 0%, #e8804a 100%)",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">Or continue with</span>
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

        {/* Sign up link */}
        <p className="mt-6 text-center text-sm text-dv-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold transition-colors"
            style={{ color: "#e8934a" }}
          >
            Sign up
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
