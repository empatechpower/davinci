import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import type { Artist, Artwork } from "@/lib/db/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const artwork = await queryOne<Artwork>(
    "SELECT * FROM artworks WHERE slug = $1",
    [slug]
  );
  if (!artwork) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const artist = artwork.artist_id
    ? await queryOne<Artist>("SELECT * FROM artists WHERE id = $1", [artwork.artist_id])
    : null;

  return NextResponse.json({ artwork, artist });
}
