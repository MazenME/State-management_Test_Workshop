import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { Products } from "../../components/zustand/Products";
import { useShopStore } from "../../store/zustand/shopStore";
import { getProducts } from "../../api/productsApi";
import type { Product } from "../../types/products";

jest.mock("../../api/productsApi", () => ({
  getProducts: jest.fn(),
}));
const mockedGetProducts = jest.mocked(getProducts);

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  useShopStore.setState({
    products: [],
    cart: [],
    isLoading: false,
    error: null,
  });
});

describe("Products", () => {
  const createProduct = (overrides?: Partial<Product>): Product => ({
    id: 1,
    title: "Mechanical Keyboard",
    price: 120,
    stock: 5,
    image: "keyboard.jpg",
    ...overrides,
  });

  test("shows products after fetching", async () => {
    mockedGetProducts.mockResolvedValueOnce([
      createProduct({ id: 1, title: "Product 1" }),
      createProduct({ id: 2, title: "Product 2" }),
    ]);

    render(<Products />);

    expect(
      await screen.findByRole("heading", { name: "Product 1" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Product 2" }),
    ).toBeInTheDocument();
    expect(screen.getByText("2 items")).toBeInTheDocument();
  });

  test("shows a loading message while fetching", () => {
    mockedGetProducts.mockReturnValueOnce(new Promise<Product[]>(() => {}));
    render(<Products />);
    expect(screen.getByText("Loading products...")).toBeInTheDocument();
  });

  test("shows an error message when fetching fails", async () => {
    mockedGetProducts.mockRejectedValueOnce(new Error("Network Error"));
    render(<Products />);
    expect(
      await screen.findByText("Error: Failed to fetch products"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Loading products...")).not.toBeInTheDocument();
  });
});
