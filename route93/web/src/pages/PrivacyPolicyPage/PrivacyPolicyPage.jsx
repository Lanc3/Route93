import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const PrivacyPolicyPage = () => {
  return (
    <>
      <Metadata 
        title="Privacy Policy - Route93" 
        description="Route93's privacy policy. Learn how we collect, use, and protect your personal information when you shop with us."
      />

      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Privacy <span className="text-green-400">Policy</span>
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                Your privacy is important to us. Learn how we collect, use, and protect your information.
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
            <span className="text-gray-900 font-medium">Privacy Policy</span>
          </nav>
        </div>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800"><strong>Last Updated:</strong> December 26, 2024</p>
                <p className="text-blue-700 mt-2">This Privacy Policy explains how Route93 collects, uses, and protects your information.</p>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                <p className="text-gray-600 mb-4">We collect information you provide directly and automatically when you use our services.</p>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">How We Use Your Information</h2>
                <p className="text-gray-600 mb-4">We use your information to provide services, process orders, and improve your experience.</p>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Data Security</h2>
                <p className="text-gray-600 mb-4">We implement security measures to protect your personal information.</p>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Your Rights</h2>
                <p className="text-gray-600 mb-4">You have rights regarding your personal information, including access and deletion.</p>
              </div>

              <div className="mt-8 p-6 bg-purple-50 border border-purple-200 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h3>
                <p className="text-gray-600 mb-4">Questions about this Privacy Policy? Contact our privacy team:</p>
                <p className="text-gray-600 mb-2"><strong>Email:</strong> privacy@route93.com</p>
                <p className="text-gray-600 mb-4"><strong>Phone:</strong> 1-800-ROUTE93</p>
                <Link to={routes.contact()} className="btn-primary">Contact Privacy Team</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default PrivacyPolicyPage
