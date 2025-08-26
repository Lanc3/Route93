export const schema = gql`
  type CartItem {
    id: Int!
    quantity: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: Int!
    productId: Int!
    user: User!
    product: Product!
  }

  input CartSyncInput {
    productId: Int!
    quantity: Int!
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
  }

  input UpdateCartItemInput {
    quantity: Int
    userId: Int
    productId: Int
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
