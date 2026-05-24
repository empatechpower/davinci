"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ShoppingCart, Share2, Palette, Heart, Award, Check } from "lucide-react";
import { use, useState, useCallback } from "react";
import { notFound } from "next/navigation";
import { ARTWORKS, ARTISTS } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-context";

interface Props {
  params: Promise<{ id: string }>;
}

const ARTWORK_EXTRA: Record<string, {
  technique: string;
  dimensions: string;
  story: string;
  inspiration: string;
  artistQuote: string;
}> = {
  "butterfly-dreams": {
    technique: "Hand-cut and welded steel with powder coating",
    dimensions: `12" × 10" × 2"`,
    story: "Marcus spent over two weeks carefully cutting, shaping, and welding each element of this butterfly. He was inspired by watching butterflies in the garden and wanted to create something that would last forever. The wings are intricately detailed with patterns that catch the light beautifully.",
    inspiration: "Monarch butterflies in the community garden",
    artistQuote: "Every piece tells my story. Metal might be hard, but my heart makes it beautiful.",
  },
  "flower-garden": {
    technique: "Hand-cut and welded steel with enamel finish",
    dimensions: `18" × 14" × 3"`,
    story: "Each flower in this garden was shaped individually over weeks of patient metalwork. Marcus drew from childhood memories of his mother's garden, recreating familiar blooms in steel.",
    inspiration: "My mother's garden in springtime",
    artistQuote: "I speak through metal the way others speak through words.",
  },
  "abstract-spiral": {
    technique: "Welded steel rods, powder coated",
    dimensions: `10" × 10" × 8"`,
    story: "The spiral emerged intuitively as Marcus worked — a form that kept appearing in his sketches until he had to make it real. It represents the endless cycle of growth and return.",
    inspiration: "The golden ratio found in nature",
    artistQuote: "Art is the only spiral I never want to stop following.",
  },
  "iron-postcard-i": {
    technique: "Etched and relief-cut mild steel",
    dimensions: `6" × 4" × 0.25"`,
    story: "Marcus wanted to create something you could hold in your hand and still feel the full weight of his work. These postcards are made to be mailed, gifted, or kept as tiny treasures.",
    inspiration: "The idea that great art can fit in an envelope",
    artistQuote: "Big feelings come in small packages.",
  },
  "spring-awakening": {
    technique: "Layered watercolor washes on 300gsm cold press",
    dimensions: `20" × 16"`,
    story: "Sarah spent three weeks layering translucent washes to achieve the luminous quality of early morning light. Each layer dried fully before the next was applied, building depth and glow.",
    inspiration: "The first cherry blossoms outside her studio window",
    artistQuote: "Every bloom is a small miracle I try to capture before it fades.",
  },
  "morning-dew": {
    technique: "Wet-on-wet watercolor with salt texture",
    dimensions: `16" × 12"`,
    story: "Painted in the early morning before the light shifted, this piece captures a fleeting moment Sarah had been chasing for months. The dewdrops were achieved with fine masking fluid.",
    inspiration: "Early mornings in the garden before the world wakes up",
    artistQuote: "I paint the quiet moments most people sleep through.",
  },
};

function getExtra(id: string) {
  if (ARTWORK_EXTRA[id]) return ARTWORK_EXTRA[id];
  const artwork = ARTWORKS.find((a) => a.id === id);
  const categoryTechniques: Record<string, string> = {
    "Watercolor": "Watercolor on cold press paper",
    "Metal Art": "Hand-cut and welded steel",
    "Mixed Media": "Acrylic, paper, and fabric on canvas",
    "Sculpture": "Welded steel and found objects",
    "Acrylic": "Acrylic on stretched canvas",
    "Ink Drawing": "Pen and ink on archival paper",
    "Original Painting": "Oil on stretched canvas",
    "Postcard Art": "Mixed media on card stock",
  };
  const categoryDimensions: Record<string, string> = {
    "Watercolor": `20" × 16"`,
    "Metal Art": `14" × 10" × 2"`,
    "Mixed Media": `24" × 18"`,
    "Sculpture": `18" × 12" × 8"`,
    "Acrylic": `36" × 24"`,
    "Ink Drawing": `18" × 14"`,
    "Original Painting": `24" × 18"`,
    "Postcard Art": `6" × 4"`,
  };
  return {
    technique: categoryTechniques[artwork?.category ?? ""] ?? "Mixed media on archival substrate",
    dimensions: categoryDimensions[artwork?.category ?? ""] ?? `16" × 12"`,
    story: artwork?.description ?? "",
    inspiration: "The world as seen through the artist's eyes",
    artistQuote: "Every creation is a piece of my heart shared with the world.",
  };
}

