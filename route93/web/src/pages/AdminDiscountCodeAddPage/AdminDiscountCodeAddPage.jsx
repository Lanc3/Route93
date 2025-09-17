import { useState } from 'react'
import { Link, routes, navigate } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { useMutation, gql } from '@apollo/client'

const CREATE_DISCOUNT_CODE_MUTATION = gql`
  mutation CreateDiscountCode($input: CreateDiscountCodeInput!) {
    createDiscountCode(input: $input) {
      id
      code
      name
      type
      value
      isActive
    }
  }
`



const AdminDiscountCodeAddPage = () => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'fixed',
    value: '',
    minOrderValue: '',
    maxDiscount: '',
    usageLimit: '',
    perCustomerLimit: '',
    startsAt: '',
    expiresAt: ''
  })


  const [isSubmitting, setIsSubmitting] = useState(false)

  const [createDiscountCode] = useMutation(CREATE_DISCOUNT_CODE_MUTATION, {
    onCompleted: () => {
      toast.success('Discount code created successfully!')
      navigate(routes.adminDiscountCodes())
    },
    onError: (error) => {
      toast.error(`Failed to create discount code: ${error.message}`)
    }
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      // Clear value for free_shipping and bogo types
      value: type === 'free_shipping' || type === 'bogo' ? '' : prev.value
    }))
  }



  const validateForm = () => {
    if (!formData.code.trim()) {
      toast.error('Discount code is required')
      return false
    }

    if (!formData.name.trim()) {
      toast.error('Discount name is required')
      return false
    }

    if (!['fixed', 'percentage', 'free_shipping', 'bogo'].includes(formData.type)) {
      toast.error('Please select a valid discount type')
      return false
    }

    if ((formData.type === 'fixed' || formData.type === 'percentage') && !formData.value) {
      toast.error('Discount value is required for this type')
      return false
    }

    if (formData.value && isNaN(parseFloat(formData.value))) {
      toast.error('Discount value must be a valid number')
      return false
    }

    if (formData.minOrderValue && isNaN(parseFloat(formData.minOrderValue))) {
      toast.error('Minimum order value must be a valid number')
      return false
    }

    if (formData.maxDiscount && isNaN(parseFloat(formData.maxDiscount))) {
      toast.error('Maximum discount must be a valid number')
      return false
    }

    if (formData.usageLimit && isNaN(parseInt(formData.usageLimit))) {
      toast.error('Usage limit must be a valid number')
      return false
    }

    if (formData.perCustomerLimit && isNaN(parseInt(formData.perCustomerLimit))) {
      toast.error('Per-customer limit must be a valid number')
      return false
    }

    if (formData.startsAt && formData.expiresAt && new Date(formData.startsAt) >= new Date(formData.expiresAt)) {
      toast.error('Expiration date must be after start date')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const input = {
        code: formData.code.toUpperCase(),
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        type: formData.type,
        value: formData.value ? parseFloat(formData.value) : null,
        minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : null,
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        perCustomerLimit: formData.perCustomerLimit ? parseInt(formData.perCustomerLimit) : null,
        startsAt: formData.startsAt && formData.startsAt.trim() ? new Date(formData.startsAt).toISOString() : null,
        expiresAt: formData.expiresAt && formData.expiresAt.trim() ? new Date(formData.expiresAt).toISOString() : null,
        applicableTo: 'all', // For now, only support 'all'
        categoryIds: null,
        productIds: null
      }

      await createDiscountCode({ variables: { input } })
    } catch (error) {
      console.error('Error creating discount code:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Metadata
        title="Create Discount Code"
        description="Create a new discount code for your store"
      />

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create Discount Code</h1>
                <p className="mt-2 text-gray-600">
                  Set up a new discount code for your customers
                </p>
              </div>
              <Link
                to={routes.adminDiscountCodes()}
                className="btn-outline"
              >
                ← Back to Discount Codes
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white shadow-sm rounded-lg">
            <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
              {/* Basic Information */}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Code *
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                      placeholder="SUMMER2024"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Code will be automatically converted to uppercase
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Summer Sale 2024"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Optional description for internal use"
                  />
                </div>
              </div>

              {/* Discount Type and Value */}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Discount Configuration</h3>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Discount Type *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: 'fixed', label: 'Fixed Amount', desc: '€10 off' },
                      { value: 'percentage', label: 'Percentage', desc: '20% off' },
                      { value: 'free_shipping', label: 'Free Shipping', desc: 'No shipping cost' },
                      { value: 'bogo', label: 'Buy One Get One', desc: 'BOGO deals' }
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleTypeChange(type.value)}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          formData.type === type.value
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-600">{type.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {(formData.type === 'fixed' || formData.type === 'percentage') && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {formData.type === 'fixed' ? 'Discount Amount ($)' : 'Discount Percentage (%)'} *
                      </label>
                      <input
                        type="number"
                        name="value"
                        value={formData.value}
                        onChange={handleInputChange}
                        step={formData.type === 'fixed' ? '0.01' : '0.1'}
                        min="0"
                        max={formData.type === 'percentage' ? '100' : undefined}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={formData.type === 'fixed' ? '10.00' : '20.0'}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Order Value ($)
                      </label>
                      <input
                        type="number"
                        name="minOrderValue"
                        value={formData.minOrderValue}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="25.00"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Leave empty for no minimum
                      </p>
                    </div>

                    {formData.type === 'percentage' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Discount (€)
                        </label>
                        <input
                          type="number"
                          name="maxDiscount"
                          value={formData.maxDiscount}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="50.00"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Cap the discount amount
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Usage Limits */}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Limits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Usage Limit
                    </label>
                    <input
                      type="number"
                      name="usageLimit"
                      value={formData.usageLimit}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum number of times this code can be used
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Per Customer Limit
                    </label>
                    <input
                      type="number"
                      name="perCustomerLimit"
                      value={formData.perCustomerLimit}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      How many times each customer can use this code
                    </p>
                  </div>
                </div>
              </div>

              {/* Validity Period */}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Validity Period</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      name="startsAt"
                      value={formData.startsAt}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to start immediately
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiration Date
                    </label>
                    <input
                      type="datetime-local"
                      name="expiresAt"
                      value={formData.expiresAt}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty for no expiration
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <Link
                  to={routes.adminDiscountCodes()}
                  className="btn-outline"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Discount Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDiscountCodeAddPage
