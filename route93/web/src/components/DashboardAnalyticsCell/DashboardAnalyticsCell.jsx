import { useState } from 'react'
import AnalyticsKpi from 'src/components/AnalyticsKPI/AnalyticsKPI'
import AnalyticsChart from 'src/components/AnalyticsChart/AnalyticsChart'
import AnalyticsMetricsGrid from 'src/components/AnalyticsMetricsGrid/AnalyticsMetricsGrid'
import AnalyticsChartGrid from 'src/components/AnalyticsChartGrid/AnalyticsChartGrid'

export const QUERY = gql`
  query DashboardDataQuery($startDate: DateTime, $endDate: DateTime, $period: String) {
    dashboardData(startDate: $startDate, endDate: $endDate, period: $period) {
      salesData {
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
          categoryId
          categoryName
          revenue
          orders
          products
        }
      }
      productData {
        topSellingProducts {
          productId
          productName
          sku
          totalSales
          totalQuantity
          category
        }
      }
      userData {
        totalUsers
        newUsersThisMonth
        activeUsers
        userGrowth
        topCustomers {
          userId
          userName
          userEmail
          totalOrders
          totalSpent
          averageOrderValue
          lastOrderDate
        }
        userActivity {
          date
          activeUsers
          orders
          revenue
        }
        returnCustomerRate
      }
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

export const Success = ({ dashboardData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  
  const { salesData, productData, userData } = dashboardData

  // Prepare metrics for KPI grid
  const metrics = [
    {
      title: 'Total Revenue',
      value: salesData.totalRevenue,
      change: salesData.revenueGrowth,
      changeType: salesData.revenueGrowth >= 0 ? 'positive' : 'negative',
      icon: '💰',
      format: 'currency'
    },
    {
      title: 'Total Orders',
      value: salesData.totalOrders,
      change: salesData.ordersGrowth,
      changeType: salesData.ordersGrowth >= 0 ? 'positive' : 'negative',
      icon: '📦',
      format: 'number'
    },
    {
      title: 'Average Order Value',
      value: salesData.averageOrderValue,
      change: 0, // Could calculate this if we have historical data
      changeType: 'neutral',
      icon: '📊',
      format: 'currency'
    },
    {
      title: 'Total Customers',
      value: userData.totalUsers,
      change: userData.userGrowth,
      changeType: userData.userGrowth >= 0 ? 'positive' : 'negative',
      icon: '👥',
      format: 'number'
    }
  ]

  // Prepare chart data
  const revenueChartData = {
    labels: salesData.dailySales.map(sale => 
      new Date(sale.date).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Daily Revenue',
        data: salesData.dailySales.map(sale => sale.revenue),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const ordersChartData = {
    labels: salesData.dailySales.map(sale => 
      new Date(sale.date).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Daily Orders',
        data: salesData.dailySales.map(sale => sale.orders),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const categoryChartData = {
    labels: salesData.topCategories.map(cat => cat.categoryName),
    datasets: [
      {
        data: salesData.topCategories.map(cat => cat.revenue),
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
          value={userData.newUsersThisMonth}
          change={0}
          changeType="neutral"
          icon="🆕"
          format="number"
          className="bg-gradient-to-br from-blue-50 to-blue-100"
        />
        <AnalyticsKpi
          title="Active Users"
          value={userData.activeUsers}
          change={0}
          changeType="neutral"
          icon="🔥"
          format="number"
          className="bg-gradient-to-br from-green-50 to-green-100"
        />
        <AnalyticsKpi
          title="Return Customer Rate"
          value={userData.returnCustomerRate}
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
            <option value="1y">Last year</option>
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
              {productData.topSellingProducts.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      €{product.totalSales.toFixed(2)}
                    </p>
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
              {salesData.topCategories.slice(0, 5).map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{category.categoryName}</p>
                    <p className="text-xs text-gray-500">{category.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      €{category.revenue.toFixed(2)}
                    </p>
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
              {userData.topCustomers.slice(0, 10).map((customer, index) => (
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
                    €{customer.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €{customer.averageOrderValue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">{productData.topSellingProducts?.length || 0}</div>
          <div className="text-sm text-gray-600">Top Selling Products</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">{productData.lowPerformingProducts?.length || 0}</div>
          <div className="text-sm text-gray-600">Low Performing Products</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">{userData.returnCustomerRate?.toFixed(1) || 0}%</div>
          <div className="text-sm text-gray-600">Return Customer Rate</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-2">€{salesData.averageOrderValue.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Average Order Value</div>
        </div>
      </div>
    </div>
  )
}
