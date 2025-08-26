import { useState, useEffect } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import AdminOrdersCell from 'src/components/AdminOrdersCell/AdminOrdersCell'
import OrderQuickStatsCell from 'src/components/OrderQuickStatsCell/OrderQuickStatsCell'

const AdminOrdersPage = ({ status: urlStatus, search: urlSearch }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 20,
    offset: 0
  })

  // Initialize filters from URL parameters
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      status: urlStatus || '',
      search: urlSearch || ''
    }))
  }, [urlStatus, urlSearch])

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, offset: 0 })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const search = formData.get('search')
    handleFilterChange({ search })
  }

  const handleSort = (sortBy) => {
    const sortOrder = filters.sortBy === sortBy && filters.sortOrder === 'desc' ? 'asc' : 'desc'
    handleFilterChange({ sortBy, sortOrder })
  }

  return (
    <>
      <Metadata title="Orders Management - Admin" description="Manage customer orders and track shipments" />

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {filters.status ? `${filters.status.charAt(0) + filters.status.slice(1).toLowerCase()} Orders` : 'Orders Management'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {filters.status ? `Viewing ${filters.status.toLowerCase()} orders` : 'Track and manage customer orders'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to={routes.admin()}
                  className="btn-outline"
                >
                  ← Back to Dashboard
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
                    placeholder="Search by order number, customer name or email..."
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
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REFUNDED">Refunded</option>
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
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="totalAmount-desc">Highest Amount</option>
                <option value="totalAmount-asc">Lowest Amount</option>
                <option value="orderNumber-asc">Order Number A-Z</option>
                <option value="orderNumber-desc">Order Number Z-A</option>
                <option value="status-asc">Status A-Z</option>
                <option value="status-desc">Status Z-A</option>
              </select>
            </div>

            {/* Active Filters */}
            {(filters.search || filters.status) && (
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
                <button
                  onClick={() => setFilters({ search: '', status: '', sortBy: 'createdAt', sortOrder: 'desc', limit: 20, offset: 0 })}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <OrderQuickStatsCell />

          {/* Orders List */}
          <AdminOrdersCell
            search={filters.search || undefined}
            status={filters.status || undefined}
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            limit={filters.limit}
            offset={filters.offset}
          />
        </div>
      </div>
    </>
  )
}

export default AdminOrdersPage