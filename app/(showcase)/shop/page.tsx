"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, ShoppingCart, Loader2 } from "lucide-react";
import type { Artwork, Artist } from "@/lib/db/types";

export default function ShopPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [artists, setArtists] = useState<Pick<Artist, "id" | "name">[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [activeArtist, setActiveArtist] = useState("All Artists");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/artworks");
      const { artworks: w, artistMap: am } = await res.json();
      setArtworks(w ?? []);
      setArtists(Object.values(am ?? {}));
      setLoading(false);
    })();
  }, []);

  const artistMap = useMemo(
    () => Object.fromEntries(artists.map((a) => [a.id, a])),
    [artists],
  );

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(artworks.map((a) => a.category).filter(Boolean) as string[]),
    ).sort();
    return ["All Categories", ...unique];
  }, [artworks]);

  const artistOptions = useMemo(
    () => ["All Artists", ...artists.map((a) => a.name)],
    [artists],
  );

  const displayed = useMemo(() => {
    let result = [...artworks];

    if (activeCategory !== "All Categories") {
      result = result.filter((a) => a.category === activeCategory);
    }

    if (activeArtist !== "All Artists") {
      result = result.filter(
        (a) => (artistMap[a.artist_id ?? ""]?.name ?? "") === activeArtist,
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.category ?? "").toLowerCase().includes(q) ||
          (artistMap[a.artist_id ?? ""]?.name ?? "").toLowerCase().includes(q),
      );
    }

    return result;
  }, [artworks, search, activeCategory, activeArtist, artistMap]);

  return (
    <div style={{ background: "#faf9f7" }} className="min-h-screen pb-16">
      {/* Page header */}
      <div className="max-w-[1280px] mx-auto pt-14 pb-8 text-center px-4">
        <h1 className="font-serif italic text-dv-accent text-[42px] sm:text-[52px] leading-tight mb-3">
          Shop Artworks
        </h1>
        <p className="text-[15px] text-dv-muted max-w-[460px] mx-auto leading-relaxed">
          Every purchase supports our talented artists and their creative
          journey.
        </p>
      </div>

      {/* Filter bar */}
      <div className="max-w-[1280px] mx-auto px-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
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
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-dv-accent" />
          </div>
        ) : (
          <>
            <p className="text-[13px] text-dv-muted mb-5">
              Showing {displayed.length} artwork
              {displayed.length !== 1 ? "s" : ""}
            </p>

            {displayed.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayed.map((artwork) => {
                  const artist = artistMap[artwork.artist_id ?? ""];
                  return (
                    <Link
                      key={artwork.id}
                      href={`/shop/${artwork.slug}`}
                      className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="relative aspect-square bg-gray-100 overflow-hidden">
                        {artwork.image_url ? (
                          <Image
                            src={artwork.image_url}
                            alt={artwork.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl text-dv-muted font-light">
                            {artwork.title[0]}
                          </div>
                        )}
                        <span className="absolute top-2 right-2 bg-dv-accent text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                          {artwork.dimensions ?? "Art"}
                        </span>
                      </div>
                      <div className="p-3 flex flex-col gap-1 flex-1">
                        <p className="text-[13px] font-semibold text-dv-text leading-snug line-clamp-1 group-hover:text-dv-accent transition-colors">
                          {artwork.title}
                        </p>
                        <p className="text-[11px] text-dv-muted">
                          by {artist?.name ?? "Unknown"}
                        </p>
                        <div className="flex items-center justify-between mt-2 gap-1">
                          <p className="text-[13px] font-semibold text-dv-accent">
                            {artwork.price != null ? `$${artwork.price}` : "—"}
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
                <p className="font-serif italic text-dv-accent text-[20px]">
                  No artworks found
                </p>
                <p className="text-[14px] text-dv-muted">
                  Try a different search or filter.
                </p>
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
          </>
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
            Our artists are always creating new pieces. Check back regularly or
            contact us for custom requests.
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
