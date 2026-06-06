"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Lock, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { Artwork, Artist } from "@/lib/db/types";

const SHIPPING_FEE = 30;

function fmt(n: number) {
  return `$${n.toFixed(2)}`;
}

type CartArtwork = Artwork & { artist?: Pick<Artist, "name"> };

function Field({
  label, required, children,
}: {
  label: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-dv-muted mb-1.5">
        {label}{required && <span className="text-dv-accent ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border border-black/10 rounded-[10px] px-4 py-3 text-[14px] text-dv-text placeholder:text-gray-400 outline-none focus:border-dv-accent/50 transition-colors bg-white";

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();
  const [artworks, setArtworks] = useState<Record<string, CartArtwork>>({});
  const [loadingItems, setLoadingItems] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (items.length === 0) router.replace("/shop");
  }, [items, router]);

  useEffect(() => {
    if (!items.length) return;
    const ids = items.map((i) => i.artworkId);
    (async () => {
      setLoadingItems(true);
      const res = await fetch("/api/artworks");
      const { artworks: ws, artistMap: am } = await res.json();
      const filtered = (ws as Artwork[]).filter((w) => ids.includes(w.id));
      if (filtered.length) {
        const map: Record<string, CartArtwork> = {};
        for (const w of filtered)
          map[w.id] = { ...w, artist: w.artist_id ? am[w.artist_id] : undefined } as CartArtwork;
        setArtworks(map);
      }
      setLoadingItems(false);
    })();
  }, [items]);

  const subtotal = items.reduce((s, i) => s + (artworks[i.artworkId]?.price ?? 0) * i.quantity, 0);
  const total = subtotal + SHIPPING_FEE;

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.address.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setProcessing(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ artworkId: i.artworkId, quantity: i.quantity })),
          customer: form,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Checkout failed. Please try again.");
        setProcessing(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setProcessing(false);
    }
  }

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen" style={{ background: "#faf9f7" }}>
      <div className="max-w-[1200px] mx-auto px-4 py-10">

        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-[14px] text-dv-muted mb-6 hover:text-dv-accent transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <h1 className="font-serif italic text-dv-accent text-[38px] leading-tight mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

            {/* Customer info */}
            <div className="bg-white border border-black/8 rounded-[20px] p-8">
              <h2 className="text-[18px] font-semibold text-dv-text mb-6">
                Customer Information
              </h2>

              <div className="flex flex-col gap-5">
                <Field label="Full Name" required>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={(e) => set("name")(e.target.value)}
                    className={inputCls}
                  />
                </Field>

                <Field label="Email Address" required>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={(e) => set("email")(e.target.value)}
                    className={inputCls}
                  />
                </Field>

                <Field label="Phone (optional)">
                  <input
                    type="tel"
                    placeholder="+65 9000 0000"
                    value={form.phone}
                    onChange={(e) => set("phone")(e.target.value)}
                    className={inputCls}
                  />
                </Field>

                <Field label="Shipping Address" required>
                  <textarea
                    required
                    rows={3}
                    placeholder="Street, City, Country, Postal Code"
                    value={form.address}
                    onChange={(e) => set("address")(e.target.value)}
                    className={inputCls + " resize-none"}
                  />
                </Field>
              </div>

              {error && (
                <p className="mt-5 text-[13px] text-red-500 font-medium">{error}</p>
              )}
            </div>

            {/* Order summary + pay button */}
            <div className="bg-white border border-black/8 rounded-[20px] p-6 sticky top-20">
              <h2 className="font-serif italic text-dv-accent text-[22px] mb-5">
                Order Summary
              </h2>

              {loadingItems ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-dv-accent" />
                </div>
              ) : (
                <div className="flex flex-col gap-3 mb-4">
                  {items.map((item) => {
                    const aw = artworks[item.artworkId];
                    if (!aw) return null;
                    return (
                      <div key={item.artworkId} className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-[8px] overflow-hidden bg-dv-bg shrink-0">
                          {aw.image_url && (
                            <Image src={aw.image_url} alt={aw.title} fill className="object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-dv-text truncate">{aw.title}</p>
                          <p className="text-[11px] text-dv-muted">
                            {aw.artist?.name ?? "Unknown"} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-[13px] font-semibold text-dv-text shrink-0">
                          {fmt((aw.price ?? 0) * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="border-t border-black/8 pt-4 flex flex-col gap-2 mb-5">
                <div className="flex justify-between text-[13px]">
                  <span className="text-dv-muted">Subtotal</span>
                  <span className="text-dv-text font-medium">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-dv-muted">Shipping</span>
                  <span className="text-dv-text font-medium">{fmt(SHIPPING_FEE)}</span>
                </div>
                <div className="flex justify-between text-[16px] font-semibold pt-3 border-t border-black/8 mt-1">
                  <span className="text-dv-text">Total (SGD)</span>
                  <span className="font-serif italic text-dv-accent text-[22px]">{fmt(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing || loadingItems}
                className="w-full h-12 rounded-full bg-dv-accent text-white text-[15px] font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Redirecting to payment…
                  </>
                ) : (
                  "Pay with HitPay"
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-dv-muted mt-4">
                <Lock className="w-3.5 h-3.5" />
                <span className="text-[12px]">Secure payment powered by HitPay</span>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
