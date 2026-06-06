import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import type { Event } from "@/lib/db/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const event = await queryOne<Event>(
    "SELECT * FROM events WHERE slug = $1",
    [slug]
  );
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(event);
}
