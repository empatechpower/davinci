"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ShoppingBag, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Artwork, Artist } from "@/lib/db/types";

export default function ArtworkPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [artist,  setArtist]  = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);

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

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-dv-accent" />
      </div>
    );
  }

  if (!artwork) return null;

  return (
    <>
      <div className="bg-white min-h-screen">
        <div className="max-w-[1280px] mx-auto px-4 py-10">
          {/* Back button */}
          <Link
            href={artist ? `/artists/${artist.slug}` : "/gallery"}
            className="inline-flex items-center gap-2 text-[14px] text-as-text py-2 mb-8 hover:text-as-gray transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {artist ? `Back to ${artist.name}` : "Back to Gallery"}
          </Link>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-[976px]">
            {/* Artwork image */}
            <div className="bg-as-card rounded-[10px] overflow-hidden aspect-square w-full max-w-[464px]">
              {artwork.image_url ? (
                <Image
                  src={artwork.image_url}
                  alt={artwork.title}
                  width={464}
                  height={464}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-as-muted text-6xl font-light">{artwork.title[0]}</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] font-normal text-as-text">{artwork.title}</h2>
                {artist && (
                  <Link
                    href={`/artists/${artist.slug}`}
                    className="text-[16px] text-as-gray hover:text-as-text transition-colors"
                  >
                    by {artist.name}
                  </Link>
                )}
              </div>

              <p className="text-[24px] font-normal text-as-text">
                {artwork.price != null ? `$${artwork.price}` : "—"}
              </p>

              {artwork.artist_receives != null && (
                <div className="bg-as-section rounded-[10px] px-6 py-4 flex flex-col gap-1">
                  <p className="text-[14px] text-as-gray">Artist receives</p>
                  <p className="text-[20px] font-normal text-as-text">${artwork.artist_receives}</p>
                  <p className="text-[14px] text-as-muted">
                    80% of purchase price goes directly to the artist
                  </p>
                </div>
              )}

              {artwork.description && (
                <p className="text-[16px] text-as-rich leading-relaxed">{artwork.description}</p>
              )}

              <button
                onClick={() => setLoginOpen(true)}
                className="bg-as-btn text-white text-[14px] rounded-[8px] h-10 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <ShoppingBag className="w-4 h-4" />
                Log In to Purchase
              </button>

              {artist && (
                <div className="border-t border-as-border pt-5 flex flex-col gap-3">
                  <h4 className="text-[16px] font-normal text-as-text">About the Artist</h4>
                  <p className="text-[16px] text-as-gray leading-relaxed">{artist.short_bio}</p>
                  <Link
                    href={`/artists/${artist.slug}`}
                    className="bg-white border border-black text-[14px] text-as-text rounded-[8px] h-9 px-4 inline-flex items-center self-start hover:bg-as-card transition-colors"
                  >
                    View More Work
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Login modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setLoginOpen(false)} />
          <div className="relative bg-white rounded-[10px] w-[448px] max-w-[calc(100vw-32px)] p-6 shadow-xl">
            <button
              onClick={() => setLoginOpen(false)}
              className="absolute top-4 right-4 text-as-text"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-1">Welcome Back</h2>
            <p className="text-[14px] text-[#717182] mb-6">
              Sign in to your account to purchase artwork and view your collection.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setLoginOpen(false)}
                className="flex-1 bg-white border border-black rounded-[8px] h-9 text-[14px] text-[#0a0a0a]"
              >
                Cancel
              </button>
              <Link
                href="/login"
                className="flex-1 bg-as-btn text-white rounded-[8px] h-9 text-[14px] flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
