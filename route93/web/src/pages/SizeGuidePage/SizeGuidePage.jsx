import { useState } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const SizeGuidePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('clothing')

  const sizeCategories = {
    clothing: {
      name: 'Clothing',
      tables: {
        womens: {
          name: "Women's Clothing",
          headers: ['Size', 'US', 'UK', 'EU', 'Bust (in)', 'Waist (in)', 'Hips (in)'],
          rows: [
            ['XS', '2', '6', '34', '32-33', '25-26', '35-36'],
            ['S', '4-6', '8-10', '36-38', '34-35', '27-28', '37-38'],
            ['M', '8-10', '12-14', '40-42', '36-37', '29-30', '39-40'],
            ['L', '12-14', '16-18', '44-46', '38-40', '31-33', '41-43'],
            ['XL', '16-18', '20-22', '48-50', '42-44', '35-37', '45-47'],
            ['XXL', '20-22', '24-26', '52-54', '46-48', '39-41', '49-51']
          ]
        },
        mens: {
          name: "Men's Clothing",
          headers: ['Size', 'US', 'UK', 'EU', 'Chest (in)', 'Waist (in)', 'Neck (in)'],
          rows: [
            ['XS', '32-34', '32-34', '42-44', '32-34', '28-30', '14-14.5'],
            ['S', '36-38', '36-38', '46-48', '36-38', '30-32', '15-15.5'],
            ['M', '40-42', '40-42', '50-52', '40-42', '32-34', '16-16.5'],
            ['L', '44-46', '44-46', '54-56', '44-46', '34-36', '17-17.5'],
            ['XL', '48-50', '48-50', '58-60', '48-50', '36-38', '18-18.5'],
            ['XXL', '52-54', '52-54', '62-64', '52-54', '38-40', '19-19.5']
          ]
        }
      }
    },
    shoes: {
      name: 'Shoes',
      tables: {
        womens: {
          name: "Women's Shoes",
          headers: ['US', 'UK', 'EU', 'Length (in)', 'Length (cm)'],
          rows: [
            ['5', '2.5', '35', '8.5', '21.6'],
            ['5.5', '3', '35.5', '8.75', '22.2'],
            ['6', '3.5', '36', '8.875', '22.5'],
            ['6.5', '4', '37', '9.0625', '23'],
            ['7', '4.5', '37.5', '9.25', '23.5'],
            ['7.5', '5', '38', '9.375', '23.8'],
            ['8', '5.5', '38.5', '9.5', '24.1'],
            ['8.5', '6', '39', '9.6875', '24.6'],
            ['9', '6.5', '40', '9.875', '25.1'],
            ['9.5', '7', '40.5', '10', '25.4'],
            ['10', '7.5', '41', '10.1875', '25.9'],
            ['11', '8.5', '42', '10.5', '26.7']
          ]
        },
        mens: {
          name: "Men's Shoes",
          headers: ['US', 'UK', 'EU', 'Length (in)', 'Length (cm)'],
          rows: [
            ['6', '5.5', '38.5', '9.25', '23.5'],
            ['6.5', '6', '39', '9.5', '24.1'],
            ['7', '6.5', '40', '9.625', '24.4'],
            ['7.5', '7', '40.5', '9.75', '24.8'],
            ['8', '7.5', '41', '9.9375', '25.2'],
            ['8.5', '8', '42', '10.125', '25.7'],
            ['9', '8.5', '42.5', '10.25', '26'],
            ['9.5', '9', '43', '10.4375', '26.5'],
            ['10', '9.5', '44', '10.5625', '26.8'],
            ['10.5', '10', '44.5', '10.75', '27.3'],
            ['11', '10.5', '45', '10.9375', '27.8'],
            ['12', '11.5', '46', '11.25', '28.6']
          ]
        }
      }
    }
  }

  const measurementTips = {
    clothing: [
      {
        title: 'Bust/Chest',
        description: 'Measure around the fullest part of your bust/chest, keeping the measuring tape horizontal.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
      },
      {
        title: 'Waist',
        description: 'Measure around your natural waistline, which is typically the narrowest part of your torso.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      {
        title: 'Hips',
        description: 'Measure around the fullest part of your hips, approximately 8 inches below your waist.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      }
    ],
    shoes: [
      {
        title: 'Foot Length',
        description: 'Stand on a piece of paper and mark your heel and longest toe. Measure the distance between marks.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      {
        title: 'Best Time to Measure',
        description: 'Measure your feet in the evening when they are at their largest due to natural swelling.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      {
        title: 'Both Feet',
        description: 'Measure both feet and use the larger measurement, as feet are often slightly different sizes.',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
      }
    ]
  }

  return (
    <>
      <Metadata 
        title="Size Guide - Clothing & Shoe Sizing | Route93" 
        description="Find your perfect fit with Route93's comprehensive size guide. Detailed sizing charts for clothing and shoes with measurement tips."
      />

      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Size <span className="text-green-400">Guide</span>
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                Find your perfect fit with our detailed sizing charts and measurement guides.
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
            <span className="text-gray-900 font-medium">Size Guide</span>
          </nav>
        </div>

        {/* Category Selector */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <div className="bg-white rounded-lg shadow-md p-2">
                <div className="flex space-x-2">
                  {Object.entries(sizeCategories).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        selectedCategory === key
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Measurement Tips */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Measure</h2>
              <p className="text-lg text-gray-600">
                Follow these tips to get accurate measurements for the best fit
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {measurementTips[selectedCategory].map((tip, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {tip.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{tip.title}</h3>
                  <p className="text-gray-600">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Size Charts */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {Object.entries(sizeCategories[selectedCategory].tables).map(([tableKey, table]) => (
                <div key={tableKey} className="bg-gray-50 rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{table.name}</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
                      <thead className="bg-purple-600 text-white">
                        <tr>
                          {table.headers.map((header, index) => (
                            <th key={index} className="px-4 py-3 text-left font-semibold">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {table.rows.map((row, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-gray-50">
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className={`px-4 py-3 ${
                                cellIndex === 0 ? 'font-semibold text-purple-600' : 'text-gray-600'
                              }`}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Size Guide Tips */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Sizing Tips</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">General Guidelines</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Always refer to the size chart rather than assuming your usual size
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Measure yourself without clothes or over thin, form-fitting garments
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Use a flexible measuring tape and keep it parallel to the floor
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    If between sizes, we recommend sizing up for comfort
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Still Unsure?</h3>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    If you're still unsure about sizing, we're here to help! Our customer service team can provide personalized sizing advice.
                  </p>
                  <div className="space-y-3">
                    <Link to={routes.contact()} className="block w-full btn-primary text-center">
                      Contact Support
                    </Link>
                    <Link to={routes.returns()} className="block w-full btn-outline text-center">
                      View Return Policy
                    </Link>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Free Returns:</strong> Don't worry about getting it wrong! We offer free returns on all orders within 30 days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Need Sizing Help?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Our team is here to help you find the perfect fit. Get personalized sizing advice from our experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={routes.contact()} className="btn-secondary text-lg px-8 py-4">
                Get Sizing Help
              </Link>
              <Link to={routes.products()} className="btn-outline border-white text-white hover:bg-white hover:text-purple-600 text-lg px-8 py-4">
                Shop Now
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default SizeGuidePage