export type Locale = 'es' | 'en';

export type Localized<T = string> = {
  es: T;
  en: T;
};

export type CategoryId = 'talleres' | 'regionales' | 'cafe' | 'vino';

export interface Category {
  id: CategoryId;
  label: Localized;
}

export interface Product {
  slug: string;
  category: CategoryId;
  tag: Localized;
  title: Localized;
  state: Localized;
  short: Localized;
  price: number;
  image: string;
  featured?: boolean;
  about: Localized<string[]>;
  why: Localized;
  includes: Localized<string[]>;
  excludes: Localized<string[]>;
  special: Localized<string[]>;
  recommendations: Localized;
}

export interface CartItem {
  slug: string;
  quantity: number;
  date: string;
}

export interface OrderSummary {
  orderId: string;
  transactionId?: string;
  total: number;
  items: {
    title: string;
    quantity: number;
    price: number;
    date: string;
    image: string;
    state?: string;
  }[];
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  date: string;
}
