import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import CollectionsCell from 'src/components/CollectionsCell'

const CollectionsPage = () => {
  return (
    <>
      <Metadata 
        title="Collections - Route93" 
        description="Explore our curated collections of premium products. Discover new arrivals, best sellers, and featured items at Route93."
      />

      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Our <span className="text-green-400">Collections</span>
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                Discover carefully curated collections that showcase the best of what we have to offer. 
                From trending styles to timeless classics, find your perfect match.
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
            <span className="text-gray-900 font-medium">Collections</span>
          </nav>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse Collections</h2>
                <p className="text-gray-600">
                  Each collection tells a story and brings together products that complement each other perfectly.
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link to={routes.products()} className="btn-outline text-sm">
                  View All Products
                </Link>
              </div>
            </div>
          </div>

          {/* Collections Grid */}
          <CollectionsCell />
        </div>

        {/* Call to Action Section */}
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Can't find what you're looking for?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Our team is always working on new collections. Browse our full catalog or get in touch 
                to let us know what you'd like to see next.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={routes.products()} className="btn-primary">
                  Browse All Products
                </Link>
                <Link to={routes.contact()} className="btn-outline">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CollectionsPage
