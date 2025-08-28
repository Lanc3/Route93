import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { useAuth } from 'src/auth'
import AnalyticsKpi from 'src/components/AnalyticsKPI/AnalyticsKPI'
import AnalyticsChart from 'src/components/AnalyticsChart/AnalyticsChart'
import AnalyticsMetricsGrid from 'src/components/AnalyticsMetricsGrid/AnalyticsMetricsGrid'
import AnalyticsChartGrid from 'src/components/AnalyticsChartGrid/AnalyticsChartGrid'

export const QUERY = gql`
  query AdminAnalyticsQuery($startDate: DateTime, $endDate: DateTime) {
    overallAnalytics(startDate: $startDate, endDate: $endDate) {
      salesReport {
        totalRevenue
        totalOrders
        averageOrderValue
        revenueGrowth
        ordersGrowth
        dailySales {
          date
          revenue
          orders
          customers
        }
        topCategories {
          categoryName
          revenue
          orders
        }
      }
      productAnalytics {
        topSellingProducts {
          productName
          totalSales
          totalQuantity
          category
        }
        lowPerformingProducts {
          productName
          totalSales
          totalQuantity
          category
        }
        productsByCategory {
          categoryName
          productCount
          averagePrice
          totalRevenue
        }
      }
      userAnalytics {
        totalUsers
        newUsersThisMonth
        activeUsers
        userGrowth
        topCustomers {
          userName
          userEmail
          totalOrders
          totalSpent
          averageOrderValue
        }
        userActivity {
          date
          activeUsers
          orders
          revenue
        }
      }
      conversionRate
      averageSessionValue
      returnCustomerRate
    }
  }
`

export const Loading = () => (
  <div className="space-y-6">
    <div className="animate-pulse">
      {/* Overview Cards Loading */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="ml-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts Loading */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
)

export const Empty = () => (
  <div className="text-center py-12">
    <div className="w-24 h-24 mx-auto mb-4 text-gray-300">📊</div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data available</h3>
    <p className="text-gray-500 mb-4">Analytics data will appear once you have orders and user activity.</p>
  </div>
)

export const Failure = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="text-red-800">
      <h3 className="font-semibold">Error loading analytics</h3>
      <p className="text-sm mt-1">{error?.message}</p>
    </div>
  </div>
)

