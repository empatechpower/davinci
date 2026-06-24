import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, Palette, Heart, Paintbrush } from "lucide-react";
import { query, queryOne } from "@/lib/db";
import type { Artist, Artwork } from "@/lib/db/types";

export default async function HomePage() {
  const [artists, artworks, artistCount, artworkCount] = await Promise.all([
    query<Artist>("SELECT * FROM artists ORDER BY created_at DESC LIMIT 3"),
    query<Artwork>("SELECT * FROM artworks ORDER BY created_at DESC LIMIT 4"),
    queryOne<{ c: number }>("SELECT COUNT(*) AS c FROM artists"),
    queryOne<{ c: number }>("SELECT COUNT(*) AS c FROM artworks"),
  ]);

  const stats = [
    { Icon: Users,   value: String(artistCount?.c  ?? 0), label: "Talented Artists", bg: "#fde8e4", color: "#ff8c42", italic: false },
    { Icon: Palette, value: String(artworkCount?.c ?? 0), label: "Artworks Created",  bg: "#fff0e4", color: "#ff8c42", italic: false },
    { Icon: Heart,   value: "Proceeds",                    label: "Goes to Artists",   bg: "#e0f5f2", color: "#2a9d8f", italic: true  },
  ];

  const artistIds = [...new Set(artworks.map((a) => a.artist_id).filter(Boolean))];
  let artistMap: Record<string, string> = {};
  if (artistIds.length) {
    const ph = artistIds.map((_, i) => `$${i + 1}`).join(",");
    const rows = await query<{ id: string; name: string }>(
      `SELECT id, name FROM artists WHERE id IN (${ph})`,
      artistIds
    );
    artistMap = Object.fromEntries(rows.map((a) => [a.id, a.name]));
  }

  const featuredArtists = artists.filter((a) => a.image_url);
  const galleryItems = artworks.filter((a) => a.image_url);

  return (
    <div className="flex flex-col">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "#f7f2eb" }}>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.08]"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=1400&q=60)",
          }}
        />
        <div className="relative max-w-[1280px] mx-auto px-4 py-20 sm:py-28 flex flex-col items-center text-center gap-7">
          <span className="inline-flex items-center gap-1.5 border border-dv-accent text-dv-accent text-[13px] px-4 py-1.5 rounded-full">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            Empowering Special-Needs Artists
          </span>
          <h1 className="max-w-[700px]">
            <span className="block font-serif italic text-dv-accent text-[38px] sm:text-[48px] leading-[1.15]">
              Helping artists &amp; makers find<br className="hidden sm:block" /> hope &amp; purpose,
            </span>
            <span className="block font-bold text-[#1a1a1a] text-[38px] sm:text-[48px] leading-[1.15] mt-1">
              one creation at a time.
            </span>
          </h1>
          <p className="max-w-[520px] text-[16px] text-dv-muted leading-relaxed">
            Welcome to DaVinci Project, where creativity meets compassion. We empower
            artists with special needs to share their unique talents with the world,
            bringing hope and purpose through every brushstroke and creation.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/artists"
              className="bg-dv-accent text-white text-[15px] font-medium px-7 h-11 rounded-full flex items-center hover:opacity-90 transition-opacity"
            >
              Meet the Artists
            </Link>
            <Link
              href="/shop"
              className="border border-dv-accent text-dv-accent text-[15px] font-medium px-7 h-11 rounded-full flex items-center hover:bg-dv-accent/5 transition-colors"
            >
              Shop Artworks
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS
      ══════════════════════════════════════════ */}
      <section className="bg-white py-12">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map(({ Icon, value, label, bg, color, italic }) => (
              <div
                key={label}
                className="rounded-[16px] px-8 py-8 flex flex-col items-center gap-3 text-center"
                style={{ background: bg }}
              >
                <Icon className="w-10 h-10" style={{ color }} />
                <p
                  className={`text-[32px] font-bold leading-none ${italic ? "font-serif italic" : ""}`}
                  style={{ color }}
                >
                  {value}
                </p>
                <p className="text-[14px] text-dv-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURED ARTISTS
      ══════════════════════════════════════════ */}
      <section className="py-16" style={{ background: "#f7f2eb" }}>
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-serif italic text-dv-accent text-[32px] mb-2">
                Featured Artists
              </h2>
              <p className="text-[15px] text-dv-muted max-w-[480px] mx-auto">
                Meet the incredible artists behind our creations. Each with their own unique
                story and vision.
              </p>
            </div>
            {featuredArtists.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <p className="text-[32px]">🎨</p>
                <p className="text-[16px] font-semibold text-dv-text">Artists coming soon</p>
                <p className="text-[14px] text-dv-muted max-w-[320px]">We&apos;re onboarding incredible artists. Check back soon to meet them.</p>
              </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {featuredArtists.map((artist) => (
                <div key={artist.id} className="flex flex-col bg-white rounded-t-[8px] rounded-b-[16px] overflow-hidden">
                  <div className="p-[1px]">
                    <Link
                      href={`/artists/${artist.slug}`}
                      className="block relative overflow-hidden rounded-[6px]"
                      style={{ aspectRatio: "4/3", background: "#f5f2ef" }}
                    >
                      <Image
                        src={artist.image_url!}
                        alt={artist.name}
                        fill
                        className="object-cover object-top hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  </div>
                  <div className="flex flex-col gap-3 px-4 pt-3 pb-4">
                    <div>
                      <p className="text-[16px] font-bold text-dv-text">{artist.name}</p>
                      <p className="text-[13px] text-dv-accent italic">{artist.medium || artist.category}</p>
                    </div>
                    {(artist.full_bio || artist.short_bio || artist.tagline) && (
                      <div className="border-l-[3px] border-dv-accent pl-3">
                        <p className="text-[13px] text-dv-muted italic line-clamp-2">
                          {artist.full_bio || artist.short_bio || artist.tagline}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            )}
            <div className="flex justify-center">
              <Link
                href="/artists"
                className="border border-dv-accent text-dv-accent text-[15px] px-7 h-10 rounded-full flex items-center gap-2 hover:bg-dv-accent/5 transition-colors"
              >
                View All Artists <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

      {/* ══════════════════════════════════════════
          GALLERY HIGHLIGHTS
      ══════════════════════════════════════════ */}
      <section className="bg-white py-16 border-t border-black/5">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-serif italic text-dv-accent text-[32px] mb-2">
                Gallery Highlights
              </h2>
              <p className="text-[15px] text-dv-muted max-w-[480px] mx-auto">
                Explore beautiful artworks ranging from metal sculptures to original paintings.
              </p>
            </div>
            {galleryItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <p className="text-[32px]">🖼️</p>
                <p className="text-[16px] font-semibold text-dv-text">Artworks coming soon</p>
                <p className="text-[14px] text-dv-muted max-w-[320px]">Our gallery is being curated. Beautiful pieces will be available here shortly.</p>
              </div>
            ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {galleryItems.map((artwork) => (
                <Link key={artwork.id} href={`/shop/${artwork.slug}`} className="group flex flex-col gap-2.5">
                  <div className="relative overflow-hidden rounded-[12px] bg-dv-bg" style={{ aspectRatio: "1/1" }}>
                    <Image
                      src={artwork.image_url!}
                      alt={artwork.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {artwork.dimensions && (
                      <span className="absolute top-2.5 right-2.5 bg-dv-accent/90 text-white text-[11px] font-medium px-2.5 py-1 rounded-full shadow-sm">
                        {artwork.dimensions}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-[11px] text-dv-muted uppercase tracking-wider mb-0.5">
                      {artwork.category}
                    </p>
                    <p className="text-[14px] font-bold text-dv-text leading-snug">{artwork.title}</p>
                    {artwork.artist_id && artistMap[artwork.artist_id] && (
                      <p className="text-[13px] text-dv-muted">by {artistMap[artwork.artist_id]}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            )}
            <div className="flex justify-center mt-10">
              <Link
                href="/shop"
                className="bg-dv-accent text-white text-[15px] font-medium px-7 h-10 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                Browse All Artworks <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

      {/* ══════════════════════════════════════════
          EVERY PURCHASE MAKES A DIFFERENCE
      ══════════════════════════════════════════ */}
      <section style={{ background: "#f7f2eb" }} className="py-20">
        <div className="max-w-[600px] mx-auto px-4 flex flex-col items-center text-center gap-6">
          <div className="text-dv-accent">
            <Paintbrush className="w-12 h-12" />
          </div>
          <h2 className="font-serif italic text-dv-accent text-[36px] sm:text-[40px] leading-tight">
            Every Purchase Makes a Difference
          </h2>
          <p className="text-[16px] text-dv-muted leading-relaxed">
            When you buy art from DaVinci Project, 60% of the profit goes directly to
            the artist. You&apos;re not just buying art — you&apos;re supporting dreams,
            fostering independence, and spreading hope.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/artists"
              className="bg-dv-accent text-white text-[15px] font-medium px-7 h-11 rounded-full flex items-center hover:opacity-90 transition-opacity"
            >
              Support Our Artists
            </Link>
            <Link
              href="/about"
              className="border border-dv-accent text-dv-accent text-[15px] font-medium px-7 h-11 rounded-full flex items-center hover:bg-dv-accent/5 transition-colors"
            >
              Learn Our Story
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
