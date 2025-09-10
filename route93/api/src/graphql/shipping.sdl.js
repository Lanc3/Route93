export const schema = gql`
  type ShippingEstimate {
    minDays: Int!
    maxDays: Int!
    commitment: String!
  }

  type Query {
    shippingEstimate(country: String!, method: String!): ShippingEstimate! @skipAuth
  }
`


