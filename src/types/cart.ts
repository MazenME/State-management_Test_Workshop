import type { Product } from "./products";

export type CartItem = Product & {
  quantity: number;
};
