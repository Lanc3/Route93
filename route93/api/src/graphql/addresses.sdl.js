export const schema = gql`
  type Address {
    id: Int!
    firstName: String!
    lastName: String!
    company: String
    address1: String!
    address2: String
    city: String!
    state: String!
    zipCode: String!
    country: String!
    phone: String
    isDefault: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: Int!
    user: User!
    shippingOrders: [Order]!
    billingOrders: [Order]!
  }

  type Query {
    addresses: [Address!]! @requireAuth
    address(id: Int!): Address @requireAuth
    addressesByUser(userId: Int!): [Address!]! @requireAuth
  }

  input CreateAddressInput {
    firstName: String!
    lastName: String!
    company: String
    address1: String!
    address2: String
    city: String!
    state: String!
    zipCode: String!
    country: String!
    phone: String
    isDefault: Boolean!
    userId: Int!
  }

  input UpdateAddressInput {
    firstName: String
    lastName: String
    company: String
    address1: String
    address2: String
    city: String
    state: String
    zipCode: String
    country: String
    phone: String
    isDefault: Boolean
    userId: Int
  }

  input DeleteAddressInput {
    id: Int!
  }

  type Mutation {
    createAddress(input: CreateAddressInput!): Address! @requireAuth
    updateAddress(id: Int!, input: UpdateAddressInput!): Address! @requireAuth
    deleteAddress(id: Int!): Address! @requireAuth
  }
`
