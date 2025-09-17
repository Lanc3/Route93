export const schema = gql`
  type PrintOrderItem {
    id: Int!
    printOrderId: Int!
    orderItemId: Int
    printableItemId: Int!
    designId: Int
    designPublicId: String
    designUrl: String
    quantity: Int!
    unitPrice: Float!
    printFee: Float
    totalPrice: Float!
    printOrder: PrintOrder!
    orderItem: OrderItem
    printableItem: PrintableItem!
    design: Design
  }

  type Query {
    printOrderItems: [PrintOrderItem!]! @requireAuth
    printOrderItem(id: Int!): PrintOrderItem @requireAuth
  }

  input CreatePrintOrderItemInput {
    printOrderId: Int!
    orderItemId: Int
    printableItemId: Int!
    designId: Int
    designPublicId: String
    designUrl: String
    quantity: Int!
    unitPrice: Float!
    printFee: Float
    totalPrice: Float!
  }

  input UpdatePrintOrderItemInput {
    printOrderId: Int
    orderItemId: Int
    printableItemId: Int
    designId: Int
    designPublicId: String
    designUrl: String
    quantity: Int
    unitPrice: Float
    printFee: Float
    totalPrice: Float
  }

  type Mutation {
    createPrintOrderItem(input: CreatePrintOrderItemInput!): PrintOrderItem!
      @requireAuth
    updatePrintOrderItem(
      id: Int!
      input: UpdatePrintOrderItemInput!
    ): PrintOrderItem! @requireAuth
    deletePrintOrderItem(id: Int!): PrintOrderItem! @requireAuth
  }
`
