import { useState, useEffect } from 'react'
import { Link, routes, navigate } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { useCart } from 'src/contexts/CartContext'

const PaymentFailedPage = () => {
  const { getCartTotal, items } = useCart()
  const [errorDetails, setErrorDetails] = useState({})
  const [retryAttempts, setRetryAttempts] = useState(0)

  useEffect(() => {
    // Get error details from URL params or sessionStorage
    const urlParams = new URLSearchParams(window.location.search)
    const sessionError = sessionStorage.getItem('paymentError')
    
    const errorData = {
      type: urlParams.get('error') || 'unknown',
      message: urlParams.get('message') || (sessionError ? JSON.parse(sessionError).message : 'Payment failed'),
      code: urlParams.get('code') || (sessionError ? JSON.parse(sessionError).code : null),
      orderId: urlParams.get('orderId') || (sessionError ? JSON.parse(sessionError).orderId : null),
      amount: urlParams.get('amount') || (sessionError ? JSON.parse(sessionError).amount : getCartTotal()),
      timestamp: new Date().toISOString()
    }
    
    setErrorDetails(errorData)
    setRetryAttempts(parseInt(urlParams.get('attempts') || '0'))

    // Clear session storage after reading
    if (sessionError) {
      sessionStorage.removeItem('paymentError')
    }
  }, [getCartTotal])

  const getErrorIcon = (errorType) => {
    switch (errorType) {
      case 'card_declined':
        return '💳'
      case 'insufficient_funds':
        return '💰'
      case 'expired_card':
        return '📅'
      case 'incorrect_cvc':
        return '🔒'
      case 'processing_error':
        return '⚙️'
      case 'network_error':
        return '🌐'
      default:
        return '❌'
    }
  }

  const getErrorTitle = (errorType) => {
    switch (errorType) {
      case 'card_declined':
        return 'Card Declined'
      case 'insufficient_funds':
        return 'Insufficient Funds'
      case 'expired_card':
        return 'Card Expired'
      case 'incorrect_cvc':
        return 'Security Code Incorrect'
      case 'processing_error':
        return 'Processing Error'
      case 'network_error':
        return 'Connection Error'
      default:
        return 'Payment Failed'
    }
  }

  const getErrorDescription = (errorType) => {
    switch (errorType) {
      case 'card_declined':
        return 'Your card was declined by your bank. Please try a different payment method or contact your bank.'
      case 'insufficient_funds':
        return 'There are insufficient funds on your card to complete this purchase.'
      case 'expired_card':
        return 'Your card has expired. Please use a different card or update your payment information.'
      case 'incorrect_cvc':
        return 'The security code (CVC) you entered is incorrect. Please check and try again.'
      case 'processing_error':
        return 'There was an error processing your payment. This is usually temporary.'
      case 'network_error':
        return 'There was a connection error. Please check your internet connection and try again.'
      default:
        return 'We encountered an issue processing your payment. Please try again or use a different payment method.'
    }
  }

  const getRetryRecommendation = (errorType) => {
    switch (errorType) {
      case 'card_declined':
        return 'Try using a different card or contact your bank'
      case 'insufficient_funds':
        return 'Add funds to your account or use a different payment method'
      case 'expired_card':
        return 'Use a valid, non-expired card'
      case 'incorrect_cvc':
        return 'Double-check your security code and try again'
      case 'processing_error':
        return 'Wait a few minutes and try again'
      case 'network_error':
        return 'Check your connection and retry'
      default:
        return 'Try again or use a different payment method'
    }
  }

  const handleRetryPayment = () => {
    const newAttempts = retryAttempts + 1
    if (newAttempts >= 3) {
      // Too many attempts, suggest different approach
      return
    }
    
    // Store retry attempt count
    const retryUrl = `${routes.checkout()}?retry=true&attempts=${newAttempts}`
    navigate(retryUrl)
  }

  const handleTryDifferentCard = () => {
    navigate(routes.checkout())
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <>
      <Metadata 
        title="Payment Failed - Route93" 
        description="Your payment could not be processed. Please try again or use a different payment method." 
      />

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="text-6xl mb-4">{getErrorIcon(errorDetails.type)}</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {getErrorTitle(errorDetails.type)}
            </h2>
            <p className="text-gray-600">
              {getErrorDescription(errorDetails.type)}
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            {/* Error Details */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-red-800">Error:</span>
                    <span className="text-red-700">{errorDetails.message}</span>
                  </div>
                  {errorDetails.amount && (
                    <div className="flex justify-between">
                      <span className="font-medium text-red-800">Amount:</span>
                      <span className="text-red-700">{formatPrice(errorDetails.amount)}</span>
                    </div>
                  )}
                  {errorDetails.code && (
                    <div className="flex justify-between">
                      <span className="font-medium text-red-800">Error Code:</span>
                      <span className="text-red-700 font-mono">{errorDetails.code}</span>
                    </div>
                  )}
                  {errorDetails.orderId && (
                    <div className="flex justify-between">
                      <span className="font-medium text-red-800">Order ID:</span>
                      <span className="text-red-700 font-mono">{errorDetails.orderId}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Retry Attempts Warning */}
            {retryAttempts > 0 && (
              <div className="mb-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="text-yellow-400 mr-2">⚠️</div>
                    <div>
                      <p className="text-sm text-yellow-800">
                        <span className="font-medium">Attempt {retryAttempts + 1} of 3</span>
                        {retryAttempts >= 2 && (
                          <span className="block mt-1">
                            After 3 attempts, please try a different payment method or contact support.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendation */}
            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">💡 What to try next:</h4>
                <p className="text-sm text-blue-800">{getRetryRecommendation(errorDetails.type)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {retryAttempts < 2 && (
                <button
                  onClick={handleRetryPayment}
                  className="w-full btn-primary"
                >
                  🔄 Try Again
                </button>
              )}
              
              <button
                onClick={handleTryDifferentCard}
                className="w-full btn-outline"
              >
                💳 Use Different Payment Method
              </button>

              <div className="flex space-x-4">
                <Link to={routes.cart()} className="flex-1 btn-outline text-center">
                  🛒 Back to Cart
                </Link>
                <Link to={routes.contact()} className="flex-1 btn-outline text-center">
                  📞 Contact Support
                </Link>
              </div>

              <Link to={routes.home()} className="w-full btn-secondary text-center">
                🏠 Continue Shopping
              </Link>
            </div>

            {/* Help Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Need Help?</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="mr-2">📧</span>
                  <a href="mailto:support@route93.com" className="text-purple-600 hover:text-purple-500">
                    support@route93.com
                  </a>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📱</span>
                  <a href="tel:+1-555-0123" className="text-purple-600 hover:text-purple-500">
                    +1 (555) 012-3456
                  </a>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">💬</span>
                  <span>Live chat available 24/7</span>
                </div>
              </div>
            </div>

            {/* Common Issues */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <details className="group">
                <summary className="cursor-pointer font-medium text-gray-900 mb-2 flex items-center justify-between">
                  <span>Common Payment Issues</span>
                  <svg className="w-4 h-4 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-2 space-y-2 text-sm text-gray-600">
                  <div>
                    <strong>Card Declined:</strong> Contact your bank to authorize the transaction
                  </div>
                  <div>
                    <strong>Expired Card:</strong> Check your card's expiration date
                  </div>
                  <div>
                    <strong>Incorrect Info:</strong> Verify billing address matches your bank records
                  </div>
                  <div>
                    <strong>Security Code:</strong> Enter the 3-digit code on the back of your card
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentFailedPage
