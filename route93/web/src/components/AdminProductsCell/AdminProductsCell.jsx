import { Link, routes } from '@redwoodjs/router'
import { useMutation, gql } from '@redwoodjs/web'
import { useState } from 'react'
import { toast } from '@redwoodjs/web/toast'

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: Int!) {
    deleteProduct(id: $id) {
      id
    }
  }
`

export const QUERY = gql`
  query AdminProductsQuery($limit: Int, $offset: Int, $search: String, $status: String, $categoryId: Int) {
    products(limit: $limit, offset: $offset, search: $search, status: $status, categoryId: $categoryId) {
      id
      name
      description
      price
      salePrice
      inventory
      status
      images
      slug
      createdAt
      updatedAt
      category {
        id
        name
      }
    }
    productsCount: productsCount(search: $search, status: $status, categoryId: $categoryId)
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
      📦
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
    <p className="text-gray-500">
      {search ? `No products match "${search}"` : 'Get started by adding your first product.'}
    </p>
  </div>
)

export const Failure = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="text-red-800">
      <h3 className="font-semibold">Error loading products</h3>
      <p className="text-sm mt-1">{error?.message}</p>
    </div>
  </div>
)

export const Success = ({ products, productsCount }) => {
  const formatPrice = (price) => `€${price.toFixed(2)}`
  const formatDate = (date) => new Date(date).toLocaleDateString()

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => {
      toast.success('Product deleted successfully!')
      // Refresh the page to update the list
      window.location.reload()
    },
    onError: (error) => {
      toast.error('Error deleting product: ' + error.message)
    }
  })

  const UPDATE_PRODUCT = gql`
    mutation UpdateProductStatusBulk($id: Int!, $input: UpdateProductInput!) {
      updateProduct(id: $id, input: $input) { id status }
    }
  `

  const [updateProductSilent] = useMutation(UPDATE_PRODUCT)

  const [selectedIds, setSelectedIds] = useState([])
  const [bulkStatus, setBulkStatus] = useState('ACTIVE')
  const [isBulkProcessing, setIsBulkProcessing] = useState(false)

  const toggleSelect = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const toggleSelectAll = (checked) => {
    if (checked) setSelectedIds(products.map((p) => p.id))
    else setSelectedIds([])
  }

  const handleBulkStatusApply = async () => {
    if (selectedIds.length === 0) return
    setIsBulkProcessing(true)
    try {
      await Promise.allSettled(
        selectedIds.map((id) => updateProductSilent({ variables: { id, input: { status: bulkStatus } } }))
      )
      toast.success('Product statuses updated')
      window.location.reload()
    } catch (e) {
      toast.error('Failed to update some products')
    } finally {
      setIsBulkProcessing(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Delete ${selectedIds.length} selected product(s)? This cannot be undone.`)) return
    setIsBulkProcessing(true)
    try {
      await Promise.allSettled(
        selectedIds.map((id) => deleteProduct({ variables: { id } }))
      )
      toast.success('Selected products deleted')
      window.location.reload()
    } catch (e) {
      toast.error('Failed to delete some products')
    } finally {
      setIsBulkProcessing(false)
    }
  }

  const handleDelete = (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      deleteProduct({ variables: { id: product.id } })
    }
  }
  
  const getStatusBadge = (status) => {
    const statusStyles = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      OUT_OF_STOCK: 'bg-red-100 text-red-800'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.INACTIVE}`}>
        {status.replace('_', ' ')}
      </span>
    )
  }

  const getStockStatus = (inventory) => {
    if (inventory === 0) return { color: 'text-red-600', text: 'Out of stock' }
    if (inventory < 10) return { color: 'text-yellow-600', text: 'Low stock' }
    return { color: 'text-green-600', text: 'In stock' }
  }

  return (
    <div className="space-y-6">
      {/* Bulk actions toolbar */}
      <div className="bg-white shadow-sm rounded-lg border p-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Selected: <span className="font-medium">{selectedIds.length}</span> / {productsCount}
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Set status to</label>
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
            <button
              onClick={handleBulkStatusApply}
              disabled={isBulkProcessing || selectedIds.length === 0}
              className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              Apply
            </button>
          </div>
          <div className="border-l h-6 mx-1" />
          <button
            onClick={handleBulkDelete}
            disabled={isBulkProcessing || selectedIds.length === 0}
            className="px-3 py-1.5 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
          >
            Delete Selected
          </button>
        </div>
      </div>
      {/* Products Table */}
      <div className="bg-white shadow-sm rounded-lg border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Products ({productsCount})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                    checked={selectedIds.length > 0 && selectedIds.length === products.length}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    aria-label="Select all"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
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
              {products.map((product) => {
                const stockStatus = getStockStatus(product.inventory)
                // Parse images JSON if it exists, otherwise use placeholder
                let imageUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAxNkM5Ljc5IDE2IDEgMjIuNzkgMSAzMlM5Ljc5IDQ4IDI0IDQ4IDQ3IDQxLjIxIDQ3IDMySzM3LjIxIDE2IDI0IDE2Wk0yNCA0NEM5Ljc5IDQ0IDEgMzkuMjEgMSAzMlM5Ljc5IDIwIDI0IDIwUzQ3IDI0Ljc5IDQ3IDMySzM3LjIxIDQ0IDI0IDQ0WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                
                if (product.images) {
                  try {
                    const images = JSON.parse(product.images)
                    if (Array.isArray(images) && images.length > 0) {
                      imageUrl = images[0]
                    }
                  } catch (e) {
                    // If images is not valid JSON, treat it as a single URL
                    if (typeof product.images === 'string' && product.images.trim()) {
                      imageUrl = product.images
                    }
                  }
                }
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        aria-label={`Select product ${product.id}`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover bg-gray-100"
                            src={imageUrl}
                            alt={product.name}
                            onError={(e) => {
                              // Use a simple SVG placeholder to prevent infinite retries
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAxNkM5Ljc5IDE2IDEgMjIuNzkgMSAzMlM5Ljc5IDQ4IDI0IDQ4IDQ3IDQxLjIxIDQ3IDMySzM3LjIxIDE2IDI0IDE2Wk0yNCA0NEM5Ljc5IDQ0IDEgMzkuMjEgMSAzMlM5Ljc5IDIwIDI0IDIwUzQ3IDI0Ljc5IDQ3IDMySzM3LjIxIDQ0IDI0IDQ0WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        {product.salePrice ? (
                          <>
                            <span className="line-through text-gray-500">
                              {formatPrice(product.price)}
                            </span>
                            <span className="ml-2 text-red-600 font-medium">
                              {formatPrice(product.salePrice)}
                            </span>
                          </>
                        ) : (
                          formatPrice(product.price)
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className={`font-medium ${stockStatus.color}`}>
                          {product.inventory}
                        </div>
                        <div className={`text-xs ${stockStatus.color}`}>
                          {stockStatus.text}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={routes.adminProductEdit({ id: product.id })}
                          className="text-purple-600 hover:text-purple-900 p-1"
                          title="Edit product"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete product"
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
