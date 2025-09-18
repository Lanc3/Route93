export const schema = gql`
  type CollectionCount {
    products: Int!
  }

  type Collection {
    id: Int!
    name: String!
    description: String
    slug: String!
    image: String
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    products: [ProductCollection]!
    _count: CollectionCount
  }

  type Query {
    collections(
      isActive: Boolean
      search: String
      sortBy: String
      sortOrder: String
      limit: Int
      offset: Int
    ): [Collection!]! @skipAuth
    collection(id: Int!): Collection @skipAuth
    collectionsCount(
      isActive: Boolean
      search: String
    ): Int! @requireAuth(roles: ["ADMIN"])
    collectionBySlug(slug: String!): Collection @skipAuth
  }

  input CreateCollectionInput {
    name: String!
    description: String
    slug: String!
    image: String
    isActive: Boolean!
  }

  input UpdateCollectionInput {
    name: String
    description: String
    slug: String
    image: String
    isActive: Boolean
  }

  type Mutation {
    createCollection(input: CreateCollectionInput!): Collection! @requireAuth(roles: ["ADMIN"])
    updateCollection(id: Int!, input: UpdateCollectionInput!): Collection! @requireAuth(roles: ["ADMIN"])
    deleteCollection(id: Int!): Collection! @requireAuth(roles: ["ADMIN"])
    addProductToCollection(collectionId: Int!, productId: Int!): Collection! @requireAuth(roles: ["ADMIN"])
    removeProductFromCollection(collectionId: Int!, productId: Int!): Collection! @requireAuth(roles: ["ADMIN"])
  }
`
