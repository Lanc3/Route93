export const schema = gql`
  type ProductCollection {
    id: Int!
    productId: Int!
    collectionId: Int!
    product: Product!
    collection: Collection!
  }

  type Query {
    productCollections: [ProductCollection!]! @requireAuth
    productCollection(id: Int!): ProductCollection @requireAuth
  }

  input CreateProductCollectionInput {
    productId: Int!
    collectionId: Int!
  }

  input UpdateProductCollectionInput {
    productId: Int
    collectionId: Int
  }

  type Mutation {
    createProductCollection(
      input: CreateProductCollectionInput!
    ): ProductCollection! @requireAuth
    updateProductCollection(
      id: Int!
      input: UpdateProductCollectionInput!
    ): ProductCollection! @requireAuth
    deleteProductCollection(id: Int!): ProductCollection! @requireAuth
  }
`
