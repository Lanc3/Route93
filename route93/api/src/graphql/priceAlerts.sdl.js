export const schema = gql`
  type PriceAlert {
    id: Int!
    userId: Int
    email: String
    productId: Int!
    variantId: Int
    targetType: String!
    threshold: Float
    unsubToken: String!
    notifiedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User
    product: Product!
    variant: ProductVariant
  }

  type Query {
    priceAlerts: [PriceAlert!]! @requireAuth
    priceAlert(id: Int!): PriceAlert @requireAuth
  }

  input CreatePriceAlertInput {
    userId: Int
    email: String
    productId: Int!
    variantId: Int
    targetType: String!
    threshold: Float
    unsubToken: String!
    notifiedAt: DateTime
  }

  input UpdatePriceAlertInput {
    userId: Int
    email: String
    productId: Int
    variantId: Int
    targetType: String
    threshold: Float
    unsubToken: String
    notifiedAt: DateTime
  }

  type Mutation {
    createPriceAlert(input: CreatePriceAlertInput!): PriceAlert! @requireAuth
    updatePriceAlert(id: Int!, input: UpdatePriceAlertInput!): PriceAlert!
      @requireAuth
    deletePriceAlert(id: Int!): PriceAlert! @requireAuth
  }
`
