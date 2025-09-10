import ProductCard from 'src/components/ProductCard/ProductCard'

export const QUERY = gql`
  query ProductsQuery(
    $categoryId: Int
    $minPrice: Float
    $maxPrice: Float
    $inStock: Boolean
    $status: String
    $search: String
    $sortBy: String
    $sortOrder: String
    $limit: Int
    $offset: Int
  ) {
    products(
      categoryId: $categoryId
      minPrice: $minPrice
      maxPrice: $maxPrice
      inStock: $inStock
      status: $status
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
      limit: $limit
      offset: $offset
    ) {
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
      category {
        id
        name
        slug
      }
      reviews {
        rating
      }
      _count {
        reviews
      }
    }
    productsCount(
      categoryId: $categoryId
      minPrice: $minPrice
      maxPrice: $maxPrice
      inStock: $inStock
      status: $status
      search: $search
    )
  }
`

export const beforeQuery = (props) => {
  return {
    variables: {
      ...props,
      status: props?.status ?? 'ACTIVE',
    },
  }
}

export const Loading = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="h-64 bg-gray-300"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
          <div className="h-6 bg-gray-300 rounded mb-3 w-1/2"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>
      </div>
    ))}
  </div>
)

export const Empty = () => (
  <div className="text-center py-12">
    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
    </svg>
    <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
    <p className="mt-1 text-sm text-gray-500">
      Try adjusting your search or filter criteria.
    </p>
  </div>
)

export const Failure = ({ error }) => (
  <div className="text-center py-12">
    <div className="text-red-500 mb-4">
      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading products</h3>
    <p className="text-sm text-gray-500">{error?.message}</p>
  </div>
)

export const Success = ({ products, productsCount }) => {
  // Calculate average rating for each product
  const productsWithRating = products.map((product) => {
    // Ensure reviews is always an array, even if null from database
    const reviews = product.reviews || []
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0
    
    return {
      ...product,
      averageRating,
      reviewCount: product._count?.reviews || 0
    }
  })

  return (
    <div>
      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Showing {products.length} of {productsCount} products
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productsWithRating.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load More Button - if there are more products */}
      {products.length < productsCount && (
        <div className="text-center mt-8">
          <button className="btn-outline">
            Load More Products
          </button>
        </div>
      )}
    </div>
  )
}
