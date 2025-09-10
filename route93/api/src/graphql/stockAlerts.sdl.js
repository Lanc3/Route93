export const schema = gql`
  type StockAlert {
    id: Int!
    productId: Int!
    variantId: Int
    channel: String!
    email: String
    phone: String
    unsubToken: String!
    notifiedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    product: Product!
    variant: ProductVariant
  }

  type Query {
    stockAlerts: [StockAlert!]! @requireAuth
    stockAlert(id: Int!): StockAlert @requireAuth
  }

  input CreateStockAlertInput {
    productId: Int!
    variantId: Int
    channel: String!
    email: String
    phone: String
    unsubToken: String
    notifiedAt: DateTime
  }

  input UpdateStockAlertInput {
    productId: Int
    variantId: Int
    channel: String
    email: String
    phone: String
    unsubToken: String
    notifiedAt: DateTime
  }

  type Mutation {
    createStockAlert(input: CreateStockAlertInput!): StockAlert! @skipAuth
    updateStockAlert(id: Int!, input: UpdateStockAlertInput!): StockAlert!
      @requireAuth
    deleteStockAlert(id: Int!): StockAlert! @requireAuth
  }
`
