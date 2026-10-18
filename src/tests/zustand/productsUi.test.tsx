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

  test("shows products after fetching", async () => {
  
  });
});
