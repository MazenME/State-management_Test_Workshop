import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { axiosInstance } from "./../../api/axiosInstance";
import { getProducts } from "./../../api/productsApi";

jest.mock("./../../api/axiosInstance", () => ({
  axiosInstance: { get: jest.fn() },
}));

const mockedProducts = jest.mocked(axiosInstance.get);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("fetching productsApi", () => {
  test("should fetch products and return data", async () => {
    mockedProducts.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          title: "Mechanical Keyboard",
          price: 120,
          stock: 5,
          image: "keyboard.jpg",
        },
      ],
    });
    const result = await getProducts();
    expect(result).toEqual([
      {
        id: 1,
        title: "Mechanical Keyboard",
        price: 120,
        stock: 5,
        image: "keyboard.jpg",
      },
    ]);
    expect(mockedProducts).toHaveBeenCalledTimes(1);
    expect(mockedProducts).toHaveBeenCalledWith("/products");
  });

  test("should throw an error when the API call fails", async () => {
    const error = new Error("Network Error");
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockedProducts.mockRejectedValueOnce(error);
    await expect(getProducts()).rejects.toBe(error);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});
