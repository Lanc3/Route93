import { Link, routes } from '@redwoodjs/router'

export const QUERY = gql`
  query FeaturedCollectionsQuery {
    collections {
      id
      name
      description
      slug
      image
      isActive
    }
  }
`

export const Loading = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="animate-pulse bg-gray-300 h-80 rounded-lg"></div>
      </div>
      <div className="space-y-8">
        <div className="animate-pulse bg-gray-300 h-48 rounded-lg"></div>
        <div className="animate-pulse bg-gray-300 h-48 rounded-lg"></div>
      </div>
    </div>
  )
}

export const Empty = () => {
  // Return static collections layout if no collections in database
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* New Arrivals - Large Featured Collection */}
      <div className="lg:col-span-2">
        <Link 
          to={routes.products({ sortBy: 'createdAt', sortOrder: 'desc' })}
          className="group relative block overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="aspect-w-16 aspect-h-9">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop" 
              alt="New Arrivals"
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-transparent"></div>
          <div className="absolute inset-0 flex items-center">
            <div className="p-8 text-white">
              <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                New Arrivals
              </span>
              <h3 className="text-3xl font-bold mb-2">Fresh & Trending</h3>
              <p className="text-lg text-purple-100 mb-4">
                Discover the latest products that everyone is talking about
              </p>
              <div className="inline-flex items-center text-white group-hover:text-green-400 transition-colors">
                <span className="mr-2 font-semibold">Shop New Arrivals</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Best Sellers & Featured Collections - Stacked */}
      <div className="space-y-8">
        {/* Best Sellers */}
        <Link 
          to={routes.products({ sortBy: 'popularity' })}
          className="group relative block overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="aspect-w-4 aspect-h-3">
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop" 
              alt="Best Sellers"
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
              Best Sellers
            </span>
            <h3 className="text-xl font-bold mb-1">Customer Favorites</h3>
            <p className="text-sm text-gray-200">Most loved products</p>
          </div>
        </Link>

        {/* Featured Collection */}
        <Link 
          to={routes.products()}
          className="group relative block overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="aspect-w-4 aspect-h-3">
            <img 
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop" 
              alt="Featured Collection"
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
              Featured
            </span>
            <h3 className="text-xl font-bold mb-1">Editor's Choice</h3>
            <p className="text-sm text-gray-200">Handpicked selections</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export const Failure = ({ error }) => {
  return <Empty /> // Fallback to static layout on error
}

export const Success = ({ collections }) => {
  const activeCollections = collections.filter(collection => collection.isActive)
  
  if (activeCollections.length === 0) {
    return <Empty />
  }

  // Use dynamic collections if available
  const featuredCollections = activeCollections.slice(0, 3)
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* First collection - Large Featured */}
      {featuredCollections[0] && (
        <div className="lg:col-span-2">
          <Link 
            to={routes.products({ collection: featuredCollections[0].slug })}
            className="group relative block overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img 
                src={featuredCollections[0].image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop"} 
                alt={featuredCollections[0].name}
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-transparent"></div>
            <div className="absolute inset-0 flex items-center">
              <div className="p-8 text-white">
                <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  Featured
                </span>
                <h3 className="text-3xl font-bold mb-2">{featuredCollections[0].name}</h3>
                <p className="text-lg text-purple-100 mb-4">
                  {featuredCollections[0].description || "Discover amazing products in this collection"}
                </p>
                <div className="inline-flex items-center text-white group-hover:text-green-400 transition-colors">
                  <span className="mr-2 font-semibold">Shop Collection</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Other collections - Stacked */}
      <div className="space-y-8">
        {featuredCollections.slice(1, 3).map((collection, index) => (
          <Link 
            key={collection.id}
            to={routes.products({ collection: collection.slug })}
            className="group relative block overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="aspect-w-4 aspect-h-3">
              <img 
                src={collection.image || `https://images.unsplash.com/photo-${index === 0 ? '1556742049-0cfed4f6a45d' : '1560472354-b33ff0c44a43'}?w=400&h=300&fit=crop`} 
                alt={collection.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <span className={`inline-block text-white px-3 py-1 rounded-full text-sm font-semibold mb-2 ${index === 0 ? 'bg-purple-600' : 'bg-green-600'}`}>
                {collection.name}
              </span>
              <h3 className="text-xl font-bold mb-1">{collection.name}</h3>
              <p className="text-sm text-gray-200">{collection.description || "Explore this collection"}</p>
            </div>
          </Link>
        ))}
        
        {/* Fill remaining slots with static content if needed */}
        {featuredCollections.length < 3 && (
          <Link 
            to={routes.products()}
            className="group relative block overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="aspect-w-4 aspect-h-3">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop" 
                alt="Browse All"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
                Browse
              </span>
              <h3 className="text-xl font-bold mb-1">All Products</h3>
              <p className="text-sm text-gray-200">Explore our full catalog</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
