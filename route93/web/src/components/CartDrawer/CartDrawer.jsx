import { useState, useEffect } from 'react'
import { Link, routes, navigate } from '@redwoodjs/router'
import { useCart } from 'src/contexts/CartContext'
import { useAuth } from 'src/auth'
import { toast } from '@redwoodjs/web/toast'
import CartRecommendations from 'src/components/CartRecommendations/CartRecommendations'
import DiscountInput from 'src/components/DiscountInput/DiscountInput'

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, getCartTotal, getCartCount, loading } = useCart()
  const { isAuthenticated } = useAuth()
  const [updatingItems, setUpdatingItems] = useState({})

  // Close drawer when clicking outside
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return

    setUpdatingItems(prev => ({ ...prev, [itemId]: true }))
    await updateQuantity(itemId, newQuantity)
    setUpdatingItems(prev => ({ ...prev, [itemId]: false }))
  }

  const handleRemoveItem = async (itemId) => {
    setUpdatingItems(prev => ({ ...prev, [itemId]: true }))
    await removeItem(itemId)
    setUpdatingItems(prev => ({ ...prev, [itemId]: false }))
  }

  const handleCheckout = () => {
    onClose()
    if (isAuthenticated) {
      navigate(routes.checkout())
    } else {
      navigate(routes.login())
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const getItemImage = (product) => {
    if (!product.images) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyNUMxNy4yNSAyNSAxNSAyMi43NSAxNSAyMEMxNSAxNy4yNSAxNy4yNSAxNSAyMCAxNUMyMi43NSAxNSAyNSAxNy4yNSAyNSAyMEMyNSAyMi43NSAyMi43NSAyNSAyMCAyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'

    try {
      const images = JSON.parse(product.images)
      return images[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyNUMxNy4yNSAyNSAxNSAyMi43NSAxNSAyMEMxNSAxNy4yNSAxNy4yNSAxNSAyMCAxNUMyMi43NSAxNSAyNSAxNy4yNSAyNSAyMEMyNSAyMi43NSAyMi43NSAyNSAyMCAyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'
    } catch {
      return product.images || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyNUMxNy4yNSAyNSAxNSAyMi43NSAxNSAyMEMxNSAxNy4yNSAxNy4yNSAxNSAyMCAxNUMyMi43NSAxNSAyNSAxNy4yNSAyNSAyMEMyNSAyMi43NSAyMi43NSAyNSAyMCAyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        style={{ zIndex: 999999 }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
        style={{
          zIndex: 1000000,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
          position: 'fixed',
          right: 0,
          top: 0,
          height: '100vh',
          width: '100%',
          maxWidth: '28rem'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Shopping Cart ({getCartCount()})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                🛒
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 text-sm mb-6">Add some products to get started!</p>
              <button
                onClick={onClose}
                className="btn-primary"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const price = item.product.salePrice || item.product.price
                const isUpdating = updatingItems[item.id]

                return (
                  <div key={item.id} className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={getItemImage(item.product)}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyNUMxNy4yNSAyNSAxNSAyMi43NSAxNSAyMEMxNSAxNy4yNSAxNy4yNSAxNSAyMCAxNUMyMi43NSAxNSAyNSAxNy4yNSAyNSAyMEMyNSAyMi43NSAyMi43NSAyNSAyMCAyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={routes.product({ slug: item.product.slug })}
                        onClick={onClose}
                        className="block"
                      >
                        <h4 className="text-sm font-medium text-gray-900 truncate hover:text-purple-600 transition-colors">
                          {item.product.name}
                        </h4>
                      </Link>

                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm font-semibold text-purple-600">
                          {formatPrice(price)}
                        </span>
                        {item.product.salePrice && item.product.salePrice < item.product.price && (
                          <span className="text-xs text-gray-500 line-through">
                            {formatPrice(item.product.price)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isUpdating}
                            className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="px-3 py-1 text-sm border-x border-gray-300">
                            {isUpdating ? '...' : item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.inventory || isUpdating}
                            className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isUpdating}
                          className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {item.product.inventory <= 5 && (
                        <div className="text-xs text-orange-600 mt-1">
                          Only {item.product.inventory} left
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Discount Input */}
        {items.length > 0 && isAuthenticated && (
          <div className="border-t p-6">
            <DiscountInput compact={true} />
          </div>
        )}

        {/* Recommendations */}
        {items.length > 0 && (
          <div className="border-t">
            <CartRecommendations limit={3} className="p-6" />
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6">
            {/* Order Summary */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(getCartTotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-semibold text-purple-600">{formatPrice(getCartTotal())}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full btn-primary"
              >
                {isAuthenticated ? 'Checkout' : 'Sign In to Checkout'}
              </button>

              <Link
                to={routes.cart()}
                onClick={onClose}
                className="w-full btn-outline text-center block"
              >
                View Full Cart
              </Link>
            </div>

            {/* Security Badge */}
            <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure checkout
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CartDrawer
