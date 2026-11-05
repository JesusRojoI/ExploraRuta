'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartItem } from '@/types';
import { getProduct } from '@/data/products';
import { ivaBreakdown } from '@/lib/format';

const STORAGE_KEY = 'exploraruta_cart_v1';

interface CartValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  addItem: (slug: string, date: string, quantity?: number) => void;
  updateQuantity: (slug: string, date: string, quantity: number) => void;
  removeItem: (slug: string, date: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  hydrated: boolean;
  getSubtotal: () => number;
  getTaxIncluded: () => number;
}

const CartContext = createContext<CartValue>({
  items: [],
  count: 0,
  subtotal: 0,
  isOpen: false,
  addItem: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {},
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
  hydrated: false,
  getSubtotal: () => 0,
  getTaxIncluded: () => 0,
});

export function useCart() {
  return useContext(CartContext);
}

function readStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.slug === 'string' &&
        // Ignore entries left over from a previous catalogue version.
        Boolean(getProduct(item.slug)) &&
        typeof item.date === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(item.date) &&
        typeof item.quantity === 'number' &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const addItem = useCallback(
    (slug: string, date: string, quantity = 1) => {
      setItems((current) => {
        const index = current.findIndex(
          (item) => item.slug === slug && item.date === date
        );
        if (index >= 0) {
          const next = [...current];
          next[index] = {
            ...next[index],
            quantity: Math.min(20, next[index].quantity + quantity),
          };
          return next;
        }
        return [...current, { slug, date, quantity: Math.min(20, quantity) }];
      });
      setIsOpen(true);
    },
    []
  );

  const updateQuantity = useCallback(
    (slug: string, date: string, quantity: number) => {
      setItems((current) =>
        current
          .map((item) =>
            item.slug === slug && item.date === date
              ? { ...item, quantity: Math.max(1, Math.min(20, quantity)) }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    },
    []
  );

  const removeItem = useCallback((slug: string, date: string) => {
    setItems((current) =>
      current.filter((item) => !(item.slug === slug && item.date === date))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((value) => !value), []);

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = getProduct(item.slug);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0),
    [items]
  );

  const getSubtotal = useCallback(() => ivaBreakdown(subtotal).subtotal, [subtotal]);
  const getTaxIncluded = useCallback(() => ivaBreakdown(subtotal).iva, [subtotal]);

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      isOpen,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
      hydrated,
      getSubtotal,
      getTaxIncluded,
    }),
    [
      items,
      count,
      subtotal,
      isOpen,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
      hydrated,
      getSubtotal,
      getTaxIncluded,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
