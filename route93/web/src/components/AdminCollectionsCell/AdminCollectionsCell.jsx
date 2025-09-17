import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const DELETE_COLLECTION = gql`
  mutation DeleteCollection($id: Int!) {
    deleteCollection(id: $id) {
      id
    }
  }
`

export const QUERY = gql`
  query AdminCollectionsQuery($limit: Int, $offset: Int, $search: String, $isActive: Boolean, $sortBy: String, $sortOrder: String) {
    collections(limit: $limit, offset: $offset, search: $search, isActive: $isActive, sortBy: $sortBy, sortOrder: $sortOrder) {
      id
      name
      description
      slug
      image
      isActive
      createdAt
      updatedAt
      _count {
        products
      }
      products {
        product {
          id
          name
          images
          price
          salePrice
        }
      }
    }
    collectionsCount: collectionsCount(search: $search, isActive: $isActive)
  }
`

export const Loading = () => (
  <div className="space-y-4">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
            <div className="w-16 h-16 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export const Empty = ({ search }) => (
  <div className="text-center py-12">
    <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
      📚
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No collections found</h3>
    <p className="text-gray-500 mb-4">
      {search ? `No collections match "${search}"` : 'Get started by creating your first collection.'}
    </p>
    <Link to={routes.adminCollectionAdd()} className="btn-primary">
      + Add Collection
    </Link>
  </div>
)

export const Failure = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="text-red-800">
      <h3 className="font-semibold">Error loading collections</h3>
      <p className="text-sm mt-1">{error?.message}</p>
    </div>
  </div>
)

export const Success = ({ collections, collectionsCount }) => {
  const formatDate = (date) => new Date(date).toLocaleDateString()

  const [deleteCollection] = useMutation(DELETE_COLLECTION, {
    onCompleted: () => {
      toast.success('Collection deleted successfully!')
      window.location.reload()
    },
    onError: (error) => {
      toast.error('Error deleting collection: ' + error.message)
    }
  })

  const handleDelete = (collection) => {
    if (collection._count.products > 0) {
      toast.error(`Cannot delete collection "${collection.name}" because it has ${collection._count.products} products. Remove products first.`)
      return
    }

    if (window.confirm(`Are you sure you want to delete "${collection.name}"? This action cannot be undone.`)) {
      deleteCollection({ variables: { id: collection.id } })
    }
  }

  const getStatusBadge = (isActive) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    )
  }

  const getProductImageUrl = (product) => {
    const { images } = product || {}
    if (!images) return null
    if (Array.isArray(images)) {
      return images[0] || null
    }
    if (typeof images === 'string') {
      const trimmed = images.trim()
      if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
        try {
          const parsed = JSON.parse(trimmed)
          if (Array.isArray(parsed)) return parsed[0] || null
          if (parsed && typeof parsed === 'object') return parsed.secureUrl || parsed.url || null
        } catch (_) {
          // fall through to return the raw string
        }
      }
      return trimmed
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Collections Table */}
      <div className="bg-white shadow-sm rounded-lg border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Collections ({collectionsCount})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Collection
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {collections.map((collection) => {
                // Parse image if it exists
                let imageUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyMEMxNy45IDIwIDEgMjguNyAxIDQwUzE3LjkgNjAgMzIgNjAgNjMgNTEuMyA2MyA0MCA0NS4xIDIwIDMyIDIwWk0zMiA1NkMxNy45IDU2IDEgNDguMyAxIDQwUzE3LjkgMjQgMzIgMjQgNjMgMzEuNyA2MyA0MCA0NS4xIDU2IDMyIDU2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                
                if (collection.image) {
                  imageUrl = collection.image
                }

                return (
                  <tr key={collection.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover bg-gray-100"
                            src={imageUrl}
                            alt={collection.name}
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyMEMxNy45IDIwIDEgMjguNyAxIDQwUzE3LjkgNjAgMzIgNjAgNjMgNTEuMyA2MyA0MCA0NS4xIDIwIDMyIDIwWk0zMiA1NkMxNy45IDU2IDEgNDguMyAxIDQwUzE3LjkgMjQgMzIgMjQgNjMgMzEuNyA2MyA0MCA0NS4xIDU2IDMyIDU2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {collection.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {collection.description || 'No description'}
                          </div>
                          <div className="text-xs text-gray-400">
                            /{collection.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {collection._count.products}
                        </div>
                        <div className="text-xs text-gray-500">
                          {collection._count.products === 1 ? 'product' : 'products'}
                        </div>
                        {collection.products.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {collection.products.slice(0, 3).map((productCollection, index) => {
                              const product = productCollection.product
                              const productImage = getProductImageUrl(product)
                              return (
                                <div
                                  key={product.id}
                                  className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs"
                                  title={product.name}
                                >
                                  {productImage ? (
                                    <img
                                      src={productImage}
                                      alt={product.name}
                                      className="w-full h-full rounded-full object-cover"
                                    />
                                  ) : (
                                    product.name.charAt(0)
                                  )}
                                </div>
                              )
                            })}
                            {collection.products.length > 3 && (
                              <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                                +{collection.products.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(collection.isActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(collection.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={routes.adminCollectionEdit({ id: collection.id })}
                          className="text-purple-600 hover:text-purple-900 p-1"
                          title="Edit collection"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(collection)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete collection"
                          disabled={collection._count.products > 0}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}