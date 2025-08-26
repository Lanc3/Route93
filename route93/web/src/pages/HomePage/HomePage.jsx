import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import ProductsCell from 'src/components/ProductsCell'
import CategoriesCell from 'src/components/CategoriesCell'
import FeaturedCollectionsCell from 'src/components/FeaturedCollectionsCell'

const HomePage = () => {
  return (
    <>
      <Metadata 
        title="Route93 - Premium E-commerce Store" 
        description="Discover quality products at Route93. Shop electronics, clothing, home & garden, and sports gear with fast shipping and exceptional service." 
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-green-400">Route93</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Your premium destination for quality products and exceptional service
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={routes.products()} className="btn-secondary text-lg px-8 py-4">
                Shop Now
              </Link>
              <Link to={routes.collections()} className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-purple-600">
                Browse Collections
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600">Handpicked items just for you</p>
          </div>
          
          {/* Dynamic Products from Database */}
          <ProductsCell 
            sortBy="createdAt" 
            sortOrder="desc" 
            limit={8} 
            status="ACTIVE"
          />
          
          <div className="text-center mt-12">
            <Link to={routes.products()} className="btn-outline">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Find exactly what you're looking for</p>
          </div>
          
          {/* Dynamic Categories from Database */}
          <CategoriesCell />
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Collections</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collections that bring together the best products for every lifestyle and occasion.
            </p>
          </div>
          
          {/* Dynamic Featured Collections */}
          <FeaturedCollectionsCell />

          {/* View All Collections CTA */}
          <div className="text-center mt-12">
            <Link to={routes.collections()} className="btn-outline text-lg px-8 py-4">
              View All Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                ),
                title: 'Free Shipping',
                description: 'Free shipping on orders over $50. Fast and reliable delivery to your doorstep.'
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Quality Guarantee',
                description: '30-day money-back guarantee. Shop with confidence knowing we stand behind our products.'
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                  </svg>
                ),
                title: '24/7 Support',
                description: 'Our customer support team is available around the clock to help with any questions.'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-xl mb-8 text-purple-100">
            Get exclusive deals, new product announcements, and style tips delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <button className="btn-secondary px-8 py-3 whitespace-nowrap">
              Subscribe
            </button>
          </div>
          <p className="text-sm text-purple-200 mt-4">
            Get 10% off your first order when you subscribe. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </>
  )
}

export default HomePage

