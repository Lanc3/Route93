import { Metadata, useQuery } from '@redwoodjs/web'
import OrderConfirmationCell, { Success, ORDER_QUERY } from 'src/components/OrderConfirmationCell'

const OrderConfirmationPage = ({ id }) => {
  

  // Use cache-busting query to ensure fresh data
  const { data, loading, error } = useQuery(ORDER_QUERY, {
    variables: { id: parseInt(id) },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  })

  

  

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your order details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading order</h3>
          <p className="text-red-600 mb-6">{error?.message}</p>
        </div>
      </div>
    )
  }

  if (!data?.order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
          <p className="text-gray-500 mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Metadata
        title="Order Confirmation - Route93"
        description="Your order has been confirmed! View your order details and track your purchase."
      />

      {/* Render Success component directly with fresh data */}
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="mt-2 text-gray-600">
              View your order information and track your purchase
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <Success order={data.order} />
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderConfirmationPage
