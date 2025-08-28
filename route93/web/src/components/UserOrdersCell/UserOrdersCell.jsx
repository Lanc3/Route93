import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'

export const QUERY = gql`
  query CurrentUserOrdersQuery {
    currentUser {
      id
      orders {
        id
        orderNumber
        status
        totalAmount
        shippingCost
        taxAmount
        createdAt
        updatedAt
        orderItems {
          id
          quantity
          price
          totalPrice
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
  }
`

export const Loading = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow p-4">
        <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    ))}
  </div>
)

export const Empty = () => (
  <div className="text-center py-12">
    <div className="w-24 h-24 mx-auto mb-4 text-gray-300">📦</div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
    <p className="text-gray-500">You haven't placed any orders yet.</p>
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

export const Success = ({ currentUser }) => {
  return currentUser?.orders || []
}
