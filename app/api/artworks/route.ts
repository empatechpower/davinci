import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { Artist, Artwork } from "@/lib/db/types";

export async function GET() {
  try {
  const artworks = await query<Artwork>(
    "SELECT * FROM artworks ORDER BY created_at DESC"
  );
  const artistIds = [...new Set(artworks.map((a) => a.artist_id).filter(Boolean))];
  let artistMap: Record<string, Artist> = {};
  if (artistIds.length) {
    const placeholders = artistIds.map((_, i) => `$${i + 1}`).join(",");
    const artists = await query<Artist>(
      `SELECT * FROM artists WHERE id IN (${placeholders})`,
      artistIds
    );
    artistMap = Object.fromEntries(artists.map((a) => [a.id, a]));
  }
  return NextResponse.json({ artworks, artistMap });
  } catch (err) {
    console.error("[/api/artworks] DB error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
