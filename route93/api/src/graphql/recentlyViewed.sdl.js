import { gql } from 'graphql-tag'

export const schema = gql`
  type RecentlyViewed {
    id: Int!
    userId: Int!
    productId: Int!
    viewedAt: DateTime!
    user: User!
    product: Product!
  }

  type Query {
    # Get recently viewed products for current user
    recentlyViewed(limit: Int): [RecentlyViewed!]! @requireAuth

    # Get recently viewed products count
    recentlyViewedCount: Int! @requireAuth
  }

  type Mutation {
    # Add product to recently viewed
    addToRecentlyViewed(productId: Int!): RecentlyViewed! @requireAuth

    # Remove from recently viewed
    removeFromRecentlyViewed(productId: Int!): Boolean! @requireAuth

    # Clear all recently viewed products
    clearRecentlyViewed: Boolean! @requireAuth
  }
`
