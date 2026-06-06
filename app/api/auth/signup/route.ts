import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { queryOne, execute } from "@/lib/db";
import type { User } from "@/lib/db/types";

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const existing = await queryOne<User>("SELECT id FROM users WHERE email = $1", [email]);
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const password_hash = await bcrypt.hash(password, 12);
  const id = crypto.randomUUID();

  await execute(
    "INSERT INTO users (id, email, password_hash, full_name) VALUES ($1, $2, $3, $4)",
    [id, email, password_hash, name ?? null]
  );

  return NextResponse.json({ ok: true });
}
