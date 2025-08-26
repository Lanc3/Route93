import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const ShippingPage = () => {
  return (
    <>
      <Metadata 
        title="Shipping Information - Delivery Options & Rates | Route93" 
        description="Learn about Route93's shipping options, delivery times, and rates. Free shipping on orders over $50. Fast, reliable delivery worldwide."
      />

      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Shipping <span className="text-green-400">Information</span>
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                Fast, reliable delivery options to get your orders to you quickly and safely.
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
            <span className="text-gray-900 font-medium">Shipping Info</span>
          </nav>
        </div>

        {/* Free Shipping Banner */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-12 h-12 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h2 className="text-3xl font-bold">Free Shipping on Orders Over $50!</h2>
              </div>
              <p className="text-xl text-green-100">
                Enjoy complimentary standard shipping to the continental United States on qualifying orders.
              </p>
            </div>
          </div>
        </section>

        {/* Shipping Options */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Delivery Options</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Choose the shipping method that works best for you. All orders are carefully packaged and tracked.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Standard Shipping */}
              <div className="bg-white p-8 rounded-lg shadow-md border-2 border-gray-200 hover:border-purple-300 transition-colors">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Standard Shipping</h3>
                  <div className="text-3xl font-bold text-purple-600 mb-2">FREE</div>
                  <p className="text-sm text-gray-500 mb-4">on orders over $50</p>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Delivery:</strong> 3-7 business days</p>
                    <p><strong>Cost:</strong> $5.99 (under $50)</p>
                    <p><strong>Tracking:</strong> Included</p>
                  </div>
                </div>
              </div>

              {/* Expedited Shipping */}
              <div className="bg-white p-8 rounded-lg shadow-md border-2 border-green-300 hover:border-green-400 transition-colors relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Expedited Shipping</h3>
                  <div className="text-3xl font-bold text-green-600 mb-2">$12.99</div>
                  <p className="text-sm text-gray-500 mb-4">all orders</p>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Delivery:</strong> 1-3 business days</p>
                    <p><strong>Cost:</strong> $12.99</p>
                    <p><strong>Tracking:</strong> Real-time updates</p>
                  </div>
                </div>
              </div>

              {/* Overnight Shipping */}
              <div className="bg-white p-8 rounded-lg shadow-md border-2 border-gray-200 hover:border-purple-300 transition-colors">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Overnight Shipping</h3>
                  <div className="text-3xl font-bold text-purple-600 mb-2">$24.99</div>
                  <p className="text-sm text-gray-500 mb-4">all orders</p>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Delivery:</strong> Next business day</p>
                    <p><strong>Cost:</strong> $24.99</p>
                    <p><strong>Tracking:</strong> Priority handling</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* International Shipping */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">International Shipping</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We ship worldwide! International shipping rates and delivery times vary by destination.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { region: 'Canada', time: '5-10 days', cost: 'From $15.99' },
                { region: 'Europe', time: '7-14 days', cost: 'From $24.99' },
                { region: 'Asia Pacific', time: '10-21 days', cost: 'From $29.99' },
                { region: 'Rest of World', time: '14-28 days', cost: 'From $34.99' }
              ].map((region, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{region.region}</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Delivery:</strong> {region.time}</p>
                    <p><strong>Cost:</strong> {region.cost}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-yellow-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h4 className="text-lg font-semibold text-yellow-800 mb-2">International Shipping Notes</h4>
                  <ul className="text-yellow-700 space-y-1 text-sm">
                    <li>• Customs duties and taxes may apply and are the responsibility of the recipient</li>
                    <li>• Delivery times are estimates and may vary due to customs processing</li>
                    <li>• Some products may have shipping restrictions to certain countries</li>
                    <li>• International orders cannot be expedited</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Shipping Policies */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Shipping Policies</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Processing Time</h3>
                <div className="space-y-4 text-gray-600">
                  <p>• Orders placed before 2 PM EST ship the same business day</p>
                  <p>• Orders placed after 2 PM EST ship the next business day</p>
                  <p>• Weekend orders are processed on Monday</p>
                  <p>• Holiday processing times may vary</p>
                  <p>• Custom or personalized items may require additional processing time</p>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Packaging & Handling</h3>
                <div className="space-y-4 text-gray-600">
                  <p>• All items are carefully packaged to prevent damage</p>
                  <p>• Eco-friendly packaging materials when possible</p>
                  <p>• Fragile items receive extra protection</p>
                  <p>• Discreet packaging available upon request</p>
                  <p>• Gift wrapping and messages available for $4.99</p>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery Information</h3>
                <div className="space-y-4 text-gray-600">
                  <p>• Signature required for orders over $200</p>
                  <p>• We deliver to residential and business addresses</p>
                  <p>• PO Boxes accepted for standard shipping only</p>
                  <p>• Address changes must be made within 1 hour of ordering</p>
                  <p>• Delivery attempts are made Monday-Friday, 9 AM-6 PM</p>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tracking & Updates</h3>
                <div className="space-y-4 text-gray-600">
                  <p>• Tracking information sent via email when order ships</p>
                  <p>• Real-time tracking available on our website</p>
                  <p>• SMS delivery notifications available</p>
                  <p>• Email notifications for delivery attempts</p>
                  <p>• Customer service available for tracking assistance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Shop?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Start shopping now and enjoy fast, reliable shipping on all your favorite products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={routes.products()} className="btn-secondary text-lg px-8 py-4">
                Shop Now
              </Link>
              <Link to={routes.contact()} className="btn-outline border-white text-white hover:bg-white hover:text-purple-600 text-lg px-8 py-4">
                Questions? Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default ShippingPage