import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const reg = await queryOne<{ user_id: string | null }>(
    "SELECT user_id FROM event_registrations WHERE id = $1",
    [id]
  );

  if (!reg) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (reg.user_id !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await execute("DELETE FROM event_registrations WHERE id = $1", [id]);
  return NextResponse.json({ ok: true });
}
