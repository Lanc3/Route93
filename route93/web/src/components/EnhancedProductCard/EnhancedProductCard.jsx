import { Link, routes } from '@redwoodjs/router'
import { useState } from 'react'
import { useCart } from 'src/contexts/CartContext'
import QuickViewModal from 'src/components/QuickViewModal/QuickViewModal'

const EnhancedProductCard = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addItem } = useCart()
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  
  // Calculate average rating and review count
  const averageRating = product.averageRating || 0
  const reviewCount = product.reviewCount || 0

  // Handle adding item to cart
  const handleAddToCart = async () => {
    if (isAddingToCart) return

    setIsAddingToCart(true)
    try {
      await addItem(product, 1)
    } catch (error) {
      console.error('Error adding item to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }
  
  // Generate star rating display
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="star filled" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className="star filled" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="halfStar">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <path fill="url(#halfStar)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      } else {
        stars.push(
          <svg key={i} className="star empty" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      }
    }
    return stars
  }

  return (
    <div 
      className="product-card-3d group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 0.1}s`,
        animation: 'slide-in-up 0.6s ease-out forwards'
      }}
    >
      {/* Product Image Container */}
      <div className="product-image-container">
        <img
          src={product.image || '/images/placeholder-product.jpg'}
          alt={product.name}
          className="product-image"
        />
        
        {/* Quick View Overlay */}
        <div className="quick-view-overlay">
          <button className="quick-view-button" onClick={() => setIsQuickViewOpen(true)}>
            Quick View
          </button>
        </div>
        
        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {product.category.name}
          </div>
        )}
        
        {/* Sale Badge */}
        {product.onSale && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            SALE
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="product-info">
        {/* Rating Stars */}
        <div className="rating-stars">
          {renderStars(averageRating)}
          <span className="text-sm text-gray-500 ml-2">
            ({reviewCount} reviews)
          </span>
        </div>

        {/* Product Title */}
        <h3 className="product-title line-clamp-2">
          {product.name}
        </h3>

        {/* Product Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price Display */}
        <div className="price-display">
          {product.onSale && product.originalPrice && (
            <span className="text-gray-400 line-through text-lg mr-2">
              €{product.originalPrice}
            </span>
          )}
          <span className="text-2xl font-bold text-green-600">
            €{product.displayPrice}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            to={routes.product({ slug: product.slug })}
            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg font-semibold text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            View Details
          </Link>
          
          <button
            className={`add-to-cart-btn ${isAddingToCart ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm text-gray-500">
            <span>SKU: {product.sku || 'N/A'}</span>
            <span>In Stock: {product.stockQuantity || 0}</span>
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/20 to-green-400/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  )
}

export default EnhancedProductCard
