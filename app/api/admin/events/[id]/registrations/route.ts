import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import type { EventRegistration } from "@/lib/db/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const regs = await query<EventRegistration>(
    "SELECT * FROM event_registrations WHERE event_id = $1 ORDER BY registered_at DESC",
    [id]
  );
  return NextResponse.json(regs);
}
