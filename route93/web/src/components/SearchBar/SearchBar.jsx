import { useState, useRef, useEffect } from 'react'
import { navigate, routes } from '@redwoodjs/router'
import { useLazyQuery, gql } from '@apollo/client'
import SearchCell from 'src/components/SearchCell'
import { useSearchAnalytics } from 'src/hooks/useSearchAnalytics'

const SEARCH_SUGGESTIONS_QUERY = gql`
  query SearchSuggestions($query: String!, $limit: Int) {
    searchSuggestions(query: $query, limit: $limit) {
      text
      type
      count
    }
  }
`

const SearchBar = ({ className = '', placeholder = 'Search products...', isMobile = false }) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [searchStartTime, setSearchStartTime] = useState(null)
  const searchRef = useRef(null)
  const inputRef = useRef(null)

  const { trackSearch, trackSearchClick } = useSearchAnalytics()

  const [getSuggestions, { loading: suggestionsLoading }] = useLazyQuery(SEARCH_SUGGESTIONS_QUERY, {
    onCompleted: (data) => {
      setSuggestions(data.searchSuggestions || [])
    },
    onError: () => {
      setSuggestions([])
    }
  })

  // Load search history from localStorage on mount
  useEffect(() => {
    const history = localStorage.getItem('route93-search-history')
    if (history) {
      try {
        setSearchHistory(JSON.parse(history))
      } catch (error) {
        console.error('Error parsing search history:', error)
      }
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
        if (isMobile) {
          setIsExpanded(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobile])

  // Handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)

    if (value.length > 1) {
      setIsOpen(true)
      // Debounce suggestions
      const timeoutId = setTimeout(() => {
        getSuggestions({ variables: { query: value, limit: 8 } })
      }, 300)

      return () => clearTimeout(timeoutId)
    } else {
      setIsOpen(value.length > 0)
      setSuggestions([])
    }
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    const searchTerm = selectedIndex >= 0 && suggestions[selectedIndex]
      ? suggestions[selectedIndex].text
      : query.trim()

    if (searchTerm) {
      performSearch(searchTerm)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    const totalItems = (query.length > 0 ? 1 : 0) + suggestions.length + (searchHistory.length > 0 ? 1 : 0) + 1 // +1 for search results link

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % totalItems)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev <= 0 ? totalItems - 1 : prev - 1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setSelectedIndex(-1)
      if (isMobile) {
        setIsExpanded(false)
      }
    }
  }

  // Perform search and save to history
  const performSearch = async (searchTerm) => {
    const startTime = Date.now()

    // Add to search history
    const newHistory = [searchTerm, ...searchHistory.filter(item => item !== searchTerm)].slice(0, 10)
    setSearchHistory(newHistory)
    localStorage.setItem('route93-search-history', JSON.stringify(newHistory))

    // Navigate to search results with query parameters
    navigate(`${routes.products()}?search=${encodeURIComponent(searchTerm)}`)

    // Close dropdown and clear mobile state
    setIsOpen(false)
    setIsExpanded(false)

    // Clear input on mobile for better UX
    if (isMobile) {
      setQuery('')
    }

    // Track search analytics
    try {
      await trackSearch({
        query: searchTerm,
        resultCount: 0, // Will be updated when results are loaded
        searchTime: Date.now() - startTime,
      })
    } catch (error) {
      console.error('Error tracking search:', error)
    }
  }

  // Handle product click from suggestions
  const handleProductClick = async (product) => {
    if (product.name) {
      // Track search click if this is from a search result
      if (query && product.id) {
        try {
          await trackSearchClick({
            query,
            productId: product.id,
          })
        } catch (error) {
          console.error('Error tracking search click:', error)
        }
      }

      performSearch(product.name)
    }
    setIsOpen(false)
    setIsExpanded(false)
  }

  // Handle search history click
  const handleHistoryClick = (term) => {
    setQuery(term)
    performSearch(term)
  }

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('route93-search-history')
  }

  // Mobile expand/collapse
  const toggleMobileSearch = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  // Popular searches (could be dynamic from API in the future)
  const popularSearches = ['headphones', 'shirt', 'camera', 'shoes', 'phone case']

  if (isMobile) {
    return (
      <div className={`relative ${className}`} ref={searchRef}>
        {/* Mobile Search Button */}
        {!isExpanded && (
          <button
            onClick={toggleMobileSearch}
            className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
            aria-label="Search"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}

        {/* Mobile Search Overlay */}
        {isExpanded && (
          <div className="fixed inset-0 bg-white z-[60]">
            <div className="flex items-center p-4 border-b border-gray-200">
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors mr-2"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <form onSubmit={handleSubmit} className="flex-1">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    autoFocus
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </form>
            </div>

            {/* Mobile Search Content */}
            <div className="overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
              {query.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
                  <SearchCell search={query} limit={8} onProductClick={handleProductClick} />
                </div>
              ) : (
                <div className="p-4">
                  {/* Search History */}
                  {searchHistory.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-900">Recent Searches</h3>
                        <button
                          onClick={clearHistory}
                          className="text-xs text-purple-600 hover:text-purple-700"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="space-y-2">
                        {searchHistory.slice(0, 5).map((term, index) => (
                          <button
                            key={index}
                            onClick={() => handleHistoryClick(term)}
                            className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700">{term}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Popular Searches</h3>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => handleHistoryClick(term)}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-purple-100 hover:text-purple-700 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Desktop Search
  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(query.length > 0)}
            placeholder={placeholder}
            className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </form>

      {/* Desktop Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-[60] max-h-96 overflow-y-auto">
          {/* Search Suggestions */}
          {query.length > 1 && suggestions.length > 0 && (
            <div className="border-b border-gray-100">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(suggestion.text)}
                  className={`flex items-center justify-between w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                    selectedIndex === index ? 'bg-purple-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-sm text-gray-700">{suggestion.text}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      suggestion.type === 'product' ? 'bg-blue-100 text-blue-800' :
                      suggestion.type === 'category' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {suggestion.type}
                    </span>
                    {suggestion.count && (
                      <span className="text-xs text-gray-500">
                        {suggestion.count}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Search Results */}
          {query.length > 0 ? (
            <SearchCell search={query} limit={4} onProductClick={handleProductClick} />
          ) : (
            <div className="p-4">
              {/* Search History */}
              {searchHistory.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Recent</h4>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-purple-600 hover:text-purple-700"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-1">
                    {searchHistory.slice(0, 3).map((term, index) => {
                      const itemIndex = suggestions.length + index
                      return (
                        <button
                          key={index}
                          onClick={() => handleHistoryClick(term)}
                          className={`flex items-center space-x-2 w-full text-left px-2 py-1 rounded transition-colors ${
                            selectedIndex === itemIndex ? 'bg-purple-50' : 'hover:bg-gray-100'
                          }`}
                        >
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-gray-700">{term}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Popular</h4>
                <div className="flex flex-wrap gap-1">
                  {popularSearches.slice(0, 5).map((term, index) => {
                    const itemIndex = suggestions.length + searchHistory.length + index
                    return (
                      <button
                        key={index}
                        onClick={() => handleHistoryClick(term)}
                        className={`px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs transition-colors ${
                          selectedIndex === itemIndex ? 'bg-purple-100 text-purple-800' : 'hover:bg-purple-100 hover:text-purple-700'
                        }`}
                      >
                        {term}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
