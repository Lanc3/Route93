import { useState } from 'react'
import AnalyticsKpi from 'src/components/AnalyticsKPI/AnalyticsKPI'
import AnalyticsChart from 'src/components/AnalyticsChart/AnalyticsChart'

const AnalyticsDashboard = ({ 
  salesData, 
  productData, 
  userData, 
  className = '' 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedView, setSelectedView] = useState('overview')

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IE', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(amount)

  const formatPercent = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`

  const views = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'sales', name: 'Sales', icon: '💰' },
    { id: 'products', name: 'Products', icon: '📦' },
    { id: 'customers', name: 'Customers', icon: '👥' }
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsKpi
          title="Total Revenue"
          value={salesData?.totalRevenue || 0}
          change={salesData?.revenueGrowth || 0}
          changeType={salesData?.revenueGrowth >= 0 ? 'positive' : 'negative'}
          icon="💰"
          format="currency"
        />
        <AnalyticsKpi
          title="Total Orders"
          value={salesData?.totalOrders || 0}
          change={salesData?.ordersGrowth || 0}
          changeType={salesData?.ordersGrowth >= 0 ? 'positive' : 'negative'}
          icon="📦"
          format="number"
        />
        <AnalyticsKpi
          title="Total Customers"
          value={userData?.totalUsers || 0}
          change={userData?.userGrowth || 0}
          changeType={userData?.userGrowth >= 0 ? 'positive' : 'negative'}
          icon="👥"
          format="number"
        />
        <AnalyticsKpi
          title="Average Order Value"
          value={salesData?.averageOrderValue || 0}
          change={0}
          changeType="neutral"
          icon="📊"
          format="currency"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          {salesData?.dailySales ? (
            <AnalyticsChart
              type="line"
              data={{
                labels: salesData.dailySales.map(sale => 
                  new Date(sale.date).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' })
                ),
                datasets: [{
                  label: 'Daily Revenue',
                  data: salesData.dailySales.map(sale => sale.revenue),
                  borderColor: '#3B82F6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  fill: true,
                  tension: 0.4
                }]
              }}
              height={250}
            />
          ) : (
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <p>No sales data available</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Trend</h3>
          {salesData?.dailySales ? (
            <AnalyticsChart
              type="line"
              data={{
                labels: salesData.dailySales.map(sale => 
                  new Date(sale.date).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' })
                ),
                datasets: [{
                  label: 'Daily Orders',
                  data: salesData.dailySales.map(sale => sale.orders),
                  borderColor: '#10B981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  fill: true,
                  tension: 0.4
                }]
              }}
              height={250}
            />
          ) : (
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📦</div>
                <p>No orders data available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderSales = () => (
    <div className="space-y-6">
      {/* Sales Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsKpi
          title="Average Order Value"
          value={salesData?.averageOrderValue || 0}
          change={0}
          changeType="neutral"
          icon="📊"
          format="currency"
        />
        <AnalyticsKpi
          title="Total Revenue"
          value={salesData?.totalRevenue || 0}
          change={salesData?.revenueGrowth || 0}
          changeType={salesData?.revenueGrowth >= 0 ? 'positive' : 'negative'}
          icon="💰"
          format="currency"
        />
        <AnalyticsKpi
          title="Total Orders"
          value={salesData?.totalOrders || 0}
          change={salesData?.ordersGrowth || 0}
          changeType={salesData?.ordersGrowth >= 0 ? 'positive' : 'negative'}
          icon="📦"
          format="number"
        />
      </div>

      {/* Sales Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h3>
          {salesData?.topCategories ? (
            <AnalyticsChart
              type="doughnut"
              data={{
                labels: salesData.topCategories.map(cat => cat.categoryName),
                datasets: [{
                  data: salesData.topCategories.map(cat => cat.revenue),
                  backgroundColor: [
                    '#3B82F6',
                    '#10B981',
                    '#F59E0B',
                    '#EF4444',
                    '#8B5CF6',
                    '#06B6D4'
                  ]
                }]
              }}
              height={250}
            />
          ) : (
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🍕</div>
                <p>No category data available</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Sales</h3>
          {salesData?.dailySales ? (
            <AnalyticsChart
              type="bar"
              data={{
                labels: salesData.dailySales.map(sale => 
                  new Date(sale.date).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' })
                ),
                datasets: [{
                  label: 'Revenue',
                  data: salesData.dailySales.map(sale => sale.revenue),
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  borderColor: '#3B82F6',
                  borderWidth: 1
                }]
              }}
              height={250}
            />
          ) : (
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📈</div>
                <p>No daily sales data available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderProducts = () => (
    <div className="space-y-6">
      {/* Product Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsKpi
          title="Top Selling Products"
          value={productData?.topSellingProducts?.length || 0}
          change={0}
          changeType="neutral"
          icon="🏷️"
          format="number"
        />
        <AnalyticsKpi
          title="Top Selling Product"
          value={productData?.topProduct?.sales || 0}
          change={0}
          changeType="neutral"
          icon="⭐"
          format="currency"
        />
        <AnalyticsKpi
          title="Low Stock Products"
          value={productData?.lowPerformingProducts?.length || 0}
          change={0}
          changeType="neutral"
          icon="⚠️"
          format="number"
        />
      </div>

      {/* Product Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          {productData?.topSellingProducts ? (
            <AnalyticsChart
              type="bar"
              data={{
                labels: productData.topSellingProducts.map(p => p.productName).slice(0, 8),
                datasets: [{
                  label: 'Sales',
                  data: productData.topSellingProducts.map(p => p.totalSales).slice(0, 8),
                  backgroundColor: 'rgba(16, 185, 129, 0.8)',
                  borderColor: '#10B981',
                  borderWidth: 1
                }]
              }}
              height={250}
            />
          ) : (
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📦</div>
                <p>No product data available</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Products by Category</h3>
          {productData?.productsByCategory ? (
            <AnalyticsChart
              type="doughnut"
              data={{
                labels: productData.productsByCategory.map(cat => cat.categoryName),
                datasets: [{
                  data: productData.productsByCategory.map(cat => cat.productCount),
                  backgroundColor: [
                    '#3B82F6',
                    '#10B981',
                    '#F59E0B',
                    '#EF4444',
                    '#8B5CF6',
                    '#06B6D4'
                  ]
                }]
              }}
              height={250}
            />
          ) : (
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🏷️</div>
                <p>No category data available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderCustomers = () => (
    <div className="space-y-6">
      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsKpi
          title="Total Customers"
          value={userData?.totalUsers || 0}
          change={userData?.userGrowth || 0}
          changeType={userData?.userGrowth >= 0 ? 'positive' : 'negative'}
          icon="👥"
          format="number"
        />
        <AnalyticsKpi
          title="New Users This Month"
          value={userData?.newUsersThisMonth || 0}
          change={0}
          changeType="neutral"
          icon="🆕"
          format="number"
        />
        <AnalyticsKpi
          title="Active Users"
          value={userData?.activeUsers || 0}
          change={0}
          changeType="neutral"
          icon="🔥"
          format="number"
        />
      </div>

      {/* Customer Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          {userData?.userActivity ? (
            <AnalyticsChart
              type="line"
              data={{
                labels: userData.userActivity.map(activity => 
                  new Date(activity.date).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' })
                ),
                datasets: [{
                  label: 'Active Users',
                  data: userData.userActivity.map(activity => activity.activeUsers),
                  borderColor: '#8B5CF6',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  fill: true,
                  tension: 0.4
                }]
              }}
              height={250}
            />
          ) : (
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">👥</div>
                <p>No user activity data available</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h3>
          {userData?.topCustomers ? (
            <AnalyticsChart
              type="bar"
              data={{
                labels: userData.topCustomers.map(customer => 
                  customer.userName.length > 15 
                    ? customer.userName.substring(0, 15) + '...' 
                    : customer.userName
                ).slice(0, 8),
                datasets: [{
                  label: 'Total Spent',
                  data: userData.topCustomers.map(customer => customer.totalSpent).slice(0, 8),
                  backgroundColor: 'rgba(245, 158, 11, 0.8)',
                  borderColor: '#F59E0B',
                  borderWidth: 1
                }]
              }}
              height={250}
            />
          ) : (
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">👑</div>
                <p>No customer data available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (selectedView) {
      case 'sales':
        return renderSales()
      case 'products':
        return renderProducts()
      case 'customers':
        return renderCustomers()
      default:
        return renderOverview()
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive overview of your business performance</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
        <nav className="flex space-x-1">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setSelectedView(view.id)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedView === view.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{view.icon}</span>
              {view.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  )
}

export default AnalyticsDashboard
