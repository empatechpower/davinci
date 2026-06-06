import { NextRequest, NextResponse } from "next/server";
import { queryOne, query } from "@/lib/db";
import type { Artist, Artwork } from "@/lib/db/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const artist = await queryOne<Artist>(
    "SELECT * FROM artists WHERE slug = $1",
    [slug]
  );
  if (!artist) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const artworks = await query<Artwork>(
    "SELECT * FROM artworks WHERE artist_id = $1 ORDER BY created_at DESC",
    [artist.id]
  );
  return NextResponse.json({ artist, artworks });
}
