import { useState } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { useCart } from 'src/contexts/CartContext'
import { toast } from '@redwoodjs/web/toast'
import ProductReviews from 'src/components/ProductReviews/ProductReviews'

export const QUERY = gql`
  query FindProductQuery($slug: String!) {
    product: productBySlug(slug: $slug) {
      id
      name
      description
      price
      salePrice
      sku
      slug
      status
      inventory
      images
      tags
      createdAt
      updatedAt
      category {
        id
        name
        slug
      }
      reviews {
        id
        rating
        title
        comment
        createdAt
        user {
          id
          name
        }
      }
      _count {
        reviews
      }
    }
  }
`

export const Loading = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Image skeleton */}
      <div className="space-y-4">
        <div className="aspect-square bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
      
      {/* Product info skeleton */}
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  </div>
)

export const Empty = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
    <div className="bg-white rounded-lg shadow-md p-12">
      <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
      </svg>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
      <p className="text-gray-600 mb-8">
        The product you're looking for doesn't exist or may have been removed.
      </p>
      <Link to={routes.products()} className="btn-primary">
        Browse All Products
      </Link>
    </div>
  </div>
)

export const Failure = ({ error }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
    <div className="bg-white rounded-lg shadow-md p-12">
      <svg className="w-24 h-24 text-red-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Product</h2>
      <p className="text-gray-600 mb-8">
        {error?.message || 'There was an error loading this product. Please try again.'}
      </p>
      <button 
        onClick={() => window.location.reload()} 
        className="btn-primary mr-4"
      >
        Try Again
      </button>
      <Link to={routes.products()} className="btn-outline">
        Browse All Products
      </Link>
    </div>
  </div>
)

export const Success = ({ product }) => {
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Parse images from JSON string
  const images = product.images ? JSON.parse(product.images) : []
  const productImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80'
  ]

  // Parse tags
  const tags = product.tags ? JSON.parse(product.tags) : []

  // Calculate savings
  const hasDiscount = product.salePrice && product.salePrice < product.price
  const savings = hasDiscount ? product.price - product.salePrice : 0
  const discountPercent = hasDiscount ? Math.round((savings / product.price) * 100) : 0

  const handleAddToCart = async () => {
    if (product.inventory <= 0) {
      toast.error('This product is out of stock')
      return
    }

    setIsAddingToCart(true)
    try {
      await addItem(product, quantity)
      toast.success(`Added ${quantity} ${product.name} to cart!`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add item to cart. Please try again.')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const isInStock = product.inventory > 0
  const isLowStock = product.inventory <= 5 && product.inventory > 0

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to={routes.home()} className="hover:text-purple-600 transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to={routes.products()} className="hover:text-purple-600 transition-colors">Products</Link>
            {product.category && (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link 
                  to={routes.products({ categoryId: product.category.id })} 
                  className="hover:text-purple-600 transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg shadow-md overflow-hidden group">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-purple-600 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Product Title & Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  {hasDiscount ? (
                    <>
                      <span className="text-3xl font-bold text-purple-600">€{product.salePrice.toFixed(2)}</span>
                      <span className="text-xl text-gray-500 line-through">€{product.price.toFixed(2)}</span>
                      <span className="bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded">
                        {discountPercent}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2 mb-4">
                {isInStock ? (
                  <>
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-600 font-medium">
                      {isLowStock ? `Only ${product.inventory} left in stock` : 'In Stock'}
                    </span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
              </div>

              {/* SKU */}
              <p className="text-sm text-gray-500 mb-4">SKU: {product.sku}</p>
            </div>

            {/* Short Description */}
            {product.description && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {product.description.substring(0, 200)}
                  {product.description.length > 200 && '...'}
                </p>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-900">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={!isInStock}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={product.inventory}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.inventory, parseInt(e.target.value) || 1)))}
                    className="w-16 text-center border-0 focus:ring-0"
                    disabled={!isInStock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={!isInStock}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock || isAddingToCart}
                  className={`flex-1 btn-primary text-lg py-4 ${
                    (!isInStock || isAddingToCart) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isAddingToCart ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : !isInStock ? (
                    'Out of Stock'
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
                
                <button className="btn-outline px-6">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Product Features */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'description', name: 'Description' },
                { id: 'specifications', name: 'Specifications' },
                { id: 'reviews', name: `Reviews (${product._count?.reviews || 0})` },
                { id: 'shipping', name: 'Shipping & Returns' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="bg-white rounded-lg p-8">
                <div className="prose max-w-none">
                  {product.description ? (
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {product.description}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">No description available for this product.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="bg-white rounded-lg p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">SKU:</span>
                      <span className="text-gray-600">{product.sku}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Category:</span>
                      <span className="text-gray-600">{product.category?.name || 'Uncategorized'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Availability:</span>
                      <span className={`font-medium ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
                        {isInStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Weight:</span>
                      <span className="text-gray-600">1.2 lbs</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Dimensions:</span>
                      <span className="text-gray-600">12" x 8" x 4"</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Material:</span>
                      <span className="text-gray-600">Premium Quality</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-white rounded-lg p-8">
                <ProductReviews 
                  product={product} 
                  onReviewCreated={() => {
                    // This will trigger a refetch of the product data
                    window.location.reload()
                  }}
                />
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="bg-white rounded-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">Free Standard Shipping</p>
                          <p className="text-gray-600 text-sm">On orders over €50 (5-7 business days)</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">Express Shipping</p>
                          <p className="text-gray-600 text-sm">€9.99 (2-3 business days)</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">Overnight Shipping</p>
                          <p className="text-gray-600 text-sm">€19.99 (1 business day)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Returns & Exchanges</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">30-Day Returns</p>
                          <p className="text-gray-600 text-sm">Free returns on all orders</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">Easy Exchanges</p>
                          <p className="text-gray-600 text-sm">Hassle-free size and color exchanges</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">Quality Guarantee</p>
                          <p className="text-gray-600 text-sm">100% satisfaction guaranteed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link to={routes.returns()} className="btn-outline">
                    View Full Return Policy
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
