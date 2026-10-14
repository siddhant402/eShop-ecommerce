import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const KEY = "eshop-cart";

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable: cart lives in memory only */
    }
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((sum, i) => sum + i.price * i.qty, 0),
      add: (product, qty = 1) =>
        setItems((cur) => {
          const found = cur.find((i) => i.id === product.id);
          if (found) {
            return cur.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
          }
          return [
            ...cur,
            { id: product.id, name: product.name, price: product.price, image: product.image, qty },
          ];
        }),
      setQty: (id, qty) =>
        setItems((cur) => cur.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))),
      remove: (id) => setItems((cur) => cur.filter((i) => i.id !== id)),
      clear: () => setItems([]),
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
