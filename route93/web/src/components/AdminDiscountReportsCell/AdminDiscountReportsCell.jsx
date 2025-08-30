import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'

const QUERY = gql`
  query AdminDiscountReportsQuery($startDate: DateTime, $endDate: DateTime) {
    discountAnalytics(startDate: $startDate, endDate: $endDate) {
      totalDiscountCodes
      activeDiscountCodes
      totalUsageCount
      totalDiscountAmount
      averageDiscountPerOrder
      mostPopularDiscount {
        discountCodeId
        code
        name
        type
        usageCount
        totalDiscountAmount
        averageDiscountPerUse
        revenueImpact
        lastUsed
      }
      discountPerformance {
        discountCodeId
        code
        name
        type
        usageCount
        totalDiscountAmount
        averageDiscountPerUse
        revenueImpact
        lastUsed
      }
      usageByType {
        type
        count
        totalAmount
        percentage
      }
      monthlyDiscountTrends {
        month
        totalDiscounts
        totalAmount
        uniqueCodes
      }
    }
  }
`

export const Loading = () => (
  <div className="space-y-6">
    {/* KPI Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Charts Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export const Empty = () => (
  <div className="bg-white rounded-lg shadow-sm p-12 text-center">
    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No Discount Data Available</h3>
    <p className="text-gray-600 mb-4">There are no discount codes or usage data to display for the selected period.</p>
    <p className="text-sm text-gray-500">Try adjusting your date range or create some discount codes to see analytics.</p>
  </div>
)

export const Failure = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
    <div className="flex items-center">
      <svg className="w-8 h-8 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <h3 className="text-lg font-medium text-red-800">Error Loading Discount Reports</h3>
        <p className="text-red-600 mt-1">{error?.message}</p>
      </div>
    </div>
  </div>
)

const AdminDiscountReportsCell = ({ startDate, endDate }) => {
  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      startDate: startDate || null,
      endDate: endDate || null
    },
    fetchPolicy: 'cache-and-network'
  })

  if (loading) return <Loading />
  if (error) return <Failure error={error} />
  if (!data?.discountAnalytics) return <Empty />

  return <Success discountAnalytics={data.discountAnalytics} />
}

const Success = ({ discountAnalytics }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString()
  }

  // Prepare chart data for monthly trends
  const chartData = useMemo(() => {
    return discountAnalytics.monthlyDiscountTrends.map(trend => ({
      month: new Date(trend.month + '-01').toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      }),
      discounts: trend.totalDiscounts,
      amount: trend.totalAmount,
      codes: trend.uniqueCodes
    }))
  }, [discountAnalytics.monthlyDiscountTrends])

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Codes</p>
              <p className="text-2xl font-bold text-gray-900">{discountAnalytics.totalDiscountCodes}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-green-600">
              {discountAnalytics.activeDiscountCodes} active
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Usage</p>
              <p className="text-2xl font-bold text-gray-900">{discountAnalytics.totalUsageCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {formatCurrency(discountAnalytics.totalDiscountAmount)} given
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg per Order</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(discountAnalytics.averageDiscountPerOrder)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              On orders with discounts
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Most Popular</p>
              <p className="text-lg font-bold text-gray-900 truncate">
                {discountAnalytics.mostPopularDiscount.code}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {discountAnalytics.mostPopularDiscount.usageCount} uses
            </p>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage by Type */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Discount Types Usage</h3>
          <div className="space-y-4">
            {discountAnalytics.usageByType.map((type, index) => (
              <div key={type.type} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500'][index % 4]
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {type.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{type.count} uses</div>
                  <div className="text-xs text-gray-500">{formatPercentage(type.percentage)}</div>
                </div>
              </div>
            ))}
            {discountAnalytics.usageByType.length === 0 && (
              <p className="text-gray-500 text-center py-4">No usage data available</p>
            )}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Trends</h3>
          <div className="space-y-3">
            {chartData.slice(-6).map((month) => (
              <div key={month.month} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">{month.month}</span>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{month.discounts} discounts</div>
                  <div className="text-xs text-gray-500">{formatCurrency(month.amount)}</div>
                </div>
              </div>
            ))}
            {chartData.length === 0 && (
              <p className="text-gray-500 text-center py-4">No trend data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Performing Discounts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Discounts</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg per Use
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Used
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {discountAnalytics.discountPerformance.slice(0, 10).map((discount) => (
                <tr key={discount.discountCodeId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{discount.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{discount.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">
                      {discount.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{discount.usageCount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(discount.totalDiscountAmount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {formatCurrency(discount.averageDiscountPerUse)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {formatDate(discount.lastUsed)}
                    </span>
                  </td>
                </tr>
              ))}
              {discountAnalytics.discountPerformance.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No discount performance data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDiscountReportsCell
