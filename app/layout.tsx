import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "DaVinci Project",
  description:
    "Empowering artists with special needs to find hope and purpose through creative expression.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <CartProvider>{children}</CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
