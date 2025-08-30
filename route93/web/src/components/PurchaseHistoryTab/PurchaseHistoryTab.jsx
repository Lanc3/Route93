import { Link, routes } from '@redwoodjs/router'
import { useCart } from 'src/contexts/CartContext'
import { toast } from '@redwoodjs/web/toast'

const PurchaseHistoryTab = ({ user }) => {
  const { addItem } = useCart()

  const handleReorder = async (order) => {
    if (!order.orderItems || order.orderItems.length === 0) {
      toast.error('No items found in this order')
      return
    }

    let successCount = 0
    let errorCount = 0

    for (const item of order.orderItems) {
      if (item.product) {
        try {
          await addItem(item.product, item.quantity)
          successCount++
        } catch (error) {
          console.error('Error adding item to cart:', error)
          errorCount++
        }
      } else {
        errorCount++
      }
    }

    if (successCount > 0) {
      toast.success(`Added ${successCount} item${successCount > 1 ? 's' : ''} to cart`)
      if (errorCount > 0) {
        toast.warning(`${errorCount} item${errorCount > 1 ? 's' : ''} could not be added`)
      }
    } else {
      toast.error('Unable to add items to cart')
    }
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 text-gray-300">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No user data available</h3>
        <p className="text-gray-500">Please log in to view your purchase history.</p>
      </div>
    )
  }

  // Ensure orders is an array and filter completed orders
  const orders = Array.isArray(user.orders) ? user.orders : []
  const completedOrders = orders.filter(order => 
    order && order.status && ['COMPLETED', 'DELIVERED', 'SHIPPED'].includes(order.status)
  )

  if (completedOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 text-gray-300">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No purchase history</h3>
        <p className="text-gray-500">You haven't completed any orders yet.</p>
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
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'DELIVERED':
        return 'bg-blue-100 text-blue-800'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Purchase History</h3>
              <p className="text-sm text-gray-500">
                View your completed orders and purchase history
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
          {completedOrders.map((order) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
              <div className="mt-6 flex justify-end space-x-3">
                <Link
                  to={routes.orderDetails({ id: order.id })}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleReorder(order)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Reorder
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PurchaseHistoryTab
