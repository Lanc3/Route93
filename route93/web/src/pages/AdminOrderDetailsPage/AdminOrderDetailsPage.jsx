import { useParams, Link, routes } from '@redwoodjs/router'
import { useQuery, gql } from '@redwoodjs/web'

const ORDER_QUERY = gql`
  query AdminOrderDetailsQuery($id: Int!) {
    order(id: $id) {
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
        phone
      }
      shippingAddress {
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
        firstName
        lastName
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
        designUrl
        designId
        printFee
        printableItemId
        product { id name images }
        printableItem { id name imageUrl }
      }
      payments { id status amount method transactionId createdAt }
    }
  }
`

const formatPrice = (price) => `€${price.toFixed(2)}`

const AdminOrderDetailsPage = () => {
  const { id } = useParams()
  const orderId = parseInt(id)
  const { data, loading, error } = useQuery(ORDER_QUERY, {
    variables: { id: orderId },
    fetchPolicy: 'network-only'
  })

  const handlePrintLabel = async () => {
    try {
      const res = await fetch(`/api/shippingLabel?orderId=${orderId}`)
      if (!res.ok) throw new Error('Failed to generate label')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `shipping-label-${orderId}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      alert('Could not generate shipping label: ' + e.message)
    }
  }

  if (loading) {
    return (
      <div className="p-6">Loading order...</div>
    )
  }

  if (error || !data?.order) {
    return (
      <div className="p-6 text-red-600">Failed to load order.</div>
    )
  }

  const { order } = data

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Order #{order.orderNumber}</h1>
          <div className="text-sm text-gray-500">ID: {order.id}</div>
        </div>
        <div className="flex items-center space-x-2">
          <Link to={routes.adminOrders()} className="btn-outline">Back to Orders</Link>
          <button onClick={handlePrintLabel} className="btn-primary">Print Shipping Label</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => {
                const isCustomPrint = item.designUrl && item.printableItemId && item.printableItem
                let productImage = ''
                if (item.product?.images) {
                  try {
                    const images = JSON.parse(item.product.images)
                    if (Array.isArray(images) && images.length > 0) productImage = images[0]
                  } catch {}
                }
                const displayName = isCustomPrint ? item.printableItem.name : item.product.name
                return (
                  <div key={item.id} className={`flex items-center space-x-4 p-3 border rounded ${isCustomPrint ? 'bg-purple-50 border-purple-200' : ''}`}>
                    <div className="relative">
                      {isCustomPrint ? (
                        <div className="relative">
                          <img src={item.printableItem.imageUrl || productImage} className="w-12 h-12 rounded object-cover border" alt="Printable" />
                          {item.designUrl && (
                            <img src={item.designUrl} className="w-6 h-6 rounded absolute -bottom-1 -right-1 border-2 border-white" alt="Design" />
                          )}
                        </div>
                      ) : (
                        <img src={productImage} className="w-12 h-12 rounded object-cover border" alt={displayName} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 flex items-center">
                        {displayName}
                        {isCustomPrint && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Custom Print</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-700">Unit: {formatPrice(item.price - item.printFee)}</div>
                      {item.printFee ? (
                        <div className="text-sm text-purple-700">Print Fee: {formatPrice(item.printFee)}</div>
                      ) : null}
                      <div className="font-semibold">Total: {formatPrice(item.price)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Payments */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payments</h2>
            <div className="space-y-2">
              {order.payments.length === 0 && (
                <div className="text-sm text-gray-600">No payments recorded.</div>
              )}
              {order.payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm border rounded p-2">
                  <div className="space-y-0.5">
                    <div className="font-medium">{p.method} - {p.status}</div>
                    <div className="text-gray-600">{p.transactionId}</div>
                  </div>
                  <div className="font-semibold">{formatPrice(p.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary & Addresses */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.totalAmount - order.shippingCost - order.taxAmount)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(order.shippingCost)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>{formatPrice(order.taxAmount)}</span></div>
              <div className="border-t pt-2 flex justify-between font-semibold"><span>Total</span><span className="text-purple-600">{formatPrice(order.totalAmount)}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
            <div className="text-sm text-gray-700 space-y-1">
              <div className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</div>
              {order.shippingAddress.company && <div>{order.shippingAddress.company}</div>}
              <div>{order.shippingAddress.address1}</div>
              {order.shippingAddress.address2 && <div>{order.shippingAddress.address2}</div>}
              <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</div>
              <div>{order.shippingAddress.country}</div>
              {order.shippingAddress.phone && <div>Phone: {order.shippingAddress.phone}</div>}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h2>
            <div className="text-sm text-gray-700 space-y-1">
              <div className="font-medium">{order.billingAddress.firstName} {order.billingAddress.lastName}</div>
              <div>{order.billingAddress.address1}</div>
              {order.billingAddress.address2 && <div>{order.billingAddress.address2}</div>}
              <div>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}</div>
              <div>{order.billingAddress.country}</div>
              {order.billingAddress.phone && <div>Phone: {order.billingAddress.phone}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOrderDetailsPage


