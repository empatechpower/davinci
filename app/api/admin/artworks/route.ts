export const maxDuration = 60;
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { requireAdmin } from "@/lib/admin";
import { query, queryOne, execute } from "@/lib/db";
import { uploadImage, uploadVideo } from "@/lib/cloudinary";
import type { Artwork } from "@/lib/db/types";

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const artworks = await query<Artwork>("SELECT * FROM artworks ORDER BY created_at DESC");
  return NextResponse.json(artworks);
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form          = await req.formData();
  const title         = form.get("title")        as string;
  const slug          = form.get("slug")         as string;
  const artist_id     = form.get("artist_id")    as string | null;
  const category      = form.get("category")     as string | null;
  const product_type  = form.get("product_type") as string | null;
  const sku           = form.get("sku")          as string | null;
  const price         = form.get("price")        ? Number(form.get("price")) : null;
  const artist_receives = form.get("artist_receives") ? Number(form.get("artist_receives")) : null;
  const dimensions    = form.get("dimensions")   as string | null;
  const description   = form.get("description")  as string | null;
  const remarks       = form.get("remarks")      as string | null;
  const videoFiles    = form.getAll("videos") as File[];

  if (!title || !slug) return NextResponse.json({ error: "title and slug required" }, { status: 400 });

  let finalSlug = slug;
  let suffix = 2;
  while (await queryOne<Artwork>("SELECT id FROM artworks WHERE slug = $1", [finalSlug])) {
    finalSlug = `${slug}-${suffix++}`;
  }

  const photoFiles = form.getAll("photos") as File[];
  const photoUrls: string[] = [];
  for (const file of photoFiles) {
    if (file?.size) photoUrls.push(await uploadImage(file, "davinci/artworks"));
  }

  const videoUrls: string[] = [];
  for (const file of videoFiles) {
    if (file?.size) videoUrls.push(await uploadVideo(file, "davinci/artworks/videos"));
  }

  const image_url = photoUrls[0] ?? null;
  const photos    = photoUrls.length ? photoUrls : null;
  const videos    = videoUrls.length ? videoUrls : null;

  const id = crypto.randomUUID();
  await execute(
    `INSERT INTO artworks
     (id, slug, artist_id, title, category, product_type, sku, price, artist_receives,
      dimensions, description, remarks, image_url, photos, videos)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
    [id, finalSlug, artist_id || null, title, category, product_type, sku, price, artist_receives,
     dimensions, description, remarks, image_url,
     photos ? JSON.stringify(photos) : null,
     videos ? JSON.stringify(videos) : null]
  );
  return NextResponse.json({ id });
}
