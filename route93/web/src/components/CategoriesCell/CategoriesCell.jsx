import { Link, routes } from '@redwoodjs/router'

export const QUERY = gql`
  query CategoriesQuery {
    categories {
      id
      name
      description
      slug
      image
    }
  }
`

export const Loading = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
          <div className="space-y-2">
            <div className="bg-gray-300 h-6 rounded w-3/4"></div>
            <div className="bg-gray-300 h-4 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const Empty = () => {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Categories Available</h3>
      <p className="text-gray-600">We're working on adding product categories. Check back soon!</p>
    </div>
  )
}

export const Failure = ({ error }) => {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Categories</h3>
      <p className="text-gray-600 mb-4">We're having trouble loading our categories. Please try again later.</p>
      <div className="text-sm text-red-600 mb-4">Error: {error?.message}</div>
      <button 
        onClick={() => window.location.reload()} 
        className="btn-primary"
      >
        Try Again
      </button>
    </div>
  )
}

export const Success = ({ categories }) => {
  if (categories.length === 0) {
    return <Empty />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.slice(0, 4).map((category) => {
        const imageUrl = category.image || `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&q=80`
        
        return (
          <Link 
            key={category.id}
            to={routes.products({ categoryId: category.id })}
            className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="aspect-w-3 aspect-h-4">
              <img 
                src={imageUrl} 
                alt={category.name}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-bold mb-1">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-gray-200">{category.description}</p>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
