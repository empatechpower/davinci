import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@/lib/auth";
import { execute } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  const body = await req.json();

  await execute(
    `INSERT INTO event_registrations
     (id, event_id, user_id, name, email, phone, attendee_count, dietary_restrictions, special_requirements)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [
      crypto.randomUUID(),
      body.event_id,
      session?.user?.id ?? null,
      body.name ?? null,
      body.email ?? null,
      body.phone ?? null,
      body.attendee_count ?? 1,
      body.dietary_restrictions ?? null,
      body.special_requirements ?? null,
    ]
  );

  return NextResponse.json({ ok: true });
}
