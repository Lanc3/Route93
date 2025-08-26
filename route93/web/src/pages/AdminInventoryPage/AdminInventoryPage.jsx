import { useState } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import AdminInventoryCell from 'src/components/AdminInventoryCell/AdminInventoryCell'

const AdminInventoryPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    stockStatus: '',
    sortBy: 'inventory',
    sortOrder: 'asc',
    lowStockThreshold: 10,
    limit: 50,
    offset: 0
  })

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, offset: 0 })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const search = formData.get('search')
    handleFilterChange({ search })
  }

  return (
    <>
      <Metadata title="Inventory Management - Admin" description="Manage product inventory and stock levels" />

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                <p className="text-gray-600 mt-1">Monitor stock levels and manage inventory</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to={routes.admin()}
                  className="btn-outline"
                >
                  ← Back to Dashboard
                </Link>
                <Link to={routes.adminProducts()} className="btn-primary">
                  Manage Products
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="md:col-span-2">
                <div className="relative">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search products by name, SKU..."
                    defaultValue={filters.search}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </form>

              {/* Stock Status Filter */}
              <select
                value={filters.stockStatus}
                onChange={(e) => handleFilterChange({ stockStatus: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Stock Levels</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
                <option value="CRITICAL">Critical (≤5)</option>
                <option value="LOW_STOCK">Low Stock (≤10)</option>
                <option value="IN_STOCK">In Stock (>10)</option>
              </select>

              {/* Sort Options */}
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-')
                  handleFilterChange({ sortBy, sortOrder })
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="inventory-asc">Stock: Low to High</option>
                <option value="inventory-desc">Stock: High to Low</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="updatedAt-desc">Recently Updated</option>
              </select>

              {/* Low Stock Threshold */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={filters.lowStockThreshold}
                  onChange={(e) => handleFilterChange({ lowStockThreshold: parseInt(e.target.value) || 10 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Active Filters */}
            {(filters.search || filters.stockStatus) && (
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                {filters.search && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Search: "{filters.search}"
                    <button
                      onClick={() => handleFilterChange({ search: '' })}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-500"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.stockStatus && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Status: {filters.stockStatus.replace('_', ' ')}
                    <button
                      onClick={() => handleFilterChange({ stockStatus: '' })}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-500"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => setFilters({ search: '', stockStatus: '', sortBy: 'inventory', sortOrder: 'asc', lowStockThreshold: 10, limit: 50, offset: 0 })}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Inventory Management Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Inventory Management Tips
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Click on any stock number to quickly edit inventory levels</li>
                    <li>Monitor critical stock items (≤5) and low stock items (≤10) regularly</li>
                    <li>Use filters to focus on specific stock levels or product categories</li>
                    <li>Adjust the low stock threshold based on your reorder requirements</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Data */}
          <AdminInventoryCell
            search={filters.search || undefined}
            stockStatus={filters.stockStatus || undefined}
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            lowStockThreshold={filters.lowStockThreshold}
            limit={filters.limit}
            offset={filters.offset}
          />
        </div>
      </div>
    </>
  )
}

export default AdminInventoryPage