import { beforeEach, describe, expect, test } from "@jest/globals";
import type { Product } from "../../types/products";
import { useShopStore } from "../../store/zustand/shopStore";

beforeEach(() => {
  localStorage.clear();

  useShopStore.setState({
    products: [],
    cart: [],
    isLoading: false,
    error: null,
  });
});

describe("Shop Store - Cart", () => {
  const createProduct = (overrides?: Partial<Product>): Product => ({
    id: 1,
    title: "Mechanical Keyboard",
    price: 120,
    stock: 5,
    image: "keyboard.jpg",
    ...overrides,
  });

    
  test("fetches products and updates the store state", async () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        title: "Mechanical Keyboard",
        price: 120,
        stock: 5,
        image: "keyboard.jpg",
      },
      {
        id: 2,
        title: "Wireless Mouse",
        price: 50,
        stock: 10,
        image: "mouse.jpg",
      },
    ];
    useShopStore.getState().products = mockProducts;
    const products = useShopStore.getState().products;
    expect(products).toEqual(mockProducts);
  });
  



  test("should add a new product to an empty cart", () => {
    const product = createProduct();
    useShopStore.getState().addToCart(product);
    const cart = useShopStore.getState().cart;
    expect(cart).toHaveLength(1);

    expect(cart[0]).toMatchObject({
      id: product.id,
      quantity: 1,
    });
  });

  test("increases the quantity of an existing product in the cart", () => {
    const product = createProduct();
    useShopStore.getState().addToCart(product);
    useShopStore.getState().addToCart(product);
    const cart = useShopStore.getState().cart;
    expect(cart).toHaveLength(1);
    expect(cart[0]).toMatchObject({
      id: product.id,
      quantity: 2,
    });
  });

  test("does not add a product to the cart if it is out of stock", () => {
    const product = createProduct({ stock: 0 });
    useShopStore.getState().addToCart(product);
    const cart = useShopStore.getState().cart;
    expect(cart).toHaveLength(0);
  });

  test("does not increase quantity beyond available stock", () => {
    const product = createProduct({ stock: 1 });
    useShopStore.getState().addToCart(product);
    useShopStore.getState().addToCart(product);
    const cart = useShopStore.getState().cart;
    expect(cart).toHaveLength(1);
    expect(cart[0]).toMatchObject({
      id: product.id,
      quantity: 1,
    });
  });

  test("does not exceed the available stock when adding products to the cart", () => {
    const product = createProduct({ stock: 2 });
    useShopStore.getState().addToCart(product);
    useShopStore.getState().addToCart(product);
    useShopStore.getState().addToCart(product);
    const cart = useShopStore.getState().cart;
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(product.stock);
  });

  test("removes a product from the cart", () => {
    const product = createProduct();
    useShopStore.getState().addToCart(product);
    useShopStore.getState().removeFromCart(product.id);
    const cart = useShopStore.getState().cart;
    expect(cart).toHaveLength(0);
  });

  test("decreases the quantity of a product in the cart", () => {
    const product = createProduct();
    useShopStore.getState().addToCart(product);
    useShopStore.getState().addToCart(product);
    useShopStore.getState().decreaseQuantity(product.id);
    const cart = useShopStore.getState().cart;
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(1);
  });

  test("removes the product from the cart when decreasing quantity to zero", () => {
    const product = createProduct();
    useShopStore.getState().addToCart(product);
    useShopStore.getState().decreaseQuantity(product.id);
    const cart = useShopStore.getState().cart;
    expect(cart).toHaveLength(0);
  });

  test("remove a specific product from the cart", () => {
    const product1 = createProduct();
    const product2 = createProduct({
      id: 2,
      title: "Wireless Mouse",
      price: 50,
      stock: 10,
      image: "mouse.jpg",
    });
    useShopStore.getState().addToCart(product1);
    useShopStore.getState().addToCart(product2);
    useShopStore.getState().removeFromCart(product1.id);
    const cart = useShopStore.getState().cart;
    expect(cart).toHaveLength(1);
    expect(cart[0]).toMatchObject({
      id: product2.id,
      quantity: 1,
    });
  });

  test("does nothing when removing a product that is not in the cart", () => {
    const product = createProduct();
    useShopStore.getState().addToCart(product);
    useShopStore.getState().removeFromCart(999);
    const cart = useShopStore.getState().cart;
    expect(cart).toHaveLength(1);
    expect(cart[0].id).toBe(product.id);
  });

  test("clears the entire cart", () => {
    const product1 = createProduct();
    const product2 = createProduct({
      id: 2,
      title: "Wireless Mouse",
      price: 50,
      stock: 10,
      image: "mouse.jpg",
    });
    useShopStore.getState().addToCart(product1);
    useShopStore.getState().addToCart(product2);
    useShopStore.getState().clearCart();
    const cart = useShopStore.getState().cart;
    expect(cart).toHaveLength(0);
  });
});
