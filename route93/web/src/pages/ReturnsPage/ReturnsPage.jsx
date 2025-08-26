import { useState } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const ReturnsPage = () => {
  const [returnType, setReturnType] = useState('return')
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [showReturnForm, setShowReturnForm] = useState(false)

  const handleReturnLookup = (e) => {
    e.preventDefault()
    setShowReturnForm(true)
  }

  return (
    <>
      <Metadata 
        title="Returns & Refunds - Easy Return Policy | Route93" 
        description="Easy returns and refunds at Route93. 30-day return policy, free return shipping for defective items. Start your return process here."
      />

      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Returns & <span className="text-green-400">Refunds</span>
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                We want you to love your purchase. If you're not completely satisfied, we're here to help.
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
            <span className="text-gray-900 font-medium">Returns & Refunds</span>
          </nav>
        </div>

        {/* Return Policy Summary */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-12 h-12 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-3xl font-bold">30-Day Return Policy</h2>
              </div>
              <p className="text-xl text-green-100">
                Return most items within 30 days for a full refund. Free return shipping for defective items.
              </p>
            </div>
          </div>
        </section>

        {/* Start Return Process */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Your Return</h2>
              <p className="text-lg text-gray-600">
                Enter your order information below to begin the return process.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <form onSubmit={handleReturnLookup}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    What would you like to do?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: 'return', label: 'Return Item', desc: 'Get a refund' },
                      { value: 'exchange', label: 'Exchange Item', desc: 'Different size/color' },
                      { value: 'defective', label: 'Report Defect', desc: 'Item is damaged' }
                    ].map((option) => (
                      <label key={option.value} className="relative">
                        <input
                          type="radio"
                          name="returnType"
                          value={option.value}
                          checked={returnType === option.value}
                          onChange={(e) => setReturnType(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          returnType === option.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="text-center">
                            <h3 className="font-semibold text-gray-900">{option.label}</h3>
                            <p className="text-sm text-gray-600">{option.desc}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

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
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary text-lg py-4"
                >
                  Find My Order
                </button>
              </form>

              {showReturnForm && (
                <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center mb-4">
                    <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-green-800">Order Found!</h3>
                  </div>
                  <p className="text-green-700 mb-4">
                    We found your order. You'll receive an email with return instructions and a prepaid shipping label within 15 minutes.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to={routes.home()} className="btn-primary text-center">
                      Continue Shopping
                    </Link>
                    <Link to={routes.contact()} className="btn-outline text-center">
                      Need Help?
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Return Policy Details */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Return Policy Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* What Can Be Returned */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">What Can Be Returned</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Items in original condition</li>
                  <li>• Items with tags attached</li>
                  <li>• Unused and unworn items</li>
                  <li>• Items in original packaging</li>
                  <li>• Returns within 30 days</li>
                </ul>
              </div>

              {/* What Cannot Be Returned */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">What Cannot Be Returned</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Personalized items</li>
                  <li>• Intimate apparel</li>
                  <li>• Perishable goods</li>
                  <li>• Gift cards</li>
                  <li>• Final sale items</li>
                </ul>
              </div>

              {/* Return Process */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Return Process</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Start return online</li>
                  <li>• Print prepaid label</li>
                  <li>• Package securely</li>
                  <li>• Drop off at carrier</li>
                  <li>• Refund in 5-7 days</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Return Timeline */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Return Timeline</h2>
              <p className="text-lg text-gray-600">Here's what to expect during the return process</p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-purple-200"></div>
                
                {[
                  {
                    step: '1',
                    title: 'Start Return',
                    description: 'Submit return request online with order details',
                    time: 'Day 1'
                  },
                  {
                    step: '2',
                    title: 'Receive Label',
                    description: 'Get prepaid return shipping label via email',
                    time: 'Within 15 minutes'
                  },
                  {
                    step: '3',
                    title: 'Ship Item',
                    description: 'Package item and drop off at shipping location',
                    time: 'Within 7 days'
                  },
                  {
                    step: '4',
                    title: 'Item Received',
                    description: 'We receive and inspect your returned item',
                    time: '3-5 business days'
                  },
                  {
                    step: '5',
                    title: 'Refund Processed',
                    description: 'Refund issued to original payment method',
                    time: '5-7 business days'
                  }
                ].map((item, index) => (
                  <div key={index} className={`relative flex items-center mb-8 ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                          <span className="text-sm text-purple-600 font-semibold">{item.time}</span>
                        </div>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{item.step}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Return FAQs</h2>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              {[
                {
                  question: "How long do I have to return an item?",
                  answer: "You have 30 days from the delivery date to return most items. The item must be in its original condition with tags attached."
                },
                {
                  question: "Do I have to pay for return shipping?",
                  answer: "Return shipping is free for defective items. For other returns, you can use our prepaid return label for $6.99, or arrange your own shipping."
                },
                {
                  question: "How long does it take to get my refund?",
                  answer: "Once we receive your return, refunds are processed within 5-7 business days to your original payment method."
                },
                {
                  question: "Can I exchange an item instead of returning it?",
                  answer: "Yes! You can exchange items for a different size or color. Start the exchange process using the form above."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help with Your Return?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Our customer service team is here to help make your return process as smooth as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={routes.contact()} className="btn-secondary text-lg px-8 py-4">
                Contact Support
              </Link>
              <a href="mailto:returns@route93.com" className="btn-outline border-white text-white hover:bg-white hover:text-purple-600 text-lg px-8 py-4">
                Email Returns Team
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default ReturnsPage