export const Success = ({ startDate, endDate }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('90d')
  const { currentUser, isAuthenticated } = useAuth()
  
  // Check authentication
  if (!isAuthenticated || currentUser?.role !== 'ADMIN') {
    console.warn('AdminAnalyticsCell - User not authenticated or not admin:', { isAuthenticated, role: currentUser?.role })
    return <Failure error={{ message: 'Access denied. Admin privileges required.' }} />
  }
  
  // Use the GraphQL query with the date parameters
  const { data, loading, error } = useQuery(QUERY, {
    variables: { startDate, endDate },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })
  
  // Debug logging
  console.log('AdminAnalyticsCell - Query variables:', { startDate, endDate })
  console.log('AdminAnalyticsCell - Query result:', { data, loading, error })
  
  // Show loading state
  if (loading) {
    return <Loading />
  }
  
  // Show error state
  if (error) {
    console.error('AdminAnalyticsCell - GraphQL error:', error)
    return <Failure error={error} />
  }
  
  // Use the fetched data
  const analyticsData = data?.overallAnalytics
  console.log('AdminAnalyticsCell - Analytics data:', analyticsData)
  console.log('AdminAnalyticsCell - Full data object:', data)
  
  // Check if we have data
  if (!analyticsData) {
    console.warn('AdminAnalyticsCell - No analytics data received')
    console.warn('AdminAnalyticsCell - Data structure:', data)
    return <Empty />
  }
  
  // Destructure with fallbacks to prevent errors
  const { 
    salesReport = {}, 
    productAnalytics = {}, 
    userAnalytics = {} 
  } = analyticsData
  
  // Check if required data exists
  if (!salesReport || !productAnalytics || !userAnalytics) {
    console.warn('AdminAnalyticsCell - Missing required data sections:', { salesReport, productAnalytics, userAnalytics })
    return <Empty />
  }
  
  const formatCurrency = (amount) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(amount)
  const formatPercent = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`

  // Prepare metrics for KPI grid with safety checks
  const metrics = [
    {
      title: 'Total Revenue',
      value: salesReport.totalRevenue || 0,
      change: salesReport.revenueGrowth || 0,
      changeType: (salesReport.revenueGrowth || 0) >= 0 ? 'positive' : 'negative',
      icon: '💰',
      format: 'currency'
    },
    {
      title: 'Total Orders',
      value: salesReport.totalOrders || 0,
      change: salesReport.ordersGrowth || 0,
      changeType: (salesReport.ordersGrowth || 0) >= 0 ? 'positive' : 'negative',
      icon: '📦',
      format: 'number'
    },
    {
      title: 'Average Order Value',
      value: salesReport.averageOrderValue || 0,
      change: 0, // Could calculate this if we have historical data
      changeType: 'neutral',
      icon: '📊',
      format: 'currency'
    },
    {
      title: 'Total Customers',
      value: userAnalytics.totalUsers || 0,
      change: userAnalytics.userGrowth || 0,
      changeType: (userAnalytics.userGrowth || 0) >= 0 ? 'positive' : 'negative',
      icon: '👥',
      format: 'number'
    }
  ]

  // Prepare chart data with safety checks
  const dailySales = salesReport.dailySales || []
  const topCategories = salesReport.topCategories || []
  
  const revenueChartData = {
    labels: dailySales.map(sale => new Date(sale.date).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Daily Revenue',
        data: dailySales.map(sale => sale.revenue || 0),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const ordersChartData = {
    labels: dailySales.map(sale => new Date(sale.date).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Daily Orders',
        data: dailySales.map(sale => sale.orders || 0),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const categoryChartData = {
    labels: topCategories.map(cat => cat.categoryName || 'Unknown'),
    datasets: [
      {
        data: topCategories.map(cat => cat.revenue || 0),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#06B6D4'
        ]
      }
    ]
  }

  const charts = [
    {
      title: 'Revenue Trend',
      type: 'line',
      data: revenueChartData,
      height: 300
    },
    {
      title: 'Orders Trend',
      type: 'line',
      data: ordersChartData,
      height: 300
    },
    {
      title: 'Revenue by Category',
      type: 'doughnut',
      data: categoryChartData,
      height: 300
    }
  ]

  return (
    <div className="space-y-8">
      {/* Enhanced KPI Metrics Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Performance Indicators</h2>
        <AnalyticsMetricsGrid metrics={metrics} />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsKpi
          title="New Users This Month"
          value={userAnalytics.newUsersThisMonth}
          change={0}
          changeType="neutral"
          icon="🆕"
          format="number"
          className="bg-gradient-to-br from-blue-50 to-blue-100"
        />
        <AnalyticsKpi
          title="Active Users"
          value={userAnalytics.activeUsers}
          change={0}
          changeType="neutral"
          icon="🔥"
          format="number"
          className="bg-gradient-to-br from-green-50 to-green-100"
        />
        <AnalyticsKpi
          title="Return Customer Rate"
          value={analyticsData.returnCustomerRate || 0}
          change={0}
          changeType="neutral"
          icon="🔄"
          format="percentage"
          className="bg-gradient-to-br from-purple-50 to-purple-100"
        />
      </div>

      {/* Enhanced Charts Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Analytics Charts</h2>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All Time</option>
          </select>
        </div>
        <AnalyticsChartGrid charts={charts} />
      </div>

      {/* Top Products and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {productAnalytics.topSellingProducts.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(product.totalSales)}</p>
                    <p className="text-xs text-gray-500">{product.totalQuantity} sold</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Categories</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {salesReport.topCategories.slice(0, 5).map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{category.categoryName}</p>
                    <p className="text-xs text-gray-500">{category.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(category.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Order</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userAnalytics.topCustomers.slice(0, 10).map((customer, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{customer.userName}</div>
                      <div className="text-sm text-gray-500">{customer.userEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.totalOrders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(customer.totalSpent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(customer.averageOrderValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Performing Products */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Products Needing Attention</h3>
          <p className="text-sm text-gray-600">Low performing products that may need promotion or review</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productAnalytics.lowPerformingProducts.slice(0, 6).map((product, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{formatCurrency(product.totalSales)}</p>
                    <p className="text-xs text-gray-500">{product.totalQuantity} sold</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}