"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Minus, Plus, Trash2, ShoppingBag, Lock } from "lucide-react";
import { ARTWORKS, ARTISTS } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-context";

const SHIPPING_FEE = 30;

function parsePrice(p: string) {
  return parseFloat(p.replace(/[$,]/g, ""));
}

function formatPrice(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function CartPage() {
  const { items, updateQty, removeItem } = useCart();

  const artworkMap = Object.fromEntries(ARTWORKS.map((a) => [a.id, a]));
  const artistMap = Object.fromEntries(ARTISTS.map((a) => [a.id, a]));

  const subtotal = items.reduce((sum, item) => {
    const artwork = artworkMap[item.artworkId];
    return sum + parsePrice(artwork?.price ?? "0") * item.quantity;
  }, 0);

  const total = items.length > 0 ? subtotal + SHIPPING_FEE : 0;
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  /* ── EMPTY STATE ── */
  if (items.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 py-24 text-center"
        style={{ background: "#faf9f7" }}
      >
        <div className="flex flex-col items-center gap-5">
          <ShoppingBag className="w-20 h-20 text-black/20" strokeWidth={1.5} />
          <h1 className="font-serif italic text-dv-accent text-[34px]">
            Your Cart is Empty
          </h1>
          <p className="text-[15px] text-dv-muted max-w-[380px] leading-relaxed">
            Looks like you haven&apos;t added any artworks yet. Explore our shop
            to find beautiful pieces created by our talented artists.
          </p>
          <Link
            href="/shop"
            className="bg-dv-accent text-white text-[15px] font-medium px-8 h-11 rounded-full flex items-center hover:opacity-90 transition-opacity"
          >
            Browse Artworks
          </Link>
        </div>
      </div>
    );
  }

  /* ── FILLED STATE ── */
  return (
    <div className="min-h-screen" style={{ background: "#faf9f7" }}>
      <div className="max-w-[1280px] mx-auto px-4 py-10">

        {/* Back link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-[14px] text-dv-muted mb-6 hover:text-dv-accent transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        {/* Heading */}
        <h1 className="font-serif italic text-dv-accent text-[38px] leading-tight mb-1">
          Shopping Cart
        </h1>
        <p className="text-[14px] text-dv-muted mb-8">
          {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
        </p>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* Left: item list */}
          <div className="flex flex-col gap-4">
            {items.map((item) => {
              const artwork = artworkMap[item.artworkId];
              const artist = artwork ? artistMap[artwork.artistId] : null;
              if (!artwork) return null;
              const lineTotal = parsePrice(artwork.price) * item.quantity;

              return (
                <div
                  key={item.artworkId}
                  className="bg-white border border-black/8 rounded-[16px] p-5 flex items-center gap-5"
                >
                  {/* Thumbnail */}
                  <div className="relative w-[80px] h-[80px] rounded-[10px] overflow-hidden bg-dv-bg shrink-0">
                    {artwork.image && (
                      <Image
                        src={artwork.image}
                        alt={artwork.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* Info + controls */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-dv-text leading-snug">
                      {artwork.title}
                    </p>
                    <p className="text-[13px] text-dv-muted">by {artist?.name ?? "Unknown"}</p>
                    <p className="text-[12px] text-dv-muted/70 mb-3">{artwork.category}</p>

                    {/* Quantity stepper */}
                    <div className="inline-flex items-center gap-3 border border-black/12 rounded-full px-3 h-9">
                      <button
                        onClick={() => updateQty(item.artworkId, -1)}
                        className="text-dv-muted hover:text-dv-accent transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[14px] font-medium text-dv-text w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.artworkId, 1)}
                        className="text-dv-muted hover:text-dv-accent transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Price + delete */}
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <button
                      onClick={() => removeItem(item.artworkId)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <p className="text-[16px] font-semibold text-dv-accent">
                      {formatPrice(lineTotal)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Order summary */}
          <div className="bg-white border border-black/8 rounded-[20px] p-6 sticky top-20">
            <h2 className="font-serif italic text-dv-accent text-[24px] mb-6">
              Order Summary
            </h2>

            <div className="flex flex-col gap-3 mb-5">
              <div className="flex items-center justify-between text-[14px]">
                <span className="text-dv-muted">Subtotal</span>
                <span className="text-dv-text font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[14px]">
                <span className="text-dv-muted">Shipping Fee</span>
                <span className="text-dv-text font-medium">{formatPrice(SHIPPING_FEE)}</span>
              </div>
            </div>

            <div className="border-t border-black/8 pt-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-semibold text-dv-text">Total</span>
                <span className="text-[22px] font-bold text-dv-accent">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="border border-black/10 rounded-full px-4 py-2.5 mb-5 text-center">
              <p className="text-[12px] text-dv-muted">
                Your proceeds go directly towards our artists
              </p>
            </div>

            <div className="flex flex-col gap-3 mb-5">
              <button className="w-full h-12 rounded-full bg-dv-accent text-white text-[15px] font-medium hover:opacity-90 transition-opacity">
                Proceed to Checkout
              </button>
              <Link
                href="/shop"
                className="w-full h-12 rounded-full border border-dv-accent text-dv-accent text-[15px] font-medium flex items-center justify-center hover:bg-dv-accent/5 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-dv-muted">
              <Lock className="w-3.5 h-3.5" />
              <span className="text-[13px]">Secure checkout</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
