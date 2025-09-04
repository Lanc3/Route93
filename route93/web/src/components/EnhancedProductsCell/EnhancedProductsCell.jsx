import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import EnhancedProductCard from 'src/components/EnhancedProductCard/EnhancedProductCard'

export const QUERY = gql`
  query EnhancedProductsQuery($sortBy: String, $sortOrder: String, $limit: Int, $status: String) {
    products(sortBy: $sortBy, sortOrder: $sortOrder, limit: $limit, status: $status) {
      id
      name
      slug
      description
      price
      salePrice
      sku
      inventory
      status
      images
      tags
      category {
        id
        name
      }
      reviews {
        rating
      }
      _count {
        reviews
      }
    }
  }
`

const Loading = () => (
  <div className="products-grid">
    {[...Array(8)].map((_, index) => (
      <div key={index} className="product-card-3d">
        <div className="skeleton skeleton-image"></div>
        <div className="p-6">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-title w-1/2"></div>
          <div className="skeleton skeleton-price mt-4"></div>
          <div className="skeleton h-12 w-full mt-4"></div>
        </div>
      </div>
    ))}
  </div>
)

const Empty = () => (
  <div className="text-center py-12">
    <div className="text-6xl mb-4">🛍️</div>
    <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h3>
    <p className="text-gray-600">We couldn't find any products matching your criteria.</p>
  </div>
)

const Failure = ({ error }) => (
  <div className="text-center py-12">
    <div className="text-6xl mb-4">❌</div>
    <h3 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h3>
    <p className="text-gray-600 mb-4">We encountered an error while loading products.</p>
    <details className="text-sm text-gray-500">
      <summary className="cursor-pointer hover:text-gray-700">Error details</summary>
      <pre className="mt-2 text-left bg-gray-100 p-4 rounded-lg overflow-auto">
        {error?.message || 'Unknown error occurred'}
      </pre>
    </details>
  </div>
)

const Success = ({ products, sortBy, sortOrder, limit, status }) => {
  // Calculate average rating and review count for each product
  const enhancedProducts = products.map(product => {
    const reviews = product.reviews || []
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0
    const reviewCount = product._count?.reviews || 0
    
    // Determine if product is on sale and calculate original price
    const isOnSale = product.salePrice && product.salePrice < product.price
    const originalPrice = isOnSale ? product.price : null
    const displayPrice = isOnSale ? product.salePrice : product.price
    
    // Parse images string to get first image with error handling
    let firstImage = null
    try {
      if (product.images && product.images.trim()) {
        const imageArray = JSON.parse(product.images)
        if (Array.isArray(imageArray) && imageArray.length > 0) {
          firstImage = imageArray[0]
        }
      }
    } catch (error) {
      firstImage = null
    }
    
    return {
      ...product,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      reviewCount,
      onSale: isOnSale,
      originalPrice,
      displayPrice,
      image: firstImage,
      stockQuantity: product.inventory
    }
  })

  return (
    <div className="parallax-section">
      {/* Parallax Background */}
      <div className="parallax-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-green-50"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/30 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-green-200/30 rounded-full animate-float delay-300"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-300/20 rounded-full animate-float delay-500"></div>
      </div>
      {/* Content Layer */}
      <div className="parallax-content">
        {/* Enhanced Section Header */}
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">
            Discover our handpicked selection of premium products, carefully curated just for you
          </p>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {enhancedProducts.map((product, index) => (
            <EnhancedProductCard 
              key={product.id} 
              product={product} 
              index={index}
            />
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 to-green-600 text-white px-8 py-4 rounded-full shadow-lg">
            <span className="text-lg font-semibold">Ready to explore more?</span>
            <button className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              View All Products
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const EnhancedProductsCell = (props) => {
  const { data, error, loading } = useQuery(QUERY, {
    variables: {
      sortBy: props.sortBy || 'createdAt',
      sortOrder: props.sortOrder || 'desc',
      limit: props.limit || 8,
      status: props.status || 'ACTIVE'
    },
    errorPolicy: 'all'
  })

  if (loading) return <Loading />
  if (error) return <Failure error={error} />
  if (!data?.products?.length) return <Empty />

  return <Success {...props} products={data.products} />
}

export default EnhancedProductsCell
