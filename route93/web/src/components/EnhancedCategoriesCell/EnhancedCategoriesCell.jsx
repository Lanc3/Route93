import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { Link, routes } from '@redwoodjs/router'

export const QUERY = gql`
  query EnhancedCategoriesQuery {
    categories {
      id
      name
      description
      slug
      image
      _count {
        products
      }
    }
  }
`

const Loading = () => (
  <div className="categories-grid">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="category-card-enhanced">
        <div className="skeleton skeleton-image"></div>
        <div className="p-6">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-title w-1/2"></div>
          <div className="skeleton h-8 w-1/3 mt-4"></div>
        </div>
      </div>
    ))}
  </div>
)

const Empty = () => (
  <div className="text-center py-12">
    <div className="text-6xl mb-4">📂</div>
    <h3 className="text-2xl font-bold text-gray-900 mb-2">No Categories Found</h3>
    <p className="text-gray-600">We couldn't find any product categories.</p>
  </div>
)

const Failure = ({ error }) => (
  <div className="text-center py-12">
    <div className="text-6xl mb-4">❌</div>
    <h3 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h3>
    <p className="text-gray-600 mb-4">We encountered an error while loading categories.</p>
    <details className="text-sm text-gray-500">
      <summary className="cursor-pointer hover:text-gray-700">Error details</summary>
      <pre className="mt-2 text-left bg-gray-100 p-4 rounded-lg overflow-auto">
        {error?.message || 'Unknown error occurred'}
      </pre>
    </details>
  </div>
)

const Success = ({ categories }) => {
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
      {/* Content Layer */}
      <div className="relative z-10">
        {/* Enhanced Section Header */}
        <div className="section-header-enhanced">
          <h2 className="section-title-enhanced">Shop by Category</h2>
          <p className="section-subtitle-enhanced">
            Discover our carefully organized product categories, each designed to help you find exactly what you're looking for
          </p>
        </div>

        {/* Categories Grid */}
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div 
              key={category.id}
              className="category-card-enhanced group"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: 'slide-in-from-bottom 0.8s ease-out forwards'
              }}
            >
              {/* Category Image */}
              <div className="category-image-container">
                <img
                  src={category.image || '/images/placeholder-category.jpg'}
                  alt={category.name}
                  className="category-image"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white text-sm font-medium">
                      {category._count?.products || 0} Products
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Content */}
              <div className="category-content">
                <h3 className="category-title group-hover:text-purple-600">
                  {category.name}
                </h3>
                
                {category.description && (
                  <p className="category-description line-clamp-2">
                    {category.description}
                  </p>
                )}

                <div className="category-stats">
                  <span className="text-purple-600 font-semibold">
                    {category._count?.products || 0} Products
                  </span>
                  <Link 
                    to={routes.products({ categoryId: category.id })}
                    className="text-green-600 hover:text-green-700 font-medium transition-colors duration-300"
                  >
                    Browse →
                  </Link>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-400/20 to-green-400/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 to-green-600 text-white px-8 py-4 rounded-full shadow-lg">
            <span className="text-lg font-semibold">Ready to explore all categories?</span>
            <Link 
              to={routes.products()} 
              className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              View All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

const EnhancedCategoriesCell = () => {
  const { data, error, loading } = useQuery(QUERY, {
    errorPolicy: 'all'
  })

  if (loading) return <Loading />
  if (error) return <Failure error={error} />
  if (!data?.categories?.length) return <Empty />

  return <Success categories={data.categories} />
}

export default EnhancedCategoriesCell
