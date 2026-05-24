"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";

export default function ArtShowcaseNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-as-border sticky top-0 z-40">
        <div className="max-w-[1280px] mx-auto px-4 h-[65px] flex items-center justify-between">
          <Link href="/" className="font-bold text-[16px] text-as-dark leading-6">
            Art &amp; Stories
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/artists"
              className="text-[14px] text-as-gray hover:text-as-text transition-colors"
            >
              Artists
            </Link>
            <Link
              href="/about"
              className="text-[14px] text-as-text border border-black rounded-[8px] px-4 h-8 flex items-center"
            >
              About
            </Link>
            <button
              onClick={() => setLoginOpen(true)}
              className="bg-as-btn text-white text-[14px] rounded-[8px] px-4 h-8 flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <ShoppingBag className="w-4 h-4" />
              Log In
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-as-border px-4 py-4 flex flex-col gap-3">
            <Link
              href="/artists"
              className="text-[14px] text-as-gray py-2"
              onClick={() => setMobileOpen(false)}
            >
              Artists
            </Link>
            <Link
              href="/about"
              className="text-[14px] text-as-text border border-black rounded-[8px] px-4 py-2 text-center"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <button
              onClick={() => { setMobileOpen(false); setLoginOpen(true); }}
              className="bg-as-btn text-white text-[14px] rounded-[8px] px-4 py-2 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Log In
            </button>
          </div>
        )}
      </header>

      {/* Login Modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setLoginOpen(false)}
          />
          <div className="relative bg-white rounded-[10px] w-[448px] max-w-[calc(100vw-32px)] p-6">
            <button
              onClick={() => setLoginOpen(false)}
              className="absolute top-4 right-4 text-as-text"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-1">
              Welcome Back
            </h2>
            <p className="text-[14px] text-[#717182] mb-6">
              Sign in to your account to purchase artwork and view your collection.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[14px] text-[#0a0a0a]">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="bg-[#f3f3f5] border border-black rounded-[8px] px-3 h-9 text-[14px] text-[#717182] w-full outline-none focus:border-as-btn"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[14px] text-[#0a0a0a]">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="bg-[#f3f3f5] border border-black rounded-[8px] px-3 h-9 text-[14px] text-[#717182] w-full outline-none focus:border-as-btn"
                />
              </div>
              <div className="bg-as-section rounded-[10px] p-3">
                <p className="text-[12px] text-as-gray">Demo credentials:</p>
                <p className="text-[12px] text-as-gray">Email: marc@example.com</p>
                <p className="text-[12px] text-as-gray">Password: any password</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setLoginOpen(false)}
                  className="flex-1 bg-white border border-black rounded-[8px] h-9 text-[14px] text-[#0a0a0a]"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-as-btn text-white rounded-[8px] h-9 text-[14px]">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
