export const schema = gql`
  type PrintCartItem {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: Int!
    printableItemId: Int!
    designId: Int
    designPublicId: String
    designUrl: String
    quantity: Int!
    printFee: Float
    note: String
    basePrice: Float
    totalPrice: Float
    user: User!
    printableItem: PrintableItem!
    design: Design
  }

  type Query {
    printCartItems: [PrintCartItem!]! @requireAuth
    printCartItem(id: Int!): PrintCartItem @requireAuth
    userPrintCartItems(userId: Int!): [PrintCartItem!]! @requireAuth
  }

  input CreatePrintCartItemInput {
    userId: Int!
    printableItemId: Int!
    designId: Int
    designPublicId: String
    designUrl: String
    quantity: Int!
    printFee: Float
    note: String
    basePrice: Float
    totalPrice: Float
  }

  input UpdatePrintCartItemInput {
    userId: Int
    printableItemId: Int
    designId: Int
    designPublicId: String
    designUrl: String
    quantity: Int
    printFee: Float
    note: String
    basePrice: Float
    totalPrice: Float
  }

  type Mutation {
    createPrintCartItem(input: CreatePrintCartItemInput!): PrintCartItem!
      @requireAuth
    updatePrintCartItem(
      id: Int!
      input: UpdatePrintCartItemInput!
    ): PrintCartItem! @requireAuth
    deletePrintCartItem(id: Int!): PrintCartItem! @requireAuth
    clearUserPrintCart(userId: Int!): Boolean! @requireAuth
  }
`
