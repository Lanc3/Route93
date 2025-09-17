export const schema = gql`
  type PrintOrder {
    id: Int!
    orderId: Int!
    status: String!
    proofUrl: String
    notes: String
    createdAt: DateTime!
    updatedAt: DateTime!
    order: Order!
    items: [PrintOrderItem]!
  }

  type Query {
    printOrders: [PrintOrder!]! @requireAuth
    printOrder(id: Int!): PrintOrder @requireAuth
  }

  input CreatePrintOrderInput {
    orderId: Int!
    status: String!
    proofUrl: String
    notes: String
  }

  input UpdatePrintOrderInput {
    orderId: Int
    status: String
    proofUrl: String
    notes: String
  }

  type Mutation {
    createPrintOrder(input: CreatePrintOrderInput!): PrintOrder! @requireAuth
    updatePrintOrder(id: Int!, input: UpdatePrintOrderInput!): PrintOrder!
      @requireAuth
    deletePrintOrder(id: Int!): PrintOrder! @requireAuth
  }
`
