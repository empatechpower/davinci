"use client";

import Link from "next/link";
import DavinciLogo from "./DavinciLogo";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Artists", href: "/artists" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.79a8.18 8.18 0 004.78 1.52V6.85a4.85 4.85 0 01-1-.16z" />
    </svg>
  );
}

const SOCIAL = [
  { label: "Facebook", Icon: FacebookIcon, href: "#" },
  { label: "Instagram", Icon: InstagramIcon, href: "#" },
  { label: "TikTok", Icon: TikTokIcon, href: "#" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#f7f2eb" }}>
      <div className="max-w-[1280px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-black/10">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <DavinciLogo />
            <p className="text-[14px] text-dv-muted leading-relaxed">
              Empowering artists with special needs to find hope and purpose
              through creative expression. Every purchase supports their journey.
            </p>
            <Link
              href="/about"
              className="text-[14px] text-dv-accent hover:opacity-80 transition-opacity"
            >
              Learn more about us →
            </Link>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-[15px] font-semibold text-dv-text mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-dv-muted hover:text-dv-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Connected */}
          <div>
            <h3 className="text-[15px] font-semibold text-dv-text mb-4">Stay Connected</h3>
            <div className="flex gap-2 mb-5">
              {SOCIAL.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-black/20 flex items-center justify-center text-dv-muted hover:text-dv-accent hover:border-dv-accent transition-colors"
                >
                  <Icon />
                </a>
              ))}
            </div>
            <p className="text-[13px] text-dv-muted mb-3">Subscribe to our newsletter</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white border border-black/20 rounded-full px-4 h-10 text-[14px] text-dv-text placeholder:text-dv-muted outline-none focus:border-dv-accent min-w-0"
              />
              <button
                type="submit"
                className="bg-dv-accent text-white text-[14px] px-5 h-10 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-[13px] text-dv-muted">
              © 2025 DaVinci Project by SHINKAIBI – 60% Back to Artists
            </p>
            <p className="text-[13px] text-dv-muted/70">
              Helping artists &amp; makers find hope &amp; purpose, one creation at a time.
            </p>
          </div>
          <Link
            href="/admin"
            className="text-[12px] text-dv-muted/50 hover:text-dv-accent transition-colors"
          >
            Admin Access
          </Link>
        </div>
      </div>
    </footer>
  );
}
