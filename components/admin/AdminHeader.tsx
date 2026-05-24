import Link from "next/link";
import { Bell, ChevronDown, ArrowLeft } from "lucide-react";
import DavinciLogo from "@/components/layout/DavinciLogo";
import Image from "next/image";

export default function AdminHeader() {
  return (
    <header className="h-[81px] bg-white border-b border-ad-border-light flex items-center px-6 justify-between shrink-0">
      {/* Left: back link + logo */}
      <div className="flex items-center gap-5">
        <Link
          href="/"
          className="text-[14px] text-ad-gray flex items-center gap-2 hover:text-ad-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Website
        </Link>
        <DavinciLogo />
      </div>

      {/* Right: bell + user */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-ad-gray hover:text-ad-dark transition-colors relative">
          <Bell className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <Image
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Admin User"
            width={42}
            height={42}
            className="rounded-full object-cover"
          />
          <span className="text-[14px] text-ad-gray font-medium hidden sm:block">
            Admin User
          </span>
          <ChevronDown className="w-4 h-4 text-ad-gray" />
        </div>
      </div>
    </header>
  );
}
