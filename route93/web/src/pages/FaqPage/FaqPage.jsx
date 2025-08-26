import { useState } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const FaqPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openFaq, setOpenFaq] = useState(null)

  const faqCategories = [
    { id: 'all', name: 'All Questions', count: 24 },
    { id: 'orders', name: 'Orders & Payment', count: 8 },
    { id: 'shipping', name: 'Shipping & Delivery', count: 6 },
    { id: 'returns', name: 'Returns & Refunds', count: 5 },
    { id: 'account', name: 'Account & Profile', count: 3 },
    { id: 'products', name: 'Products & Quality', count: 2 }
  ]

  const faqData = [
    {
      id: 1,
      category: 'orders',
      question: 'How do I place an order?',
      answer: 'Placing an order is easy! Simply browse our products, add items to your cart, and proceed to checkout. You can pay using credit/debit cards, PayPal, or other available payment methods. You\'ll receive an order confirmation email once your purchase is complete.'
    },
    {
      id: 2,
      category: 'orders',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely through our encrypted payment system.'
    },
    {
      id: 3,
      category: 'orders',
      question: 'Can I modify or cancel my order?',
      answer: 'You can modify or cancel your order within 1 hour of placing it, provided it hasn\'t been processed for shipping. Contact our customer service team immediately at hello@route93.com or call +1 (555) ROUTE93 for assistance.'
    },
    {
      id: 4,
      category: 'shipping',
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-7 business days, expedited shipping takes 1-3 business days, and overnight shipping delivers the next business day. Shipping times may vary during peak seasons or for remote locations.'
    },
    {
      id: 5,
      category: 'shipping',
      question: 'Do you offer free shipping?',
      answer: 'Yes! We offer free standard shipping on all orders over $50 within the continental United States. International shipping rates vary by location and are calculated at checkout.'
    },
    {
      id: 6,
      category: 'shipping',
      question: 'Can I track my order?',
      answer: 'Absolutely! Once your order ships, you\'ll receive a tracking number via email. You can also track your order anytime by visiting our Track Order page and entering your order number and email address.'
    },
    {
      id: 7,
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Some items like personalized products or perishables cannot be returned. Return shipping is free for defective items.'
    },
    {
      id: 8,
      category: 'returns',
      question: 'How do I return an item?',
      answer: 'To return an item, visit our Returns page, enter your order information, and print a return label. Package the item securely and drop it off at any authorized shipping location. Refunds are processed within 5-7 business days after we receive your return.'
    },
    {
      id: 9,
      category: 'account',
      question: 'Do I need an account to shop?',
      answer: 'While you can checkout as a guest, creating an account allows you to track orders, save favorites, view purchase history, and enjoy faster checkout. Plus, account holders get early access to sales and exclusive offers!'
    },
    {
      id: 10,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you a password reset link. The link expires in 24 hours for security. If you don\'t receive the email, check your spam folder or contact support.'
    },
    {
      id: 11,
      category: 'products',
      question: 'Are your products authentic?',
      answer: 'Yes, all our products are 100% authentic and sourced directly from authorized manufacturers and distributors. We stand behind the quality and authenticity of every item we sell with our satisfaction guarantee.'
    },
    {
      id: 12,
      category: 'products',
      question: 'Do you offer product warranties?',
      answer: 'Many of our products come with manufacturer warranties. Warranty terms vary by product and brand. You can find warranty information on individual product pages or contact us for specific warranty details.'
    }
  ]

  const filteredFaqs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFaq = (faqId) => {
    setOpenFaq(openFaq === faqId ? null : faqId)
  }

  return (
    <>
      <Metadata 
        title="FAQ - Frequently Asked Questions | Route93" 
        description="Find answers to common questions about shopping, shipping, returns, and more at Route93. Get quick help with our comprehensive FAQ section."
      />

      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Frequently Asked <span className="text-green-400">Questions</span>
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                Find quick answers to common questions about shopping, shipping, returns, and more.
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
            <span className="text-gray-900 font-medium">FAQ</span>
          </nav>
        </div>

        {/* Search Bar */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-12 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Categories Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                  <ul className="space-y-2">
                    {faqCategories.map((category) => (
                      <li key={category.id}>
                        <button
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-purple-100 text-purple-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{category.name}</span>
                            <span className="text-sm text-gray-400">({category.count})</span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* FAQ Content */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-md">
                  {filteredFaqs.length === 0 ? (
                    <div className="p-8 text-center">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.4a7.962 7.962 0 01-5.657-2.109L6 21l.291-.409A7.962 7.962 0 014 12.4c0-4.411 3.589-8 8-8s8 3.589 8 8c0 1.76-.571 3.386-1.536 4.708z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
                      <p className="text-gray-600">Try adjusting your search or browse different categories.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredFaqs.map((faq) => (
                        <div key={faq.id} className="p-6">
                          <button
                            onClick={() => toggleFaq(faq.id)}
                            className="w-full text-left flex justify-between items-start"
                          >
                            <h3 className="text-lg font-medium text-gray-900 pr-4">
                              {faq.question}
                            </h3>
                            <svg
                              className={`w-5 h-5 text-gray-500 transform transition-transform ${
                                openFaq === faq.id ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {openFaq === faq.id && (
                            <div className="mt-4 text-gray-600 leading-relaxed">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Still have questions?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our friendly customer support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={routes.contact()} className="btn-primary text-lg px-8 py-4">
                Contact Support
              </Link>
              <a href="mailto:hello@route93.com" className="btn-outline text-lg px-8 py-4">
                Email Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default FaqPage