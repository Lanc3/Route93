import { gql } from 'graphql-tag'

export const schema = gql`
  type DiscountCode {
    id: Int!
    code: String!
    name: String!
    description: String
    type: String!
    value: Float
    minOrderValue: Float
    maxDiscount: Float
    usageLimit: Int
    usageCount: Int!
    perCustomerLimit: Int
    isActive: Boolean!
    startsAt: DateTime
    expiresAt: DateTime
    applicableTo: String!
    categoryIds: String
    productIds: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type OrderDiscount {
    id: Int!
    orderId: Int!
    discountCodeId: Int!
    discountCode: String!
    discountType: String!
    discountValue: Float!
    discountAmount: Float!
    createdAt: DateTime!
    discount: DiscountCode!
  }

  type DiscountValidation {
    isValid: Boolean!
    discountCode: DiscountCode
    errorMessage: String
    discountAmount: Float
    finalTotal: Float
  }

  type DiscountAnalytics {
    totalDiscountCodes: Int!
    activeDiscountCodes: Int!
    totalUsageCount: Int!
    totalDiscountAmount: Float!
    averageDiscountPerOrder: Float!
    mostPopularDiscount: DiscountPerformance!
    discountPerformance: [DiscountPerformance!]!
    usageByType: [DiscountTypeUsage!]!
    monthlyDiscountTrends: [MonthlyDiscountData!]!
  }

  type DiscountPerformance {
    discountCodeId: Int!
    code: String!
    name: String!
    type: String!
    usageCount: Int!
    totalDiscountAmount: Float!
    averageDiscountPerUse: Float!
    revenueImpact: Float!
    lastUsed: DateTime
  }

  type DiscountTypeUsage {
    type: String!
    count: Int!
    totalAmount: Float!
    percentage: Float!
  }

  type MonthlyDiscountData {
    month: String!
    totalDiscounts: Int!
    totalAmount: Float!
    uniqueCodes: Int!
  }

  type Query {
    # Get all discount codes (admin only)
    discountCodes(
      limit: Int
      offset: Int
      search: String
      isActive: Boolean
    ): [DiscountCode!]! @requireAuth(roles: ["ADMIN"])

    # Get single discount code (admin only)
    discountCode(id: Int!): DiscountCode @requireAuth(roles: ["ADMIN"])

    # Validate discount code for current cart
    validateDiscountCode(code: String!): DiscountValidation! @skipAuth

    # Get discount codes count (admin only)
    discountCodesCount(search: String, isActive: Boolean): Int! @requireAuth(roles: ["ADMIN"])

    # Get discount analytics (admin only)
    discountAnalytics(
      startDate: DateTime
      endDate: DateTime
    ): DiscountAnalytics! @requireAuth(roles: ["ADMIN"])
  }

  type Mutation {
    # Create discount code (admin only)
    createDiscountCode(input: CreateDiscountCodeInput!): DiscountCode! @requireAuth(roles: ["ADMIN"])

    # Update discount code (admin only)
    updateDiscountCode(id: Int!, input: UpdateDiscountCodeInput!): DiscountCode! @requireAuth(roles: ["ADMIN"])

    # Delete discount code (admin only)
    deleteDiscountCode(id: Int!): Boolean! @requireAuth(roles: ["ADMIN"])

    # Toggle discount code active status (admin only)
    toggleDiscountCode(id: Int!): DiscountCode! @requireAuth(roles: ["ADMIN"])

    # Apply discount to cart (user)
    applyDiscountToCart(code: String!): DiscountValidation! @requireAuth

    # Remove discount from cart (user)
    removeDiscountFromCart: Boolean! @requireAuth
  }

  input CreateDiscountCodeInput {
    code: String!
    name: String!
    description: String
    type: String!
    value: Float
    minOrderValue: Float
    maxDiscount: Float
    usageLimit: Int
    perCustomerLimit: Int
    startsAt: DateTime
    expiresAt: DateTime
    applicableTo: String
    categoryIds: String
    productIds: String
  }

  input UpdateDiscountCodeInput {
    code: String
    name: String
    description: String
    type: String
    value: Float
    minOrderValue: Float
    maxDiscount: Float
    usageLimit: Int
    perCustomerLimit: Int
    startsAt: DateTime
    expiresAt: DateTime
    applicableTo: String
    categoryIds: String
    productIds: String
  }
`
