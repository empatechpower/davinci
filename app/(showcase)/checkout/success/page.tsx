"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";

function SuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get("order");
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#faf9f7" }}
    >
      <div className="max-w-[480px] w-full text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-16 h-16 text-dv-accent" strokeWidth={1.5} />
        </div>

        <h1 className="font-serif italic text-dv-accent text-[40px] leading-tight mb-3">
          Thank You!
        </h1>

        <p className="text-[15px] text-dv-muted mb-2 leading-relaxed">
          Your payment has been received. Thank you for supporting our artists through
          the DaVinci Project.
        </p>

        {orderNumber && (
          <p className="text-[14px] text-dv-muted mb-8">
            Order number:{" "}
            <span className="font-semibold text-dv-text">{orderNumber}</span>
          </p>
        )}

        <div
          className="border border-black/8 rounded-[16px] p-5 mb-8 text-left"
          style={{ background: "#fff7f0" }}
        >
          <p className="text-[13px] text-dv-muted leading-relaxed">
            A confirmation will be sent to your email. To view full order details and
            invoice, sign in to your dashboard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="h-11 px-8 rounded-full bg-dv-accent text-white text-[14px] font-medium flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            View My Orders
          </Link>
          <Link
            href="/shop"
            className="h-11 px-8 rounded-full border border-dv-accent text-dv-accent text-[14px] font-medium flex items-center justify-center hover:bg-dv-accent/5 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen"
          style={{ background: "#faf9f7" }}
        />
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
