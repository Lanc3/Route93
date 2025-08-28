import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import AccountSettingsTabs from 'src/components/AccountSettingsTabs/AccountSettingsTabs'

export const QUERY = gql`
  query CurrentUserQuery {
    currentUser {
      id
      email
      name
      phone
      role
      createdAt
      updatedAt
      _count {
        orders
        addresses
        cartItems
        reviews
      }
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
      addresses {
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
        isDefault
        createdAt
      }
    }
  }
`

export const Loading = () => (
  <div className="animate-pulse space-y-6">
    <div className="bg-white rounded-lg shadow p-6">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  </div>
)

export const Empty = () => (
  <div className="text-center py-12">
    <div className="w-24 h-24 mx-auto mb-4 text-gray-300">👤</div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No user data available</h3>
    <p className="text-gray-500">Please log in to view your account information.</p>
  </div>
)

export const Failure = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="text-red-800">
      <h3 className="font-semibold">Error loading user profile</h3>
      <p className="text-sm mt-1">{error?.message}</p>
    </div>
  </div>
)

export const Success = ({ currentUser }) => {
  if (!currentUser) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">
          <h3 className="font-semibold">No user data received</h3>
          <p className="text-sm mt-1">The currentUser data is undefined or null.</p>
        </div>
      </div>
    )
  }
  
  return (
    <AccountSettingsTabs user={currentUser} />
  )
}
