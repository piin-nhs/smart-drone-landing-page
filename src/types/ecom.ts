import { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface EcomContextType {
  cart: CartItem[];
  favorites: Product[];
  recentlyViewed: Product[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  addToRecentlyViewed: (product: Product) => void;
}
