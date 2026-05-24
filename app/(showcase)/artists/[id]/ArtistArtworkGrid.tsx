"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";

interface Artwork {
  id: string;
  title: string;
  price: string;
  image?: string;
  category: string;
}

interface Props {
  artworks: Artwork[];
}

export default function ArtistArtworkGrid({ artworks }: Props) {
  const categories = Array.from(new Set(artworks.map((a) => a.category)));
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] ?? "");
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { addToCart } = useCart();

  const handleAdd = useCallback((artworkId: string) => {
    addToCart(artworkId);
    setAddedIds((prev) => new Set(prev).add(artworkId));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(artworkId);
        return next;
      });
    }, 2000);
  }, [addToCart]);

  const filtered =
    categories.length > 1
      ? artworks.filter((a) => a.category === activeCategory)
      : artworks;

  return (
    <div>
      {categories.length > 1 && (
        <div className="flex gap-4 mb-6 border-b border-gray-100 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[14px] pb-2 transition-colors ${
                activeCategory === cat
                  ? "text-dv-text font-medium border-b-2 border-dv-text"
                  : "text-dv-muted hover:text-dv-text"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((artwork) => {
          const isAdded = addedIds.has(artwork.id);
          return (
            <div key={artwork.id} className="flex flex-col rounded-xl overflow-hidden border border-gray-100">
              <Link href={`/shop/${artwork.id}`} className="aspect-square w-full bg-gray-100 overflow-hidden block">
                {artwork.image ? (
                  <Image
                    src={artwork.image}
                    alt={artwork.title}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-dv-muted text-4xl font-light">
                    {artwork.title[0]}
                  </div>
                )}
              </Link>
              <div className="p-4 flex flex-col gap-2">
                <Link href={`/shop/${artwork.id}`} className="text-[15px] font-medium text-dv-text hover:text-dv-accent transition-colors">
                  {artwork.title}
                </Link>
                <p className="text-[16px] font-semibold text-dv-accent">{artwork.price}</p>
                <button
                  onClick={() => handleAdd(artwork.id)}
                  className="mt-1 flex items-center justify-center gap-2 w-full bg-dv-accent text-white text-[14px] font-medium rounded-full py-2.5 hover:opacity-90 transition-opacity"
                >
                  {isAdded ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                  {isAdded ? "Added!" : "Add to Cart"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
