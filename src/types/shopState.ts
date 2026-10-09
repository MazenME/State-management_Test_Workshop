import type { CartItem } from "./cart";
import type { Product } from "./products";


export type ShopState = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  cart: CartItem[];
  fetchProducts: () => Promise<void>;
  cleanProducts: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
};
