export const schema = gql`
  type Order {
    id: Int!
    orderNumber: String!
    status: String!
    totalAmount: Float!
    shippingCost: Float!
    taxAmount: Float!
    notes: String
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: Int!
    user: User!
    shippingAddress: Address!
    billingAddress: Address!
    shippingAddressId: Int!
    billingAddressId: Int!
    orderItems: [OrderItem]!
    payments: [Payment]!
  }

  type Query {
    orders(
      status: String
      userId: Int
      search: String
      sortBy: String
      sortOrder: String
      limit: Int
      offset: Int
    ): [Order!]! @requireAuth(roles: ["ADMIN"])
    order(id: Int!): Order @requireAuth
    ordersCount(
      status: String
      userId: Int
      search: String
    ): Int! @requireAuth(roles: ["ADMIN"])
  }

  input CreateOrderInput {
    orderNumber: String
    status: String!
    totalAmount: Float!
    shippingCost: Float
    taxAmount: Float
    notes: String
    userId: Int!
    shippingAddress: CreateOrderAddressInput!
    billingAddress: CreateOrderAddressInput
    orderItems: [CreateNestedOrderItemInput!]!
  }

  input CreateOrderAddressInput {
    firstName: String!
    lastName: String!
    company: String
    address1: String!
    address2: String
    city: String!
    state: String!
    zipCode: String!
    country: String!
    phone: String
    isDefault: Boolean!
  }

  input CreateNestedOrderItemInput {
    productId: Int!
    quantity: Int!
    price: Float!
    totalPrice: Float!
  }



  input UpdateOrderInput {
    orderNumber: String
    status: String
    totalAmount: Float
    shippingCost: Float
    taxAmount: Float
    notes: String
    userId: Int
    shippingAddressId: Int
    billingAddressId: Int
  }

  type Mutation {
    createOrder(input: CreateOrderInput!): Order! @requireAuth
    updateOrder(id: Int!, input: UpdateOrderInput!): Order! @requireAuth(roles: ["ADMIN"])
    updateOrderStatus(id: Int!, status: String!): Order! @requireAuth(roles: ["ADMIN"])
    deleteOrder(id: Int!): Order! @requireAuth(roles: ["ADMIN"])
  }
`
