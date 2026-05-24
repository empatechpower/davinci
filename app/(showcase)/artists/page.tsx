import ArtistCard from "@/components/ui/ArtistCard";
import { ARTISTS, ARTWORKS } from "@/lib/mock-data";

export default function ArtistsPage() {
  /* compute available artwork count per artist */
  const availableMap = ARTWORKS.reduce<Record<string, number>>((acc, art) => {
    acc[art.artistId] = (acc[art.artistId] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 pt-14 pb-20">

        {/* Page heading */}
        <div className="text-center mb-14">
          <h1 className="font-serif italic text-dv-accent text-[48px] sm:text-[56px] leading-tight mb-4">
            Meet Our Artists
          </h1>
          <p className="text-[16px] text-dv-muted max-w-[520px] mx-auto leading-relaxed">
            Each artist brings their unique vision and story. Click on any artist to explore
            their gallery.
          </p>
        </div>

        {/* Artist grid — 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {ARTISTS.map((artist) => (
            <ArtistCard
              key={artist.id}
              id={artist.id}
              name={artist.name}
              category={artist.category}
              shortBio={artist.shortBio}
              soldCount={artist.soldCount}
              availableCount={availableMap[artist.id] ?? 0}
              image={artist.image}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
