import { Link, routes } from '@redwoodjs/router'

const AdminOrderManagement = ({ adminStats }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <h3 className="ml-3 text-lg font-medium text-gray-900">Order Management</h3>
      </div>
      <p className="text-gray-600 mb-4">Process orders, manage shipping, and handle returns</p>
      <div className="space-y-2">
        <Link 
          to={routes.adminOrders()} 
          className="w-full btn-primary text-center block"
        >
          View All Orders ({adminStats?.ordersCount || 0})
        </Link>
        
        <Link 
          to={`${routes.adminOrders()}?status=PENDING`}
          className="w-full btn-outline text-left block flex items-center justify-between"
        >
          <span>Pending Orders</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            adminStats?.pendingOrdersCount > 0 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {adminStats?.pendingOrdersCount || 0}
          </span>
        </Link>
        
        <Link 
          to={`${routes.adminOrders()}?status=PROCESSING`}
          className="w-full btn-outline text-left block flex items-center justify-between"
        >
          <span>Processing Orders</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            adminStats?.processingOrdersCount > 0 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {adminStats?.processingOrdersCount || 0}
          </span>
        </Link>
        
        <Link 
          to={`${routes.adminOrders()}?status=SHIPPED`}
          className="w-full btn-outline text-left block flex items-center justify-between"
        >
          <span>Shipped Orders</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            adminStats?.shippedOrdersCount > 0 
              ? 'bg-indigo-100 text-indigo-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {adminStats?.shippedOrdersCount || 0}
          </span>
        </Link>
      </div>
    </div>
  )
}

export default AdminOrderManagement