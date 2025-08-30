import { Link, routes } from '@redwoodjs/router'
import { useAuth } from 'src/auth'
import { useCart } from 'src/contexts/CartContext'
import { useState, useEffect, useRef } from 'react'
import SearchBar from 'src/components/SearchBar/SearchBar'
import AnimatedLogo from 'src/components/AnimatedLogo/AnimatedLogo'
import CartButton from 'src/components/CartButton/CartButton'

const MainLayout = ({ children }) => {
  const { isAuthenticated, currentUser, logOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef(null)
  const mobileMenuButtonRef = useRef(null)

  const handleLogout = async () => {
    await logOut()
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Click outside handler to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target)
      ) {
        closeMobileMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top row: Logo + Search + Account */}
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <AnimatedLogo size="large" />
            
            {/* Desktop Search - centered and prominent */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <SearchBar />
            </div>
            
            {/* Account Controls */}
            <div className="flex items-center space-x-4">
              {/* Account */}
              <div className="flex items-center space-x-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-medium text-sm">
                            {currentUser?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="hidden md:block">
                          <p className="text-sm font-medium text-gray-700">
                            {currentUser?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {currentUser?.role}
                          </p>
                        </div>
                      </div>
                      
                      <Link 
                        to={routes.userAccount()} 
                        className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="hidden sm:inline">Settings</span>
                      </Link>

                      {currentUser?.role === 'ADMIN' && (
                        <Link 
                          to={routes.admin()} 
                          className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
                        >
                          Admin
                        </Link>
                      )}
                      
                      <button 
                        onClick={handleLogout}
                        className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link to={routes.login()} className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">
                      Sign In
                    </Link>
                    <Link to={routes.signup()} className="btn-primary text-sm">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Bottom row: Navigation + Cart + Mobile Search */}
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link 
                to={routes.home()} 
                className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link 
                to={routes.products()} 
                className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Products
              </Link>
              <Link 
                to={routes.collections()} 
                className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Collections
              </Link>
              <Link 
                to={routes.about()} 
                className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                About
              </Link>
              <Link 
                to={routes.contact()} 
                className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Contact
              </Link>
            </nav>
            
            {/* Right side - Cart + Mobile Search + Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Mobile Search - only show on mobile/tablet */}
              <div className="md:hidden">
                <SearchBar isMobile={true} />
              </div>
              
              {/* Cart */}
              <CartButton />

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button 
                  ref={mobileMenuButtonRef}
                  onClick={toggleMobileMenu}
                  className="text-gray-600 hover:text-purple-600 p-2 transition-colors"
                  aria-label="Toggle mobile menu"
                >
                  {isMobileMenuOpen ? (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-[60]"
          >
            <div className="px-4 py-6 space-y-6">
              {/* Mobile Navigation */}
              <nav className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Navigation</h3>
                <div className="space-y-2">
                  <Link 
                    to={routes.home()} 
                    onClick={closeMobileMenu}
                    className="block text-gray-600 hover:text-purple-600 py-2 text-base font-medium transition-colors"
                  >
                    Home
                  </Link>
                  <Link 
                    to={routes.products()} 
                    onClick={closeMobileMenu}
                    className="block text-gray-600 hover:text-purple-600 py-2 text-base font-medium transition-colors"
                  >
                    Products
                  </Link>
                  <Link 
                    to={routes.collections()} 
                    onClick={closeMobileMenu}
                    className="block text-gray-600 hover:text-purple-600 py-2 text-base font-medium transition-colors"
                  >
                    Collections
                  </Link>
                  <Link 
                    to={routes.about()} 
                    onClick={closeMobileMenu}
                    className="block text-gray-600 hover:text-purple-600 py-2 text-base font-medium transition-colors"
                  >
                    About
                  </Link>
                  <Link 
                    to={routes.contact()} 
                    onClick={closeMobileMenu}
                    className="block text-gray-600 hover:text-purple-600 py-2 text-base font-medium transition-colors"
                  >
                    Contact
                  </Link>
                </div>
              </nav>

              {/* Mobile Account Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Account</h3>
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-medium text-sm">
                          {currentUser?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-base font-medium text-gray-900">
                          {currentUser?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {currentUser?.role}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Link 
                        to={routes.userAccount()} 
                        onClick={closeMobileMenu}
                        className="block text-gray-600 hover:text-purple-600 py-2 text-base font-medium transition-colors"
                      >
                        Account Settings
                      </Link>
                      
                      {currentUser?.role === 'ADMIN' && (
                        <Link 
                          to={routes.admin()} 
                          onClick={closeMobileMenu}
                          className="block text-gray-600 hover:text-purple-600 py-2 text-base font-medium transition-colors"
                        >
                          Admin Panel
                        </Link>
                      )}
                      
                      <button 
                        onClick={() => {
                          closeMobileMenu()
                          handleLogout()
                        }}
                        className="block w-full text-left text-gray-600 hover:text-purple-600 py-2 text-base font-medium transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link 
                      to={routes.login()} 
                      onClick={closeMobileMenu}
                      className="block w-full text-center bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to={routes.signup()} 
                      onClick={closeMobileMenu}
                      className="block w-full text-center border-2 border-purple-600 text-purple-600 py-2 px-4 rounded-lg font-medium hover:bg-purple-600 hover:text-white transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Search Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Search</h3>
                <SearchBar isMobile={true} />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-bold text-purple-400 mb-4">Route93</div>
              <p className="text-gray-300 mb-4">
                Your premium destination for quality products and exceptional service. 
                Discover unique items that enhance your lifestyle.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to={routes.about()} className="text-gray-300 hover:text-purple-400 transition-colors">About Us</Link></li>
                <li><Link to={routes.contact()} className="text-gray-300 hover:text-purple-400 transition-colors">Contact</Link></li>
                <li><Link to={routes.faq()} className="text-gray-300 hover:text-purple-400 transition-colors">FAQ</Link></li>
                <li><Link to={routes.shipping()} className="text-gray-300 hover:text-purple-400 transition-colors">Shipping Info</Link></li>
                <li><Link to={routes.returns()} className="text-gray-300 hover:text-purple-400 transition-colors">Returns</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><Link to={routes.helpCenter()} className="text-gray-300 hover:text-purple-400 transition-colors">Help Center</Link></li>
                <li><Link to={routes.trackOrder()} className="text-gray-300 hover:text-purple-400 transition-colors">Track Order</Link></li>
                <li><Link to={routes.sizeGuide()} className="text-gray-300 hover:text-purple-400 transition-colors">Size Guide</Link></li>
                <li><Link to={routes.privacyPolicy()} className="text-gray-300 hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to={routes.termsOfService()} className="text-gray-300 hover:text-purple-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              © 2024 Route93. All rights reserved. Built by Expansion.ie
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout
