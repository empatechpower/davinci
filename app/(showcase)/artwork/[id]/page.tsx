"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { ARTWORKS, ARTISTS } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ArtworkPage({ params }: Props) {
  const { id } = use(params);
  const artwork = ARTWORKS.find((a) => a.id === id);
  if (!artwork) notFound();

  const artist = ARTISTS.find((a) => a.id === artwork.artistId);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <div className="bg-white min-h-screen">
        <div className="max-w-[1280px] mx-auto px-4 py-10">
          {/* Back button */}
          <Link
            href={`/artists/${artwork.artistId}`}
            className="inline-flex items-center gap-2 text-[14px] text-as-text py-2 mb-8 hover:text-as-gray transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to {artist?.name}
          </Link>

          {/* Two-column layout matching Figma 464+464 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-[976px]">
            {/* Artwork image */}
            <div className="bg-as-card rounded-[10px] overflow-hidden aspect-square w-full max-w-[464px]">
              {artwork.image ? (
                <Image
                  src={artwork.image}
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
              {/* Title + artist link */}
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] font-normal text-as-text">{artwork.title}</h2>
                <Link
                  href={`/artists/${artwork.artistId}`}
                  className="text-[16px] text-as-gray hover:text-as-text transition-colors"
                >
                  by {artist?.name}
                </Link>
              </div>

              {/* Price */}
              <p className="text-[24px] font-normal text-as-text">{artwork.price}</p>

              {/* Artist receives */}
              <div className="bg-as-section rounded-[10px] px-6 py-4 flex flex-col gap-1">
                <p className="text-[14px] text-as-gray">Artist receives</p>
                <p className="text-[20px] font-normal text-as-text">{artwork.artistReceives}</p>
                <p className="text-[14px] text-as-muted">
                  80% of purchase price goes directly to the artist
                </p>
              </div>

              {/* Description */}
              <p className="text-[16px] text-as-rich leading-relaxed">{artwork.description}</p>

              {/* CTA */}
              <button
                onClick={() => setLoginOpen(true)}
                className="bg-as-btn text-white text-[14px] rounded-[8px] h-10 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <ShoppingBag className="w-4 h-4" />
                Log In to Purchase
              </button>

              {/* About the artist */}
              <div className="border-t border-as-border pt-5 flex flex-col gap-3">
                <h4 className="text-[16px] font-normal text-as-text">About the Artist</h4>
                <p className="text-[16px] text-as-gray leading-relaxed">{artist?.shortBio}</p>
                <Link
                  href={`/artists/${artwork.artistId}`}
                  className="bg-white border border-black text-[14px] text-as-text rounded-[8px] h-9 px-4 inline-flex items-center self-start hover:bg-as-card transition-colors"
                >
                  View More Work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login modal overlay */}
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
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[14px] text-[#0a0a0a]">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="bg-[#f3f3f5] border border-black rounded-[8px] px-3 h-9 text-[14px] text-[#717182] w-full outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[14px] text-[#0a0a0a]">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="bg-[#f3f3f5] border border-black rounded-[8px] px-3 h-9 text-[14px] text-[#717182] w-full outline-none"
                />
              </div>
              <div className="bg-as-section rounded-[10px] p-3 flex flex-col gap-1">
                <p className="text-[12px] text-as-gray">Demo credentials:</p>
                <p className="text-[12px] text-as-gray">Email: marc@example.com</p>
                <p className="text-[12px] text-as-gray">Password: any password</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setLoginOpen(false)}
                  className="flex-1 bg-white border border-black rounded-[8px] h-9 text-[14px] text-[#0a0a0a]"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-as-btn text-white rounded-[8px] h-9 text-[14px]">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
