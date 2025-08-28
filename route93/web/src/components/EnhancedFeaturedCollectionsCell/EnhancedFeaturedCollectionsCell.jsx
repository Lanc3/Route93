import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { Link, routes } from '@redwoodjs/router'

export const QUERY = gql`
  query EnhancedFeaturedCollectionsQuery {
    collections(limit: 6) {
      id
      name
      description
      slug
      image
      isActive
      _count {
        products
      }
    }
  }
`

const Loading = () => (
  <div className="collections-grid">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="collection-card-enhanced">
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
    <div className="text-6xl mb-4">🎨</div>
    <h3 className="text-2xl font-bold text-gray-900 mb-2">No Collections Found</h3>
    <p className="text-gray-600">We couldn't find any featured collections.</p>
  </div>
)

const Failure = ({ error }) => (
  <div className="text-center py-12">
    <div className="text-6xl mb-4">❌</div>
    <h3 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h3>
    <p className="text-gray-600 mb-4">We encountered an error while loading collections.</p>
    <details className="text-sm text-gray-500">
      <summary className="cursor-pointer hover:text-gray-700">Error details</summary>
      <pre className="mt-2 text-left bg-gray-100 p-4 rounded-lg overflow-auto">
        {error?.message || 'Unknown error occurred'}
      </pre>
    </details>
  </div>
)

const Success = ({ collections }) => {
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
        {/* Collections Grid */}
        <div className="collections-grid">
          {collections.map((collection, index) => (
            <div 
              key={collection.id}
              className="collection-card-enhanced group"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: 'slide-in-from-bottom 0.8s ease-out forwards'
              }}
            >
              {/* Collection Image */}
              <div className="collection-image-container">
                <img
                  src={collection.image || '/images/placeholder-collection.jpg'}
                  alt={collection.name}
                  className="collection-image"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white text-sm font-medium">
                      {collection._count?.products || 0} Products
                    </div>
                  </div>
                </div>

                {/* Active Badge */}
                {collection.isActive && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Active
                  </div>
                )}
              </div>

              {/* Collection Content */}
              <div className="collection-content">
                <h3 className="collection-title group-hover:text-purple-600">
                  {collection.name}
                </h3>
                
                {collection.description && (
                  <p className="collection-description line-clamp-2">
                    {collection.description}
                  </p>
                )}

                <div className="collection-meta">
                  <span className="text-purple-600 font-semibold">
                    {collection._count?.products || 0} Products
                  </span>
                  <Link 
                    to={routes.collections()}
                    className="text-green-600 hover:text-green-700 font-medium transition-colors duration-300"
                  >
                    Explore →
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
            <span className="text-lg font-semibold">Ready to explore all collections?</span>
            <Link 
              to={routes.collections()} 
              className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              View All Collections
            </Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

const EnhancedFeaturedCollectionsCell = () => {
  const { data, error, loading } = useQuery(QUERY, {
    errorPolicy: 'all'
  })

  if (loading) return <Loading />
  if (error) return <Failure error={error} />
  if (!data?.collections?.length) return <Empty />

  return <Success collections={data.collections} />
}

export default EnhancedFeaturedCollectionsCell
