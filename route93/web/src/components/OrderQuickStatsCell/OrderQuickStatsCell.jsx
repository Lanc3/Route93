export const QUERY = gql`
  query OrderQuickStatsQuery {
    adminStats {
      pendingOrdersCount
      processingOrdersCount
      shippedOrdersCount
      deliveredOrdersCount
    }
  }
`

export const Loading = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white p-4 rounded-lg shadow-sm border animate-pulse">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          <div className="ml-3">
            <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
            <div className="h-6 bg-gray-200 rounded w-8"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

export const Empty = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    {[
      { name: 'Pending Orders', value: 0, color: 'yellow', icon: '⏰' },
      { name: 'Processing', value: 0, color: 'blue', icon: '✅' },
      { name: 'Shipped', value: 0, color: 'indigo', icon: '📦' },
      { name: 'Delivered', value: 0, color: 'green', icon: '✓' }
    ].map((stat) => (
      <div key={stat.name} className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center">
          <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
            <span className="text-lg">{stat.icon}</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">{stat.name}</p>
            <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
)

export const Failure = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
    <div className="text-red-800">
      <h3 className="font-semibold">Error loading order statistics</h3>
      <p className="text-sm mt-1">{error?.message}</p>
    </div>
  </div>
)

export const Success = ({ adminStats }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-500">Pending Orders</p>
          <p className="text-lg font-semibold text-gray-900">{adminStats.pendingOrdersCount}</p>
        </div>
      </div>
    </div>

    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center">
        <div className="p-2 bg-blue-100 rounded-lg">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-500">Processing</p>
          <p className="text-lg font-semibold text-gray-900">{adminStats.processingOrdersCount}</p>
        </div>
      </div>
    </div>

    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-500">Shipped</p>
          <p className="text-lg font-semibold text-gray-900">{adminStats.shippedOrdersCount}</p>
        </div>
      </div>
    </div>

    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center">
        <div className="p-2 bg-green-100 rounded-lg">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-500">Delivered</p>
          <p className="text-lg font-semibold text-gray-900">{adminStats.deliveredOrdersCount}</p>
        </div>
      </div>
    </div>
  </div>
)