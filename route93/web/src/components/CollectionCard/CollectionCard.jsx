import { Link, routes } from '@redwoodjs/router'

const CollectionCard = ({ collection }) => {
  const imageUrl = collection.image || 'https://via.placeholder.com/600x400?text=Collection'

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <Link to={routes.collection({ slug: collection.slug })}>
        <div className="relative overflow-hidden">
          <img
            src={imageUrl}
            alt={collection.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Collection Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Collection
            </span>
          </div>

          {/* Hover Overlay Content */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-center text-white">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Explore Collection</p>
                <div className="w-8 h-8 mx-auto border-2 border-white rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
            {collection.name}
          </h3>
          
          {collection.description && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {collection.description}
            </p>
          )}

          {/* Collection Stats Placeholder */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>View Products</span>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default CollectionCard
