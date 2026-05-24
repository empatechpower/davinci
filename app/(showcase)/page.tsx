import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, Palette, Heart, Paintbrush } from "lucide-react";
import { ARTISTS } from "@/lib/mock-data";

/* ─── Static data for this page ─── */

const STATS = [
  {
    Icon: Users,
    value: "25+",
    label: "Talented Artists",
    bg: "#fde8e4",
    color: "#ff8c42",
    italic: false,
  },
  {
    Icon: Palette,
    value: "500+",
    label: "Artworks Created",
    bg: "#fff0e4",
    color: "#ff8c42",
    italic: false,
  },
  {
    Icon: Heart,
    value: "Proceeds",
    label: "Goes to Artists",
    bg: "#e0f5f2",
    color: "#2a9d8f",
    italic: true,
  },
];

const FEATURED = [
  {
    href: "/artists/sarah-mitchell",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=700&q=80",
    name: "Marcus Thiompson",
    medium: "Abstract Paintings",
    quote: "Art helps me express what words cannot.",
  },
  {
    href: "/artists/marcus-chen",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=700&q=80",
    name: "Emma Chen",
    medium: "Abstract Paintings",
    quote: "Every piece tells my story.",
  },
  {
    href: "/artists/emma-rodriguez",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80",
    name: "Daniel Lichben",
    medium: "Abstract Paintings",
    quote: "Coloring joy to my world.",
  },
];

