"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  Users,
  ImageIcon,
  Settings,
  Menu,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, href: "/admin", label: "Dashboard" },
  { icon: Users, href: "/admin/artists", label: "Artists" },
  { icon: ImageIcon, href: "/admin/artworks", label: "Artworks" },
  { icon: ShoppingBag, href: "/admin/orders", label: "Orders" },
  { icon: Calendar, href: "/admin/events", label: "Events" },
  { icon: Settings, href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[120px] shrink-0 bg-white border-r border-ad-border-light flex flex-col items-center pt-5 gap-1 min-h-screen">
      {/* Hamburger toggle */}
      <button className="w-[74px] h-10 flex items-center justify-center mb-3 text-[#abb2bc] hover:text-ad-gray transition-colors">
        <Menu className="w-6 h-6" />
      </button>

      {NAV_ITEMS.map(({ icon: Icon, href, label }) => {
        const isActive =
          pathname === href ||
          (href !== "/admin" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            title={label}
            className={`w-[74px] h-[56px] flex items-center justify-center rounded-[8px] transition-all ${
              isActive
                ? "border border-ad-purple-light"
                : "hover:bg-gray-50"
            }`}
          >
            <Icon
              className={`w-6 h-6 ${
                isActive ? "text-ad-purple" : "text-[#828282]"
              }`}
            />
          </Link>
        );
      })}
    </aside>
  );
}
