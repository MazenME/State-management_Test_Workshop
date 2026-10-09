import { useEffect } from "react";
import { useShopStore } from "../../store/zustand/shopStore";

export const Products = () => {
  const products = useShopStore((state) => state.products);
  const isLoading = useShopStore((state) => state.isLoading);
  const error = useShopStore((state) => state.error);
  const fetchProducts = useShopStore((state) => state.fetchProducts);
  const cleanProducts = useShopStore((state) => state.cleanProducts);
  const cart = useShopStore((state) => state.cart);
  const addToCart = useShopStore((state) => state.addToCart);
  useEffect(() => {
    fetchProducts();

    return () => {
      cleanProducts();
    };
  }, [fetchProducts, cleanProducts]);

  if (isLoading) {
    return (
      <section className="products-section" aria-live="polite">
        <div className="status-panel">Loading products...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="products-section" aria-live="polite">
        <div className="status-panel status-error">Error: {error}</div>
      </section>
    );
  }

  return (
    <section className="products-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Catalog</p>
          <h2>Featured products</h2>
        </div>
        <span className="product-count">{products.length} items</span>
      </div>

      <div className="product-grid">
        {products.map((product) => {
          const cartItem = cart.find((item) => item.id === product.id);
          const availableStock = cartItem
            ? product.stock - cartItem.quantity
            : product.stock;

          return (
            <article className="product-card" key={product.id}>
              <div className="product-image-wrap">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="product-details">
                <h3>{product.title}</h3>
                <div className="product-meta">
                  <strong>${product.price}</strong>
                  <span className="stock-label">{availableStock} in stock</span>
                </div>
                <button
                  className="add-button"
                  disabled={availableStock <= 0}
                  type="button"
                  onClick={() => addToCart(product)}
                >
                  {availableStock <= 0 ? "Out of stock" : "Add to cart"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
