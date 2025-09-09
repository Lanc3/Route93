import { Link, routes } from '@redwoodjs/router'
import { useCart } from 'src/contexts/CartContext'
import { toast } from '@redwoodjs/web/toast'
import { parseProductImages } from 'src/lib/imageUtils'

const ProductCard = ({ product }) => {
  const { addItem } = useCart()
  const images = parseProductImages(product.images)
  const primaryImage = images[0] || 'https://via.placeholder.com/400x400?text=No+Image'
  
  const displayPrice = product.salePrice || product.price
  const hasDiscount = product.salePrice && product.salePrice < product.price

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative">
        <Link to={product.slug ? routes.product({ slug: product.slug }) : '#'}>
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {hasDiscount && (
            <span className="bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
              Sale
            </span>
          )}
          {product.inventory <= 5 && product.inventory > 0 && (
            <span className="bg-orange-500 text-white px-2 py-1 text-xs font-semibold rounded block">
              Low Stock
            </span>
          )}
          {product.inventory === 0 && (
            <span className="bg-gray-500 text-white px-2 py-1 text-xs font-semibold rounded block">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2">
          {product.category && (
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {product.category.name}
            </span>
          )}
        </div>
        
        <Link to={product.slug ? routes.product({ slug: product.slug }) : '#'}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-purple-600">
              ${displayPrice}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                ${product.price}
              </span>
            )}
          </div>
          
          {/* Product Rating */}
          <div className="flex items-center space-x-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.round(product.averageRating || 0) ? 'fill-current' : 'fill-gray-300'}`} 
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
              ))}
            </div>
            {product.reviewCount > 0 && (
              <span className="text-xs text-gray-500 ml-1">
                ({product.reviewCount})
              </span>
            )}
          </div>
        </div>

        <button 
          onClick={() => {
            if (product.inventory > 0) {
              addItem(product, 1)
            }
          }}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
            product.inventory > 0 
              ? 'btn-primary hover:bg-purple-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={product.inventory === 0}
        >
          {product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
