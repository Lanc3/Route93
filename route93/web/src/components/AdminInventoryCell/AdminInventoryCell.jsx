import { useState } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import JsBarcode from 'jsbarcode'
import { toast } from '@redwoodjs/web/toast'

const UPDATE_PRODUCT_INVENTORY = gql`
  mutation UpdateProductInventory($id: Int!, $inventory: Int!) {
    updateProductInventory(id: $id, inventory: $inventory) {
      id
      name
      inventory
    }
  }
`

export const QUERY = gql`
  query AdminInventoryQuery(
    $lowStockThreshold: Int
    $stockStatus: String
    $sortBy: String
    $sortOrder: String
    $limit: Int
    $offset: Int
    $search: String
  ) {
    inventoryProducts(
      lowStockThreshold: $lowStockThreshold
      stockStatus: $stockStatus
      sortBy: $sortBy
      sortOrder: $sortOrder
      limit: $limit
      offset: $offset
      search: $search
    ) {
      id
      name
      sku
      barcode
      price
      salePrice
      inventory
      status
      images
      category {
        id
        name
      }
    }
    inventoryStats {
      totalProducts
      inStockProducts
      outOfStockProducts
      lowStockProducts
      criticalStockProducts
      overstockedProducts
      totalInventoryValue
      averageStockLevel
    }
  }
`

export const Loading = () => (
  <div className="space-y-6">
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="ml-3 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export const Empty = () => (
  <div className="text-center py-12">
    <div className="w-24 h-24 mx-auto mb-4 text-gray-300">📦</div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
    <p className="text-gray-500 mb-4">No products available in inventory.</p>
  </div>
)

export const Failure = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="text-red-800">
      <h3 className="font-semibold">Error loading inventory</h3>
      <p className="text-sm mt-1">{error?.message}</p>
    </div>
  </div>
)

export const Success = ({ inventoryProducts, inventoryStats, refetch }) => {
  const [editingProduct, setEditingProduct] = useState(null)
  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  const [updateProductInventory] = useMutation(UPDATE_PRODUCT_INVENTORY, {
    onCompleted: () => {
      toast.success('Inventory updated successfully!')
      setEditingProduct(null)
      refetch()
    },
    onError: (error) => {
      toast.error('Error updating inventory: ' + error.message)
    }
  })

  const GENERATE_BARCODE = gql`
    mutation GenerateProductBarcode($id: Int!, $force: Boolean) {
      generateProductBarcode(id: $id, force: $force) { id barcode }
    }
  `
  const [generateProductBarcode] = useMutation(GENERATE_BARCODE)

  const downloadBarcodePng = (barcodeValue, filename) => {
    const canvas = document.createElement('canvas')
    JsBarcode(canvas, barcodeValue, { format: 'CODE128', width: 2, height: 80, displayValue: true, margin: 6 })
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const handleInventoryUpdate = (productId, newInventory) => {
    const inventory = parseInt(newInventory)
    if (isNaN(inventory) || inventory < 0) {
      toast.error('Inventory must be a non-negative number')
      return
    }
    updateProductInventory({ variables: { id: productId, inventory } })
  }

  const getStockStatusBadge = (inventory) => {
    if (inventory <= 0) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Out of Stock</span>
    } else if (inventory <= 5) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Critical</span>
    } else if (inventory <= 10) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Low Stock</span>
    } else {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">In Stock</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">📦</div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-2xl font-semibold text-gray-900">{inventoryStats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">✅</div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">In Stock</p>
              <p className="text-2xl font-semibold text-gray-900">{inventoryStats.inStockProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">⚠️</div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Low Stock</p>
              <p className="text-2xl font-semibold text-gray-900">{inventoryStats.lowStockProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">❌</div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Out of Stock</p>
              <p className="text-2xl font-semibold text-gray-900">{inventoryStats.outOfStockProducts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <p className="text-sm font-medium text-gray-500">Critical Stock</p>
          <p className="text-xl font-semibold text-red-600">{inventoryStats.criticalStockProducts}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <p className="text-sm font-medium text-gray-500">Overstocked</p>
          <p className="text-xl font-semibold text-blue-600">{inventoryStats.overstockedProducts}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <p className="text-sm font-medium text-gray-500">Total Inventory</p>
          <p className="text-xl font-semibold text-gray-900">{inventoryStats.totalInventoryValue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <p className="text-sm font-medium text-gray-500">Avg Stock Level</p>
          <p className="text-xl font-semibold text-gray-900">{inventoryStats.averageStockLevel}</p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white shadow-sm rounded-lg border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Inventory Products ({inventoryProducts.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        📦
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.category?.name || 'No category'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{formatCurrency(product.price)}</div>
                      {product.salePrice && (
                        <div className="text-xs text-green-600">Sale: {formatCurrency(product.salePrice)}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingProduct === product.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          defaultValue={product.inventory}
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleInventoryUpdate(product.id, e.target.value)
                            }
                          }}
                          onBlur={(e) => {
                            handleInventoryUpdate(product.id, e.target.value)
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => setEditingProduct(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div
                        className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                        onClick={() => setEditingProduct(product.id)}
                      >
                        <span className="text-lg font-semibold text-gray-900">{product.inventory}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStockStatusBadge(product.inventory)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={routes.adminProductEdit({ id: product.id })}
                        className="text-purple-600 hover:text-purple-900 p-1"
                        title="Edit product"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => setEditingProduct(product.id)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Quick edit inventory"
                      >
                        🏷️
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            let code = product.barcode
                            if (!code) {
                              const { data } = await generateProductBarcode({ variables: { id: product.id } })
                              code = data?.generateProductBarcode?.barcode
                            }
                            if (!code) {
                              toast.error('Failed to generate barcode')
                              return
                            }
                            downloadBarcodePng(code, `barcode-${product.sku || product.id}.png`)
                            toast.success('Barcode downloaded')
                          } catch (e) {
                            toast.error('Error generating barcode')
                          }
                        }}
                        className="text-gray-700 hover:text-gray-900 p-1"
                        title="Generate & download barcode"
                      >
                        🧾
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}