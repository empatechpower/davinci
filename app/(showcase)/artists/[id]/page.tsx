import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Award, Heart } from "lucide-react";
import { notFound } from "next/navigation";
import { queryOne, query } from "@/lib/db";
import type { Artist, Artwork } from "@/lib/db/types";
import ArtistArtworkGrid from "./ArtistArtworkGrid";

interface Props { params: Promise<{ id: string }> }

export default async function ArtistPage({ params }: Props) {
  const { id } = await params;

  const artist = await queryOne<Artist>("SELECT * FROM artists WHERE slug = $1", [id]);
  if (!artist) notFound();

  const artworks = await query<Artwork>(
    "SELECT * FROM artworks WHERE artist_id = $1 ORDER BY created_at DESC",
    [artist.id]
  );

  return (
    <div className="min-h-screen py-8 px-6" style={{ background: "#faf9f7" }}>
      <div className="max-w-[1280px] mx-auto flex flex-col gap-6">

        {/* Back */}
        <Link href="/artists" className="inline-flex items-center gap-1 text-[14px] text-[#718096] hover:text-[#ff8c42] transition-colors w-fit">
          <ChevronLeft className="w-4 h-4" />
          Back to All Artists
        </Link>

        {/* ── Hero card ── */}
        <div className="bg-white rounded-[20px] overflow-hidden border border-dv-accent-border/40 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col md:flex-row">

            {/* Photo — left panel */}
            <div className="relative shrink-0 w-full md:w-[46%] p-6 min-h-[420px]">
              <div className="relative w-full h-full min-h-[380px] rounded-[8px] overflow-hidden">
                {artist.image_url ? (
                  <Image src={artist.image_url} alt={artist.name} fill className="object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl font-bold" style={{ background: "#fdf3ea", color: "#ff8c42", opacity: 0.3 }}>
                    {artist.name[0]}
                  </div>
                )}
              </div>
              {/* Award badge — large, on the bottom-right edge of the image */}
              <div className="absolute bottom-3 right-3 w-20 h-20 rounded-full flex items-center justify-center shadow-xl z-10" style={{ background: "#ff8c42" }}>
                <Award className="w-9 h-9 text-white" />
              </div>
            </div>

            {/* Right — info */}
            <div className="flex-1 flex flex-col justify-center gap-5 px-12 py-10">

              {/* Tagline badge */}
              {(artist.tagline || artist.category) && (
                <span className="self-start text-[13px] font-semibold px-4 py-1.5 rounded-full" style={{ background: "rgba(255,140,66,0.15)", color: "#ff8c42" }}>
                  {artist.tagline || artist.category}
                </span>
              )}

              {/* Name */}
              <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", color: "#ff8c42", fontSize: 48, lineHeight: 1.1, fontWeight: 400 }}>
                {artist.name}
              </h1>

              {/* Full bio */}
              {(artist.full_bio || artist.short_bio) && (
                <p className="text-[15px] leading-relaxed" style={{ color: "#4a5568" }}>
                  {artist.full_bio || artist.short_bio}
                </p>
              )}

              {/* Category with bracket */}
              {artist.category && (
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: "Georgia, serif", fontSize: 40, lineHeight: 1, color: "#ff8c42", fontWeight: 300 }}>(</span>
                  <Heart className="w-4 h-4 shrink-0" style={{ color: "#ff8c42" }} fill="#ff8c42" />
                  <p className="text-[14px]" style={{ color: "#718096" }}>{artist.category}</p>
                </div>
              )}

              {/* Stats */}
              <div className="flex gap-4 mt-2">
                <div className="flex flex-col items-center justify-center px-8 py-5 rounded-[16px]" style={{ background: "#fdf3ea" }}>
                  <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 34, color: "#ff8c42", lineHeight: 1 }}>{artist.sold_count}</span>
                  <span className="text-[12px] mt-1.5" style={{ color: "#718096" }}>Artworks Sold</span>
                </div>
                <div className="flex flex-col items-center justify-center px-8 py-5 rounded-[16px]" style={{ background: "#fdf3ea" }}>
                  <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 34, color: "#ff8c42", lineHeight: 1 }}>{artworks.length}</span>
                  <span className="text-[12px] mt-1.5" style={{ color: "#718096" }}>Total Works</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── Artworks card ── */}
        <div className="bg-white rounded-[20px] overflow-hidden border border-dv-accent-border/40 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
          <div className="px-10 py-8 border-b border-dv-accent-border/30">
            <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", color: "#ff8c42", fontSize: 30, fontWeight: 400 }}>
              Artworks by {artist.name}
            </h2>
            <p className="text-[14px] mt-1" style={{ color: "#718096" }}>
              {artworks.length} {artworks.length === 1 ? "piece" : "pieces"}
            </p>
          </div>
          <div className="p-8">
            {artworks.length > 0 ? (
              <ArtistArtworkGrid artworks={artworks} />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <p className="text-[32px]">🎨</p>
                <p className="text-[16px] font-semibold" style={{ color: "#2d3748" }}>No artworks yet</p>
                <p className="text-[14px]" style={{ color: "#718096" }}>This artist&apos;s works will appear here once added.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
