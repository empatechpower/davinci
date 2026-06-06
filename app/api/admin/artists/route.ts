import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { requireAdmin } from "@/lib/admin";
import { query, queryOne, execute } from "@/lib/db";
import { uploadImage } from "@/lib/cloudinary";
import type { Artist } from "@/lib/db/types";


export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const artists = await query<Artist>("SELECT * FROM artists ORDER BY created_at DESC");
  return NextResponse.json(artists);
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const name      = form.get("name") as string;
  const slug      = form.get("slug") as string;
  const category  = form.get("category") as string | null;
  const tagline   = form.get("tagline") as string | null;
  const short_bio = form.get("short_bio") as string | null;
  const full_bio  = form.get("full_bio") as string | null;
  const medium    = form.get("medium") as string | null;
  const imageFile = form.get("image") as File | null;

  if (!name || !slug) return NextResponse.json({ error: "name and slug required" }, { status: 400 });

  let finalSlug = slug;
  let suffix = 2;
  while (await queryOne<Artist>("SELECT id FROM artists WHERE slug = $1", [finalSlug])) {
    finalSlug = `${slug}-${suffix++}`;
  }

  let image_url: string | null = null;
  if (imageFile?.size) image_url = await uploadImage(imageFile, "davinci/artists");

  const id = crypto.randomUUID();
  await execute(
    "INSERT INTO artists (id, slug, name, category, tagline, short_bio, full_bio, medium, image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
    [id, finalSlug, name, category, tagline, short_bio, full_bio, medium, image_url]
  );
  return NextResponse.json({ id });
}
