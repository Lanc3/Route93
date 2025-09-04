export const schema = gql`
  type TaxRate {
    id: Int!
    name: String!
    rate: Float!
    description: String
    country: String!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type TaxRecord {
    id: Int!
    orderId: Int!
    orderNumber: String!
    customerType: String!
    customerCountry: String!
    customerVatNumber: String
    subtotal: Float!
    vatAmount: Float!
    totalAmount: Float!
    standardVat: Float!
    reducedVat: Float!
    secondReducedVat: Float!
    zeroVat: Float!
    exemptAmount: Float!
    vatNumber: String
    invoiceNumber: String
    reverseCharge: Boolean!
    taxPeriod: String!
    reportingYear: Int!
    reportingQuarter: Int
    reportingMonth: Int
    createdAt: DateTime!
    updatedAt: DateTime!
    order: Order!
  }

  type TaxReturn {
    id: Int!
    period: String!
    periodType: String!
    startDate: DateTime!
    endDate: DateTime!
    totalSales: Float!
    totalVatCollected: Float!
    totalVatDue: Float!
    standardVatSales: Float!
    standardVatAmount: Float!
    reducedVatSales: Float!
    reducedVatAmount: Float!
    secondReducedVatSales: Float!
    secondReducedVatAmount: Float!
    zeroVatSales: Float!
    exemptSales: Float!
    euB2BSales: Float!
    euB2CSales: Float!
    status: String!
    filedAt: DateTime
    filedBy: String
    rosReference: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type TaxSummary {
    period: String!
    totalOrders: Int!
    totalSales: Float!
    totalVatCollected: Float!
    standardVatSales: Float!
    standardVatAmount: Float!
    reducedVatSales: Float!
    reducedVatAmount: Float!
    secondReducedVatSales: Float!
    secondReducedVatAmount: Float!
    zeroVatSales: Float!
    exemptSales: Float!
    euB2BSales: Float!
    euB2CSales: Float!
  }

  type VatBreakdown {
    rate: Float!
    rateName: String!
    salesAmount: Float!
    vatAmount: Float!
    orderCount: Int!
  }

  input CreateTaxRecordInput {
    orderId: Int!
    orderNumber: String!
    customerType: String!
    customerCountry: String!
    customerVatNumber: String
    subtotal: Float!
    vatAmount: Float!
    totalAmount: Float!
    standardVat: Float!
    reducedVat: Float!
    secondReducedVat: Float!
    zeroVat: Float!
    exemptAmount: Float!
    vatNumber: String
    invoiceNumber: String
    reverseCharge: Boolean!
    taxPeriod: String!
    reportingYear: Int!
    reportingQuarter: Int
    reportingMonth: Int
  }

  input CreateTaxReturnInput {
    period: String!
    periodType: String!
    startDate: DateTime!
    endDate: DateTime!
  }

  input TaxReportInput {
    startDate: DateTime!
    endDate: DateTime!
    period: String
  }

  type Query {
    taxRates: [TaxRate!]! @requireAuth(roles: ["ADMIN"])
    taxRecord(id: Int!): TaxRecord @requireAuth(roles: ["ADMIN"])
    taxRecords: [TaxRecord!]! @requireAuth(roles: ["ADMIN"])
    taxRecordsByPeriod(period: String!): [TaxRecord!]! @requireAuth(roles: ["ADMIN"])
    taxReturn(id: Int!): TaxReturn @requireAuth(roles: ["ADMIN"])
    taxReturns: [TaxReturn!]! @requireAuth(roles: ["ADMIN"])
    taxSummary(input: TaxReportInput!): TaxSummary! @requireAuth(roles: ["ADMIN"])
    vatBreakdown(input: TaxReportInput!): [VatBreakdown!]! @requireAuth(roles: ["ADMIN"])
    generateTaxReturn(input: CreateTaxReturnInput!): TaxReturn! @requireAuth(roles: ["ADMIN"])
  }

  type Mutation {
    createTaxRecord(input: CreateTaxRecordInput!): TaxRecord! @requireAuth(roles: ["ADMIN"])
    calculateOrderTax(orderId: Int!): TaxRecord! @requireAuth(roles: ["ADMIN"])
    recalculateAllTaxRecords: Int! @requireAuth(roles: ["ADMIN"])
    createTaxReturn(input: CreateTaxReturnInput!): TaxReturn! @requireAuth(roles: ["ADMIN"])
    updateTaxReturn(id: Int!, status: String!): TaxReturn! @requireAuth(roles: ["ADMIN"])
  }
`
