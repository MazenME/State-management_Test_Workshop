import { create } from "zustand";
import type { ShopState } from "../../types/shopState";
import { getProducts } from "../../api/productsApi";
import {persist, createJSONStorage} from "zustand/middleware";

export const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      products: [],
      cart: [],
      isLoading: false,
      error: null,

      fetchProducts: async () => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          const products = await getProducts();

          set({
            products,
            isLoading: false,
          });
        } catch {
          set({
            error: "Failed to fetch products",
            isLoading: false,
          });
        }
      },

      cleanProducts: () => {
        set({
          products: [],
        });
      },

      addToCart: (product) => {
        if (product.stock <= 0) {
          return;
        }

        set((state) => {
          const existingProduct = state.cart.find(
            (item) => item.id === product.id,
          );

          if (existingProduct) {
            if (existingProduct.quantity >= product.stock) {
              return state;
            }

            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + 1,
                    }
                  : item,
              ),
            };
          }

          return {
            cart: [
              ...state.cart,
              {
                ...product,
                quantity: 1,
              },
            ],
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => {
          return {
            cart: state.cart.filter((item) => item.id !== productId),
          };
        });
      },
      clearCart: () => set({ cart: [] }),

      decreaseQuantity: (productId) => {
        set((state) => {
          const existingProduct = state.cart.find(
            (item) => item.id === productId,
          );

          if (!existingProduct) {
            return state;
          }

          if (existingProduct.quantity <= 1) {
            return {
              cart: state.cart.filter((item) => item.id !== productId),
            };
          }

          return {
            cart: state.cart.map((item) =>
              item.id === productId
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                  }
                : item,
            ),
          };
        });
      },
    }),
    {
      name: "shop-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
      }),
    },
  ),
);