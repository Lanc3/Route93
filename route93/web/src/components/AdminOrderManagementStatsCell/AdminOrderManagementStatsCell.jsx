import AdminOrderManagement from 'src/components/AdminOrderManagement/AdminOrderManagement'

export const QUERY = gql`
  query AdminOrderManagementStatsQuery {
    adminStats {
      ordersCount
      pendingOrdersCount
      processingOrdersCount
      shippedOrdersCount
      deliveredOrdersCount
    }
  }
`

export const Loading = () => (
  <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
      <div className="ml-3 h-6 bg-gray-200 rounded w-32"></div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="space-y-2">
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  </div>
)

export const Empty = () => (
  <AdminOrderManagement adminStats={null} />
)

export const Failure = ({ error }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="text-red-800">
        <h3 className="font-semibold">Error loading order statistics</h3>
        <p className="text-sm mt-1">{error?.message}</p>
      </div>
    </div>
  </div>
)

export const Success = ({ adminStats }) => (
  <AdminOrderManagement adminStats={adminStats} />
)