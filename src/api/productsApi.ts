import { axiosInstance } from "./axiosInstance";
import type {Product} from "../types/products";    


export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get<Product[]>("/products");

    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
};
