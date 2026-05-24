"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart } from "lucide-react";
import DavinciLogo from "./DavinciLogo";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Gallery", href: "/gallery" },
  { label: "Artists", href: "/artists" },
  { label: "Shop", href: "/shop" },
  { label: "Events", href: "/events" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function DavinciNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <header className="bg-white border-b border-black/10 sticky top-0 z-40">
      <div className="max-w-[1280px] mx-auto px-4 h-[65px] flex items-center justify-between gap-4">
        <DavinciLogo />

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-[15px] px-3 h-10 flex items-center transition-colors whitespace-nowrap ${
                  isActive ? "text-dv-accent font-medium" : "text-dv-text hover:text-dv-accent"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-dv-accent rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/login"
            className="hidden md:flex bg-dv-accent text-white text-[14px] px-5 h-9 rounded-full items-center hover:opacity-90 transition-opacity"
          >
            Sign In
          </Link>
          <Link href="/cart" className="relative p-2 text-dv-text hover:text-dv-accent transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-dv-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>
          <button
            className="lg:hidden p-2 text-dv-text"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-black/10 px-4 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[16px] px-2 py-3 border-b border-black/5 last:border-none ${
                  isActive ? "text-dv-accent font-medium" : "text-dv-text"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            className="mt-3 bg-dv-accent text-white text-[14px] px-5 py-2.5 rounded-full text-center"
            onClick={() => setMobileOpen(false)}
          >
            Sign In
          </Link>
        </div>
      )}
    </header>
  );
}
