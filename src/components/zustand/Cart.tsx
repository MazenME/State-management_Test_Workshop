import { useEffect } from 'react'
import { useShopStore } from '../../store/zustand/shopStore'

type CartProps = {
  onClose: () => void
}

export function Cart({ onClose }: CartProps) {
  const cart = useShopStore((state) => state.cart)
  const removeFromCart = useShopStore((state) => state.removeFromCart)
    const clearCart = useShopStore((state) => state.clearCart)
    const addToCart = useShopStore((state) => state.addToCart)
    const decreaseQuantity = useShopStore((state) => state.decreaseQuantity)
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  useEffect(() => {
    document.getElementById('cart')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <section id="cart" className="cart-section" aria-labelledby="cart-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Your selection</p>
          <h2 id="cart-title">Shopping cart</h2>
        </div>
        <div className="cart-heading-actions">
          <span className="product-count">{cart.length} products</span>
          <button className="close-cart-button" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <span className="cart-empty-icon" aria-hidden="true">
            🛒
          </span>
          <h3>Your cart is empty</h3>
          <p>Add a product from the catalog to see it here.</p>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <article className="cart-item" key={item.id}>
                <img src={item.image} alt={item.title} />
                <div className="cart-item-info">
                  <h3>{item.title}</h3>
                  <p>${item.price} each</p>
                </div>
                <span className="cart-quantity">Qty: {item.quantity}</span>
                <strong className="cart-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                  <button
                    className="remove-button"
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                  <div className="cart-item-actions">
                    <button
                      className="increase-button"
                      type="button"
                      onClick={() => addToCart(item)}
                    >
                      +
                    </button>
                    <button
                      className="decrease-button"
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      -
                    </button>
                  </div>
                </strong>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <p className="eyebrow">Summary</p>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <button
              className="clear-cart-button"
              type="button"
              onClick={() => clearCart()}
            >
              Clear cart
            </button>
            <button className="checkout-button" type="button" disabled>
              Checkout soon
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
