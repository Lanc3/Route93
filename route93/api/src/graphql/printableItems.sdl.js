export const schema = gql`
  type PrintableItem {
    id: Int!
    name: String!
    description: String
    price: Float!
    imageUrl: String
    publicId: String
    status: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    printableItems(
      search: String
      status: String
      limit: Int
      offset: Int
    ): [PrintableItem!]! @requireAuth
    printableItem(id: Int!): PrintableItem @requireAuth
  }

  input CreatePrintableItemInput {
    name: String!
    description: String
    price: Float!
    imageUrl: String
    publicId: String
    status: String!
  }

  input UpdatePrintableItemInput {
    name: String
    description: String
    price: Float
    imageUrl: String
    publicId: String
    status: String
  }

  type Mutation {
    createPrintableItem(input: CreatePrintableItemInput!): PrintableItem!
      @requireAuth
    updatePrintableItem(
      id: Int!
      input: UpdatePrintableItemInput!
    ): PrintableItem! @requireAuth
    deletePrintableItem(id: Int!): PrintableItem! @requireAuth
    uploadPrintableItemImage(
      name: String!
      description: String
      price: Float!
      file: String!
      status: String
    ): PrintableItem! @requireAuth
  }
`
