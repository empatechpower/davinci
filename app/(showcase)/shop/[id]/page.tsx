"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ShoppingCart, Share2, Palette, Heart, Award, Check, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Artwork, Artist } from "@/lib/db/types";
import { useCart } from "@/lib/cart-context";

export default function ShopArtworkPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [artist,  setArtist]  = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [added,      setAdded]      = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/artworks/${id}`);
      if (!res.ok) { router.replace("/shop"); return; }
      const { artwork: a, artist: art } = await res.json();
      setArtwork(a);
      setArtist(art ?? null);
      setLoading(false);
    })();
  }, [id, router]);

  const handleAddToCart = useCallback(() => {
    if (!artwork) return;
    addToCart(artwork.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [addToCart, artwork]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-dv-accent" />
      </div>
    );
  }

  if (!artwork) return null;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 py-10">

        {/* Back link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-[14px] text-dv-muted mb-8 hover:text-dv-accent transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        {/* TOP TWO-COLUMN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">

          {/* Left: image gallery + videos + artist card */}
          <div className="flex flex-col gap-4">
            {/* Photo gallery */}
            {(() => {
              const allPhotos = artwork.photos?.length ? artwork.photos : artwork.image_url ? [artwork.image_url] : [];
              return (
                <>
                  <div className="relative rounded-[16px] overflow-hidden bg-dv-bg aspect-square">
                    {allPhotos.length > 0 ? (
                      <Image src={allPhotos[activePhoto]} alt={artwork.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl text-dv-muted font-light">
                        {artwork.title[0]}
                      </div>
                    )}
                    {artwork.category && (
                      <span className="absolute top-3 right-3 bg-dv-accent text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                        {artwork.category}
                      </span>
                    )}
                  </div>
                  {allPhotos.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {allPhotos.map((src, i) => (
                        <button key={i} onClick={() => setActivePhoto(i)}
                          className={`relative shrink-0 w-16 h-16 rounded-[8px] overflow-hidden border-2 transition-colors ${i === activePhoto ? "border-dv-accent" : "border-transparent"}`}>
                          <Image src={src} alt={`photo ${i + 1}`} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}

            {/* Videos */}
            {artwork.videos && artwork.videos.length > 0 && (
              <div className="flex flex-col gap-3">
                {artwork.videos.map((url, i) => (
                  <video key={i} src={url} controls className="w-full rounded-[12px] bg-black" style={{ maxHeight: 320 }}>
                    Your browser does not support the video tag.
                  </video>
                ))}
              </div>
            )}

            {/* Artist card */}
            {artist && (
              <div className="border border-black/10 rounded-[16px] p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-dv-bg">
                    {artist.image_url && (
                      <Image src={artist.image_url} alt={artist.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[15px] font-semibold text-dv-text leading-snug">{artist.name}</p>
                      <Award className="w-4 h-4 text-dv-accent shrink-0" />
                    </div>
                    <p className="text-[12px] text-dv-muted">{artist.category}</p>
                    <p className="text-[12px] text-dv-accent font-medium">{artist.sold_count} pieces sold</p>
                  </div>
                </div>
                <Link
                  href={`/artists/${artist.slug}`}
                  className="w-full h-9 rounded-[10px] border border-black/20 flex items-center justify-center text-[13px] text-dv-text hover:border-dv-accent hover:text-dv-accent transition-colors"
                >
                  View Artist Profile
                </Link>
              </div>
            )}
          </div>

          {/* Right: info */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-[32px] font-bold text-dv-text leading-tight mb-1">{artwork.title}</h1>
              <p className="text-[15px] text-dv-muted">by {artist?.name ?? "Unknown"}</p>
            </div>

            {/* Description */}
            {artwork.description && (
              <p className="text-[15px] text-dv-muted leading-relaxed">{artwork.description}</p>
            )}

            {/* Remarks */}
            {artwork.remarks && (
              <div className="border-l-[3px] border-dv-accent pl-4 py-1">
                <p className="text-[12px] font-semibold text-dv-accent mb-0.5">Remarks</p>
                <p className="text-[14px] text-dv-muted">{artwork.remarks}</p>
              </div>
            )}

            {/* Price + purchase card */}
            <div className="rounded-[16px] p-5 flex flex-col gap-4" style={{ background: "#fff7f0" }}>
              <div>
                <p className="text-[12px] text-dv-muted mb-0.5">Price</p>
                <p className="text-[34px] font-bold text-dv-accent leading-none">
                  {artwork.price != null ? `$${artwork.price}` : "—"}
                </p>
              </div>

              {artwork.category && (
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-dv-muted">Format</label>
                  <select
                    className="bg-white border border-black/15 rounded-[10px] px-3 h-10 text-[14px] text-dv-text outline-none cursor-pointer"
                    defaultValue={artwork.category}
                  >
                    <option value={artwork.category}>{artwork.category}</option>
                  </select>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-11 rounded-full bg-dv-accent text-white text-[15px] font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                  {added ? "Added!" : "Add to Cart"}
                </button>
                <button className="w-11 h-11 rounded-full border border-black/15 flex items-center justify-center text-dv-muted hover:text-dv-accent hover:border-dv-accent transition-colors shrink-0">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Artwork details */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-4 h-4 text-dv-accent" />
                <p className="text-[14px] font-semibold text-dv-accent">Artwork Details</p>
              </div>
              <div className="flex flex-col divide-y divide-black/8">
                {[
                  { label: "Technique",  value: artwork.technique  },
                  { label: "Dimensions", value: artwork.dimensions },
                  { label: "Category",   value: artwork.category   },
                ].filter(({ value }) => value).map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-3 gap-4">
                    <span className="text-[13px] text-dv-muted shrink-0">{label}</span>
                    <span className="text-[13px] text-dv-text text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* STORY SECTION */}
        {(artwork.story || artwork.inspiration) && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-dv-accent" fill="#ff8c42" />
              <h2 className="text-[22px] font-bold text-dv-accent">The Story Behind This Artwork</h2>
            </div>
            {artwork.story && (
              <p className="text-[15px] text-dv-muted leading-relaxed mb-5 max-w-[720px]">
                {artwork.story}
              </p>
            )}
            {artwork.inspiration && (
              <div className="border-l-[3px] border-dv-accent pl-4 py-1">
                <p className="text-[13px] text-dv-accent italic font-medium mb-0.5">Inspiration:</p>
                <p className="text-[14px] text-dv-muted italic">{artwork.inspiration}</p>
              </div>
            )}
          </div>
        )}

        {/* ARTIST QUOTE */}
        {artist && artwork.artist_quote && (
          <div
            className="rounded-[20px] p-8 flex flex-col items-center text-center gap-4 mb-10"
            style={{ background: "#fff7f0" }}
          >
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-dv-bg">
              {artist.image_url && (
                <Image src={artist.image_url} alt={artist.name} fill className="object-cover" />
              )}
            </div>
            <p className="text-[18px] font-serif italic text-dv-text max-w-[560px] leading-relaxed">
              &ldquo;{artwork.artist_quote}&rdquo;
            </p>
            <p className="text-[13px] text-dv-muted">— {artist.name}</p>
          </div>
        )}

        {/* PURCHASE CTA */}
        <div
          className="rounded-[20px] px-8 py-10 flex flex-col items-center text-center gap-5"
          style={{ background: "#e8f5f3" }}
        >
          <h2 className="text-[22px] font-bold text-dv-text">Your Purchase Makes a Difference</h2>
          <p className="text-[15px] text-dv-muted leading-relaxed max-w-[520px]">
            When you purchase this artwork, you&apos;re not just buying art — you&apos;re supporting{" "}
            {artist?.name}&apos;s creative journey.{" "}
            <span className="font-semibold text-dv-text">60% of profits</span> from this sale go
            directly to the artist.
          </p>
          <button
            onClick={handleAddToCart}
            className="h-11 rounded-full bg-dv-accent text-white text-[15px] font-medium px-8 flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            {added ? "Added!" : "Add to Cart"}
          </button>
        </div>

      </div>
    </div>
  );
}
