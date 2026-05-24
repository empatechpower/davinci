"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface CartItem {
  artworkId: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  addToCart: (artworkId: string) => void;
  removeItem: (artworkId: string) => void;
  updateQty: (artworkId: string, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  /* load from localStorage once on mount */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dv-cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setHydrated(true);
  }, []);

  /* persist on every change (skip before hydration) */
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("dv-cart", JSON.stringify(items));
  }, [items, hydrated]);

  const addToCart = useCallback((artworkId: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.artworkId === artworkId);
      if (existing) {
        return prev.map((i) =>
          i.artworkId === artworkId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { artworkId, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((artworkId: string) => {
    setItems((prev) => prev.filter((i) => i.artworkId !== artworkId));
  }, []);

  const updateQty = useCallback((artworkId: string, delta: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.artworkId === artworkId
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, totalItems, addToCart, removeItem, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
