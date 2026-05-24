"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, ShoppingCart } from "lucide-react";
import { ARTWORKS, ARTISTS } from "@/lib/mock-data";

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [activeArtist, setActiveArtist] = useState("All Artists");

  const artistMap = useMemo(
    () => Object.fromEntries(ARTISTS.map((a) => [a.id, a])),
    []
  );

  const categories = useMemo(() => {
    const unique = Array.from(new Set(ARTWORKS.map((a) => a.category))).sort();
    return ["All Categories", ...unique];
  }, []);

  const artistOptions = useMemo(() => {
    return ["All Artists", ...ARTISTS.map((a) => a.name)];
  }, []);

  const displayed = useMemo(() => {
    let result = [...ARTWORKS];

    if (activeCategory !== "All Categories") {
      result = result.filter((a) => a.category === activeCategory);
    }

    if (activeArtist !== "All Artists") {
      result = result.filter(
        (a) => (artistMap[a.artistId]?.name ?? "") === activeArtist
      );
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

    return result;
  }, [search, activeCategory, activeArtist, artistMap]);

  return (
    <div style={{ background: "#faf9f7" }} className="min-h-screen pb-16">
      {/* Page header */}
      <div className="max-w-[1280px] mx-auto pt-14 pb-8 text-center px-4">
        <h1 className="font-serif italic text-dv-accent text-[42px] sm:text-[52px] leading-tight mb-3">
          Shop Artworks
        </h1>
        <p className="text-[15px] text-dv-muted max-w-[460px] mx-auto leading-relaxed">
          Every purchase supports our talented artists and their creative journey.
        </p>
      </div>

      {/* Filter bar */}
      <div className="max-w-[1280px] mx-auto px-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {/* Search */}
          <div className="flex items-center gap-2 px-5 py-3 flex-1">
            <Search className="w-4 h-4 text-dv-muted shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search artworks or artists..."
              className="flex-1 text-[14px] text-dv-text placeholder:text-dv-muted bg-transparent outline-none min-w-0"
            />
          </div>

          {/* Category select */}
          <div className="flex items-center gap-2 px-5 py-3 sm:w-[200px]">
            <SlidersHorizontal className="w-4 h-4 text-dv-muted shrink-0" />
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="flex-1 text-[14px] text-dv-text bg-transparent outline-none cursor-pointer appearance-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Artist select */}
          <div className="flex items-center gap-2 px-5 py-3 sm:w-[200px]">
            <SlidersHorizontal className="w-4 h-4 text-dv-muted shrink-0" />
            <select
              value={activeArtist}
              onChange={(e) => setActiveArtist(e.target.value)}
              className="flex-1 text-[14px] text-dv-text bg-transparent outline-none cursor-pointer appearance-none"
            >
              {artistOptions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-[1280px] mx-auto px-4">
        <p className="text-[13px] text-dv-muted mb-5">
          Showing {displayed.length} artwork{displayed.length !== 1 ? "s" : ""}
        </p>

        {displayed.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayed.map((artwork) => {
              const artist = artistMap[artwork.artistId];
              return (
                <Link key={artwork.id} href={`/shop/${artwork.id}`} className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {artwork.image && (
                      <Image
                        src={artwork.image}
                        alt={artwork.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    {/* Category badge — top right */}
                    <span className="absolute top-2 right-2 bg-dv-accent text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                      {artwork.category}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col gap-1 flex-1">
                    <p className="text-[13px] font-semibold text-dv-text leading-snug line-clamp-1 group-hover:text-dv-accent transition-colors">
                      {artwork.title}
                    </p>
                    <p className="text-[11px] text-dv-muted">
                      by {artist?.name ?? "Unknown"}
                    </p>
                    <div className="flex items-center justify-between mt-2 gap-1">
                      <p className="text-[13px] font-semibold text-dv-accent">
                        From {artwork.price}
                      </p>
                      <span className="flex items-center gap-1 bg-dv-accent text-white text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0">
                        <ShoppingCart className="w-3 h-3" />
                        Buy
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center gap-3 text-center">
            <p className="font-serif italic text-dv-accent text-[20px]">No artworks found</p>
            <p className="text-[14px] text-dv-muted">Try a different search or filter.</p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All Categories");
                setActiveArtist("All Artists");
              }}
              className="mt-2 border border-dv-accent text-dv-accent text-[13px] px-5 h-9 rounded-full hover:bg-dv-accent/5 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-[1280px] mx-auto px-4 mt-12">
        <div
          className="rounded-2xl py-12 px-6 text-center flex flex-col items-center gap-4"
          style={{ background: "#f0ebe3" }}
        >
          <h2 className="font-serif italic text-dv-accent text-[28px] leading-tight">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-[14px] text-dv-muted max-w-[380px] leading-relaxed">
            Our artists are always creating new pieces. Check back regularly or contact us for
            custom requests.
          </p>
          <Link
            href="/contact"
            className="bg-dv-accent text-white text-[14px] font-medium px-7 h-10 rounded-full flex items-center hover:opacity-90 transition-opacity"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
