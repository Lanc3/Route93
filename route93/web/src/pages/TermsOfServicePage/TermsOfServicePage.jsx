import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const TermsOfServicePage = () => {
  return (
    <>
      <Metadata 
        title="Terms of Service - Route93" 
        description="Route93's terms of service and conditions for using our website and services. Read our user agreement and policies."
      />

      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Terms of <span className="text-green-400">Service</span>
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                Please read these terms carefully before using our services.
              </p>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to={routes.home()} className="hover:text-purple-600 transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Terms of Service</span>
          </nav>
        </div>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800"><strong>Effective Date:</strong> December 26, 2024</p>
                <p className="text-blue-700 mt-2">These Terms of Service govern your use of Route93's website and services.</p>
              </div>

              <div className="prose max-w-none space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                  <p className="text-gray-600 mb-4">
                    By accessing and using Route93's website and services, you accept and agree to be bound by these Terms of Service. 
                    If you do not agree to these terms, please do not use our services.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of Services</h2>
                  <p className="text-gray-600 mb-4">
                    You may use our services for lawful purposes only. You agree not to use our services in any way that could damage, 
                    disable, overburden, or impair our website or interfere with others' use of our services.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
                  <p className="text-gray-600 mb-4">
                    To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality 
                    of your account information and for all activities under your account.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Orders and Payment</h2>
                  <p className="text-gray-600 mb-4">
                    All orders are subject to acceptance and availability. We reserve the right to refuse or cancel orders. 
                    Payment must be received before order processing and shipping.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Shipping and Returns</h2>
                  <p className="text-gray-600 mb-4">
                    Shipping terms and return policies are detailed on our respective policy pages. 
                    Please review these policies before making a purchase.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
                  <p className="text-gray-600 mb-4">
                    All content on our website, including text, graphics, logos, and images, is owned by Route93 and protected by copyright laws. 
                    You may not reproduce or distribute our content without permission.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privacy</h2>
                  <p className="text-gray-600 mb-4">
                    Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
                  <p className="text-gray-600 mb-4">
                    Our services are provided "as is" without warranties of any kind. We do not guarantee that our services will be uninterrupted 
                    or error-free.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
                  <p className="text-gray-600 mb-4">
                    Route93 shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
                  <p className="text-gray-600 mb-4">
                    We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
                    Your continued use constitutes acceptance of the modified terms.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-purple-50 border border-purple-200 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h3>
                <p className="text-gray-600 mb-4">Questions about these Terms of Service? Contact us:</p>
                <p className="text-gray-600 mb-2"><strong>Email:</strong> legal@route93.com</p>
                <p className="text-gray-600 mb-4"><strong>Phone:</strong> 1-800-ROUTE93</p>
                <Link to={routes.contact()} className="btn-primary">Contact Legal Team</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Policies</h2>
              <p className="text-lg text-gray-600">Learn more about our policies and procedures</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Privacy Policy</h3>
                <p className="text-gray-600 mb-4">Learn how we protect your personal information</p>
                <Link to={routes.privacyPolicy()} className="btn-outline">View Privacy Policy</Link>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Returns Policy</h3>
                <p className="text-gray-600 mb-4">Easy returns and refunds within 30 days</p>
                <Link to={routes.returns()} className="btn-outline">View Returns Policy</Link>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Shipping Info</h3>
                <p className="text-gray-600 mb-4">Delivery options and shipping rates</p>
                <Link to={routes.shipping()} className="btn-outline">View Shipping Info</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default TermsOfServicePage
