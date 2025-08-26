import CollectionCard from 'src/components/CollectionCard/CollectionCard'

export const QUERY = gql`
  query CollectionsQuery {
    collections {
      id
      name
      description
      slug
      image
      isActive
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
          <div className="space-y-2">
            <div className="bg-gray-300 h-6 rounded w-3/4"></div>
            <div className="bg-gray-300 h-4 rounded w-full"></div>
            <div className="bg-gray-300 h-4 rounded w-2/3"></div>
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
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Collections Found</h3>
      <p className="text-gray-600 mb-6">We're working on adding exciting new collections. Check back soon!</p>
      <div className="flex justify-center space-x-4">
        <button className="btn-primary">Browse All Products</button>
        <button className="btn-outline">Contact Us</button>
      </div>
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
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Collections</h3>
      <p className="text-gray-600 mb-6">We're having trouble loading our collections. Please try again later.</p>
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

export const Success = ({ collections }) => {
  // Filter to only show active collections
  const activeCollections = collections.filter(collection => collection.isActive)

  if (activeCollections.length === 0) {
    return <Empty />
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-gray-600">
          Showing {activeCollections.length} collection{activeCollections.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeCollections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  )
}
