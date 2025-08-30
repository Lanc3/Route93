import { gql } from 'graphql-tag'

export const schema = gql`
  type SearchAnalytics {
    id: Int!
    query: String!
    resultCount: Int!
    filters: String
    userId: Int
    sessionId: String
    ipAddress: String
    userAgent: String
    clickedProductId: Int
    searchTime: Int!
    createdAt: DateTime!
    user: User
    clickedProduct: Product
  }

  type SearchSuggestion {
    text: String!
    type: String! # "product", "category", "popular"
    count: Int
  }

  type SearchResult {
    products: [Product!]!
    totalCount: Int!
    facets: SearchFacets
    suggestions: [SearchSuggestion!]
    searchTime: Int!
  }

  type SearchFacets {
    categories: [FacetItem!]!
    priceRanges: [PriceRange!]!
    ratings: [RatingFacet!]!
    availability: AvailabilityFacet!
  }

  type FacetItem {
    value: String!
    label: String!
    count: Int!
  }

  type PriceRange {
    min: Float!
    max: Float!
    count: Int!
  }

  type RatingFacet {
    rating: Int!
    count: Int!
  }

  type AvailabilityFacet {
    inStock: Int!
    outOfStock: Int!
  }

  type Query {
    # Advanced search with filters and facets
    advancedSearch(
      query: String!
      categoryId: Int
      minPrice: Float
      maxPrice: Float
      minRating: Int
      inStock: Boolean
      sortBy: String
      sortOrder: String
      limit: Int
      offset: Int
    ): SearchResult! @skipAuth

    # Search suggestions/autocomplete
    searchSuggestions(
      query: String!
      limit: Int
    ): [SearchSuggestion!]! @skipAuth

    # Popular search terms
    popularSearchTerms(limit: Int): [String!]! @skipAuth

    # Search analytics for admin
    searchAnalytics(
      startDate: DateTime
      endDate: DateTime
      limit: Int
      offset: Int
    ): [SearchAnalytics!]! @requireAuth(roles: ["ADMIN"])

    searchAnalyticsStats: SearchStats! @requireAuth(roles: ["ADMIN"])
  }

  type SearchStats {
    totalSearches: Int!
    uniqueQueries: Int!
    averageResults: Float!
    conversionRate: Float!
    popularTerms: [PopularTerm!]!
  }

  type PopularTerm {
    term: String!
    count: Int!
    conversionRate: Float!
  }

  type Mutation {
    # Track search analytics
    trackSearch(
      query: String!
      resultCount: Int!
      filters: String
      sessionId: String
      searchTime: Int!
    ): Boolean! @skipAuth

    # Track search result click
    trackSearchClick(
      query: String!
      productId: Int!
      sessionId: String
    ): Boolean! @skipAuth

    # Clear search analytics (admin only)
    clearSearchAnalytics: Boolean! @requireAuth(roles: ["ADMIN"])
  }
`