export default function ShopArtworkPage({ params }: Props) {
  const { id } = use(params);
  const artwork = ARTWORKS.find((a) => a.id === id);
  if (!artwork) notFound();

  const artist = ARTISTS.find((a) => a.id === artwork.artistId);
  const extra = getExtra(id);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = useCallback(() => {
    addToCart(artwork.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [addToCart, artwork.id]);

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

        {/* ── TOP TWO-COLUMN ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">

          {/* Left: image + artist card */}
          <div className="flex flex-col gap-4">
            {/* Artwork image */}
            <div className="relative rounded-[16px] overflow-hidden bg-dv-bg aspect-square">
              {artwork.image && (
                <Image
                  src={artwork.image}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                />
              )}
              <span className="absolute top-3 right-3 bg-dv-accent text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                {artwork.category}
              </span>
            </div>

            {/* Artist card */}
            {artist && (
              <div className="border border-black/10 rounded-[16px] p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-dv-bg">
                    {artist.image && (
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[15px] font-semibold text-dv-text leading-snug">{artist.name}</p>
                      <Award className="w-4 h-4 text-dv-accent shrink-0" />
                    </div>
                    <p className="text-[12px] text-dv-muted">{artist.category}</p>
                    <p className="text-[12px] text-dv-accent font-medium">{artist.soldCount} pieces sold</p>
                  </div>
                </div>
                <Link
                  href={`/artists/${artwork.artistId}`}
                  className="w-full h-9 rounded-[10px] border border-black/20 flex items-center justify-center text-[13px] text-dv-text hover:border-dv-accent hover:text-dv-accent transition-colors"
                >
                  View Artist Profile
                </Link>
              </div>
            )}
          </div>

          {/* Right: info */}
          <div className="flex flex-col gap-6">
            {/* Title + artist */}
            <div>
              <h1 className="text-[32px] font-bold text-dv-text leading-tight mb-1">{artwork.title}</h1>
              <p className="text-[15px] text-dv-muted">by {artist?.name}</p>
            </div>

            {/* Price + purchase card */}
            <div className="rounded-[16px] p-5 flex flex-col gap-4" style={{ background: "#fff7f0" }}>
              <div>
                <p className="text-[12px] text-dv-muted mb-0.5">Price</p>
                <p className="text-[34px] font-bold text-dv-accent leading-none">{artwork.price}</p>
              </div>

              {/* Format */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] text-dv-muted">Format</label>
                <select
                  className="bg-white border border-black/15 rounded-[10px] px-3 h-10 text-[14px] text-dv-text outline-none cursor-pointer"
                  defaultValue={artwork.category}
                >
                  <option value={artwork.category}>{artwork.category}</option>
                </select>
              </div>

              {/* CTA row */}
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
                  { label: "Technique", value: extra.technique },
                  { label: "Dimensions", value: extra.dimensions },
                  { label: "Category", value: artwork.category },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-3 gap-4">
                    <span className="text-[13px] text-dv-muted shrink-0">{label}</span>
                    <span className="text-[13px] text-dv-text text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── STORY SECTION ── */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-dv-accent" fill="#ff8c42" />
            <h2 className="text-[22px] font-bold text-dv-accent">The Story Behind This Artwork</h2>
          </div>

          <p className="text-[15px] text-dv-muted leading-relaxed mb-5 max-w-[720px]">
            {extra.story}
          </p>

          {/* Inspiration quote block */}
          <div className="border-l-[3px] border-dv-accent pl-4 py-1">
            <p className="text-[13px] text-dv-accent italic font-medium mb-0.5">Inspiration:</p>
            <p className="text-[14px] text-dv-muted italic">{extra.inspiration}</p>
          </div>
        </div>

        {/* ── ARTIST QUOTE ── */}
        {artist && (
          <div
            className="rounded-[20px] p-8 flex flex-col items-center text-center gap-4 mb-10"
            style={{ background: "#fff7f0" }}
          >
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-dv-bg">
              {artist.image && (
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <p className="text-[18px] font-serif italic text-dv-text max-w-[560px] leading-relaxed">
              &ldquo;{extra.artistQuote}&rdquo;
            </p>
            <p className="text-[13px] text-dv-muted">— {artist.name}</p>
          </div>
        )}

        {/* ── YOUR PURCHASE MAKES A DIFFERENCE ── */}
        <div
          className="rounded-[20px] px-8 py-10 flex flex-col items-center text-center gap-5"
          style={{ background: "#e8f5f3" }}
        >
          <h2 className="text-[22px] font-bold text-dv-text">Your Purchase Makes a Difference</h2>
          <p className="text-[15px] text-dv-muted leading-relaxed max-w-[520px]">
            When you purchase this artwork, you&apos;re not just buying art — you&apos;re supporting{" "}
            {artist?.name}&apos;s creative journey, fostering independence, and helping them share
            their unique voice with the world.{" "}
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
