import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Cart } from "../../components/zustand/Cart";
import { useShopStore } from "../../store/zustand/shopStore";
import type { Product } from "../../types/products";

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

describe("Cart", () => {
  const createProduct = (overrides?: Partial<Product>): Product => ({
    id: 1,
    title: "Mechanical Keyboard",
    price: 120,
    stock: 5,
    image: "keyboard.jpg",
    ...overrides,
  });

  test("shows the empty state", () => {
    render(<Cart onClose={jest.fn()} />);

    expect(
      screen.getByRole("heading", { name: "Your cart is empty" }),
    ).toBeInTheDocument();
  });

  test("shows the item details and totals", () => {
    useShopStore.setState({
      cart: [
        {
          ...createProduct({ id: 1, title: "Product 1", price: 10 }),
          quantity: 2,
        },
        {
          ...createProduct({ id: 2, title: "Product 2", price: 25 }),
          quantity: 1,
        },
      ],
    });

    render(<Cart onClose={jest.fn()} />);

    expect(
      screen.getByRole("heading", { name: "Product 1" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Product 2" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Qty: 2")).toBeInTheDocument();
    expect(screen.getByText("Qty: 1")).toBeInTheDocument();
    expect(screen.getByText("2 products")).toBeInTheDocument();
    expect(screen.getByText("$20.00")).toBeInTheDocument(); // إجمالي صنف 1
    expect(screen.getByText("$25.00")).toBeInTheDocument(); // إجمالي صنف 2
    expect(screen.getByText("$45.00")).toBeInTheDocument(); // Subtotal
  });

  test("increases the item quantity when clicking +", async () => {
    const user = userEvent.setup();
    useShopStore.setState({
      cart: [
        {
          ...createProduct({ id: 1, title: "Product 1", price: 10 }),
          quantity: 1,
        },
      ],
    });

    render(<Cart onClose={jest.fn()} />);
    await user.click(screen.getByRole("button", { name: "+" }));

    expect(screen.getByText("Qty: 2")).toBeInTheDocument();
    expect(useShopStore.getState().cart[0].quantity).toBe(2);
  });

  test("decreases the item quantity when clicking -", async () => {
    const user = userEvent.setup();
    useShopStore.setState({
      cart: [
        {
          ...createProduct({ id: 1, title: "Product 1", price: 10 }),
          quantity: 2,
        },
      ],
    });

    render(<Cart onClose={jest.fn()} />);
    await user.click(screen.getByRole("button", { name: "-" }));

    expect(screen.getByText("Qty: 1")).toBeInTheDocument();
    expect(useShopStore.getState().cart[0].quantity).toBe(1);
  });

  test("removes the item when clicking - on quantity 1", async () => {
    const user = userEvent.setup();
    useShopStore.setState({
      cart: [
        {
          ...createProduct({ id: 1, title: "Product 1", price: 10 }),
          quantity: 1,
        },
      ],
    });

    render(<Cart onClose={jest.fn()} />);
    await user.click(screen.getByRole("button", { name: "-" }));

    expect(
      screen.getByRole("heading", { name: "Your cart is empty" }),
    ).toBeInTheDocument();
    expect(useShopStore.getState().cart).toHaveLength(0);
  });

  test("removes only the selected item when clicking Remove", async () => {
    const user = userEvent.setup();
    useShopStore.setState({
      cart: [
        {
          ...createProduct({ id: 1, title: "Product 1", price: 10 }),
          quantity: 1,
        },
        {
          ...createProduct({ id: 2, title: "Product 2", price: 25 }),
          quantity: 1,
        },
      ],
    });

    render(<Cart onClose={jest.fn()} />);
    const articles = screen.getAllByRole("article");
    await user.click(
      within(articles[0]).getByRole("button", { name: "Remove" }),
    );

    expect(
      screen.queryByRole("heading", { name: "Product 1" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Product 2" }),
    ).toBeInTheDocument();
    expect(useShopStore.getState().cart).toHaveLength(1);
    expect(useShopStore.getState().cart[0].id).toBe(2);
  });

  test("clears the cart when clicking Clear cart", async () => {
    const user = userEvent.setup();
    useShopStore.setState({
      cart: [
        {
          ...createProduct({ id: 1, title: "Product 1", price: 10 }),
          quantity: 1,
        },
        {
          ...createProduct({ id: 2, title: "Product 2", price: 25 }),
          quantity: 1,
        },
      ],
    });

    render(<Cart onClose={jest.fn()} />);
    await user.click(screen.getByRole("button", { name: "Clear cart" }));

    expect(
      screen.getByRole("heading", { name: "Your cart is empty" }),
    ).toBeInTheDocument();
    expect(useShopStore.getState().cart).toHaveLength(0);
  });

  test("calls onClose when clicking Close", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(<Cart onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("scrolls into view on mount", () => {
    render(<Cart onClose={jest.fn()} />);

    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledTimes(
      1,
    );
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
    });
  });
});
