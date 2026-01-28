export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  images?: string[];
  category: string;
  community: string;
  vendor: string;
  stock?: number;
  rating?: number;
  reviews?: number;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  community: string;
  quantity: number;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  heroImage: string;
  vendorCount: number;
  productCount: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface Story {
  id: number;
  title: string;
  content: string;
  image: string;
  author: string;
  date: string;
  excerpt: string;
  link: string;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  images?: string[];
  category: string;
  community: string;
  vendor: string;
  stock?: number;
  rating?: number;
  reviews?: number;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  community: string;
  quantity: number;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  heroImage: string;
  vendorCount: number;
  productCount: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface Story {
  id: number;
  title: string;
  content: string;
  image: string;
  author: string;
  date: string;
  excerpt: string;
  link: string;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
