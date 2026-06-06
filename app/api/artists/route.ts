import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { Artist } from "@/lib/db/types";

export async function GET() {
  const artists = await query<Artist>(
    "SELECT * FROM artists ORDER BY created_at DESC"
  );
  return NextResponse.json(artists);
}
