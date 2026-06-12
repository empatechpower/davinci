"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";

interface Artwork {
  id: string;
  slug: string;
  title: string;
  price: number | null;
  image_url?: string | null;
  dimensions: string | null;
}

export default function ArtistArtworkGrid({ artworks }: { artworks: Artwork[] }) {
  const dims = Array.from(new Set(artworks.map((a) => a.dimensions).filter(Boolean) as string[]));
  const [activeDim, setActiveDim] = useState<string>(dims[0] ?? "");
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { addToCart } = useCart();

  const handleAdd = useCallback((artworkId: string) => {
    addToCart(artworkId);
    setAddedIds((prev) => new Set(prev).add(artworkId));
    setTimeout(() => setAddedIds((prev) => { const n = new Set(prev); n.delete(artworkId); return n; }), 2000);
  }, [addToCart]);

  const filtered = dims.length > 1
    ? artworks.filter((a) => a.dimensions === activeDim)
    : artworks;

  return (
    <div>
      {/* Dimension tabs */}
      {dims.length > 1 && (
        <div className="flex gap-8 mb-6">
          {dims.map((dim) => (
            <button
              key={dim}
              onClick={() => setActiveDim(dim)}
              style={{
                fontSize: 14,
                color: activeDim === dim ? "#2d3748" : "#718096",
                fontWeight: activeDim === dim ? 600 : 400,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {dim}
            </button>
          ))}
        </div>
      )}

      {/* Artwork grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((artwork) => {
          const isAdded = addedIds.has(artwork.id);
          return (
            <div key={artwork.id} className="flex flex-col overflow-hidden" style={{ borderRadius: 16, border: "1px solid #f0ece6", background: "#fff" }}>

              {/* Image */}
              <Link href={`/shop/${artwork.slug}`} className="block relative overflow-hidden" style={{ aspectRatio: "1/1", background: "#f5f2ef" }}>
                {artwork.image_url ? (
                  <Image
                    src={artwork.image_url}
                    alt={artwork.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-light" style={{ color: "#c9c3bc" }}>
                    {artwork.title[0]}
                  </div>
                )}
              </Link>

              {/* Info */}
              <div className="flex flex-col gap-2 p-4">
                <Link href={`/shop/${artwork.slug}`} className="text-[15px] font-medium leading-snug hover:opacity-70 transition-opacity" style={{ color: "#2d3748" }}>
                  {artwork.title}
                </Link>
                {artwork.dimensions && (
                  <p className="text-[12px]" style={{ color: "#718096" }}>{artwork.dimensions}</p>
                )}
                <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", color: "#ff8c42", fontSize: 18, fontWeight: 600 }}>
                  {artwork.price != null ? `$${artwork.price}` : "—"}
                </p>
                <button
                  onClick={() => handleAdd(artwork.id)}
                  className="flex items-center justify-center gap-2 w-full rounded-full py-2.5 text-[14px] font-medium transition-opacity hover:opacity-90"
                  style={{ background: "#ff8c42", color: "#fff" }}
                >
                  {isAdded ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                  {isAdded ? "Added!" : "Add to Cart"}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-12 text-[14px]" style={{ color: "#718096" }}>No artworks for this dimension.</p>
      )}
    </div>
  );
}
