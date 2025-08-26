import { useState } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import AdminAnalyticsCell from 'src/components/AdminAnalyticsCell/AdminAnalyticsCell'

const AdminAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0] // Today
  })

  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period)
    const now = new Date()
    let startDate

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0]
    })
  }

  const handleCustomDateChange = (field, value) => {
    setDateRange({ ...dateRange, [field]: value })
    setSelectedPeriod('custom')
  }

  return (
    <>
      <Metadata title="Analytics & Reports - Admin" description="View comprehensive analytics and reports for your e-commerce store" />

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-gray-600 mt-1">Comprehensive insights into your store's performance</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to={routes.admin()}
                  className="btn-outline"
                >
                  ← Back to Dashboard
                </Link>
                <button className="btn-primary">
                  📊 Export Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Date Range Controls */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Time Period</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: '7d', label: 'Last 7 days' },
                    { value: '30d', label: 'Last 30 days' },
                    { value: '90d', label: 'Last 90 days' },
                    { value: '1y', label: 'Last year' },
                    { value: 'custom', label: 'Custom' }
                  ].map((period) => (
                    <button
                      key={period.value}
                      onClick={() => handlePeriodChange(period.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedPeriod === period.value
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>

              {selectedPeriod === 'custom' && (
                <div className="flex items-center space-x-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Showing data from <strong>{new Date(dateRange.startDate).toLocaleDateString()}</strong> to <strong>{new Date(dateRange.endDate).toLocaleDateString()}</strong>
            </div>
          </div>

          {/* Analytics Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Analytics Insights
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Monitor revenue growth and order trends to identify patterns</li>
                    <li>Review top-performing products to optimize inventory and marketing</li>
                    <li>Track customer behavior to improve conversion rates</li>
                    <li>Identify low-performing products that may need promotion or review</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Link
              to={routes.adminProducts()}
              className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  📦
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Manage Products</p>
                  <p className="text-xs text-gray-500">Update inventory & pricing</p>
                </div>
              </div>
            </Link>

            <Link
              to={routes.adminOrders()}
              className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  🛒
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">View Orders</p>
                  <p className="text-xs text-gray-500">Process & track orders</p>
                </div>
              </div>
            </Link>

            <Link
              to={routes.adminUsers()}
              className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  👥
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Customer Insights</p>
                  <p className="text-xs text-gray-500">View customer data</p>
                </div>
              </div>
            </Link>

            <Link
              to={routes.adminInventory()}
              className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  📊
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Inventory Status</p>
                  <p className="text-xs text-gray-500">Check stock levels</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Analytics Data */}
          <AdminAnalyticsCell
            startDate={new Date(dateRange.startDate).toISOString()}
            endDate={new Date(dateRange.endDate).toISOString()}
          />
        </div>
      </div>
    </>
  )
}

export default AdminAnalyticsPage