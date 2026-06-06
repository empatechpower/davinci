import ArtistCard from "@/components/ui/ArtistCard";
import { query } from "@/lib/db";
import type { Artist, Artwork } from "@/lib/db/types";

export default async function ArtistsPage() {
  const [artists, artworks] = await Promise.all([
    query<Artist>("SELECT * FROM artists ORDER BY created_at DESC"),
    query<Pick<Artwork, "artist_id">>("SELECT artist_id FROM artworks"),
  ]);

  const availableMap = artworks.reduce<Record<string, number>>((acc, art) => {
    if (art.artist_id) acc[art.artist_id] = (acc[art.artist_id] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 pt-14 pb-20">

        <div className="text-center mb-14">
          <h1 className="font-serif italic text-dv-accent text-[48px] sm:text-[56px] leading-tight mb-4">
            Meet Our Artists
          </h1>
          <p className="text-[16px] text-dv-muted max-w-[520px] mx-auto leading-relaxed">
            Each artist brings their unique vision and story. Click on any artist to explore their gallery.
          </p>
        </div>

        {artists.length === 0 ? (
          <p className="text-center py-20 text-[16px] text-dv-muted">
            No artists yet. Check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {artists.map((artist) => (
              <ArtistCard
                key={artist.id}
                id={artist.slug}
                name={artist.name}
                category={artist.category ?? ""}
                shortBio={artist.short_bio ?? ""}
                soldCount={artist.sold_count}
                availableCount={availableMap[artist.id] ?? 0}
                image={artist.image_url ?? undefined}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
