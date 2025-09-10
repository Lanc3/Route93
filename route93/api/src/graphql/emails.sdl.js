export const schema = gql`
  type Email {
    id: Int!
    to: String!
    subject: String!
    template: String!
    context: String
    status: String!
    sentAt: DateTime
    error: String
    priority: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    emails: [Email!]! @requireAuth(roles: ["ADMIN"])
    email(id: Int!): Email @requireAuth(roles: ["ADMIN"])
  }

  input CreateEmailInput {
    to: String!
    subject: String!
    template: String!
    context: String
    status: String
    priority: String
  }

  input UpdateEmailInput {
    to: String
    subject: String
    template: String
    context: String
    status: String
    error: String
    priority: String
    sentAt: DateTime
  }

  type Mutation {
    createEmail(input: CreateEmailInput!): Email! @requireAuth(roles: ["ADMIN"])
    updateEmail(id: Int!, input: UpdateEmailInput!): Email! @requireAuth(roles: ["ADMIN"])
    deleteEmail(id: Int!): Email! @requireAuth(roles: ["ADMIN"])
    
    # Email sending mutations
    sendPasswordResetEmail(email: String!, resetToken: String!, userName: String!): Boolean! @skipAuth
    sendOrderConfirmationEmail(orderId: Int!): Boolean! @requireAuth
    sendReviewRequestEmail(orderId: Int!): Boolean! @requireAuth
    sendLowStockAlert(productIds: [Int!]!, threshold: Int): Boolean! @requireAuth(roles: ["ADMIN"])
    
    # Test email sending
    sendTestEmail(to: String!): Boolean! @requireAuth(roles: ["ADMIN"])
  }
`
