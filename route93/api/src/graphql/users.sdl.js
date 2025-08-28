export const schema = gql`
  type UserCount {
    orders: Int!
    addresses: Int!
    cartItems: Int!
    reviews: Int!
  }

  type User {
    id: Int!
    email: String!
    name: String!
    phone: String
    role: String!
    hashedPassword: String!
    salt: String!
    resetToken: String
    resetTokenExpiresAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    orders: [Order]!
    addresses: [Address]!
    cartItems: [CartItem]!
    reviews: [Review]
    _count: UserCount
  }

  type Query {
    users(
      role: String
      search: String
      sortBy: String
      sortOrder: String
      limit: Int
      offset: Int
    ): [User!]! @requireAuth(roles: ["ADMIN"])
    user(id: Int!): User @requireAuth(roles: ["ADMIN"])
    currentUser: User @requireAuth
    usersCount(
      role: String
      search: String
    ): Int! @requireAuth(roles: ["ADMIN"])
  }

  input CreateUserInput {
    email: String!
    name: String!
    phone: String
    role: String!
    hashedPassword: String!
    salt: String!
    resetToken: String
    resetTokenExpiresAt: DateTime
  }

  input UpdateUserInput {
    email: String
    name: String
    phone: String
    role: String
    hashedPassword: String
    salt: String
    resetToken: String
    resetTokenExpiresAt: DateTime
  }

  input UpdateCurrentUserInput {
    name: String
    phone: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth(roles: ["ADMIN"])
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth(roles: ["ADMIN"])
    updateCurrentUser(input: UpdateCurrentUserInput!): User! @requireAuth
    updateUserRole(id: Int!, role: String!): User! @requireAuth(roles: ["ADMIN"])
    deleteUser(id: Int!): User! @requireAuth(roles: ["ADMIN"])
  }
`
