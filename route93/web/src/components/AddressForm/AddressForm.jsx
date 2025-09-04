import { useState, useEffect } from 'react'
import { useMutation, gql } from '@apollo/client'
import { toast } from '@redwoodjs/web/toast'
import { ALL_COUNTRIES } from 'src/lib/countries'

const CREATE_ADDRESS_MUTATION = gql`
  mutation CreateAddressMutation($input: CreateAddressInput!) {
    createAddress(input: $input) {
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
    }
  }
`

const UPDATE_ADDRESS_MUTATION = gql`
  mutation UpdateAddressMutation($id: Int!, $input: UpdateAddressInput!) {
    updateAddress(id: $id, input: $input) {
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
    }
  }
`

const AddressForm = ({ address, userId, onSave, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'IE',
    phone: '',
    isDefault: false
  })

  const [createAddress, { loading: createLoading }] = useMutation(CREATE_ADDRESS_MUTATION, {
    onCompleted: () => {
      toast.success('Address saved successfully!')
      onSave()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const [updateAddress, { loading: updateLoading }] = useMutation(UPDATE_ADDRESS_MUTATION, {
    onCompleted: () => {
      toast.success('Address updated successfully!')
      onSave()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  useEffect(() => {
    if (address) {
      setFormData({
        firstName: address.firstName || '',
        lastName: address.lastName || '',
        company: address.company || '',
        address1: address.address1 || '',
        address2: address.address2 || '',
        city: address.city || '',
        state: address.state || '',
        zipCode: address.zipCode || '',
        country: address.country || 'US',
        phone: address.phone || '',
        isDefault: address.isDefault || false
      })
    }
  }, [address])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const input = {
      ...formData,
      userId: parseInt(userId)
    }

    if (isEditing) {
      updateAddress({ variables: { id: address.id, input } })
    } else {
      createAddress({ variables: { input } })
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const loading = createLoading || updateLoading

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
          Company
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div>
        <label htmlFor="address1" className="block text-sm font-medium text-gray-700">
          Address Line 1 *
        </label>
        <input
          type="text"
          id="address1"
          name="address1"
          value={formData.address1}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Street address, P.O. box, company name, c/o"
        />
      </div>

      <div>
        <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
          Address Line 2
        </label>
        <input
          type="text"
          id="address2"
          name="address2"
          value={formData.address2}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Apartment, suite, unit, building, floor, etc."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State *
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
            ZIP Code *
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country *
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="">Select a country</option>
            {ALL_COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name} {country.isEU ? '(EU)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isDefault"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
        />
        <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
          Set as default address
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : (isEditing ? 'Update Address' : 'Save Address')}
        </button>
      </div>
    </form>
  )
}

export default AddressForm

