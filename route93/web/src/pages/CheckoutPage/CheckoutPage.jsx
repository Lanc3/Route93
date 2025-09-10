import { useState, useEffect } from 'react'
import { Link, routes, navigate } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { useCart } from 'src/contexts/CartContext'
import { useAuth } from 'src/auth'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, PaymentRequestButtonElement, useStripe, useElements } from '@stripe/react-stripe-js'
import AddressAutocomplete from 'src/components/AddressAutocomplete/AddressAutocomplete'
import { formatPrice, calculateCartVat, calculateShippingVat } from 'src/lib/currency'
import { ALL_COUNTRIES } from 'src/lib/countries'

// Initialize Stripe
const stripePromise = loadStripe(process.env.REDWOOD_ENV_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef')

const CREATE_PAYMENT_INTENT_MUTATION = gql`
  mutation CreatePaymentIntentMutation($input: CreatePaymentIntentInput!) {
    createPaymentIntent(input: $input) {
      clientSecret
      paymentIntentId
    }
  }
`

const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrderMutation($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      orderNumber
      status
      totalAmount
      createdAt
    }
  }
`

const CREATE_PAYMENT_MUTATION = gql`
  mutation CreatePaymentMutation($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      id
      amount
      status
      method
      transactionId
    }
  }
`

const RECORD_FAILED_PAYMENT_MUTATION = gql`
  mutation RecordFailedPaymentMutation($input: CreatePaymentInput!) {
    recordFailedPayment(input: $input) {
      id
      amount
      status
      method
      errorCode
      errorMessage
      errorType
    }
  }
