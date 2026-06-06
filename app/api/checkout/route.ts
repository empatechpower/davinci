import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@/lib/auth";
import { query, queryOne, execute } from "@/lib/db";
import type { Artwork, Artist } from "@/lib/db/types";

const HITPAY_API = "https://api.sandbox.hit-pay.com/v1/payment-requests";
const CURRENCY = "SGD";
const SHIPPING_FEE = 30;

interface CheckoutItem { artworkId: string; quantity: number }
interface CustomerInfo { name: string; email: string; phone?: string; address: string }

export async function POST(req: NextRequest) {
  try {
    const { items, customer }: { items: CheckoutItem[]; customer: CustomerInfo } =
      await req.json();

    if (!items?.length || !customer?.name || !customer?.email || !customer?.address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Server-side price validation
    const placeholders = items.map((_, i) => `$${i + 1}`).join(",");
    const artworks = await query<Artwork>(
      `SELECT * FROM artworks WHERE id IN (${placeholders})`,
      items.map((i) => i.artworkId)
    );
    if (!artworks.length) return NextResponse.json({ error: "Invalid artworks" }, { status: 400 });

    const artistIds = [...new Set(artworks.map((a) => a.artist_id).filter(Boolean))];
    let artistMap: Record<string, string> = {};
    if (artistIds.length) {
      const ap = artistIds.map((_, i) => `$${i + 1}`).join(",");
      const artists = await query<Artist>(`SELECT id, name FROM artists WHERE id IN (${ap})`, artistIds);
      artistMap = Object.fromEntries(artists.map((a) => [a.id, a.name]));
    }
    const artworkMap = Object.fromEntries(artworks.map((a) => [a.id, a]));

    const subtotal = items.reduce(
      (s, i) => s + (artworkMap[i.artworkId]?.price ?? 0) * i.quantity,
      0
    );
    const total = subtotal + SHIPPING_FEE;

    const session = await auth();
    const userId = session?.user?.id ?? null;
    const orderNumber = `DV-${crypto.randomUUID().split("-")[0].toUpperCase()}`;
    const orderId = crypto.randomUUID();

    await execute(
      `INSERT INTO orders (id, order_number, user_id, customer_name, customer_email,
        total, status, shipping_address, payment_method)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [orderId, orderNumber, userId, customer.name, customer.email,
       total, "pending", customer.address, "HitPay"]
    );

    for (const item of items) {
      const aw = artworkMap[item.artworkId];
      await execute(
        `INSERT INTO order_items (id, order_id, artwork_id, artwork_title, artist_name, quantity, price)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [crypto.randomUUID(), orderId, item.artworkId,
         aw?.title ?? "", artistMap[aw?.artist_id ?? ""] ?? "",
         item.quantity, aw?.price ?? 0]
      );
    }

    const apiKey = process.env.HITPAY_API_KEY;
    if (!apiKey) {
      await execute("DELETE FROM orders WHERE id = $1", [orderId]);
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
    }

    const baseUrl = process.env.NODE_ENV === "production"
      ? (process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000")
      : "http://localhost:3000";
    const paymentParams = new URLSearchParams({
      amount: total.toFixed(2),
      currency: CURRENCY,
      email: customer.email,
      name: customer.name,
      reference_number: orderNumber,
      redirect_url: `${baseUrl}/checkout/success?order=${orderNumber}`,
      purpose: "DaVinci Project – Artwork Purchase",
    });
    if (process.env.NODE_ENV === "production") {
      paymentParams.set("webhook", `${baseUrl}/api/hitpay/webhook`);
    }
    if (customer.phone) paymentParams.set("phone", customer.phone);

    const hitpayRes = await fetch(HITPAY_API, {
      method: "POST",
      headers: {
        "X-BUSINESS-API-KEY": apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: paymentParams.toString(),
    });

    if (!hitpayRes.ok) {
      console.error("HitPay error:", hitpayRes.status, await hitpayRes.text());
      await execute("DELETE FROM orders WHERE id = $1", [orderId]);
      return NextResponse.json({ error: "Payment gateway error" }, { status: 502 });
    }

    const hitpayData = await hitpayRes.json();
    return NextResponse.json({ url: hitpayData.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
