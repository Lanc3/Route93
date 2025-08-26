export const schema = gql`
  type OrderItem {
    id: Int!
    quantity: Int!
    price: Float!
    totalPrice: Float!
    orderId: Int!
    productId: Int!
    order: Order!
    product: Product!
  }

  type Query {
    orderItems: [OrderItem!]! @requireAuth
    orderItem(id: Int!): OrderItem @requireAuth
  }

  input CreateOrderItemInput {
    quantity: Int!
    price: Float!
    totalPrice: Float!
    orderId: Int!
    productId: Int!
  }

  input UpdateOrderItemInput {
    quantity: Int
    price: Float
    totalPrice: Float
    orderId: Int
    productId: Int
  }

  type Mutation {
    createOrderItem(input: CreateOrderItemInput!): OrderItem! @requireAuth
    updateOrderItem(id: Int!, input: UpdateOrderItemInput!): OrderItem!
      @requireAuth
    deleteOrderItem(id: Int!): OrderItem! @requireAuth
  }
`
