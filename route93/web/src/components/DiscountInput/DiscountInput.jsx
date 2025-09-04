import { useState } from 'react'
import { useMutation, useQuery, gql, useLazyQuery } from '@apollo/client'
import { useCart } from 'src/contexts/CartContext'
import { toast } from '@redwoodjs/web/toast'

const VALIDATE_DISCOUNT_QUERY = gql`
  query ValidateDiscountCode($code: String!) {
    validateDiscountCode(code: $code) {
      isValid
      discountCode {
        id
        code
        name
        description
        type
        value
        minOrderValue
      }
      errorMessage
      discountAmount
      finalTotal
    }
  }
`

const APPLY_DISCOUNT_MUTATION = gql`
  mutation ApplyDiscountToCart($code: String!) {
    applyDiscountToCart(code: $code) {
      isValid
      discountCode {
        id
        code
        name
        description
        type
        value
      }
      errorMessage
      discountAmount
      finalTotal
    }
  }
`

const REMOVE_DISCOUNT_MUTATION = gql`
  mutation RemoveDiscountFromCart {
    removeDiscountFromCart
  }
`

const DiscountInput = ({ className = '', compact = false }) => {
  const [code, setCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [appliedDiscount, setAppliedDiscount] = useState(null)
  const { getCartTotal } = useCart()

  const [validateDiscount] = useLazyQuery(VALIDATE_DISCOUNT_QUERY)
  const [applyDiscount] = useMutation(APPLY_DISCOUNT_MUTATION)
  const [removeDiscount] = useMutation(REMOVE_DISCOUNT_MUTATION)

  const handleValidateCode = async () => {
    if (!code.trim()) {
      toast.error('Please enter a discount code')
      return
    }

    setIsValidating(true)
    try {
      const { data } = await validateDiscount({
        variables: { code: code.trim().toUpperCase() }
      })

      const result = data.validateDiscountCode

      if (result.isValid) {
        toast.success(`"${result.discountCode.name}" discount validated!`)
        // In a full implementation, you might want to show a preview
        // For now, we'll just show success message
      } else {
        toast.error(result.errorMessage || 'Invalid discount code')
      }
    } catch (error) {
      toast.error('Error validating discount code')
    } finally {
      setIsValidating(false)
    }
  }

  const handleApplyCode = async () => {
    if (!code.trim()) {
      toast.error('Please enter a discount code')
      return
    }

    setIsValidating(true)
    try {
      const { data } = await applyDiscount({
        variables: { code: code.trim().toUpperCase() }
      })

      const result = data.applyDiscountToCart

      if (result.isValid) {
        setAppliedDiscount(result.discountCode)
        setCode('')
        toast.success(`"${result.discountCode.name}" discount applied!`)
        // In a full implementation, you'd update the cart context with the discount
      } else {
        toast.error(result.errorMessage || 'Unable to apply discount code')
      }
    } catch (error) {
      toast.error('Error applying discount code')
    } finally {
      setIsValidating(false)
    }
  }

  const handleRemoveDiscount = async () => {
    try {
      await removeDiscount()
      setAppliedDiscount(null)
      toast.success('Discount removed')
      // In a full implementation, you'd update the cart context
    } catch (error) {
      toast.error('Error removing discount')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyCode()
    }
  }

  if (compact) {
    return (
      <div className={`space-y-2 ${className}`}>
        {appliedDiscount ? (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <div className="text-sm font-medium text-green-800">
                  {appliedDiscount.name}
                </div>
                <div className="text-xs text-green-600">
                  Code: {appliedDiscount.code}
                </div>
              </div>
            </div>
            <button
              onClick={handleRemoveDiscount}
              className="text-green-600 hover:text-green-800 text-sm underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isValidating}
            />
            <button
              onClick={handleApplyCode}
              disabled={isValidating || !code.trim()}
              className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isValidating ? '...' : 'Apply'}
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {appliedDiscount ? 'Applied Discount' : 'Discount Code'}
      </h3>

      {appliedDiscount ? (
        <div className="space-y-4">
          <div className="flex items-start justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-green-800">
                  {appliedDiscount.name}
                </div>
                <div className="text-sm text-green-600 mt-1">
                  {appliedDiscount.description || `Code: ${appliedDiscount.code}`}
                </div>
                {appliedDiscount.type === 'percentage' && (
                  <div className="text-sm font-medium text-green-700 mt-2">
                    {appliedDiscount.value}% off
                  </div>
                )}
                {appliedDiscount.type === 'fixed' && (
                  <div className="text-sm font-medium text-green-700 mt-2">
                    ${appliedDiscount.value} off
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleRemoveDiscount}
              className="text-green-600 hover:text-green-800 text-sm underline ml-4 flex-shrink-0"
            >
              Remove
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => setAppliedDiscount(null)}
              className="text-sm text-purple-600 hover:text-purple-700 underline"
            >
              Apply a different code
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Enter discount code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isValidating}
            />
            <button
              onClick={handleValidateCode}
              disabled={isValidating}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Check
            </button>
            <button
              onClick={handleApplyCode}
              disabled={isValidating || !code.trim()}
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isValidating ? 'Applying...' : 'Apply'}
            </button>
          </div>

          <div className="text-sm text-gray-600">
            <p className="mb-2">
              💡 <strong>Tips:</strong>
            </p>
            <ul className="space-y-1 text-xs">
              <li>• Codes are case-insensitive</li>
              <li>• Some codes require a minimum order value</li>
              <li>• Codes may have usage limits</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default DiscountInput
