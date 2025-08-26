export const QUERY = gql`
  query FindOrderConfirmationQuery($id: Int!) {
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
      user {
        id
        name
        email
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
      orderItems {
        id
        quantity
        price
        totalPrice
        product {
          id
          name
          description
          images
          slug
        }
      }
      payments {
        id
        amount
        status
        method
        transactionId
        createdAt
      }
    }
  }
`

export const Loading = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading your order details...</p>
    </div>
  </div>
)

export const Empty = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="text-center">
      <div className="text-6xl mb-4">📦</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
      <p className="text-gray-500 mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
    </div>
  </div>
)

export const Failure = ({ error }) => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="text-center">
      <div className="text-6xl mb-4">❌</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading order</h3>
      <p className="text-red-600 mb-6">{error?.message}</p>
    </div>
  </div>
)

export const Success = ({ order }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your purchase. Your order has been received and is being processed.</p>
      </div>

      {/* Order Summary Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Order #{order.orderNumber}</h2>
            <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.orderItems.map((item) => {
              const images = item.product.images ? JSON.parse(item.product.images) : []
              const primaryImage = images[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTUwSDIyNVYyNTBIMTc1VjE1MFoiIGZpbGw9IiM5Q0E4QjQiLz4KPHBhdGggZD0iTTE1MCAyMDBIMjUwTDIwMCAyNTBMMTUwIDIwMFoiIGZpbGw9IiM5Q0E4QjQiLz4KPC9zdmc+'

              return (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <img
                      src={primaryImage}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                    {item.product.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{item.product.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                      <div className="text-right">
                        <div className="font-medium">{formatPrice(item.totalPrice)}</div>
                        <div className="text-sm text-gray-600">{formatPrice(item.price)} each</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order Totals */}
        <div className="border-t pt-6 mt-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(order.totalAmount - order.shippingCost - order.taxAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">{formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">{formatPrice(order.taxAmount)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-lg font-semibold text-purple-600">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping and Payment Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
          <div className="text-gray-600">
            <p className="font-medium text-gray-900">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
            {order.shippingAddress.company && <p>{order.shippingAddress.company}</p>}
            <p>{order.shippingAddress.address1}</p>
            {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p>{order.shippingAddress.country}</p>
            {order.shippingAddress.phone && <p className="mt-2">Phone: {order.shippingAddress.phone}</p>}
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
          {order.payments && order.payments.length > 0 ? (
            <div className="space-y-3">
              {order.payments.map((payment) => (
                <div key={payment.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{payment.method}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>Amount: {formatPrice(payment.amount)}</p>
                    {payment.transactionId && (
                      <p className="font-mono">Transaction: {payment.transactionId}</p>
                    )}
                    <p>Processed: {formatDate(payment.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-600">
              <p>Payment information will be updated once processed.</p>
            </div>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-purple-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-purple-900 mb-4">What's Next?</h3>
        <div className="space-y-3 text-purple-800">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold">1</span>
              </div>
            </div>
            <div>
              <p className="font-medium">Order Confirmation</p>
              <p className="text-sm">You'll receive an email confirmation shortly with your order details.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold">2</span>
              </div>
            </div>
            <div>
              <p className="font-medium">Order Processing</p>
              <p className="text-sm">We'll prepare your order for shipment within 1-2 business days.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold">3</span>
              </div>
            </div>
            <div>
              <p className="font-medium">Shipping Notification</p>
              <p className="text-sm">You'll receive tracking information once your order ships.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="mailto:support@route93.com"
          className="btn-outline text-center"
        >
          Contact Support
        </a>
        <a
          href="/"
          className="btn-primary text-center"
        >
          Continue Shopping
        </a>
      </div>
    </div>
  )
}
