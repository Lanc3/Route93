export const schema = gql`
  type Wishlist {
    id: Int!
    userId: Int!
    productId: Int!
    variantId: Int
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
    product: Product!
    variant: ProductVariant
  }

  type Query {
    wishlists: [Wishlist!]! @requireAuth
    myWishlist: [Wishlist!]! @requireAuth
    wishlistByProduct(productId: Int!): Wishlist @requireAuth
    wishlist(id: Int!): Wishlist @requireAuth
  }

  input CreateWishlistInput {
    userId: Int!
    productId: Int!
    variantId: Int
  }

  input UpdateWishlistInput {
    userId: Int
    productId: Int
    variantId: Int
  }

  type Mutation {
    createWishlist(input: CreateWishlistInput!): Wishlist! @requireAuth
    updateWishlist(id: Int!, input: UpdateWishlistInput!): Wishlist!
      @requireAuth
    deleteWishlist(id: Int!): Wishlist! @requireAuth
  }
`
