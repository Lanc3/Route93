import { useState } from 'react'

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

export const Success = ({ overallAnalytics }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  
  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  const formatPercent = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`

  const { salesReport, productAnalytics, userAnalytics } = overallAnalytics

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              💰
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(salesReport.totalRevenue)}</p>
              <p className={`text-sm ${salesReport.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(salesReport.revenueGrowth)} from last period
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              📦
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{salesReport.totalOrders.toLocaleString()}</p>
              <p className={`text-sm ${salesReport.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(salesReport.ordersGrowth)} from last period
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              👥
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{userAnalytics.totalUsers.toLocaleString()}</p>
              <p className={`text-sm ${userAnalytics.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(userAnalytics.userGrowth)} growth
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              📈
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(salesReport.averageOrderValue)}</p>
              <p className="text-sm text-gray-500">
                {overallAnalytics.conversionRate.toFixed(1)}% conversion rate
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <p className="text-sm font-medium text-gray-500">New Users This Month</p>
          <p className="text-xl font-semibold text-blue-600">{userAnalytics.newUsersThisMonth}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <p className="text-sm font-medium text-gray-500">Active Users</p>
          <p className="text-xl font-semibold text-green-600">{userAnalytics.activeUsers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <p className="text-sm font-medium text-gray-500">Return Customer Rate</p>
          <p className="text-xl font-semibold text-purple-600">{overallAnalytics.returnCustomerRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Sales Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Sales Overview</h3>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-500">Sales chart would be displayed here</p>
            <p className="text-sm text-gray-400 mt-1">
              Daily revenue: {salesReport.dailySales.length > 0 ? formatCurrency(salesReport.dailySales[0].revenue) : '$0'}
            </p>
          </div>
        </div>
      </div>

      {/* Top Products and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Selling Products</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {productAnalytics.topSellingProducts.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center justify-between">
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
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Categories</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {salesReport.topCategories.slice(0, 5).map((category, index) => (
                <div key={index} className="flex items-center justify-between">
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
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Customers</h3>
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
                <tr key={index} className="hover:bg-gray-50">
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
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Products Needing Attention</h3>
          <p className="text-sm text-gray-600">Low performing products that may need promotion or review</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productAnalytics.lowPerformingProducts.slice(0, 6).map((product, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
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