const GALLERY = [
  {
    badge: 1,
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=500&q=80",
    category: "Metal Art",
    title: "Metal Butterfly",
    artist: "Marcus Thompson",
    href: "/artwork/spring-awakening",
  },
  {
    badge: 2,
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&q=80",
    category: "Original Painting",
    title: "Sunset Dreams",
    artist: "Emma Chen",
    href: "/artwork/energy-in-motion",
  },
  {
    badge: 3,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    category: "Postcard Art",
    title: "Hope Series #3",
    artist: "Sofia Rodriguez",
    href: "/artwork/autumn-whispers",
  },
  {
    badge: 4,
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=500&q=80",
    category: "Original Painting",
    title: "Joy in Motion",
    artist: "Emma Chen",
    href: "/artwork/morning-dew",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "#f7f2eb" }}>
        {/* Faint background watermark */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.08]"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=1400&q=60)",
          }}
        />

        <div className="relative max-w-[1280px] mx-auto px-4 py-20 sm:py-28 flex flex-col items-center text-center gap-7">
          {/* Badge pill */}
          <span className="inline-flex items-center gap-1.5 border border-dv-accent text-dv-accent text-[13px] px-4 py-1.5 rounded-full">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            Empowering Special-Needs Artists
          </span>

          {/* Heading */}
          <h1 className="max-w-[700px]">
            <span className="block font-serif italic text-dv-accent text-[38px] sm:text-[48px] leading-[1.15]">
              Helping artists &amp; makers find<br className="hidden sm:block" /> hope &amp; purpose,
            </span>
            <span className="block font-bold text-[#1a1a1a] text-[38px] sm:text-[48px] leading-[1.15] mt-1">
              one creation at a time.
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-[520px] text-[16px] text-dv-muted leading-relaxed">
            Welcome to DaVinci Project, where creativity meets compassion. We empower
            artists with special needs to share their unique talents with the world,
            bringing hope and purpose through every brushstroke and creation.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/artists"
              className="bg-dv-accent text-white text-[15px] font-medium px-7 h-11 rounded-full flex items-center hover:opacity-90 transition-opacity"
            >
              Meet the Artists
            </Link>
            <Link
              href="/shop"
              className="border border-dv-accent text-dv-accent text-[15px] font-medium px-7 h-11 rounded-full flex items-center hover:bg-dv-accent/5 transition-colors"
            >
              Shop Artworks
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS
      ══════════════════════════════════════════ */}
      <section className="bg-white py-12">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STATS.map(({ Icon, value, label, bg, color, italic }) => (
              <div
                key={label}
                className="rounded-[16px] px-8 py-8 flex flex-col items-center gap-3 text-center"
                style={{ background: bg }}
              >
                <Icon className="w-10 h-10" style={{ color }} />
                <p
                  className={`text-[32px] font-bold leading-none ${italic ? "font-serif italic" : ""}`}
                  style={{ color }}
                >
                  {value}
                </p>
                <p className="text-[14px] text-dv-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURED ARTISTS
      ══════════════════════════════════════════ */}
      <section className="bg-white py-16">
        <div className="max-w-[1280px] mx-auto px-4">
          {/* Section heading */}
          <div className="text-center mb-10">
            <h2 className="font-serif italic text-dv-accent text-[32px] mb-2">
              Featured Artists
            </h2>
            <p className="text-[15px] text-dv-muted max-w-[480px] mx-auto">
              Meet the incredible artists behind our creations. Each with their own unique
              story and vision.
            </p>
          </div>

          {/* 3-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {FEATURED.map(({ href, image, name, medium, quote }) => (
              <div key={name} className="flex flex-col gap-3">
                {/* Artist image — 4:3 */}
                <Link
                  href={href}
                  className="block overflow-hidden rounded-[12px] bg-dv-bg"
                  style={{ aspectRatio: "4/3" }}
                >
                  <Image
                    src={image}
                    alt={name}
                    width={700}
                    height={525}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Name + medium */}
                <div>
                  <p className="text-[16px] font-bold text-dv-text">{name}</p>
                  <p className="text-[13px] text-dv-accent italic">{medium}</p>
                </div>

                {/* Quote */}
                <div className="border-l-[3px] border-dv-accent pl-3">
                  <p className="text-[14px] text-dv-muted italic">&ldquo;{quote}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>

          {/* View All button */}
          <div className="flex justify-center">
            <Link
              href="/artists"
              className="border border-dv-accent text-dv-accent text-[15px] px-7 h-10 rounded-full flex items-center gap-2 hover:bg-dv-accent/5 transition-colors"
            >
              View All Artists <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          GALLERY HIGHLIGHTS
      ══════════════════════════════════════════ */}
      <section className="bg-white py-16 border-t border-black/5">
        <div className="max-w-[1280px] mx-auto px-4">
          {/* Section heading */}
          <div className="text-center mb-10">
            <h2 className="font-serif italic text-dv-accent text-[32px] mb-2">
              Gallery Highlights
            </h2>
            <p className="text-[15px] text-dv-muted max-w-[480px] mx-auto">
              Explore beautiful artworks ranging from metal sculptures to original paintings.
            </p>
          </div>

          {/* 4-column grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {GALLERY.map(({ badge, image, category, title, artist, href }) => (
              <Link key={title} href={href} className="group flex flex-col gap-2.5">
                {/* Image + badge */}
                <div className="relative overflow-hidden rounded-[12px] bg-dv-bg" style={{ aspectRatio: "1/1" }}>
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 right-2.5 w-8 h-8 bg-dv-accent text-white text-[13px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {badge}
                  </span>
                </div>

                {/* Info */}
                <div>
                  <p className="text-[11px] text-dv-muted uppercase tracking-wider mb-0.5">
                    {category}
                  </p>
                  <p className="text-[14px] font-bold text-dv-text leading-snug">{title}</p>
                  <p className="text-[13px] text-dv-muted">by {artist}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Browse All button */}
          <div className="flex justify-center">
            <Link
              href="/shop"
              className="bg-dv-accent text-white text-[15px] font-medium px-7 h-10 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              Browse All Artworks <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          EVERY PURCHASE MAKES A DIFFERENCE
      ══════════════════════════════════════════ */}
      <section style={{ background: "#f7f2eb" }} className="py-20">
        <div className="max-w-[600px] mx-auto px-4 flex flex-col items-center text-center gap-6">
          {/* Icon */}
          <div className="text-dv-accent">
            <Paintbrush className="w-12 h-12" />
          </div>

          <h2 className="font-serif italic text-dv-accent text-[36px] sm:text-[40px] leading-tight">
            Every Purchase Makes a Difference
          </h2>

          <p className="text-[16px] text-dv-muted leading-relaxed">
            When you buy art from DaVinci Project, 60% of the profit goes directly to
            the artist. You&apos;re not just buying art — you&apos;re supporting dreams,
            fostering independence, and spreading hope.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/artists"
              className="bg-dv-accent text-white text-[15px] font-medium px-7 h-11 rounded-full flex items-center hover:opacity-90 transition-opacity"
            >
              Support Our Artists
            </Link>
            <Link
              href="/about"
              className="border border-dv-accent text-dv-accent text-[15px] font-medium px-7 h-11 rounded-full flex items-center hover:bg-dv-accent/5 transition-colors"
            >
              Learn Our Story
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
