import { useState } from 'react'
import { navigate, routes } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import CollectionForm from 'src/components/CollectionForm/CollectionForm'

const UPDATE_COLLECTION = gql`
  mutation UpdateCollection($id: Int!, $input: UpdateCollectionInput!) {
    updateCollection(id: $id, input: $input) {
      id
      name
      slug
    }
  }
`

export const QUERY = gql`
  query FindCollectionById($id: Int!) {
    collection(id: $id) {
      id
      name
      description
      slug
      image
      isActive
      createdAt
      updatedAt
      products {
        product {
          id
          name
          images
          price
          salePrice
          status
        }
      }
      _count {
        products
      }
    }
  }
`

export const Loading = () => (
  <div className="bg-white shadow-sm rounded-lg border">
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="p-6">
      <div className="animate-pulse space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export const Empty = () => (
  <div className="bg-white shadow-sm rounded-lg border">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Collection Not Found</h3>
    </div>
    <div className="p-6">
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
          📚
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Collection not found</h3>
        <p className="text-gray-500 mb-4">
          The collection you're looking for doesn't exist or may have been deleted.
        </p>
        <button
          onClick={() => navigate(routes.adminCollections())}
          className="btn-primary"
        >
          ← Back to Collections
        </button>
      </div>
    </div>
  </div>
)

export const Failure = ({ error }) => (
  <div className="bg-white shadow-sm rounded-lg border">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Error Loading Collection</h3>
    </div>
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">
          <h3 className="font-semibold">Failed to load collection</h3>
          <p className="text-sm mt-1">{error?.message}</p>
        </div>
        <button
          onClick={() => navigate(routes.adminCollections())}
          className="mt-4 btn-outline"
        >
          ← Back to Collections
        </button>
      </div>
    </div>
  </div>
)

export const Success = ({ collection }) => {
  const [updateCollection, { loading, error }] = useMutation(UPDATE_COLLECTION, {
    onCompleted: (data) => {
      toast.success(`Collection "${data.updateCollection.name}" updated successfully!`)
      navigate(routes.adminCollections())
    },
    onError: (error) => {
      toast.error('Error updating collection: ' + error.message)
    }
  })

  const onSave = (input) => {
    updateCollection({ variables: { id: collection.id, input } })
  }

  // Product linking mutations
  const ADD_PRODUCT_TO_COLLECTION = gql`
    mutation AddProductToCollection($collectionId: Int!, $productId: Int!) {
      addProductToCollection(collectionId: $collectionId, productId: $productId) {
        id
      }
    }
  `

  const REMOVE_PRODUCT_FROM_COLLECTION = gql`
    mutation RemoveProductFromCollection($collectionId: Int!, $productId: Int!) {
      removeProductFromCollection(collectionId: $collectionId, productId: $productId) {
        id
      }
    }
  `

  const [addProductToCollection, { loading: adding }] = useMutation(ADD_PRODUCT_TO_COLLECTION, {
    refetchQueries: [{ query: QUERY, variables: { id: collection.id } }],
    awaitRefetchQueries: true,
    onCompleted: () => toast.success('Product added to collection'),
    onError: (e) => toast.error(e.message)
  })

  const [removeProductFromCollection, { loading: removing }] = useMutation(REMOVE_PRODUCT_FROM_COLLECTION, {
    refetchQueries: [{ query: QUERY, variables: { id: collection.id } }],
    awaitRefetchQueries: true,
    onCompleted: () => toast.success('Product removed from collection'),
    onError: (e) => toast.error(e.message)
  })

  // Search products
  const [search, setSearch] = useState('')
  const SEARCH_PRODUCTS = gql`
    query SearchProducts($search: String, $limit: Int, $offset: Int) {
      products(search: $search, limit: $limit, offset: $offset) {
        id
        name
        images
      }
    }
  `

  const { data: searchData, loading: searching } = useQuery(SEARCH_PRODUCTS, {
    variables: { search: search || undefined, limit: search && search.length >= 2 ? 10 : 0, offset: 0 },
    fetchPolicy: 'cache-and-network'
  })

  const existingProductIds = new Set((collection.products || []).map((pc) => pc.product.id))

  const results = (searchData?.products || []).filter((p) => !existingProductIds.has(p.id))

  return (
    <div className="space-y-8">
      <CollectionForm
        collection={collection}
        onSave={onSave}
        error={error}
        loading={loading}
      />

      <div className="bg-white shadow-sm rounded-lg border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Manage Products in this Collection</h3>
          <p className="text-sm text-gray-600 mt-1">Add or remove products linked to this collection.</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current products */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Current Products</h4>
            <div className="space-y-3">
              {(collection.products || []).length === 0 && (
                <div className="text-sm text-gray-500">No products linked yet.</div>
              )}
              {(collection.products || []).map((pc) => (
                <div key={pc.product.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src={typeof pc.product.images === 'string' ? pc.product.images : (pc.product.images?.[0] || '')}
                      alt={pc.product.name}
                      className="w-10 h-10 rounded object-cover bg-gray-100"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                    <div className="text-sm text-gray-900">{pc.product.name}</div>
                  </div>
                  <button
                    className="text-red-600 hover:text-red-800 text-sm"
                    disabled={removing}
                    onClick={() => removeProductFromCollection({ variables: { collectionId: collection.id, productId: pc.product.id } })}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Search and add */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Search Products to Add</h4>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3"
            />
            <div className="space-y-3">
              {search && search.length < 2 && (
                <div className="text-xs text-gray-500">Type at least 2 characters to search</div>
              )}
              {search && search.length >= 2 && searching && (
                <div className="text-sm text-gray-500">Searching...</div>
              )}
              {search && search.length >= 2 && !searching && results.length === 0 && (
                <div className="text-sm text-gray-500">No matching products</div>
              )}
              {results.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src={typeof p.images === 'string' ? p.images : (p.images?.[0] || '')}
                      alt={p.name}
                      className="w-10 h-10 rounded object-cover bg-gray-100"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                    <div className="text-sm text-gray-900">{p.name}</div>
                  </div>
                  <button
                    className="text-green-600 hover:text-green-800 text-sm"
                    disabled={adding}
                    onClick={() => addProductToCollection({ variables: { collectionId: collection.id, productId: p.id } })}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}