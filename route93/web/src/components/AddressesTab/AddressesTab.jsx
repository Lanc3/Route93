import { useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import { toast } from '@redwoodjs/web/toast'
import AddressForm from 'src/components/AddressForm/AddressForm'

const DELETE_ADDRESS_MUTATION = gql`
  mutation DeleteAddressMutation($id: Int!) {
    deleteAddress(id: $id) {
      id
    }
  }
`

const AddressesTab = ({ user, onRefresh }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)

  const [deleteAddress] = useMutation(DELETE_ADDRESS_MUTATION, {
    onCompleted: () => {
      toast.success('Address deleted successfully!')
      onRefresh()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleAddNew = () => {
    setEditingAddress(null)
    setShowForm(true)
  }

  const handleEdit = (address) => {
    setEditingAddress(address)
    setShowForm(true)
  }

  const handleUseAtCheckout = (address) => {
    // Open edit form with isDefault true; AddressForm submit will set default via update
    setEditingAddress({ ...address, isDefault: true })
    setShowForm(true)
  }

  const handleDelete = (addressId) => {
    if (confirm('Are you sure you want to delete this address?')) {
      deleteAddress({ variables: { id: addressId } })
    }
  }

  const handleSave = () => {
    setShowForm(false)
    setEditingAddress(null)
    onRefresh()
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingAddress(null)
  }

  const formatAddress = (address) => {
    const parts = [
      `${address.firstName} ${address.lastName}`,
      address.company,
      address.address1,
      address.address2,
      `${address.city}, ${address.state} ${address.zipCode}`,
      address.country,
      address.phone
    ].filter(Boolean)
    
    return parts.join(', ')
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 text-gray-300">🏠</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No user data available</h3>
        <p className="text-gray-500">Please log in to view your addresses.</p>
      </div>
    )
  }

  const addresses = user.addresses || []

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <AddressForm
          address={editingAddress}
          userId={user.id}
          onSave={handleSave}
          onCancel={handleCancel}
          isEditing={!!editingAddress}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Addresses</h3>
          <p className="text-sm text-gray-500">
            Manage your shipping and billing addresses
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">🏠</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses yet</h3>
          <p className="text-gray-500">Add your first address to get started.</p>
          <button
            onClick={handleAddNew}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900">
                      {address.firstName} {address.lastName}
                    </h4>
                    {address.isDefault && (
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {formatAddress(address)}
                  </p>
                  
                  <div className="text-xs text-gray-500">
                    Added {new Date(address.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleUseAtCheckout(address)}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      title="Use this at checkout"
                    >
                      Use at checkout
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded"
                    title="Edit address"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                    title="Delete address"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AddressesTab
