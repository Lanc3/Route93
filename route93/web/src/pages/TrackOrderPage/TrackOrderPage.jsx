import { useState } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const TrackOrderPage = () => {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [trackingResult, setTrackingResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrackOrder = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    // Simulate API call
    setTimeout(() => {
      if (orderNumber.toLowerCase().includes('rt93')) {
        setTrackingResult({
          orderNumber: orderNumber,
          status: 'In Transit',
          estimatedDelivery: 'Tomorrow, Dec 28',
          carrier: 'FedEx',
          trackingNumber: 'FX123456789US',
          timeline: [
            {
              status: 'Order Placed',
              date: 'Dec 24, 2024 - 10:30 AM',
              completed: true,
              description: 'Your order has been confirmed and is being prepared.'
            },
            {
              status: 'Processing',
              date: 'Dec 24, 2024 - 2:15 PM',
              completed: true,
              description: 'Order is being picked and packed at our warehouse.'
            },
            {
              status: 'Shipped',
              date: 'Dec 25, 2024 - 9:00 AM',
              completed: true,
              description: 'Package has been picked up by the carrier.'
            },
            {
              status: 'In Transit',
              date: 'Dec 26, 2024 - 8:45 AM',
              completed: true,
              description: 'Package is on its way to the destination.'
            },
            {
              status: 'Out for Delivery',
              date: 'Dec 28, 2024',
              completed: false,
              description: 'Package will be delivered today.'
            },
            {
              status: 'Delivered',
              date: 'Estimated Dec 28, 2024',
              completed: false,
              description: 'Package will be delivered to your address.'
            }
          ]
        })
      } else {
        setError('Order not found. Please check your order number and email address.')
      }
      setIsLoading(false)
    }, 1500)
  }

  return (
    <>
      <Metadata 
        title="Track Your Order - Order Tracking | Route93" 
        description="Track your Route93 order in real-time. Enter your order number and email to get the latest shipping updates and delivery status."
      />

      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Track Your <span className="text-green-400">Order</span>
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                Get real-time updates on your order status and estimated delivery time.
              </p>
            </div>
          </div>
          
          {/* Wave separator */}
          <div className="relative">
            <svg className="w-full h-12 text-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor"></path>
            </svg>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to={routes.home()} className="hover:text-purple-600 transition-colors">
              Home
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Track Order</span>
          </nav>
        </div>

        {/* Tracking Form */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {!trackingResult && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Enter Your Order Details</h2>
                  <p className="text-lg text-gray-600">
                    We'll show you real-time tracking information for your order.
                  </p>
                </div>

                <form onSubmit={handleTrackOrder}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Order Number *
                      </label>
                      <input
                        type="text"
                        id="orderNumber"
                        required
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="RT93-123456789"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Found in your order confirmation email
                      </p>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="your.email@example.com"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Email used to place the order
                      </p>
                    </div>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-800">{error}</p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full btn-primary text-lg py-4 ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Tracking Order...
                      </>
                    ) : (
                      'Track My Order'
                    )}
                  </button>
                </form>

                <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Need Help Finding Your Order?</h3>
                  <ul className="text-blue-700 space-y-1 text-sm">
                    <li>• Check your email for the order confirmation</li>
                    <li>• Order numbers start with "RT93-"</li>
                    <li>• Make sure to use the same email address used for checkout</li>
                    <li>• Orders may take up to 1 hour to appear in our tracking system</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tracking Results */}
            {trackingResult && (
              <div className="space-y-8">
                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow-md p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Order {trackingResult.orderNumber}</h2>
                      <p className="text-gray-600">Tracking Number: {trackingResult.trackingNumber}</p>
                    </div>
                    <button
                      onClick={() => setTrackingResult(null)}
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Track Another Order
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900">Status</h3>
                      <p className="text-green-600 font-medium">{trackingResult.status}</p>
                    </div>

                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900">Estimated Delivery</h3>
                      <p className="text-blue-600 font-medium">{trackingResult.estimatedDelivery}</p>
                    </div>

                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900">Carrier</h3>
                      <p className="text-purple-600 font-medium">{trackingResult.carrier}</p>
                    </div>
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Tracking Timeline</h3>
                  
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    <div className="space-y-6">
                      {trackingResult.timeline.map((item, index) => (
                        <div key={index} className="relative flex items-start">
                          <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                            item.completed 
                              ? 'bg-green-600 text-white' 
                              : index === trackingResult.timeline.findIndex(t => !t.completed)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-400'
                          }`}>
                            {item.completed ? (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : index === trackingResult.timeline.findIndex(t => !t.completed) ? (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <div className="w-3 h-3 bg-current rounded-full"></div>
                            )}
                          </div>
                          
                          <div className="ml-6">
                            <div className="flex items-center">
                              <h4 className={`text-lg font-semibold ${
                                item.completed ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                {item.status}
                              </h4>
                              {index === trackingResult.timeline.findIndex(t => !t.completed) && (
                                <span className="ml-3 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className={`text-sm ${item.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                              {item.date}
                            </p>
                            <p className={`text-sm mt-1 ${item.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Actions */}
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Need Help?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to={routes.contact()} className="btn-outline text-center">
                      Contact Support
                    </Link>
                    <Link to={routes.returns()} className="btn-outline text-center">
                      Return Item
                    </Link>
                    <a 
                      href={`https://www.fedex.com/fedextrack/?trknbr=${trackingResult.trackingNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline text-center"
                    >
                      View on {trackingResult.carrier}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Help Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Tracking FAQs</h2>
            </div>
            
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">When will my tracking information appear?</h3>
                  <p className="text-gray-600">Tracking information typically appears within 24 hours of your order being shipped.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">My package seems delayed. What should I do?</h3>
                  <p className="text-gray-600">Delivery times are estimates and may vary due to weather or high volume. Contact us if your package is more than 3 days late.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I change my delivery address?</h3>
                  <p className="text-gray-600">Address changes may be possible before shipping. Contact our support team immediately for assistance.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">What if my package shows delivered but I didn't receive it?</h3>
                  <p className="text-gray-600">Check with neighbors and around your property. If still missing, contact us within 48 hours for investigation.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Our customer service team is here to help with any shipping or delivery questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={routes.contact()} className="btn-secondary text-lg px-8 py-4">
                Contact Support
              </Link>
              <Link to={routes.helpCenter()} className="btn-outline border-white text-white hover:bg-white hover:text-purple-600 text-lg px-8 py-4">
                Visit Help Center
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default TrackOrderPage