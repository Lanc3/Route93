import { useState, useMemo } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import AdminProductsCell from 'src/components/AdminProductsCell'

const AdminProductsPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    categoryId: null,
    limit: 20,
    offset: 0
  })

  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters, offset: 0 }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const search = formData.get('search')
    handleFilterChange({ search })
  }

  // Memoize the cell props to prevent unnecessary re-renders
  const cellProps = useMemo(() => ({
    search: filters.search || undefined,
    status: filters.status || undefined,
    categoryId: filters.categoryId || undefined,
    limit: filters.limit,
    offset: filters.offset
  }), [filters.search, filters.status, filters.categoryId, filters.limit, filters.offset])

  return (
    <>
      <Metadata title="Products Management - Admin" description="Manage products, inventory, and pricing" />

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
                <p className="text-gray-600 mt-1">Manage your product catalog, inventory, and pricing</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to={routes.admin()}
                  className="btn-outline"
                >
                  ← Back to Dashboard
                </Link>
                                    <Link to={routes.adminProductAdd()} className="btn-primary">
                      + Add Product
                    </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="md:col-span-2">
                <div className="relative">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search products..."
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

              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange({ status: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>

              {/* Category Filter */}
              <select
                value={filters.categoryId || ''}
                onChange={(e) => handleFilterChange({ categoryId: e.target.value ? parseInt(e.target.value) : null })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="1">Electronics</option>
                <option value="2">Clothing</option>
                <option value="3">Home & Garden</option>
                <option value="4">Sports & Outdoor</option>
              </select>
            </div>

            {/* Active Filters */}
            {(filters.search || filters.status || filters.categoryId) && (
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
                {filters.status && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Status: {filters.status}
                    <button
                      onClick={() => handleFilterChange({ status: '' })}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-500"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.categoryId && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Category filter
                    <button
                      onClick={() => handleFilterChange({ categoryId: null })}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-500"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => setFilters({ search: '', status: '', categoryId: null, limit: 20, offset: 0 })}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Products List */}
          <AdminProductsCell 
            search={filters.search || undefined}
            status={filters.status || undefined}
            categoryId={filters.categoryId || undefined}
            limit={filters.limit}
            offset={filters.offset}
          />
        </div>
      </div>
    </>
  )
}

export default AdminProductsPage
