import { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'

const CATEGORIES_QUERY = gql`
  query AdvancedFiltersCategoriesQuery {
    categories {
      id
      name
      description
      slug
      _count {
        products
      }
    }
  }
`

const COLLECTIONS_QUERY = gql`
  query AdvancedFiltersCollectionsQuery {
    collections(isActive: true) {
      id
      name
      description
      slug
      _count {
        products
      }
    }
  }
`

const AdvancedFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [activeSections, setActiveSections] = useState({
    categories: true,
    price: true,
    rating: false,
    availability: true,
    collections: false,
    tags: false,
    brand: false,
    variants: false,
  })

  const toggleSection = (section) => {
    setActiveSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleCategoryChange = (categoryId) => {
    onFilterChange({
      categoryId: categoryId === filters.categoryId ? null : categoryId
    })
  }

  const handleCollectionChange = (collectionId) => {
    onFilterChange({
      collectionId: collectionId === filters.collectionId ? null : collectionId
    })
  }

  const handlePriceRangeChange = (range) => {
    onFilterChange({
      minPrice: range.min,
      maxPrice: range.max,
    })
  }

  const handleRatingChange = (rating) => {
    onFilterChange({
      minRating: rating === filters.minRating ? null : rating
    })
  }

  const handleTagToggle = (tag) => {
    const currentTags = filters.tags || []
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag]

    onFilterChange({ tags: newTags })
  }

  // Categories and Collections queries
  const { data: categoriesData, loading: categoriesLoading } = useQuery(CATEGORIES_QUERY)
  const { data: collectionsData, loading: collectionsLoading } = useQuery(COLLECTIONS_QUERY)

  const predefinedPriceRanges = [
    { label: 'Under €25', min: 0, max: 25 },
    { label: '€25 - €50', min: 25, max: 50 },
    { label: '€50 - €100', min: 50, max: 100 },
    { label: '€100 - €200', min: 100, max: 200 },
    { label: '€200 - €500', min: 200, max: 500 },
    { label: 'Over €500', min: 500, max: null },
  ]

  const popularTags = [
    'electronics', 'clothing', 'home', 'sports', 'books', 'toys',
    'beauty', 'health', 'automotive', 'garden', 'music', 'games'
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-medium text-gray-900">Categories</h4>
          <svg
            className={`w-4 h-4 transition-transform ${activeSections.categories ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {activeSections.categories && (
          <div className="mt-3">
            {categoriesLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-8"></div>
                  </div>
                ))}
              </div>
            ) : categoriesData?.categories ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {categoriesData.categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={filters.categoryId === category.id}
                        onChange={() => handleCategoryChange(category.id)}
                        className="text-purple-600 focus:ring-purple-500 h-4 w-4"
                      />
                      <span className="text-sm text-gray-700 truncate">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                      {category._count?.products || 0}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No categories available
              </div>
            )}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-medium text-gray-900">Price Range</h4>
          <svg
            className={`w-4 h-4 transition-transform ${activeSections.price ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {activeSections.price && (
          <div className="mt-3 space-y-3">
            {/* Custom Price Range */}
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={filters.minPrice || ''}
                onChange={(e) => onFilterChange({ minPrice: e.target.value ? parseFloat(e.target.value) : null })}
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={filters.maxPrice || ''}
                onChange={(e) => onFilterChange({ maxPrice: e.target.value ? parseFloat(e.target.value) : null })}
              />
            </div>

            {/* Predefined Ranges */}
            <div className="space-y-2">
              {predefinedPriceRanges.map((range, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="radio"
                    name="priceRange"
                    className="text-purple-600 focus:ring-purple-500"
                    checked={
                      filters.minPrice === range.min &&
                      (filters.maxPrice === range.max || (range.max === null && filters.maxPrice === null))
                    }
                    onChange={() => handlePriceRangeChange(range)}
                  />
                  <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-medium text-gray-900">Minimum Rating</h4>
          <svg
            className={`w-4 h-4 transition-transform ${activeSections.rating ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {activeSections.rating && (
          <div className="mt-3 space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  className="text-purple-600 focus:ring-purple-500"
                  checked={filters.minRating === rating}
                  onChange={() => handleRatingChange(rating)}
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  {rating}+ stars
                  <div className="ml-2 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3 h-3 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('availability')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-medium text-gray-900">Availability</h4>
          <svg
            className={`w-4 h-4 transition-transform ${activeSections.availability ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {activeSections.availability && (
          <div className="mt-3 space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                checked={filters.inStock === true}
                onChange={(e) => onFilterChange({ inStock: e.target.checked ? true : null })}
              />
              <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
            </label>
          </div>
        )}
      </div>

      {/* Collections */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('collections')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-medium text-gray-900">Collections</h4>
          <svg
            className={`w-4 h-4 transition-transform ${activeSections.collections ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {activeSections.collections && (
          <div className="mt-3">
            {collectionsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-8"></div>
                  </div>
                ))}
              </div>
            ) : collectionsData?.collections ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {collectionsData.collections.map((collection) => (
                  <label
                    key={collection.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <input
                        type="radio"
                        name="collection"
                        value={collection.id}
                        checked={filters.collectionId === collection.id}
                        onChange={() => handleCollectionChange(collection.id)}
                        className="text-purple-600 focus:ring-purple-500 h-4 w-4"
                      />
                      <span className="text-sm text-gray-700 truncate">
                        {collection.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                      {collection._count?.products || 0}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No collections available
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('tags')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-medium text-gray-900">Tags</h4>
          <svg
            className={`w-4 h-4 transition-transform ${activeSections.tags ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {activeSections.tags && (
          <div className="mt-3">
            <div className="grid grid-cols-2 gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-2 py-1.5 rounded-md text-xs font-medium transition-colors text-left ${
                    filters.tags?.includes(tag)
                      ? 'bg-purple-100 text-purple-800 border border-purple-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {filters.tags?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-600 mb-2">Selected Tags:</p>
                <div className="flex flex-wrap gap-1">
                  {filters.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800"
                    >
                      {tag}
                      <button
                        onClick={() => handleTagToggle(tag)}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Brand */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('brand')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-medium text-gray-900">Brand</h4>
          <svg
            className={`w-4 h-4 transition-transform ${activeSections.brand ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {activeSections.brand && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="Search by brand..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={filters.brand || ''}
              onChange={(e) => onFilterChange({ brand: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Product Variants */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('variants')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-medium text-gray-900">Product Types</h4>
          <svg
            className={`w-4 h-4 transition-transform ${activeSections.variants ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {activeSections.variants && (
          <div className="mt-3 space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="variants"
                className="text-purple-600 focus:ring-purple-500"
                checked={filters.hasVariants === true}
                onChange={() => onFilterChange({ hasVariants: true })}
              />
              <span className="ml-2 text-sm text-gray-700">Has Variants</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="variants"
                className="text-purple-600 focus:ring-purple-500"
                checked={filters.hasVariants === false}
                onChange={() => onFilterChange({ hasVariants: false })}
              />
              <span className="ml-2 text-sm text-gray-700">Simple Products</span>
            </label>
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {(filters.categoryId || filters.minPrice || filters.maxPrice || filters.minRating || filters.inStock || filters.collectionId || filters.tags?.length > 0 || filters.brand || filters.hasVariants !== null) && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.categoryId && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                Category Active
                <button
                  onClick={() => onFilterChange({ categoryId: null })}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Price: ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                <button
                  onClick={() => onFilterChange({ minPrice: null, maxPrice: null })}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.minRating && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                {filters.minRating}+ Stars
                <button
                  onClick={() => onFilterChange({ minRating: null })}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.inStock && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                In Stock
                <button
                  onClick={() => onFilterChange({ inStock: null })}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.tags?.length > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                {filters.tags.length} Tags
                <button
                  onClick={() => onFilterChange({ tags: [] })}
                  className="ml-1 text-indigo-600 hover:text-indigo-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.brand && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                Brand: {filters.brand}
                <button
                  onClick={() => onFilterChange({ brand: '' })}
                  className="ml-1 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvancedFilters
