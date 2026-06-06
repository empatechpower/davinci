export const maxDuration = 60;
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { queryOne, execute } from "@/lib/db";
import { uploadImage, uploadVideo } from "@/lib/cloudinary";
import type { Artwork } from "@/lib/db/types";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await queryOne<Artwork>("SELECT id FROM artworks WHERE id = $1", [id]);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const form          = await req.formData();
  const title         = form.get("title")        as string | null;
  const slug          = form.get("slug")         as string | null;
  const artist_id     = form.get("artist_id")    as string | null;
  const category      = form.get("category")     as string | null;
  const product_type  = form.get("product_type") as string | null;
  const sku           = form.get("sku")          as string | null;
  const price         = form.get("price")        ? Number(form.get("price")) : null;
  const artist_receives = form.get("artist_receives") ? Number(form.get("artist_receives")) : null;
  const dimensions    = form.get("dimensions")   as string | null;
  const description   = form.get("description")  as string | null;
  const remarks       = form.get("remarks")      as string | null;
  const photoFiles = form.getAll("photos") as File[];
  const videoFiles = form.getAll("videos") as File[];

  const newPhotoUrls: string[] = [];
  for (const file of photoFiles) {
    if (file?.size) newPhotoUrls.push(await uploadImage(file, "davinci/artworks"));
  }

  const newVideoUrls: string[] = [];
  for (const file of videoFiles) {
    if (file?.size) newVideoUrls.push(await uploadVideo(file, "davinci/artworks/videos"));
  }

  const photosSql    = newPhotoUrls.length ? JSON.stringify(newPhotoUrls) : null;
  const image_urlSql = newPhotoUrls[0] ?? null;
  const videosSql    = newVideoUrls.length ? JSON.stringify(newVideoUrls) : null;

  await execute(
    `UPDATE artworks SET
      title           = COALESCE($1,  title),
      slug            = COALESCE($2,  slug),
      artist_id       = COALESCE($3,  artist_id),
      category        = COALESCE($4,  category),
      product_type    = COALESCE($5,  product_type),
      sku             = COALESCE($6,  sku),
      price           = COALESCE($7,  price),
      artist_receives = COALESCE($8,  artist_receives),
      dimensions      = COALESCE($9,  dimensions),
      description     = COALESCE($10, description),
      remarks         = COALESCE($11, remarks),
      image_url       = COALESCE($12, image_url),
      photos          = COALESCE($13, photos),
      videos          = COALESCE($14, videos)
    WHERE id = $15`,
    [title, slug, artist_id, category, product_type, sku, price, artist_receives,
     dimensions, description, remarks, image_urlSql, photosSql, videosSql, id]
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await execute("DELETE FROM artworks WHERE id = $1", [id]);
  return NextResponse.json({ ok: true });
}
