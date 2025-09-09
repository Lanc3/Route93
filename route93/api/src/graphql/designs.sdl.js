export const schema = gql`
  type Design {
    id: Int!
    name: String!
    description: String
    imageUrl: String!
    publicId: String!
    status: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    designs(
      search: String
      status: String
      limit: Int
      offset: Int
    ): [Design!]! @requireAuth
    design(id: Int!): Design @requireAuth
  }

  input CreateDesignInput {
    name: String!
    description: String
    imageUrl: String!
    publicId: String!
    status: String!
  }

  input UpdateDesignInput {
    name: String
    description: String
    imageUrl: String
    publicId: String
    status: String
  }

  type Mutation {
    createDesign(input: CreateDesignInput!): Design! @requireAuth
    updateDesign(id: Int!, input: UpdateDesignInput!): Design! @requireAuth
    deleteDesign(id: Int!): Design! @requireAuth
    uploadDesignImage(
      name: String!
      description: String
      file: String!
      status: String
    ): Design! @requireAuth
  }
`
