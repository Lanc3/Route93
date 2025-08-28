import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import EnhancedProductsCell from 'src/components/EnhancedProductsCell/EnhancedProductsCell'
import EnhancedCategoriesCell from 'src/components/EnhancedCategoriesCell/EnhancedCategoriesCell'
import EnhancedFeaturedCollectionsCell from 'src/components/EnhancedFeaturedCollectionsCell/EnhancedFeaturedCollectionsCell'
import EnhancedHero from 'src/components/EnhancedHero/EnhancedHero'
import ParallaxSeparator from 'src/components/ParallaxSeparator/ParallaxSeparator'

const HomePage = () => {
  return (
    <>
      <Metadata
        title="Route93 - Premium E-commerce Store"
        description="Discover quality products at Route93. Shop electronics, clothing, home & garden, and sports gear with fast shipping and exceptional service."
      />

      {/* Enhanced Hero Section with Parallax */}
      <EnhancedHero />

      {/* Purple Separator Bar - Hero to Products */}
      <ParallaxSeparator
        variant="medium"
        text="Discover Our Products"
        className="mt-0"
      />

      {/* Enhanced Featured Products Section with Parallax */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dynamic Products from Database with Enhanced UI */}
          <EnhancedProductsCell
            sortBy="createdAt"
            sortOrder="desc"
            limit={8}
            status="ACTIVE"
          />
        </div>
      </section>

      {/* Purple Separator Bar - Products to Categories */}
      <ParallaxSeparator
        variant="thin"
        text="Shop by Category"
        className="mt-0"
      />

      {/* Enhanced Categories Section with Phase 3 Visual Elements */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EnhancedCategoriesCell />
        </div>
      </section>

      {/* Purple Separator Bar - Categories to Collections */}
      <ParallaxSeparator
        variant="medium"
        text="Featured Collections"
        className="mt-0"
      />

      {/* Enhanced Featured Collections Section with Phase 3 Visual Elements */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EnhancedFeaturedCollectionsCell />
        </div>
      </section>

      {/* Purple Separator Bar - Collections to CTA */}
      <ParallaxSeparator
        variant="with-full"
        showContent={true}
        className="mt-0"
      />

      {/* Enhanced Call-to-Action Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Start Shopping?
            </h2>
            <p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-3xl mx-auto">
              Join thousands of satisfied customers who trust Route93 for quality products and exceptional service
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to={routes.products()}
                className="cta-button-enhanced group"
              >
                <span className="flex items-center justify-center">
                  Start Shopping
                  <svg className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link
                to={routes.collections()}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-purple-600 hover:shadow-2xl"
              >
                Browse Collections
              </Link>
            </div>
          </div>

          {/* Floating Elements for CTA Section */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="floating-geometric floating-morph w-32 h-32 top-20 left-10"></div>
            <div className="floating-geometric floating-rotate w-24 h-24 bottom-20 right-10"></div>
            <div className="floating-geometric floating-morph w-20 h-20 top-1/2 left-1/4"></div>
            <div className="floating-geometric floating-rotate w-28 h-28 top-1/3 right-1/4"></div>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage

