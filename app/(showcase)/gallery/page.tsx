"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ARTWORKS, ARTISTS } from "@/lib/mock-data";

const CATEGORIES = ["All", "Watercolor", "Digital Art", "Mixed Media", "Sculpture", "Acrylic", "Ink Drawing"];

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

function parsePrice(p: string) {
  return parseFloat(p.replace(/[$,]/g, ""));
}

export default function GalleryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const artistMap = useMemo(
    () => Object.fromEntries(ARTISTS.map((a) => [a.id, a])),
    []
  );

  const displayed = useMemo(() => {
    let result = [...ARTWORKS];

    if (activeCategory !== "All") {
      result = result.filter((a) => a.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          (artistMap[a.artistId]?.name ?? "").toLowerCase().includes(q)
      );
    }

    if (sort === "price-asc") result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    if (sort === "price-desc") result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));

    return result;
  }, [search, activeCategory, sort, artistMap]);

  return (
    <div className="flex flex-col">

      {/* ── HERO HEADER ── */}
      <section className="relative overflow-hidden" style={{ background: "#f7f2eb" }}>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06]"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=1400&q=60)",
          }}
        />
        <div className="relative max-w-[1280px] mx-auto px-4 py-16 sm:py-20 text-center flex flex-col items-center gap-5">
          <h1 className="font-serif italic text-dv-accent text-[40px] sm:text-[52px] leading-tight">
            Our Gallery
          </h1>
          <p className="text-[16px] text-dv-muted max-w-[520px] leading-relaxed">
            Explore original artworks created by our talented special-needs artists.
            Every purchase sends 80% directly to the artist.
          </p>

          {/* Search bar */}
          <div className="w-full max-w-[540px] flex items-center gap-2 bg-white border border-black/15 rounded-full px-5 h-12 shadow-sm">
            <Search className="w-4 h-4 text-dv-muted shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search artworks, artists, or styles…"
              className="flex-1 text-[15px] text-dv-text placeholder:text-dv-muted bg-transparent outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-dv-muted hover:text-dv-text">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Stats pills */}
          <div className="flex gap-4 text-[13px] text-dv-muted">
            <span className="bg-white/70 px-4 py-1.5 rounded-full border border-black/10">
              {ARTWORKS.length} artworks
            </span>
            <span className="bg-white/70 px-4 py-1.5 rounded-full border border-black/10">
              {ARTISTS.length} artists
            </span>
            <span className="bg-white/70 px-4 py-1.5 rounded-full border border-black/10">
              80% to artists
            </span>
          </div>
        </div>
      </section>

      {/* ── FILTER + SORT BAR ── */}
      <div className="sticky top-[65px] z-30 bg-white border-b border-black/8 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Category pills — scroll on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 text-[13px] px-4 h-8 rounded-full border transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-dv-accent text-white border-dv-accent"
                    : "border-black/20 text-dv-muted hover:border-dv-accent hover:text-dv-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort + filter button */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 border border-black/15 rounded-full px-3 h-8">
              <SlidersHorizontal className="w-3.5 h-3.5 text-dv-muted" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-[13px] text-dv-text bg-transparent outline-none cursor-pointer pr-1"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── ARTWORK GRID ── */}
      <section className="bg-white py-12">
        <div className="max-w-[1280px] mx-auto px-4">
          {/* Results count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-[14px] text-dv-muted">
              Showing <span className="font-semibold text-dv-text">{displayed.length}</span> artwork{displayed.length !== 1 ? "s" : ""}
              {activeCategory !== "All" && (
                <> in <span className="font-semibold text-dv-accent">{activeCategory}</span></>
              )}
            </p>
            {(search || activeCategory !== "All") && (
              <button
                onClick={() => { setSearch(""); setActiveCategory("All"); }}
                className="text-[13px] text-dv-muted hover:text-dv-accent flex items-center gap-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear filters
              </button>
            )}
          </div>

          {displayed.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {displayed.map((artwork) => {
                const artist = artistMap[artwork.artistId];
                return (
                  <Link
                    key={artwork.id}
                    href={`/artwork/${artwork.id}`}
                    className="group flex flex-col gap-3"
                  >
                    {/* Image */}
                    <div
                      className="relative overflow-hidden rounded-[12px] bg-[#f5f2ef]"
                      style={{ aspectRatio: "1/1" }}
                    >
                      <Image
                        src={artwork.image}
                        alt={artwork.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Category badge */}
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-dv-text text-[11px] font-medium px-2.5 py-1 rounded-full">
                        {artwork.category}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[15px] font-bold text-dv-text leading-snug group-hover:text-dv-accent transition-colors">
                        {artwork.title}
                      </p>
                      <p className="text-[13px] text-dv-muted">by {artist?.name ?? "Unknown"}</p>
                      <p className="text-[14px] font-semibold text-dv-text mt-1">{artwork.price}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-dv-accent/10 flex items-center justify-center">
                <Search className="w-7 h-7 text-dv-accent" />
              </div>
              <p className="text-[18px] font-serif italic text-dv-accent">No artworks found</p>
              <p className="text-[14px] text-dv-muted">Try a different search or category.</p>
              <button
                onClick={() => { setSearch(""); setActiveCategory("All"); }}
                className="mt-2 border border-dv-accent text-dv-accent text-[14px] px-6 h-9 rounded-full hover:bg-dv-accent/5 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ background: "#f7f2eb" }} className="py-16">
        <div className="max-w-[560px] mx-auto px-4 text-center flex flex-col items-center gap-5">
          <h2 className="font-serif italic text-dv-accent text-[32px] leading-tight">
            Commission a Custom Piece
          </h2>
          <p className="text-[15px] text-dv-muted leading-relaxed">
            Want something unique? Connect directly with one of our artists to commission
            a piece made just for you.
          </p>
          <Link
            href="/artists"
            className="bg-dv-accent text-white text-[15px] font-medium px-7 h-11 rounded-full flex items-center hover:opacity-90 transition-opacity"
          >
            Meet the Artists
          </Link>
        </div>
      </section>

    </div>
  );
}
