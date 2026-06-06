import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import type { Order, OrderItem } from "@/lib/db/types";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await query<Order>(
    "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
    [session.user.id]
  );

  const result: (Order & { order_items: OrderItem[] })[] = [];
  for (const order of orders) {
    const items = await query<OrderItem>(
      "SELECT * FROM order_items WHERE order_id = $1",
      [order.id]
    );
    result.push({ ...order, order_items: items });
  }

  return NextResponse.json(result);
}