`

// Fetch current user's addresses (default first)
const CURRENT_USER_ADDRESSES = gql`
  query CurrentUserAddresses {
    currentUser {
      id
      email
      name
      phone
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

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const { items, getCartTotal, clearCart } = useCart()
  const { currentUser } = useAuth()
  const { data: currentUserData } = useQuery(CURRENT_USER_ADDRESSES)
  
  const [createPaymentIntent] = useMutation(CREATE_PAYMENT_INTENT_MUTATION)
  const [createOrder] = useMutation(CREATE_ORDER_MUTATION)
  const [createPayment] = useMutation(CREATE_PAYMENT_MUTATION)
  const [recordFailedPayment] = useMutation(RECORD_FAILED_PAYMENT_MUTATION)
  
  const [processing, setProcessing] = useState(false)
  const [paymentIntentId, setPaymentIntentId] = useState(null)
  const [clientSecret, setClientSecret] = useState(null)
  const [paymentRequest, setPaymentRequest] = useState(null)
  const [canMakePayment, setCanMakePayment] = useState(false)
  const [walletSupport, setWalletSupport] = useState(null)
  
  // Form states
  const [shippingAddress, setShippingAddress] = useState(() => {
    const defaultAddr = currentUser?.addresses?.find?.(a => a.isDefault) || currentUser?.addresses?.[0]
    return {
      firstName: currentUser?.name?.split(' ')[0] || '',
      lastName: currentUser?.name?.split(' ')[1] || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || defaultAddr?.phone || '',
      address1: defaultAddr?.address1 || '',
      address2: defaultAddr?.address2 || '',
      city: defaultAddr?.city || '',
      state: defaultAddr?.state || '',
      zipCode: defaultAddr?.zipCode || '',
      country: defaultAddr?.country || 'IE'
    }
  })

  // If currentUser updates (e.g., after setting default), refresh prefill once
  useEffect(() => {
    const defaultAddr = currentUser?.addresses?.find?.(a => a.isDefault) || currentUser?.addresses?.[0]
    if (defaultAddr) {
      setShippingAddress((prev) => ({
        ...prev,
        phone: prev.phone || defaultAddr.phone || '',
        address1: prev.address1 || defaultAddr.address1 || '',
        address2: prev.address2 || defaultAddr.address2 || '',
        city: prev.city || defaultAddr.city || '',
        state: prev.state || defaultAddr.state || '',
        zipCode: prev.zipCode || defaultAddr.zipCode || '',
        country: prev.country || defaultAddr.country || 'IE'
      }))
    }
  }, [currentUser])

  // Prefill once addresses load from GraphQL (default first)
  useEffect(() => {
    const user = currentUserData?.currentUser
    const defaultAddr = user?.addresses?.find?.(a => a.isDefault) || user?.addresses?.[0]
    if (defaultAddr && (!shippingAddress?.address1 || shippingAddress.address1.trim() === '')) {
      setShippingAddress({
        firstName: user?.name?.split(' ')[0] || defaultAddr.firstName || '',
        lastName: user?.name?.split(' ')[1] || defaultAddr.lastName || '',
        email: user?.email || '',
        phone: user?.phone || defaultAddr.phone || '',
        address1: defaultAddr.address1 || '',
        address2: defaultAddr.address2 || '',
        city: defaultAddr.city || '',
        state: defaultAddr.state || '',
        zipCode: defaultAddr.zipCode || '',
        country: defaultAddr.country || 'IE'
      })
    }
  }, [currentUserData])
  
  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'IE'
  })
  
  const [useSameAddress, setUseSameAddress] = useState(true)
  const [shippingMethod, setShippingMethod] = useState('standard')
  
  // VAT calculation based on customer location
  const customerCountry = shippingAddress.country || 'IE'
  const vatCalculation = calculateCartVat(items, customerCountry)
  
  // Calculate totals with VAT
  const baseShipping = shippingMethod === 'express' ? 15.99 : shippingMethod === 'overnight' ? 29.99 : 5.99
  const shippingVatCalc = calculateShippingVat(baseShipping, vatCalculation.customerType)
  
  const subtotal = vatCalculation.totalNetPrice
  const vatAmount = vatCalculation.totalVatAmount + shippingVatCalc.vatAmount
  const shipping = shippingVatCalc.grossPrice
  const total = subtotal + vatAmount + baseShipping

  // Shipping ETA
  const [eta, setEta] = useState(null)
  useEffect(() => {
    const fetchEta = async () => {
      try {
        const res = await fetch('/.redwood/functions/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: `query($country:String!,$method:String!){ shippingEstimate(country:$country, method:$method){ minDays maxDays commitment } }`, variables: { country: customerCountry, method: shippingMethod } })
        })
        const json = await res.json()
        setEta(json.data?.shippingEstimate || null)
      } catch (_) { setEta(null) }
    }
    fetchEta()
  }, [customerCountry, shippingMethod])

  // Keep Payment Request total in sync as the order total changes
  useEffect(() => {
    if (paymentRequest) {
      try {
        paymentRequest.update({
          total: { label: 'Route93 Order', amount: Math.round(total * 100) },
        })
      } catch (_) {
        // ignore
      }
    }
  }, [paymentRequest, total])

  // Prepare Payment Request Button when possible
  useEffect(() => {
    const setupPaymentRequest = async () => {
      if (!stripe || items.length === 0) return

      try {
        // Create a PaymentIntent for wallet flows
        const { data: pi } = await createPaymentIntent({
          variables: { input: { amount: Math.round(total * 100), currency: 'eur' } }
        })
        setClientSecret(pi.createPaymentIntent.clientSecret)

        const pr = stripe.paymentRequest({
          country: (shippingAddress.country || 'IE'),
          currency: 'eur',
          total: { label: 'Route93 Order', amount: Math.round(total * 100) },
          requestPayerName: true,
          requestPayerEmail: true,
          requestPayerPhone: false,
          requestShipping: false,
        })

        const result = await pr.canMakePayment()
        if (result) {
          setPaymentRequest(pr)
          setCanMakePayment(true)
          setWalletSupport(result)

          pr.on('paymentmethod', async (ev) => {
            try {
              // Create order
              const orderInput = {
                userId: currentUser.id,
                status: 'PENDING',
                totalAmount: total,
                shippingCost: shipping,
                taxAmount: vatAmount,
                shippingAddress: {
                  firstName: shippingAddress.firstName,
                  lastName: shippingAddress.lastName,
                  company: '',
                  address1: shippingAddress.address1,
                  address2: shippingAddress.address2,
                  city: shippingAddress.city,
                  state: shippingAddress.state,
                  zipCode: shippingAddress.zipCode,
                  country: shippingAddress.country,
                  phone: shippingAddress.phone,
                  isDefault: false
                },
                orderItems: items.map(item => {
                  const isCustomPrint = !!(item.printableItemId && (item.designId || item.designUrl))
                  const baseProductPrice = item.product.salePrice || item.product.price
                  const printableItemPrice = item.printableItem?.price
                  const unitPrice = isCustomPrint ? (printableItemPrice ?? baseProductPrice) : baseProductPrice
                  const unitPrintFee = item.printFee || 0
                  return {
                    productId: item.product.id,
                    quantity: item.quantity,
                    price: unitPrice,
                    totalPrice: (unitPrice + unitPrintFee) * item.quantity,
                    designUrl: item.designUrl,
                    designId: item.designId,
                    printFee: item.printFee,
                    printableItemId: item.printableItemId
                  }
                })
              }
              const { data: orderData } = await createOrder({ variables: { input: orderInput } })

              // Confirm with payment method from wallet
              const confirmResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: ev.paymentMethod.id,
              }, { handleActions: true })

              if (confirmResult.error) {
                ev.complete('fail')
                toast.error(confirmResult.error.message)
                await recordFailedPayment({ variables: { input: {
                  amount: total,
                  status: 'FAILED',
                  method: 'STRIPE_WALLET',
                  orderId: orderData.createOrder.id,
                  errorCode: confirmResult.error.code || 'STRIPE_ERROR',
                  errorMessage: confirmResult.error.message,
                  errorType: confirmResult.error.type || 'wallet_error'
                } } })
                return
              }

              if (confirmResult.paymentIntent && confirmResult.paymentIntent.status === 'succeeded') {
                ev.complete('success')
                await createPayment({ variables: { input: {
                  amount: total,
                  status: 'COMPLETED',
                  method: 'STRIPE_WALLET',
                  transactionId: confirmResult.paymentIntent.id,
                  orderId: orderData.createOrder.id
                } } })
                clearCart()
                navigate(routes.orderConfirmation({ id: orderData.createOrder.id }))
              } else {
                ev.complete('fail')
                toast.error('Payment was not completed')
              }
            } catch (err) {
              ev.complete('fail')
              console.error('Wallet payment error:', err)
              toast.error('Wallet payment failed')
            }
          })
        } else {
          setCanMakePayment(false)
          setWalletSupport(null)
        }
      } catch (e) {
        // ignore
      }
    }

    setupPaymentRequest()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe, total, items.length, shippingAddress])

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!stripe || !elements) {
      return
    }

    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setProcessing(true)

    try {
      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'address1', 'city', 'state', 'zipCode']
      for (const field of requiredFields) {
        if (!shippingAddress[field]) {
          toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
          setProcessing(false)
          return
        }
      }

      // Get card element
      const cardElement = elements.getElement(CardElement)

      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          email: shippingAddress.email,
          address: {
            line1: useSameAddress ? shippingAddress.address1 : billingAddress.address1,
            line2: useSameAddress ? shippingAddress.address2 : billingAddress.address2,
            city: useSameAddress ? shippingAddress.city : billingAddress.city,
            state: useSameAddress ? shippingAddress.state : billingAddress.state,
            postal_code: useSameAddress ? shippingAddress.zipCode : billingAddress.zipCode,
            country: useSameAddress ? shippingAddress.country : billingAddress.country,
          }
        }
      })

      if (paymentMethodError) {
        toast.error(paymentMethodError.message)
        setProcessing(false)
        return
      }

      // Create order first (without payment initially)
      const orderInput = {
        userId: currentUser.id,
        status: 'PENDING',
        totalAmount: total,
        shippingCost: shipping,
        taxAmount: vatAmount,
        shippingAddress: {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          company: '',
          address1: shippingAddress.address1,
          address2: shippingAddress.address2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country,
          phone: shippingAddress.phone,
          isDefault: false
        },
        orderItems: items.map(item => {
          const isCustomPrint = !!(item.printableItemId && (item.designId || item.designUrl))
          const baseProductPrice = item.product.salePrice || item.product.price
          const printableItemPrice = item.printableItem?.price
          const unitPrice = isCustomPrint ? (printableItemPrice ?? baseProductPrice) : baseProductPrice
          const unitPrintFee = item.printFee || 0
          const orderItemData = {
            productId: item.product.id,
            quantity: item.quantity,
            price: unitPrice,
            totalPrice: (unitPrice + unitPrintFee) * item.quantity,
            designUrl: item.designUrl,
            designId: item.designId,
            printFee: item.printFee,
            printableItemId: item.printableItemId
          }

          return orderItemData
        })
      }

      const { data: orderData } = await createOrder({
        variables: { input: orderInput }
      })

      // Create a new payment intent
      const { data: paymentIntentData } = await createPaymentIntent({
        variables: {
          input: {
            amount: Math.round(total * 100),
            currency: 'eur'
          }
        }
      })

      // Confirm payment with Stripe
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(paymentIntentData.createPaymentIntent.clientSecret, {
        payment_method: paymentMethod.id
      })

      if (confirmError) {
        // Store error details for the payment failed page
        const errorInfo = {
          message: confirmError.message,
          code: confirmError.code,
          type: confirmError.type || 'unknown',
          orderId: orderData.createOrder.id,
          amount: total,
          timestamp: new Date().toISOString()
        }
        
        // Record failed payment in database
        try {
          await recordFailedPayment({
            variables: {
              input: {
                amount: total,
                status: 'FAILED',
                method: 'STRIPE',
                orderId: orderData.createOrder.id,
                errorCode: errorInfo.code || 'STRIPE_ERROR',
                errorMessage: errorInfo.message,
                errorType: errorInfo.type
              }
            }
          })
        } catch (dbError) {
          console.error('Failed to record failed payment in database:', dbError)
        }
        
        sessionStorage.setItem('paymentError', JSON.stringify(errorInfo))
        
        // Show immediate error feedback
        toast.error(`Payment failed: ${confirmError.message}`)
        
        // Navigate to payment failed page with error details
        const errorParams = new URLSearchParams({
          error: errorInfo.type,
          message: errorInfo.message,
          code: errorInfo.code || '',
          orderId: errorInfo.orderId.toString(),
          amount: errorInfo.amount.toString()
        })
        
        navigate(`${routes.paymentFailed()}?${errorParams.toString()}`)
        return
      }

      if (paymentIntent.status === 'succeeded') {
        // Payment successful - create payment record
        await createPayment({
          variables: {
            input: {
              amount: total,
              status: 'COMPLETED',
              method: 'STRIPE',
              transactionId: paymentIntent.id,
              orderId: orderData.createOrder.id
            }
          }
        })
        
        toast.success('Payment successful!')
        
        // Clear cart
        clearCart()
        
        // Navigate to order confirmation
        navigate(routes.orderConfirmation({ id: orderData.createOrder.id }))
      } else {
        // Payment not successful - handle different statuses
        let errorType = 'processing_error'
        let errorMessage = 'Payment could not be completed'
        
        switch (paymentIntent.status) {
          case 'requires_payment_method':
            errorType = 'card_declined'
            errorMessage = 'Your payment method was declined. Please try a different card.'
            break
          case 'requires_confirmation':
            errorType = 'processing_error'
            errorMessage = 'Payment requires additional confirmation. Please try again.'
            break
          case 'requires_action':
            errorType = 'processing_error'
            errorMessage = 'Additional authentication required. Please try again.'
            break
          case 'processing':
            errorType = 'processing_error'
            errorMessage = 'Payment is still processing. Please wait and check your order status.'
            break
          case 'canceled':
            errorType = 'processing_error'
            errorMessage = 'Payment was canceled. Please try again.'
            break
          default:
            errorType = 'processing_error'
            errorMessage = `Payment status: ${paymentIntent.status}. Please try again or contact support.`
        }
        
        // Store error details
        const errorInfo = {
          message: errorMessage,
          code: `STRIPE_STATUS_${paymentIntent.status.toUpperCase()}`,
          type: errorType,
          orderId: orderData.createOrder.id,
          amount: total,
          timestamp: new Date().toISOString()
        }
        
        // Record failed payment in database
        try {
          await recordFailedPayment({
            variables: {
              input: {
                amount: total,
                status: 'FAILED',
                method: 'STRIPE',
                orderId: orderData.createOrder.id,
                errorCode: errorInfo.code,
                errorMessage: errorInfo.message,
                errorType: errorInfo.type
              }
            }
          })
        } catch (dbError) {
          console.error('Failed to record failed payment in database:', dbError)
        }
        
        sessionStorage.setItem('paymentError', JSON.stringify(errorInfo))
        
        // Show immediate error feedback
        toast.error(errorMessage)
        
        // Navigate to payment failed page
        const errorParams = new URLSearchParams({
          error: errorInfo.type,
          message: errorInfo.message,
          code: errorInfo.code,
          orderId: errorInfo.orderId.toString(),
          amount: errorInfo.amount.toString()
        })
        
        navigate(`${routes.paymentFailed()}?${errorParams.toString()}`)
      }

    } catch (error) {
      console.error('Checkout error:', error)
      
      // Determine error type based on error message/type
      let errorType = 'processing_error'
      let errorMessage = 'Payment failed. Please try again.'
      
      if (error.message?.includes('network') || error.message?.includes('connection')) {
        errorType = 'network_error'
        errorMessage = 'Network error occurred. Please check your connection and try again.'
      } else if (error.message?.includes('timeout')) {
        errorType = 'processing_error'
        errorMessage = 'Payment processing timed out. Please try again.'
      } else if (error.networkError) {
        errorType = 'network_error'
        errorMessage = 'Connection error. Please try again.'
      }
      
      // Store error details
      const errorInfo = {
        message: errorMessage,
        code: error.code || 'CHECKOUT_ERROR',
        type: errorType,
        orderId: null, // May not have order ID if error occurred before order creation
        amount: total,
        timestamp: new Date().toISOString()
      }
      
      sessionStorage.setItem('paymentError', JSON.stringify(errorInfo))
      
      // Show immediate error feedback
      toast.error(errorMessage)
      
      // Navigate to payment failed page
      const errorParams = new URLSearchParams({
        error: errorInfo.type,
        message: errorInfo.message,
        code: errorInfo.code,
        amount: errorInfo.amount.toString()
      })
      
      navigate(`${routes.paymentFailed()}?${errorParams.toString()}`)
    }

    setProcessing(false)
  }


  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            🛒
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Add some items to your cart before checking out.</p>
          <Link to={routes.products()} className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Left Column - Forms */}
          <div className="lg:col-span-7">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={shippingAddress.firstName}
                    onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={shippingAddress.lastName}
                    onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                  <AddressAutocomplete
                    value={shippingAddress.address1}
                    onAddressSelected={(addr) => setShippingAddress({ ...shippingAddress, ...addr })}
                    onChange={(val) => setShippingAddress({ ...shippingAddress, address1: val })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                  <input
                    type="text"
                    value={shippingAddress.address2}
                    onChange={(e) => setShippingAddress({...shippingAddress, address2: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                  <input
                    type="text"
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <select
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a country</option>
                    {ALL_COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name} {country.isEU ? '(EU)' : ''}
                      </option>
                    ))}
                  </select>
                  
                  {/* VAT Information */}
                  {shippingAddress.country && (
                    <div className="mt-2 text-sm text-gray-600">
                      {vatCalculation.customerType === 'B2C' && (
                        <div className="flex items-center text-green-600">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Irish VAT (23%) will be added to your order
                        </div>
                      )}
                      {vatCalculation.customerType === 'B2B_EU' && (
                        <div className="flex items-center text-blue-600">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          EU Reverse Charge - No VAT charged (B2B transaction)
                        </div>
                      )}
                      {vatCalculation.customerType === 'B2B_NON_EU' && (
                        <div className="flex items-center text-purple-600">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Export Sale - No VAT charged
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Method</h2>
              
              <div className="space-y-3">
                {[
                  { value: 'standard', label: 'Standard Shipping', price: 5.99, time: '5-7 business days' },
                  { value: 'express', label: 'Express Shipping', price: 15.99, time: '2-3 business days' },
                  { value: 'overnight', label: 'Overnight Shipping', price: 29.99, time: '1 business day' }
                ].map((method) => (
                  <label key={method.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="shipping"
                      value={method.value}
                      checked={shippingMethod === method.value}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{method.label}</div>
                          <div className="text-sm text-gray-500">{method.time}</div>
                        </div>
                        <div className="font-medium">{formatPrice(method.price)}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {eta && (
                <div className="mt-3 text-sm text-gray-600">
                  Estimated delivery: <span className="font-medium">{eta.commitment}</span>
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>

              {canMakePayment && paymentRequest && (
                <div className="mb-4">
                  <PaymentRequestButtonElement options={{ paymentRequest }} />
                  {walletSupport && (
                    <div className="text-xs text-gray-600 mt-2">
                      {walletSupport.applePay && <span className="mr-2">Apple Pay available</span>}
                      {walletSupport.googlePay && <span className="mr-2">Google Pay available</span>}
                      {!walletSupport.applePay && !walletSupport.googlePay && <span>Wallet available</span>}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">or pay with card</div>
                </div>
              )}
              {!canMakePayment && (
                <div className="mb-4 text-xs text-gray-500">
                  Digital wallets are not available on this device/browser. You can pay securely with card below.
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Information</label>
                <div className="p-3 border border-gray-300 rounded-lg">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={useSameAddress}
                    onChange={(e) => setUseSameAddress(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Billing address is the same as shipping address</span>
                </label>
              </div>

              {!useSameAddress && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Billing address fields - similar structure to shipping */}
                  <div className="md:col-span-2">
                    <h3 className="font-medium text-gray-900 mb-3">Billing Address</h3>
                  </div>
                  {/* Add billing address fields here if needed */}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {/* Regular Items */}
                {items.filter(item => !item.printFee && !item.designId && !item.designUrl).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Products</h3>
                    <div className="space-y-2">
                      {items.filter(item => !item.printFee && !item.designId && !item.designUrl).map((item) => {
                        const price = item.product.salePrice || item.product.price
                        return (
                          <div key={item.id} className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              📦
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{item.product.name}</div>
                              <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                            </div>
                            <div className="font-medium">{formatPrice(price * item.quantity)}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Custom Print Items */}
                {items.filter(item => item.printFee && item.designId && item.designUrl).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <svg className="w-3 h-3 mr-1 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                      </svg>
                      Custom Prints
                    </h3>
                    <div className="space-y-2">
                      {items.filter(item => item.printFee && item.designId && item.designUrl).map((item) => {
                        const price = item.product.salePrice || item.product.price
                        return (
                          <div key={item.id} className="flex items-center space-x-3 p-2 bg-purple-50 rounded-lg border border-purple-200">
                            {/* Design and Printable Item Images */}
                            <div className="flex-shrink-0">
                              <div className="relative">
                                {/* Printable Item Image (bottom layer) */}
                                <img
                                  src={item.printableItem?.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAxNEgxOFYyNEgxNlYxNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE0IDE2SDE4VjIwSDE0VjE2WiIgZmlsbD0iIzlDQTlBQSIvPgo8L3N2Zz4='}
                                  alt="Printable Item"
                                  className="w-10 h-10 object-cover rounded-lg border-2 border-white"
                                  onError={(e) => {
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAxNEgxOFYyNEgxNlYxNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE0IDE2SDE4VjIwSDE0VjE2WiIgZmlsbD0iIzlDQTlBQSIvPgo8L3N2Zz4='
                                  }}
                                />
                                {/* Design Image (top layer, overlaid) */}
                                <img
                                  src={item.designUrl}
                                  alt="Custom Design"
                                  className="w-6 h-6 object-cover rounded absolute -bottom-1 -right-1 border-2 border-white"
                                  onError={(e) => {
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxMkgxNFYxOEgxMlgxMloiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEwIDE0SDE0VjE4SDEwVjE0WiIgZmlsbD0iIzlDQTlBQSIvPgo8L3N2Zz4='
                                  }}
                                />
                              </div>
                            </div>

                            <div className="flex-1">
                              <div className="font-medium text-sm">{item.product.name}</div>
                              <div className="text-xs text-purple-600">Custom Print + €{item.printFee}</div>
                              <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                            </div>
                            <div className="font-medium">{formatPrice((price + item.printFee) * item.quantity)}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal (ex VAT)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping (ex VAT)</span>
                  <span className="font-medium">{formatPrice(baseShipping)}</span>
                </div>
                {vatAmount > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">VAT ({vatCalculation.customerType === 'B2C' ? '23%' : 'Various'})</span>
                      <span className="font-medium">{formatPrice(vatAmount)}</span>
                    </div>
                    {vatCalculation.reverseCharge && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">EU Reverse Charge Applied</span>
                        <span className="text-gray-500">€0.00</span>
                      </div>
                    )}
                  </>
                )}
                {vatCalculation.customerType === 'B2B_NON_EU' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Export Sale (No VAT)</span>
                    <span className="text-gray-500">€0.00</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-purple-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={!stripe || processing}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  processing
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {processing ? 'Processing...' : `Place Order - ${formatPrice(total)}`}
              </button>

              {/* Security Info */}
              <div className="mt-4 text-center text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure checkout powered by Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

const CheckoutPage = () => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <>
        <Metadata title="Checkout - Route93" description="Complete your purchase" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
              🔒
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in required</h3>
            <p className="text-gray-500 mb-6">Please sign in to continue with checkout.</p>
            <Link to={routes.login()} className="btn-primary mr-4">
              Sign In
            </Link>
            <Link to={routes.cart()} className="btn-outline">
              Back to Cart
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Metadata title="Checkout - Route93" description="Complete your purchase" />
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </>
  )
}

export default CheckoutPage
