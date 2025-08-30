import { Link, routes } from '@redwoodjs/router'
import { toast } from '@redwoodjs/web/toast'

const CurrentOrdersTab = ({ user }) => {
  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 text-gray-300">📦</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No user data available</h3>
        <p className="text-gray-500">Please log in to view your current orders.</p>
      </div>
    )
  }

  // Ensure orders is an array and filter current orders
  const orders = Array.isArray(user.orders) ? user.orders : []
  const currentOrders = orders.filter(order => 
    order && order.status && ['PENDING', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(order.status)
  )

  if (currentOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 text-gray-300">📦</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No current orders</h3>
        <p className="text-gray-500">You don't have any active orders at the moment.</p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800'
      case 'OUT_FOR_DELIVERY':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusDescription = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Your order is being reviewed and prepared for processing'
      case 'PROCESSING':
        return 'Your order is being processed and will be shipped soon'
      case 'SHIPPED':
        return 'Your order has been shipped and is on its way'
      case 'OUT_FOR_DELIVERY':
        return 'Your order is out for delivery and will arrive today'
      default:
        return 'Your order is being processed'
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Current Orders</h3>
              <p className="text-sm text-gray-500">
                Track your active orders and their current status
              </p>
            </div>
            <Link
              to={routes.trackOrder()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Track Order
            </Link>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {currentOrders.map((order) => (
            <div key={order.id} className="p-6">
              {/* Order Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    Order #{order.orderNumber}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Status Description */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  {getStatusDescription(order.status)}
                </p>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.orderItems?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {item.product?.images ? (
                        <img
                          src={JSON.parse(item.product.images)[0] || 'https://via.placeholder.com/60x60?text=No+Image'}
                          alt={item.product.name}
                          className="w-15 h-15 object-cover rounded"
                        />
                      ) : (
                        <div className="w-15 h-15 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product?.name || 'Product Name Unavailable'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Shipping Address</h5>
                  {order.shippingAddress ? (
                    <div className="text-gray-600">
                      <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                      {order.shippingAddress.company && <p>{order.shippingAddress.company}</p>}
                      <p>{order.shippingAddress.address1}</p>
                      {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                      {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
                    </div>
                  ) : (
                    <p className="text-gray-500">No shipping address available</p>
                  )}
                </div>

                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Order Summary</h5>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(order.totalAmount - order.shippingCost - order.taxAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{formatCurrency(order.shippingCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>{formatCurrency(order.taxAmount)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-gray-900 pt-2 border-t">
                      <span>Total:</span>
                      <span>{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <Link
                  to={routes.orderDetails({ id: order.id })}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  View Details
                </Link>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                  Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CurrentOrdersTab
