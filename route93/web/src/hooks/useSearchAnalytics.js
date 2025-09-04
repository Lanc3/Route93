import { useMutation, gql } from '@apollo/client'
import { useLocation } from '@redwoodjs/router'

const TRACK_SEARCH_MUTATION = gql`
  mutation TrackSearch(
    $query: String!
    $resultCount: Int!
    $filters: String
    $sessionId: String
    $searchTime: Int!
  ) {
    trackSearch(
      query: $query
      resultCount: $resultCount
      filters: $filters
      sessionId: $sessionId
      searchTime: $searchTime
    )
  }
`

const TRACK_SEARCH_CLICK_MUTATION = gql`
  mutation TrackSearchClick(
    $query: String!
    $productId: Int!
    $sessionId: String
  ) {
    trackSearchClick(
      query: $query
      productId: $productId
      sessionId: $sessionId
    )
  }
`

export const useSearchAnalytics = () => {
  const [trackSearchMutation] = useMutation(TRACK_SEARCH_MUTATION)
  const [trackSearchClickMutation] = useMutation(TRACK_SEARCH_CLICK_MUTATION)
  const location = useLocation()

  // Get or create session ID
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('route93-search-session')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('route93-search-session', sessionId)
    }
    return sessionId
  }

  // Track search event
  const trackSearch = async ({
    query,
    resultCount,
    filters = null,
    searchTime
  }) => {
    try {
      const sessionId = getSessionId()
      const filtersJson = filters ? JSON.stringify(filters) : null

      await trackSearchMutation({
        variables: {
          query,
          resultCount,
          filters: filtersJson,
          sessionId,
          searchTime,
        },
      })
    } catch (error) {
      console.error('Error tracking search:', error)
      // Don't throw error to avoid breaking user experience
    }
  }

  // Track search result click
  const trackSearchClick = async ({ query, productId }) => {
    try {
      const sessionId = getSessionId()

      await trackSearchClickMutation({
        variables: {
          query,
          productId: parseInt(productId),
          sessionId,
        },
      })
    } catch (error) {
      console.error('Error tracking search click:', error)
    }
  }

  // Track recently viewed product
  const trackRecentlyViewed = async (productId) => {
    try {
      // This will be handled by the RecentlyViewedCell component
      // We could add additional tracking here if needed
    } catch (error) {
      console.error('Error tracking recently viewed:', error)
    }
  }

  // Get search context from URL
  const getSearchContext = () => {
    const params = new URLSearchParams(location.search)
    return {
      query: params.get('search') || '',
      categoryId: params.get('categoryId'),
      minPrice: params.get('minPrice'),
      maxPrice: params.get('maxPrice'),
      inStock: params.get('inStock'),
      sortBy: params.get('sortBy'),
      sortOrder: params.get('sortOrder'),
    }
  }

  return {
    trackSearch,
    trackSearchClick,
    trackRecentlyViewed,
    getSearchContext,
    getSessionId,
  }
}
