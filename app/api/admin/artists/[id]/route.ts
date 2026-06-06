import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { queryOne, execute } from "@/lib/db";
import { uploadImage } from "@/lib/cloudinary";
import type { Artist } from "@/lib/db/types";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await queryOne<Artist>("SELECT id FROM artists WHERE id = $1", [id]);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const form = await req.formData();
  const name       = form.get("name")       as string | null;
  const slug       = form.get("slug")       as string | null;
  const category   = form.get("category")   as string | null;
  const tagline    = form.get("tagline")    as string | null;
  const short_bio  = form.get("short_bio")  as string | null;
  const full_bio   = form.get("full_bio")   as string | null;
  const medium     = form.get("medium")     as string | null;
  const imageFile  = form.get("image")      as File | null;

  let image_url: string | null = null;
  if (imageFile?.size) image_url = await uploadImage(imageFile, "davinci/artists");

  await execute(
    `UPDATE artists SET
      name       = COALESCE($1, name),
      slug       = COALESCE($2, slug),
      category   = COALESCE($3, category),
      tagline    = COALESCE($4, tagline),
      short_bio  = COALESCE($5, short_bio),
      full_bio   = COALESCE($6, full_bio),
      medium     = COALESCE($7, medium),
      image_url  = COALESCE($8, image_url)
    WHERE id = $9`,
    [name, slug, category, tagline, short_bio, full_bio, medium, image_url, id]
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await execute("DELETE FROM artists WHERE id = $1", [id]);
  return NextResponse.json({ ok: true });
}
