export const schema = gql`
  type CartItem {
    id: Int!
    quantity: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: Int!
    productId: Int!
    designUrl: String
    designId: String
    printFee: Float
    printableItemId: Int
    user: User!
    product: Product!
    printableItem: PrintableItem
  }

  input CartSyncInput {
    productId: Int!
    quantity: Int!
    designUrl: String
    designId: String
    printFee: Float
    printableItemId: Int
  }

  type Query {
    cartItems: [CartItem!]! @requireAuth
    cartItem(id: Int!): CartItem @requireAuth
    userCartItems(userId: Int!): [CartItem!]! @requireAuth
  }

  input CreateCartItemInput {
    quantity: Int!
    userId: Int!
    productId: Int!
    designUrl: String
    designId: String
    printFee: Float
    printableItemId: Int
  }

  input UpdateCartItemInput {
    quantity: Int
    userId: Int
    productId: Int
    designUrl: String
    designId: String
    printFee: Float
    printableItemId: Int
  }

  type Mutation {
    createCartItem(input: CreateCartItemInput!): CartItem! @requireAuth
    updateCartItem(id: Int!, input: UpdateCartItemInput!): CartItem!
      @requireAuth
    deleteCartItem(id: Int!): CartItem! @requireAuth
    syncCart(items: [CartSyncInput!]!): [CartItem!]! @requireAuth
    clearUserCart(userId: Int!): Boolean! @requireAuth
  }
`
