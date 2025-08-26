import { Link, routes } from '@redwoodjs/router'

export const QUERY = gql`
  query SearchSuggestionsQuery($search: String!, $limit: Int) {
    products(search: $search, limit: $limit, status: "ACTIVE") {
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
    }
  }
`

export const Loading = () => (
  <div className="py-2">
    <div className="animate-pulse space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center space-x-3 px-4 py-2">
          <div className="w-10 h-10 bg-gray-200 rounded"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export const Empty = ({ search }) => (
  <div className="py-8 px-4 text-center">
    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <p className="text-gray-500 text-sm">No products found for "{search}"</p>
    <Link 
      to={`${routes.products()}?search=${encodeURIComponent(search)}`}
      className="text-purple-600 hover:text-purple-700 text-sm mt-2 inline-block"
    >
      View all search results →
    </Link>
  </div>
)

export const Failure = ({ error }) => (
  <div className="py-4 px-4 text-center">
    <p className="text-red-500 text-sm">Error loading suggestions</p>
  </div>
)

export const Success = ({ products, search, onProductClick }) => {
  const handleProductClick = (product) => {
    if (onProductClick) {
      onProductClick(product)
    }
  }

  return (
    <div className="py-2">
      {products.length > 0 ? (
        <>
          <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
            Products ({products.length})
          </div>
          {products.map((product) => {
            const images = product.images ? JSON.parse(product.images) : []
            const imageUrl = images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop&q=80'
            const hasDiscount = product.salePrice && product.salePrice < product.price
            const displayPrice = hasDiscount ? product.salePrice : product.price

            return (
              <Link
                key={product.id}
                to={routes.product({ id: product.id })}
                onClick={() => handleProductClick(product)}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-purple-600">
                      ${displayPrice.toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-gray-500 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                    {product.category && (
                      <span className="text-xs text-gray-500">
                        in {product.category.name}
                      </span>
                    )}
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )
          })}
          <div className="border-t border-gray-100 px-4 py-3">
            <Link
              to={`${routes.products()}?search=${encodeURIComponent(search)}`}
              onClick={() => handleProductClick({ name: search })}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              View all results for "{search}" →
            </Link>
          </div>
        </>
      ) : (
        <Empty search={search} />
      )}
    </div>
  )
}
