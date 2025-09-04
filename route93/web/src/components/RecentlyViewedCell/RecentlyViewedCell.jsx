import { Link, routes } from '@redwoodjs/router'

export const QUERY = gql`
  query RecentlyViewedQuery($limit: Int) {
    recentlyViewed(limit: $limit) {
      id
      viewedAt
      product {
        id
        name
        slug
        price
        salePrice
        images
        category {
          id
          name
        }
        _count {
          reviews
        }
        reviews {
          rating
        }
      }
    }
  }
`

export const Loading = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recently Viewed</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  </div>
)

export const Empty = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recently Viewed</h3>
    <div className="text-center py-8">
      <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      <p className="text-gray-500 text-sm">No recently viewed products</p>
      <p className="text-gray-400 text-xs mt-1">Browse our products to see them here</p>
    </div>
  </div>
)

export const Failure = ({ error }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recently Viewed</h3>
    <div className="text-center py-8">
      <p className="text-red-500 text-sm">Unable to load recently viewed products</p>
    </div>
  </div>
)

export const Success = ({ recentlyViewed }) => {
  if (!recentlyViewed || recentlyViewed.length === 0) {
    return <Empty />
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recently Viewed</h3>
        <Link
          to={routes.home()}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {recentlyViewed.map((item) => {
          const product = item.product
          const images = product.images ? JSON.parse(product.images) : []
          const imageUrl = images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&q=80'

          const hasDiscount = product.salePrice && product.salePrice < product.price
          const displayPrice = hasDiscount ? product.salePrice : product.price

          // Calculate average rating
          const avgRating = product.reviews && product.reviews.length > 0
            ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
            : 0

          return (
            <Link
              key={item.id}
              to={routes.product({ slug: product.slug })}
              className="group block"
            >
              <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                <div className="p-3">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </h4>

                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-semibold text-purple-600">
                      ${displayPrice.toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-gray-500 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {product.category && (
                    <p className="text-xs text-gray-500 mb-2">
                      {product.category.name}
                    </p>
                  )}

                  {/* Rating */}
                  {avgRating > 0 && (
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${i < Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        ({product._count.reviews})
                      </span>
                    </div>
                  )}

                  {/* Viewed time */}
                  <p className="text-xs text-gray-400 mt-1">
                    Viewed {new Date(item.viewedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Clear All Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to clear your recently viewed history?')) {
              // This would trigger a mutation to clear recently viewed
            }
          }}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear History
        </button>
      </div>
    </div>
  )
}
