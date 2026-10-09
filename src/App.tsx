import { useState } from 'react'
import { Products } from "./components/zustand/Products"
import { Navbar } from './components/common/Navbar'
import { Cart } from './components/zustand/Cart'

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <main className="app-shell">
      <Navbar onCartClick={() => setIsCartOpen((isOpen) => !isOpen)} />
      <header className="app-header">
        <div>
          <p className="eyebrow">State management workshop</p>
          <h1>Shopping Cart</h1>
          <p className="intro">
            Browse the catalog and track inventory with Zustand first, then Redux Toolkit.
          </p>
        </div>
        <div className="stack-badge" aria-label="Technology stack">
          <span>Zustand</span>
          <span>Redux Toolkit</span>
        </div>
      </header>

      <Products />
      {isCartOpen && (
        <Cart onClose={() => setIsCartOpen(false)} />
      )}
    </main>
  )
}

export default App
