import { useShopStore } from '../../store/zustand/shopStore'

type NavbarProps = {
  onCartClick: () => void
}

export function Navbar({ onCartClick }: NavbarProps) {
  const cartItemsNumber = useShopStore((state) =>
    state.cart.reduce((total, item) => total + item.quantity, 0),
  )
  return (
    <nav className="navbar" aria-label="Main navigation">
      <a className="brand" href="/">
        <span className="brand-mark">SC</span>
        <span>Store Lab</span>
      </a>

      <div className="navbar-actions">
        <span className="state-badge">Zustand version</span>
        <button
          className="cart-button"
          type="button"
          aria-label="Open shopping cart"
          onClick={onCartClick}
        >
          <span className="cart-icon" aria-hidden="true">🛒</span>
          <span className="cart-label">Cart</span>
          <span className="cart-count" aria-label={`${cartItemsNumber} items in cart`}>{cartItemsNumber}</span>
        </button>
      </div>
    </nav>
  )
}
