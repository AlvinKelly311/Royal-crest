import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PRODUCTS } from "../data/products";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const KEY = "rc_cart";

// cart is stored as { "productId|variantIndex": quantity }
export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {};
    } catch {
      return {};
    }
  });
  const [order, setOrder] = useState(null); // details chosen on the cart page, used by the payment page

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const addMany = (selection) =>
    setCart((c) => {
      const next = { ...c };
      for (const [key, qty] of Object.entries(selection)) next[key] = (next[key] || 0) + qty;
      return next;
    });

  const setQty = (key, qty) =>
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[key];
      else next[key] = qty;
      return next;
    });

  const clear = () => {
    setCart({});
    setOrder(null);
  };

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([key, qty]) => {
          const [id, vi] = key.split("|");
          const product = PRODUCTS.find((p) => p.id === id);
          const variant = product?.variants[Number(vi)];
          if (!product || !variant) return null; // product was removed from the menu
          return {
            key,
            qty,
            name: product.name,
            image: product.image,
            label: variant.label,
            showLabel: product.variants.length > 1,
            price: variant.price,
          };
        })
        .filter(Boolean),
    [cart]
  );

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);

  return (
    <CartContext.Provider value={{ lines, count, subtotal, addMany, setQty, clear, order, setOrder }}>
      {children}
    </CartContext.Provider>
  );
}
