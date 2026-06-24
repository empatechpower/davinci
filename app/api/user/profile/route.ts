import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { queryOne } from "@/lib/db";
import type { User } from "@/lib/db/types";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await queryOne<Pick<User, "full_name" | "phone" | "address">>(
    "SELECT full_name, phone, address FROM users WHERE id = $1",
    [session.user.id]
  );

  return NextResponse.json(user ?? {});
}
