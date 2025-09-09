import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: Int!, $status: String!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
    }
  }
`

export const QUERY = gql`
  query AdminOrdersQuery($limit: Int, $offset: Int, $search: String, $status: String, $sortBy: String, $sortOrder: String) {
    orders(limit: $limit, offset: $offset, search: $search, status: $status, sortBy: $sortBy, sortOrder: $sortOrder) {
      id
      orderNumber
      status
      totalAmount
      shippingCost
      taxAmount
      createdAt
      updatedAt
      user {
        id
        name
        email
      }
      orderItems {
        id
        quantity
        price
        totalPrice
        designUrl
        designId
        printFee
        printableItemId
        product {
          id
          name
          images
        }
        printableItem {
          id
          name
          imageUrl
        }
      }
      payments {
        id
        status
        amount
      }
    }
    ordersCount: ordersCount(search: $search, status: $status)
  }
`

export const Loading = () => (
  <div className="space-y-4">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
            <div className="w-16 h-16 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export const Empty = ({ search }) => (
  <div className="text-center py-12">
    <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
      🛒
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
    <p className="text-gray-500">
      {search ? `No orders match "${search}"` : 'No orders have been placed yet.'}
    </p>
  </div>
)

export const Failure = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="text-red-800">
      <h3 className="font-semibold">Error loading orders</h3>
      <p className="text-sm mt-1">{error?.message}</p>
    </div>
  </div>
)

export const Success = ({ orders, ordersCount }) => {
  const formatPrice = (price) => `€${price.toFixed(2)}`
  const formatDate = (date) => new Date(date).toLocaleDateString()
  const formatDateTime = (date) => new Date(date).toLocaleString()

  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS, {
    onCompleted: () => {
      toast.success('Order status updated successfully!')
      window.location.reload()
    },
    onError: (error) => {
      toast.error('Error updating order status: ' + error.message)
    }
  })

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus({ variables: { id: orderId, status: newStatus } })
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PROCESSING: 'bg-purple-100 text-purple-800',
      SHIPPED: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-gray-100 text-gray-800',
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.PENDING}`}>
        {status}
      </span>
    )
  }

  const getPaymentStatus = (payments) => {
    if (!payments || payments.length === 0) {
      return { status: 'UNPAID', color: 'text-red-600' }
    }

    const hasSuccessful = payments.some(p => p.status === 'COMPLETED' || p.status === 'SUCCESS')
    if (hasSuccessful) {
      return { status: 'PAID', color: 'text-green-600' }
    }

    const hasPending = payments.some(p => p.status === 'PENDING')
    if (hasPending) {
      return { status: 'PENDING', color: 'text-yellow-600' }
    }

    return { status: 'FAILED', color: 'text-red-600' }
  }

  return (
    <div className="space-y-6">
      {/* Orders Table */}
      <div className="bg-white shadow-sm rounded-lg border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Orders ({ordersCount})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => {
                const paymentStatus = getPaymentStatus(order.payments)
                const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0)

                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className='flex items-center space-x-2'>
                      <Link
                          to={routes.adminOrderDetails({ id: order.id })}
                          className="inline-flex items-center text-purple-600 hover:text-purple-800"
                          title="View order details"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </Link>
                        {/* <div className="text-sm font-medium text-gray-900">
                          #{order.orderNumber}
                        </div> */}
                        <div className="text-sm text-gray-500">
                          ID: {order.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{totalItems} items</div>
                        <div className="text-xs text-gray-500">
                          {order.orderItems.slice(0, 2).map((item) => {
                            // Determine if this is a custom print item
                            const isCustomPrint = item.designUrl && item.printableItemId && item.printableItem

                            // Resolve display image for non-custom items
                            let productImageUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5SDE1VjE1SDEyVjlWM1oiIGZpbGw9IiM5Q0E4QjIiLz4KPHBhdGggZD0iTTEwIDExSDE1VjE2SDEwVjExWiIgZmlsbD0iIzlDQTlBQSIvPgo8L3N2Zz4='
                            if (item.product?.images) {
                              try {
                                const images = JSON.parse(item.product.images)
                                if (Array.isArray(images) && images.length > 0) {
                                  productImageUrl = images[0]
                                } else if (typeof item.product.images === 'string' && item.product.images.trim()) {
                                  productImageUrl = item.product.images
                                }
                              } catch (e) {
                                if (typeof item.product.images === 'string' && item.product.images.trim()) {
                                  productImageUrl = item.product.images
                                }
                              }
                            }

                            const displayName = isCustomPrint ? item.printableItem.name : item.product.name

                            return (
                              <div key={item.id} className="flex items-center space-x-2 mb-0.5">
                                <div className="relative flex-shrink-0">
                                  {isCustomPrint ? (
                                    <div className="relative">
                                      <img
                                        src={item.printableItem.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTIgOUgxNVYxNUgxMlY5VjN6IiBmaWxsPSIjOUNBOEIyIi8+PC9zdmc+'}
                                        alt="Printable"
                                        className="w-6 h-6 rounded object-cover border border-gray-200"
                                        onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTIgOUgxNVYxNUgxMlY5VjN6IiBmaWxsPSIjOUNBOEIyIi8+PC9zdmc+' }}
                                      />
                                      {item.designUrl && (
                                        <img
                                          src={item.designUrl}
                                          alt="Design"
                                          className="w-3 h-3 rounded absolute -bottom-0.5 -right-0.5 border-2 border-white"
                                          onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0iI0YzRjRGNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIGZpbGw9IiNGM0Y0RjYiLz48L3N2Zz4=' }}
                                        />
                                      )}
                                    </div>
                                  ) : (
                                    <img
                                      src={productImageUrl}
                                      alt={displayName}
                                      className="w-6 h-6 rounded object-cover border border-gray-200"
                                      onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0YzRjRGNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNGM0Y0RjYiLz48L3N2Zz4=' }}
                                    />
                                  )}
                                </div>
                                <div>
                                  <div>
                                    {item.quantity}x {displayName}
                                    {isCustomPrint && (
                                      <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-800">
                                        Custom Print
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                          {order.orderItems.length > 2 && (
                            <div className="text-gray-400">
                              +{order.orderItems.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </div>
                        {order.shippingCost > 0 && (
                          <div className="text-xs text-gray-500">
                            +{formatPrice(order.shippingCost)} shipping
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${paymentStatus.color}`}>
                        {paymentStatus.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{formatDate(order.createdAt)}</div>
                      <div className="text-xs text-gray-400">
                        {formatDateTime(order.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-between space-x-2">
                        {/* View Details - Left for reachability */}
                        

                        <div className="flex items-center justify-end space-x-2">
                          {/* Status Update Dropdown */}
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="REFUNDED">Refunded</option>
                          </select>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}