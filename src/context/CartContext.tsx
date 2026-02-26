import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from 'react';
import { Product, Addon } from '../data/products';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  qty: number;
  addons: Addon[];
  observations?: string;
}

interface CartContextData {
  items: CartItem[];
  totalItems: number;
  total: number;
  addItem: (product: Product, qty: number, addons: Addon[], observations?: string) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(
    product: Product,
    qty: number,
    addons: Addon[],
    observations?: string,
  ) {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx >= 0) {
        // Incrementa quantidade se já existe
        const updated = [...prev];
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + qty, addons, observations };
        return updated;
      }
      return [...prev, { product, qty, addons, observations }];
    });
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }

  function updateQty(productId: string, qty: number) {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, qty } : i)),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items],
  );

  const total = useMemo(
    () =>
      items.reduce((sum, i) => {
        const addonTotal = i.addons.reduce((a, ad) => a + ad.price, 0);
        return sum + (i.product.price + addonTotal) * i.qty;
      }, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{ items, totalItems, total, addItem, removeItem, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
