"use client";

import Link from "next/link";
import { ChevronLeft, Download, Printer, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Order, OrderItem } from "@/lib/db/types";

type OrderWithItems = Order & { order_items: OrderItem[] };

const SHIPPING_FEE = 30;

function fmt(n: number) { return `$${n.toFixed(2)}`; }

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order,   setOrder]   = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/user/orders");
      const orders: OrderWithItems[] = await res.json();
      const found = orders.find((o) => o.order_number === id);
      if (!found) { router.replace("/dashboard"); return; }
      setOrder(found);
      setLoading(false);
    })();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#faf9f7" }}>
        <Loader2 className="w-6 h-6 animate-spin text-dv-accent" />
      </div>
    );
  }

  if (!order) return null;

  const subtotal = order.order_items.reduce((s, i) => s + (i.price ?? 0) * i.quantity, 0);
  const total    = order.total ?? subtotal + SHIPPING_FEE;
  const shipping = total - subtotal;

  return (
    <div className="min-h-screen" style={{ background: "#faf9f7" }}>
      <div className="max-w-[860px] mx-auto px-4 py-10">

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-[14px] text-dv-muted mb-6 hover:text-dv-accent transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 border border-dv-accent text-dv-accent text-[13px] font-medium px-4 h-9 rounded-full hover:bg-dv-accent/5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 border border-dv-accent text-dv-accent text-[13px] font-medium px-4 h-9 rounded-full hover:bg-dv-accent/5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Invoice
          </button>
        </div>

        {/* Invoice document */}
        <div className="bg-white border border-black/8 rounded-[20px] p-10 shadow-sm print:shadow-none print:border-none print:rounded-none">

          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-serif italic text-dv-accent text-[40px] leading-none mb-2">Invoice</h1>
              <p className="text-[14px] font-semibold text-dv-text">DaVinci Project by SHINKAIBI</p>
              <p className="text-[12px] text-dv-muted">
                Helping artists &amp; makers find hope &amp; purpose, one creation at a time
              </p>
            </div>
            <div className="rounded-[14px] px-5 py-3 text-right" style={{ background: "#fff7f0" }}>
              <p className="text-[11px] text-dv-muted mb-1">Invoice Number</p>
              <p className="font-serif italic text-dv-accent text-[18px] font-bold">{order.order_number}</p>
            </div>
          </div>

          <div className="flex gap-12 mb-6 pb-6 border-b border-black/8">
            <div>
              <p className="text-[11px] font-medium text-dv-accent mb-1">Invoice Date</p>
              <p className="text-[14px] font-semibold text-dv-text">{fmtDate(order.created_at)}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-dv-muted mb-1">Payment Method</p>
              <p className="text-[14px] text-dv-text">{order.payment_method ?? "—"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border border-black/8 rounded-[12px] px-5 py-4">
              <p className="text-[11px] font-medium text-dv-muted mb-2">Bill To</p>
              <p className="text-[15px] font-semibold text-dv-text">{order.customer_name ?? "—"}</p>
              <p className="text-[13px] text-dv-muted">{order.customer_email ?? ""}</p>
            </div>
            <div className="border border-black/8 rounded-[12px] px-5 py-4">
              <p className="text-[11px] font-medium text-dv-muted mb-2">Ship To</p>
              <p className="text-[14px] text-dv-text">{order.shipping_address ?? "—"}</p>
            </div>
          </div>

          {/* Line items */}
          <div className="rounded-[12px] overflow-hidden mb-6">
            <div
              className="grid grid-cols-[1fr_160px_80px_90px_90px] px-5 py-3 text-[12px] font-medium text-white"
              style={{ background: "linear-gradient(90deg, #ff8c42 0%, #ffad72 100%)" }}
            >
              <span>Item</span>
              <span>Artist</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Price</span>
              <span className="text-right">Total</span>
            </div>
            {order.order_items.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_160px_80px_90px_90px] px-5 py-4 border-b border-black/6 last:border-none"
              >
                <div>
                  <p className="text-[14px] font-semibold text-dv-text">{item.artwork_title ?? "Artwork"}</p>
                </div>
                <p className="text-[13px] text-dv-accent self-center">{item.artist_name ?? "—"}</p>
                <p className="text-[14px] text-dv-text text-center self-center">{item.quantity}</p>
                <p className="text-[14px] text-dv-text text-right self-center">{fmt(item.price ?? 0)}</p>
                <p className="text-[14px] text-dv-text text-right self-center font-medium">
                  {fmt((item.price ?? 0) * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="flex flex-col items-end gap-2 mb-10">
            <div className="w-full max-w-[320px] flex flex-col gap-2">
              <div className="flex justify-between text-[14px]">
                <span className="text-dv-muted">Subtotal</span>
                <span className="text-dv-text font-medium">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-dv-muted">Shipping</span>
                <span className="text-dv-text font-medium">{fmt(shipping)}</span>
              </div>
              <div className="flex justify-between text-[16px] font-semibold pt-2 border-t border-black/8">
                <span className="text-dv-text">Total Amount</span>
                <span className="font-serif italic text-dv-accent text-[22px] font-bold">{fmt(total)}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-black/8 pt-6 text-center">
            <p className="text-[13px] text-dv-muted">
              Thank you for supporting special-needs artists through DaVinci Project!
            </p>
            <p className="text-[12px] text-dv-muted/70 mt-1">
              Questions? Contact us at contact@davinciproject.org
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
