export const schema = gql`
  type OrderItem {
    id: Int!
    quantity: Int!
    price: Float!
    totalPrice: Float!
    orderId: Int!
    productId: Int!
    designUrl: String
    designId: String
    printFee: Float
    printableItemId: Int
    order: Order!
    product: Product!
    printableItem: PrintableItem
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
    designUrl: String
    designId: String
    printFee: Float
    printableItemId: Int
  }

  input UpdateOrderItemInput {
    quantity: Int
    price: Float
    totalPrice: Float
    orderId: Int
    productId: Int
    designUrl: String
    designId: String
    printFee: Float
    printableItemId: Int
  }

  type Mutation {
    createOrderItem(input: CreateOrderItemInput!): OrderItem! @requireAuth
    updateOrderItem(id: Int!, input: UpdateOrderItemInput!): OrderItem!
      @requireAuth
    deleteOrderItem(id: Int!): OrderItem! @requireAuth
  }
`
