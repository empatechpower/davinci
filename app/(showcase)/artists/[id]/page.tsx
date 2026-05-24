import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Award, Heart } from "lucide-react";
import { ARTISTS, ARTWORKS } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import ArtistArtworkGrid from "./ArtistArtworkGrid";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ArtistPage({ params }: Props) {
  const { id } = await params;
  const artist = ARTISTS.find((a) => a.id === id);
  if (!artist) notFound();

  const artworks = ARTWORKS.filter((a) => a.artistId === id);

  return (
    <div style={{ background: "#faf9f7" }} className="min-h-screen py-8 px-4">
      <div className="max-w-[1280px] mx-auto">
        {/* Back button */}
        <Link
          href="/artists"
          className="inline-flex items-center gap-1 text-[14px] text-dv-text mb-6 hover:text-dv-accent transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to All Artists
        </Link>

        {/* Hero card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-5">
          <div className="flex flex-col md:flex-row gap-7">
            {/* Portrait with award badge */}
            <div className="relative flex-shrink-0 w-full md:w-[300px]">
              <div className="rounded-xl overflow-hidden" style={{ aspectRatio: "4/5" }}>
                {artist.image ? (
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    width={300}
                    height={375}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-dv-muted text-7xl font-light">
                    {artist.name[0]}
                  </div>
                )}
              </div>
              <div className="absolute bottom-3 left-3 w-10 h-10 bg-dv-accent rounded-full flex items-center justify-center shadow-md">
                <Award className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              {/* Category badge */}
              <span className="inline-flex bg-dv-accent text-white text-[12px] font-medium px-3 py-1 rounded-full w-fit">
                {artist.category}
              </span>

              {/* Name */}
              <h1 className="text-[34px] leading-tight text-dv-accent font-serif italic">
                {artist.name}
              </h1>

              {/* Bio */}
              <p className="text-[14px] text-dv-text leading-relaxed">
                {artist.fullBio || artist.shortBio}
              </p>

              {/* Tagline */}
              {artist.tagline && (
                <div className="flex items-center gap-2 border-l-[3px] border-dv-accent pl-3">
                  <Heart className="w-4 h-4 text-dv-accent flex-shrink-0" fill="#ff8c42" />
                  <span className="text-[13px] text-dv-text italic">{artist.tagline}</span>
                </div>
              )}

              {/* Stats */}
              <div className="flex gap-3 mt-1">
                <div
                  className="rounded-xl px-5 py-3 text-center"
                  style={{ background: "#fdf3e7" }}
                >
                  <div className="text-[26px] font-light text-dv-text leading-none mb-1">
                    {artist.soldCount}
                  </div>
                  <div className="text-[12px] text-dv-muted">Artworks Sold</div>
                </div>
                <div
                  className="rounded-xl px-5 py-3 text-center"
                  style={{ background: "#fdf3e7" }}
                >
                  <div className="text-[26px] font-light text-dv-accent leading-none mb-1">
                    {artworks.length}
                  </div>
                  <div className="text-[12px] text-dv-muted">Available Works</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Artworks card */}
        {artworks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-[28px] text-dv-accent font-serif italic mb-5">Artworks</h2>
            <ArtistArtworkGrid artworks={artworks} />
          </div>
        )}
      </div>
    </div>
  );
}
