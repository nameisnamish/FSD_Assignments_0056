import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { submitOrder } from '../services/api';

const StoreContext = createContext(null);
const readStorage = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
};

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => readStorage('noir-cart', []));
  const [user, setUser] = useState(() => readStorage('noir-user', null));
  const [notice, setNotice] = useState('');

  useEffect(() => localStorage.setItem('noir-cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('noir-user', JSON.stringify(user)), [user]);
  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(''), 2600);
    return () => clearTimeout(timer);
  }, [notice]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  function addToCart(product, quantity = 1) {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) return current.map((item) => item.product.id === product.id ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) } : item);
      return [...current, { product, quantity: Math.min(quantity, product.stock) }];
    });
    setNotice('Added to cart');
  }

  function updateQuantity(productId, quantity) {
    setCart((current) => current.map((item) => item.product.id === productId ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock)) } : item));
  }

  function removeFromCart(productId) {
    setCart((current) => current.filter((item) => item.product.id !== productId));
    setNotice('Removed from cart');
  }

  async function placeOrder() {
    const order = await submitOrder({ items: cart.map(({ product, quantity }) => ({ productId: product.id, quantity })), total: cartTotal, token: user.token });
    setCart([]);
    setNotice('Order placed successfully');
    return order;
  }

  const value = useMemo(() => ({ cart, cartCount, cartTotal, user, notice, setNotice, setUser, addToCart, updateQuantity, removeFromCart, placeOrder }), [cart, cartCount, cartTotal, user, notice]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);