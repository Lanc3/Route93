export const schema = gql`
  type Payment {
    id: Int!
    amount: Float!
    status: String!
    method: String!
    transactionId: String
    errorCode: String
    errorMessage: String
    errorType: String
    createdAt: DateTime!
    updatedAt: DateTime!
    orderId: Int!
    order: Order!
  }

  type PaymentIntent {
    id: String!
    clientSecret: String!
    paymentIntentId: String!
    amount: Int!
    currency: String!
    status: String!
  }

  type Query {
    payments: [Payment!]! @requireAuth(roles: ["ADMIN"])
    payment(id: Int!): Payment @requireAuth
  }

  input CreatePaymentInput {
    amount: Float!
    status: String!
    method: String!
    transactionId: String
    orderId: Int!
    errorCode: String
    errorMessage: String
    errorType: String
  }

  input UpdatePaymentInput {
    amount: Float
    status: String
    method: String
    transactionId: String
    orderId: Int
    errorCode: String
    errorMessage: String
    errorType: String
  }

  input CreatePaymentIntentInput {
    amount: Int!
    currency: String!
    orderId: Int
  }

  type Mutation {
    createPayment(input: CreatePaymentInput!): Payment! @requireAuth
    updatePayment(id: Int!, input: UpdatePaymentInput!): Payment! @requireAuth
    deletePayment(id: Int!): Payment! @requireAuth(roles: ["ADMIN"])
    createPaymentIntent(input: CreatePaymentIntentInput!): PaymentIntent! @skipAuth
    recordFailedPayment(input: CreatePaymentInput!): Payment! @requireAuth
  }
`