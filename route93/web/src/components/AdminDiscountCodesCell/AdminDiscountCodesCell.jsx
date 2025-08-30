

import { useState } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { toast } from '@redwoodjs/web/toast'
import { useMutation, gql } from '@apollo/client'

export const QUERY = gql`
  query AdminDiscountCodesQuery($search: String, $isActive: Boolean) {
    discountCodes(search: $search, isActive: $isActive) {
      id
      code
      name
      description
      type
      value
      usageLimit
      usageCount
      perCustomerLimit
      isActive
      startsAt
      expiresAt
      applicableTo
      createdAt
      updatedAt
    }
    discountCodesCount(search: $search, isActive: $isActive)
  }
`

const TOGGLE_DISCOUNT_MUTATION = gql`
  mutation ToggleDiscountCode($id: Int!) {
    toggleDiscountCode(id: $id) {
      id
      isActive
    }
  }
`

const DELETE_DISCOUNT_MUTATION = gql`
  mutation DeleteDiscountCode($id: Int!) {
    deleteDiscountCode(id: $id)
  }
`

export const Loading = () => (
  <div className="p-8 text-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
    <p className="mt-2 text-gray-600">Loading discount codes...</p>
  </div>
)

export const Empty = () => (
  <div className="p-8 text-center">
    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No discount codes found</h3>
    <p className="text-gray-600 mb-4">Get started by creating your first discount code.</p>
    <Link
      to={routes.adminDiscountCodeAdd()}
      className="btn-primary"
    >
      Create Discount Code
    </Link>
  </div>
)

export const Failure = ({ error }) => (
  <div className="p-8 text-center">
    <svg className="w-16 h-16 text-red-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading discount codes</h3>
    <p className="text-gray-600">{error?.message}</p>
  </div>
)

export const Success = ({ discountCodes, discountCodesCount }) => {
  const [search, setSearch] = useState('')
  const [filterActive, setFilterActive] = useState(null)

  const [toggleDiscount] = useMutation(TOGGLE_DISCOUNT_MUTATION, {
    refetchQueries: [{ query: QUERY }],
  })

  const [deleteDiscount] = useMutation(DELETE_DISCOUNT_MUTATION, {
    refetchQueries: [{ query: QUERY }],
  })

  const handleToggleActive = async (id) => {
    try {
      await toggleDiscount({ variables: { id } })
      toast.success('Discount code status updated')
    } catch (error) {
      toast.error('Failed to update discount code')
    }
  }

  const handleDelete = async (id, code) => {
    if (!confirm(`Are you sure you want to delete discount code "${code}"?`)) {
      return
    }

    try {
      await deleteDiscount({ variables: { id } })
      toast.success('Discount code deleted')
    } catch (error) {
      toast.error('Failed to delete discount code')
    }
  }

  const formatDiscountValue = (type, value) => {
    switch (type) {
      case 'fixed':
        return `$${value}`
      case 'percentage':
        return `${value}%`
      case 'free_shipping':
        return 'Free Shipping'
      case 'bogo':
        return 'Buy One Get One'
      default:
        return value
    }
  }

  const getStatusBadge = (isActive, expiresAt) => {
    const now = new Date()
    const expiry = expiresAt ? new Date(expiresAt) : null

    if (!isActive) {
      return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Inactive</span>
    }

    if (expiry && expiry < now) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Expired</span>
    }

    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
  }

  const filteredCodes = discountCodes.filter(code => {
    const matchesSearch = !search ||
      code.code.toLowerCase().includes(search.toLowerCase()) ||
      code.name.toLowerCase().includes(search.toLowerCase())

    const matchesActive = filterActive === null || code.isActive === filterActive

    return matchesSearch && matchesActive
  })

  return (
    <div>
      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search discount codes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterActive(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filterActive === null
                  ? 'bg-purple-100 text-purple-800 border border-purple-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterActive(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filterActive === true
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterActive(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filterActive === false
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredCodes.length} of {discountCodesCount} discount codes
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expires
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCodes.map((code) => (
              <tr key={code.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{code.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{code.name}</div>
                  {code.description && (
                    <div className="text-xs text-gray-500 truncate max-w-xs">{code.description}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900 capitalize">{code.type.replace('_', ' ')}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {formatDiscountValue(code.type, code.value)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {code.usageCount}
                    {code.usageLimit && ` / ${code.usageLimit}`}
                  </div>
                  {code.perCustomerLimit && (
                    <div className="text-xs text-gray-500">
                      {code.perCustomerLimit} per customer
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(code.isActive, code.expiresAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {code.expiresAt ? new Date(code.expiresAt).toLocaleDateString() : 'Never'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link
                      to={routes.adminDiscountCodeEdit({ id: code.id })}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleToggleActive(code.id)}
                      className={`${
                        code.isActive
                          ? 'text-red-600 hover:text-red-900'
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {code.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(code.id, code.code)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
