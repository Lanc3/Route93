export const QUERY = gql`
  query AdminStatsQuery {
    adminStats {
      productsCount
      ordersCount
      usersCount
      totalRevenue
      recentOrdersCount
      lowStockCount
      activeUsersCount
      categoriesCount
      collectionsCount
      pendingOrdersCount
      processingOrdersCount
      shippedOrdersCount
      deliveredOrdersCount
    }
  }
`

export const Loading = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
    ))}
  </div>
)

export const Empty = () => (
  <div className="text-center py-8">
    <p className="text-gray-500">No statistics available</p>
  </div>
)

export const Failure = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
    <div className="text-red-800">
      <h3 className="font-semibold">Error loading statistics</h3>
      <p className="text-sm mt-1">{error?.message}</p>
    </div>
  </div>
)

export const Success = ({ adminStats }) => {
  const stats = [
    {
      name: 'Total Products',
      value: adminStats.productsCount,
      icon: '📦',
      color: 'bg-blue-500'
    },
    {
      name: 'Total Orders',
      value: adminStats.ordersCount,
      icon: '🛒',
      color: 'bg-green-500'
    },
    {
      name: 'Total Users',
      value: adminStats.usersCount,
      icon: '👥',
      color: 'bg-purple-500'
    },
    {
      name: 'Total Revenue',
      value: `€${adminStats.totalRevenue.toLocaleString()}`,
      icon: '💰',
      color: 'bg-yellow-500'
    },
    {
      name: 'Recent Orders',
      value: adminStats.recentOrdersCount,
      icon: '📈',
      color: 'bg-indigo-500',
      subtitle: 'Last 30 days'
    },
    {
      name: 'Low Stock Items',
      value: adminStats.lowStockCount,
      icon: '⚠️',
      color: 'bg-red-500',
      subtitle: 'Need attention'
    },
    {
      name: 'Active Users',
      value: adminStats.activeUsersCount,
      icon: '🟢',
      color: 'bg-green-600',
      subtitle: 'Last 30 days'
    },
    {
      name: 'Categories',
      value: adminStats.categoriesCount,
      icon: '📂',
      color: 'bg-gray-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              {stat.subtitle && (
                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              )}
            </div>
            <div className={`${stat.color} text-white p-3 rounded-full text-2xl`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
