import { Metadata } from '@redwoodjs/web'
import { useParams } from '@redwoodjs/router'
import OrderDetailsCell from 'src/components/OrderDetailsCell'

const OrderDetailsPage = () => {
  const { id } = useParams()
  
  return (
    <>
      <Metadata 
        title={`Order #${id} - Route93`} 
        description="View your order details and track your purchase" 
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="mt-2 text-gray-600">
              View your order information and track your purchase
            </p>
          </div>
          <OrderDetailsCell id={parseInt(id)} />
        </div>
      </div>
    </>
  )
}

export default OrderDetailsPage
