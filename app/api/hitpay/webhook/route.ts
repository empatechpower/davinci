import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { execute, query } from "@/lib/db";

function verifyHmac(params: Record<string, string>, salt: string): boolean {
  try {
    const message = Object.entries(params)
      .filter(([k]) => k !== "hmac")
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("");
    const computed = crypto.createHmac("sha256", salt).update(message).digest("hex");
    const received = params.hmac ?? "";
    if (computed.length !== received.length) return false;
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(received));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const text = await req.text();
  const params = Object.fromEntries(new URLSearchParams(text));

  const salt = process.env.HITPAY_WEBHOOK_SALT;
  if (!salt || !params.hmac || !verifyHmac(params, salt)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const { reference_number, status } = params;
  if (!reference_number) return NextResponse.json({ error: "Missing reference" }, { status: 400 });

  const orderStatus =
    status === "completed" ? "completed" :
    status === "failed"    ? "failed"    : "pending";

  await execute(
    "UPDATE orders SET status = $1 WHERE order_number = $2",
    [orderStatus, reference_number]
  );

  if (orderStatus === "completed") {
    const items = await query<{ artwork_id: string | null; quantity: number }>(
      `SELECT oi.artwork_id, oi.quantity
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       WHERE o.order_number = $1`,
      [reference_number]
    );

    const artworkIds = items.map((i) => i.artwork_id).filter(Boolean) as string[];
    if (artworkIds.length) {
      const ph = artworkIds.map((_, i) => `$${i + 1}`).join(",");
      const artworks = await query<{ id: string; artist_id: string | null }>(
        `SELECT id, artist_id FROM artworks WHERE id IN (${ph})`,
        artworkIds
      );

      const artistQtyMap: Record<string, number> = {};
      for (const item of items) {
        if (!item.artwork_id) continue;
        const artistId = artworks.find((a) => a.id === item.artwork_id)?.artist_id;
        if (artistId) artistQtyMap[artistId] = (artistQtyMap[artistId] ?? 0) + item.quantity;
      }

      for (const [artistId, qty] of Object.entries(artistQtyMap)) {
        await execute(
          "UPDATE artists SET sold_count = sold_count + $1 WHERE id = $2",
          [qty, artistId]
        );
      }
    }
  }

  return NextResponse.json({ ok: true });
}
