import { useState } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { useCart } from 'src/contexts/CartContext'
import CartDrawer from 'src/components/CartDrawer/CartDrawer'

const CartButton = ({ className = '' }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { getCartCount, getCartTotal, loading } = useCart()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className={`relative p-2 text-gray-600 hover:text-purple-600 transition-colors ${className}`}
        aria-label="Shopping cart"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1 5M7 13h10m0 0v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8m10 0l-1.1 5" />
        </svg>

        {/* Cart Count Badge */}
        {!loading && getCartCount() > 0 && (
          <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
            {getCartCount() > 99 ? '99+' : getCartCount()}
          </span>
        )}

        {/* Cart Total (optional - can be shown on hover) */}
        {!loading && getCartCount() > 0 && (
          <div className="absolute top-full right-0 mt-2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {formatPrice(getCartTotal())}
          </div>
        )}
      </button>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  )
}

export default CartButton
