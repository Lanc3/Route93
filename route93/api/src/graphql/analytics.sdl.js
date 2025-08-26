export const schema = gql`
  type SalesReport {
    totalRevenue: Float!
    totalOrders: Int!
    averageOrderValue: Float!
    revenueGrowth: Float!
    ordersGrowth: Float!
    dailySales: [DailySales!]!
    monthlySales: [MonthlySales!]!
    topCategories: [CategorySales!]!
    recentOrders: [Order!]!
  }

  type DailySales {
    date: String!
    revenue: Float!
    orders: Int!
    customers: Int!
  }

  type MonthlySales {
    month: String!
    revenue: Float!
    orders: Int!
    customers: Int!
  }

  type CategorySales {
    categoryId: Int!
    categoryName: String!
    revenue: Float!
    orders: Int!
    products: Int!
  }

  type ProductAnalytics {
    topSellingProducts: [ProductSales!]!
    lowPerformingProducts: [ProductSales!]!
    productsByCategory: [CategoryProducts!]!
    inventoryTurnover: [ProductTurnover!]!
  }

  type ProductSales {
    productId: Int!
    productName: String!
    sku: String!
    totalSales: Float!
    totalQuantity: Int!
    averageRating: Float
    category: String
  }

  type CategoryProducts {
    categoryId: Int!
    categoryName: String!
    productCount: Int!
    averagePrice: Float!
    totalRevenue: Float!
  }

  type ProductTurnover {
    productId: Int!
    productName: String!
    currentStock: Int!
    soldQuantity: Int!
    turnoverRate: Float!
  }

  type UserAnalytics {
    totalUsers: Int!
    newUsersThisMonth: Int!
    activeUsers: Int!
    userGrowth: Float!
    topCustomers: [CustomerStats!]!
    usersByRegistrationDate: [UserRegistration!]!
    userActivity: [UserActivity!]!
  }

  type CustomerStats {
    userId: Int!
    userName: String!
    userEmail: String!
    totalOrders: Int!
    totalSpent: Float!
    averageOrderValue: Float!
    lastOrderDate: DateTime
  }

  type UserRegistration {
    date: String!
    newUsers: Int!
  }

  type UserActivity {
    date: String!
    activeUsers: Int!
    orders: Int!
    revenue: Float!
  }

  type OverallAnalytics {
    salesReport: SalesReport!
    productAnalytics: ProductAnalytics!
    userAnalytics: UserAnalytics!
    conversionRate: Float!
    averageSessionValue: Float!
    returnCustomerRate: Float!
  }

  type Query {
    salesReport(
      startDate: DateTime
      endDate: DateTime
      period: String
    ): SalesReport! @requireAuth(roles: ["ADMIN"])
    
    productAnalytics(
      startDate: DateTime
      endDate: DateTime
      limit: Int
    ): ProductAnalytics! @requireAuth(roles: ["ADMIN"])
    
    userAnalytics(
      startDate: DateTime
      endDate: DateTime
    ): UserAnalytics! @requireAuth(roles: ["ADMIN"])
    
    overallAnalytics(
      startDate: DateTime
      endDate: DateTime
    ): OverallAnalytics! @requireAuth(roles: ["ADMIN"])
  }
`
