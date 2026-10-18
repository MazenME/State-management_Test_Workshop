import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import type { Product } from "../../types/products";
import { useShopStore } from "../../store/zustand/shopStore";
import { getProducts } from "../../api/productsApi";

jest.mock("./../../api/productsApi.ts", () => ({
  getProducts: jest.fn(),
}));

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

  const mockedProducts = jest.mocked(getProducts);
  test("fetches products and updates the store state", async () => {
    mockedProducts.mockResolvedValueOnce([createProduct()]);
    await useShopStore.getState().fetchProducts();

    const state = useShopStore.getState();
    expect(state.products).toHaveLength(1);
    expect(state.products[0]).toMatchObject({
      id: 1,
      title: "Mechanical Keyboard",
      price: 120,
      stock: 5,
      image: "keyboard.jpg",
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test("fetches products and updates the store state", async () => {});

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

/*
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { axiosInstance } from "./axiosInstance";
import { addProduct, updateProduct, deleteProduct, checkout } from "./productsApi";

// الـ factory لازم تحتوي كل method بتستخدمها
jest.mock("./axiosInstance", () => ({
  axiosInstance: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedPost = jest.mocked(axiosInstance.post);
const mockedPatch = jest.mocked(axiosInstance.patch);
const mockedDelete = jest.mocked(axiosInstance.delete);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("addProduct (POST)", () => {
  test("sends the body and returns the created product", async () => {
    const newProduct = { title: "Mouse", price: 50, stock: 10, image: "m.jpg" };
    const created = { id: 7, ...newProduct };
    mockedPost.mockResolvedValueOnce({ data: created });

    const result = await addProduct(newProduct);

    expect(result).toEqual(created);
    // هنا الأهم: المسار + الـ body
    expect(mockedPost).toHaveBeenCalledWith("/products", newProduct);
  });
});

describe("updateProduct (PATCH)", () => {
  test("sends only the changed fields to the right id", async () => {
    mockedPatch.mockResolvedValueOnce({ data: { id: 3, price: 99 } });

    await updateProduct(3, { price: 99 });

    expect(mockedPatch).toHaveBeenCalledWith("/products/3", { price: 99 });
  });
});

describe("deleteProduct (DELETE)", () => {
  test("calls the right URL and returns nothing", async () => {
    mockedDelete.mockResolvedValueOnce({ data: {} });

    const result = await deleteProduct(3);

    expect(result).toBeUndefined();
    expect(mockedDelete).toHaveBeenCalledWith("/products/3"); // مفيش body
  });
});

describe("checkout (payment)", () => {
  const payload = { items: [{ id: 1, quantity: 2 }], total: 240 };

  test("returns the payment result on success", async () => {
    mockedPost.mockResolvedValueOnce({ data: { status: "paid", orderId: "A1" } });

    const result = await checkout(payload);

    expect(result).toEqual({ status: "paid", orderId: "A1" });
    expect(mockedPost).toHaveBeenCalledTimes(1);          // اتنادت مرة واحدة بس
    expect(mockedPost).toHaveBeenCalledWith("/payments", payload);
  });

  test("rejects when the payment is declined", async () => {
    const declined = { response: { status: 402, data: { message: "Card declined" } } };
    mockedPost.mockRejectedValueOnce(declined);

    await expect(checkout(payload)).rejects.toBe(declined);
  });
});


*/ 