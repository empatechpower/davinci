import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { Event } from "@/lib/db/types";

export async function GET() {
  const events = await query<Event>(
    "SELECT * FROM events ORDER BY date DESC"
  );
  return NextResponse.json(events);
}
