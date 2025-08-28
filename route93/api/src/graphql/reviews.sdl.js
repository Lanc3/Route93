export const schema = gql`
  type Review {
    id: Int!
    rating: Int!
    title: String
    comment: String
    isVerified: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: Int!
    productId: Int!
    user: User!
    product: Product!
  }

  type Query {
    reviews: [Review!]! @skipAuth
    review(id: Int!): Review @skipAuth
  }

  input CreateReviewInput {
    rating: Int!
    title: String
    comment: String
    isVerified: Boolean!
    userId: Int!
    productId: Int!
  }

  input UpdateReviewInput {
    rating: Int
    title: String
    comment: String
    isVerified: Boolean
    userId: Int
    productId: Int
  }

  type Mutation {
    createReview(input: CreateReviewInput!): Review! @requireAuth
    updateReview(id: Int!, input: UpdateReviewInput!): Review! @requireAuth
    deleteReview(id: Int!): Review! @requireAuth
  }
`
