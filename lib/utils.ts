import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// LocalStorage helpers (safe on client only)
type CartItem = {
  id: string;
  price: number;
  title?: string;
  category?: string;
  author?: string;
  thumbnail?: string;
};
type PurchaseItem = {
  id: string;
  purchasedAt: number;
  title?: string;
  price?: number;
  category?: string;
  author?: string;
  thumbnail?: string;
};

const STORAGE_KEYS = {
  user: 'pm_user',
  cart: 'pm_cart',
  purchases: 'pm_purchases',
  prompts: 'pm_prompts',
  profile: 'pm_profile',
  waitlist: 'pm_waitlist',
  favorites: 'pm_favorites',
} as const;

function isBrowser() {
  return (
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  );
}

function emitStorageEvent(detail: { key: string }) {
  if (!isBrowser()) return;
  try {
    window.dispatchEvent(new CustomEvent('pm_storage', { detail }));
  } catch {
    // ignore
  }
}

export function readStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    emitStorageEvent({ key });
  } catch {
    // ignore
  }
}

export const storage = {
  keys: STORAGE_KEYS,
  // user session mock
  getUser(): { isLoggedIn: boolean } {
    return readStorage(STORAGE_KEYS.user, { isLoggedIn: false });
  },
  setUser(next: { isLoggedIn: boolean }) {
    writeStorage(STORAGE_KEYS.user, next);
  },
  // cart
  getCart(): CartItem[] {
    return readStorage<CartItem[]>(STORAGE_KEYS.cart, []);
  },
  setCart(items: CartItem[]) {
    writeStorage<CartItem[]>(STORAGE_KEYS.cart, items);
  },
  addToCart(item: CartItem) {
    const items = storage.getCart();
    if (items.some((x) => x.id === item.id)) return items;
    const next = [
      ...items,
      {
        id: item.id,
        price: item.price,
        title: item.title,
        category: item.category,
        author: item.author,
        thumbnail: item.thumbnail,
      },
    ];
    storage.setCart(next);
    return next;
  },
  removeFromCart(id: string) {
    const next = storage.getCart().filter((x) => x.id !== id);
    storage.setCart(next);
    return next;
  },
  clearCart() {
    storage.setCart([]);
  },
  // favorites
  getFavorites(): string[] {
    return readStorage<string[]>(STORAGE_KEYS.favorites, []);
  },
  setFavorites(ids: string[]) {
    writeStorage<string[]>(STORAGE_KEYS.favorites, ids);
  },
  toggleFavorite(id: string) {
    const current = storage.getFavorites();
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    storage.setFavorites(next);
    return next;
  },
  // purchases
  getPurchases(): PurchaseItem[] {
    return readStorage<PurchaseItem[]>(STORAGE_KEYS.purchases, []);
  },
  setPurchases(items: PurchaseItem[]) {
    writeStorage<PurchaseItem[]>(STORAGE_KEYS.purchases, items);
  },
  addPurchase(
    id: string,
    meta?: {
      title?: string;
      price?: number;
      category?: string;
      author?: string;
      thumbnail?: string;
    },
  ) {
    const list = storage.getPurchases();
    if (list.some((p) => p.id === id)) return list;
    const next = [
      ...list,
      {
        id,
        purchasedAt: Date.now(),
        title: meta?.title,
        price: meta?.price,
        category: meta?.category,
        author: meta?.author,
        thumbnail: meta?.thumbnail,
      },
    ];
    storage.setPurchases(next);
    return next;
  },
  // prompts (for admin CRUD mock)
  getPrompts<T = unknown>(): T[] {
    return readStorage<T[]>(STORAGE_KEYS.prompts, []);
  },
  setPrompts<T = unknown>(items: T[]) {
    writeStorage<T[]>(STORAGE_KEYS.prompts, items);
  },
  // profile
  getProfile<T = unknown>(fallback: T): T {
    return readStorage<T>(STORAGE_KEYS.profile, fallback);
  },
  setProfile<T = unknown>(value: T) {
    writeStorage<T>(STORAGE_KEYS.profile, value);
  },
  // seller waitlist
  getWaitlist<T = unknown>(): T[] {
    return readStorage<T[]>(STORAGE_KEYS.waitlist, []);
  },
  addWaitlist<T = unknown>(value: T) {
    const list = storage.getWaitlist<T>();
    const next = [...list, value];
    writeStorage<T[]>(STORAGE_KEYS.waitlist, next);
    return next;
  },
};
