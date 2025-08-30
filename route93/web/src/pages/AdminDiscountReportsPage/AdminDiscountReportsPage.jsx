import { useState } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import AdminDiscountReportsCell from 'src/components/AdminDiscountReportsCell'

const AdminDiscountReportsPage = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleClearDates = () => {
    setDateRange({
      startDate: '',
      endDate: ''
    })
  }

  return (
    <>
      <Metadata
        title="Discount Reports & Analytics"
        description="Comprehensive discount code analytics and performance reports"
      />

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Discount Reports</h1>
                <p className="mt-2 text-gray-600">
                  Analyze discount code performance and usage patterns
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to={routes.adminDiscountCodes()}
                  className="btn-outline"
                >
                  ← Back to Discount Codes
                </Link>
                <Link
                  to={routes.adminDiscountCodeAdd()}
                  className="btn-primary"
                >
                  Create Discount Code
                </Link>
              </div>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleClearDates}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Dates
              </button>

              <div className="text-sm text-gray-500">
                {dateRange.startDate || dateRange.endDate
                  ? `Filtering: ${dateRange.startDate || 'All time'} to ${dateRange.endDate || 'Now'}`
                  : 'Showing: Last 90 days'
                }
              </div>
            </div>
          </div>

          {/* Reports Content */}
          <AdminDiscountReportsCell
            startDate={dateRange.startDate ? new Date(dateRange.startDate).toISOString() : null}
            endDate={dateRange.endDate ? new Date(dateRange.endDate).toISOString() : null}
          />
        </div>
      </div>
    </>
  )
}

export default AdminDiscountReportsPage
