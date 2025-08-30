import { useState, useEffect } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import ProductsCell from 'src/components/ProductsCell'
import SearchBar from 'src/components/SearchBar'
import AdvancedFilters from 'src/components/AdvancedFilters'
import RecentlyViewedCell from 'src/components/RecentlyViewedCell'

const ProductsPage = ({
  search,
  categoryId,
  minPrice,
  maxPrice,
  inStock,
  sortBy,
  sortOrder,
  minRating,
  tags,
  collectionId,
  brand,
  hasVariants
}) => {
  const [filters, setFilters] = useState({
    categoryId: null,
    minPrice: null,
    maxPrice: null,
    inStock: null,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 12,
    offset: 0,
    // Enhanced filters
    minRating: null,
    tags: [],
    collectionId: null,
    brand: '',
    hasVariants: null,
  })

  // Update filters when URL props change
  useEffect(() => {
    setFilters(prevFilters => ({
      ...prevFilters,
      search: search || '',
      categoryId: categoryId ? parseInt(categoryId) : null,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      inStock: inStock === 'true' ? true : null,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc',
      // Enhanced filters
      minRating: minRating ? parseInt(minRating) : null,
      tags: tags ? tags.split(',') : [],
      collectionId: collectionId ? parseInt(collectionId) : null,
      brand: brand || '',
      hasVariants: hasVariants === 'true' ? true : hasVariants === 'false' ? false : null,
    }))
  }, [search, categoryId, minPrice, maxPrice, inStock, sortBy, sortOrder, minRating, tags, collectionId, brand, hasVariants])

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, offset: 0 })
  }

  const handleSortChange = (sortBy, sortOrder = 'desc') => {
    setFilters({ ...filters, sortBy, sortOrder, offset: 0 })
  }

  const pageTitle = filters.search 
    ? `Search Results for "${filters.search}" - Route93`
    : 'Products - Route93'
  
  const pageDescription = filters.search
    ? `Search results for "${filters.search}". Find the products you're looking for at Route93.`
    : 'Browse our extensive collection of quality products. Find electronics, clothing, home goods, and more at Route93.'

  return (
    <>
      <Metadata 
        title={pageTitle} 
        description={pageDescription} 
      />

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                      <Link to={routes.home()} className="text-gray-500 hover:text-purple-600">
                        Home
                      </Link>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 font-medium">Products</span>
                      </div>
                    </li>
                  </ol>
                </nav>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">
                  {filters.search ? `Search Results` : 'All Products'}
                </h1>
                {filters.search && (
                  <p className="mt-2 text-gray-600">
                    Showing results for "<span className="font-medium">{filters.search}</span>"
                  </p>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-')
                    handleSortChange(sortBy, sortOrder)
                  }}
                >
                  <option value="relevance-desc">Relevance</option>
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="popularity-desc">Most Popular</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <AdvancedFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={() => setFilters({
                  categoryId: null,
                  minPrice: null,
                  maxPrice: null,
                  inStock: null,
                  search: '',
                  sortBy: 'createdAt',
                  sortOrder: 'desc',
                  limit: 12,
                  offset: 0,
                  // Enhanced filters
                  minRating: null,
                  tags: [],
                  collectionId: null,
                  brand: '',
                  hasVariants: null,
                })}
              />
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <ProductsCell
                categoryId={filters.categoryId}
                minPrice={filters.minPrice}
                maxPrice={filters.maxPrice}
                inStock={filters.inStock}
                search={filters.search}
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                limit={filters.limit}
                offset={filters.offset}
                // Enhanced parameters
                minRating={filters.minRating}
                tags={filters.tags}
                collectionId={filters.collectionId}
                brand={filters.brand}
                hasVariants={filters.hasVariants}
              />
            </div>
          </div>

          {/* Recently Viewed Section */}
          {filters.search && (
            <div className="mt-12">
              <RecentlyViewedCell limit={6} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductsPage
