import { Metadata } from '@redwoodjs/web'
import { Link, routes } from '@redwoodjs/router'

export const QUERY = gql`
  query OrderByToken($token: String!) {
    order: orderByTrackingToken(token: $token) {
      id
      orderNumber
      status
      trackingNumber
      carrier
      shippedAt
      deliveredAt
      estimatedDelivery
      orderItems { product { id name images price } quantity }
    }
  }
`

export const Loading = () => <div className="p-8">Loading...</div>
export const Empty = () => (
  <div className="p-8 text-center">
    <p>We couldn't find that tracking link.</p>
    <Link to={routes.home()} className="btn-primary mt-4 inline-block">Go home</Link>
  </div>
)
export const Failure = ({ error }) => <div className="p-8 text-red-600">{error.message}</div>

export const Success = ({ order }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-2">Order {order.orderNumber}</h1>
      <div className="text-gray-600 mb-6">Status: {order.status}</div>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="font-medium">Carrier</div>
            <div>{order.carrier || 'An Post'}</div>
          </div>
          <div>
            <div className="font-medium">Tracking Number</div>
            <div>{order.trackingNumber || '—'}</div>
          </div>
          <div>
            <div className="font-medium">Estimated Delivery</div>
            <div>{order.estimatedDelivery ? new Date(order.estimatedDelivery).toDateString() : '—'}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold mb-3">Items</h2>
        <div className="space-y-3">
          {order.orderItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="text-gray-800">{item.product.name}</div>
              <div className="text-gray-600">Qty: {item.quantity}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const OrderTrackingPage = ({ token }) => (
  <>
    <Metadata title="Track your order - Route93" />
    <OrderTrackingPageCell token={token} />
  </>
)

export default OrderTrackingPage


