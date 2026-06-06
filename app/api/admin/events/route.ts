import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { requireAdmin } from "@/lib/admin";
import { query, queryOne, execute } from "@/lib/db";
import { uploadImage } from "@/lib/cloudinary";
import type { Event } from "@/lib/db/types";


export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const events = await query<Event>("SELECT * FROM events ORDER BY date DESC");
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const title              = form.get("title") as string;
  const slug               = form.get("slug") as string;
  const date               = form.get("date") as string | null;
  const time               = form.get("time") as string | null;
  const location           = form.get("location") as string | null;
  const category           = form.get("category") as string | null;
  const status             = (form.get("status") as string) ?? "upcoming";
  const featured           = form.get("featured") === "true";
  const expected_attendees = form.get("expected_attendees") ? Number(form.get("expected_attendees")) : null;
  const description        = form.get("description") as string | null;
  const long_description   = form.get("long_description") as string | null;
  const admission          = form.get("admission") as string | null;
  const imageFile          = form.get("image") as File | null;

  if (!title || !slug) return NextResponse.json({ error: "title and slug required" }, { status: 400 });

  const existing = await queryOne<Event>("SELECT id FROM events WHERE slug = $1", [slug]);
  if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

  let image_url: string | null = null;
  if (imageFile?.size) image_url = await uploadImage(imageFile, "davinci/events");

  const id = crypto.randomUUID();
  await execute(
    `INSERT INTO events
     (id, slug, title, date, time, location, category, status, featured,
      expected_attendees, description, long_description, admission, image_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
    [id, slug, title, date || null, time || null, location, category,
     status, featured, expected_attendees, description, long_description, admission, image_url]
  );
  return NextResponse.json({ id });
}
