export const QUERY = gql`
  query OrderDetailsQuery($id: Int!) {
    order(id: $id) {
      id
      orderNumber
      status
      totalAmount
      shippingCost
      taxAmount
      notes
      createdAt
      updatedAt
      orderItems {
        id
        quantity
        price
        totalPrice
        designUrl
        designId
        printFee
        product {
          id
          name
          images
          price
        }
      }
      billingAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        state
        zipCode
        country
        phone
      }
      shippingAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        state
        zipCode
        country
        phone
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ order }) => {
  if (!order) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 text-gray-300">📦</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
        <p className="text-gray-500">The order you're looking for doesn't exist or you don't have permission to view it.</p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800'
      case 'PENDING':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        {/* Order Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.orderNumber}
              </h1>
              <p className="text-sm text-gray-500">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeColor(order.status)}`}>
                {order.status}
              </span>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.orderItems?.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {item.product?.images ? (
                    <img
                      src={JSON.parse(item.product.images)[0] || 'https://via.placeholder.com/80x80?text=No+Image'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.product?.name || 'Product Name Unavailable'}
                  </h3>

                  {/* Custom Print Details */}
                  {item.designUrl && (
                    <div className="mt-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0">
                          <div className="relative">
                            {/* Printable Item Image (bottom layer) */}
                            <img
                              src={item.printableItem?.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAxNEgxOFYyNEgxNlYxNFoiIGZpbGw9IiM5Q0E4QjQiLz4KPHBhdGggZD0iTTE0IDE2SDE4VjIwSDE0VjE2WiIgZmlsbD0iIzlDQTlBQSIvPgo8L3N2Zz4='}
                              alt="Printable Item"
                              className="w-8 h-8 object-cover rounded border border-white"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAxNEgxOFYyNEgxNlYxNFoiIGZpbGw9IiM5Q0E4QjQiLz4KPHBhdGggZD0iTTE0IDE2SDE4VjIwSDE0VjE2WiIgZmlsbD0iIzlDQTlBQSIvPgo8L3N2Zz4='
                              }}
                            />
                            {/* Design Image (top layer, overlaid) */}
                            <img
                              src={item.designUrl}
                              alt="Custom Design"
                              className="w-4 h-4 object-cover rounded absolute -bottom-0.5 -right-0.5 border border-white"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04IDdINlYxNEg4VjdaIiBmaWxsPSIjOUNBNEFGIi8+CjxwYXRoIGQ9Ik02IDhINlYxMEg2VjhaIiBmaWxsPSIjOUNBNEFGIi8+Cjwvc3ZnPg=='
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-purple-800">Custom Print</p>
                          {item.printFee && (
                            <p className="text-xs text-purple-600">Print Fee: {formatCurrency(item.printFee)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity} × {formatCurrency(item.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-gray-900">
                    {formatCurrency(item.totalPrice)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Address</h3>
              {order.shippingAddress ? (
                <div className="text-gray-600">
                  <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
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
              <h3 className="text-lg font-medium text-gray-900 mb-3">Billing Address</h3>
              {order.billingAddress ? (
                <div className="text-gray-600">
                  <p className="font-medium">{order.billingAddress.firstName} {order.billingAddress.lastName}</p>
                  {order.billingAddress.company && <p>{order.billingAddress.company}</p>}
                  <p>{order.billingAddress.address1}</p>
                  {order.billingAddress.address2 && <p>{order.billingAddress.address2}</p>}
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}
                  </p>
                  <p>{order.billingAddress.country}</p>
                  {order.billingAddress.phone && <p>{order.billingAddress.phone}</p>}
                </div>
              ) : (
                <p className="text-gray-500">No billing address available</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(order.totalAmount - order.shippingCost - order.taxAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium">{formatCurrency(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium">{formatCurrency(order.taxAmount)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-300">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-lg font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="px-6 py-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Order Notes</h3>
            <p className="text-gray-600">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
