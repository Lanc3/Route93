export const schema = gql`
  type AdminStats {
    productsCount: Int!
    ordersCount: Int!
    usersCount: Int!
    totalRevenue: Float!
    recentOrdersCount: Int!
    lowStockCount: Int!
    activeUsersCount: Int!
    categoriesCount: Int!
    collectionsCount: Int!
    pendingOrdersCount: Int!
    processingOrdersCount: Int!
    shippedOrdersCount: Int!
    deliveredOrdersCount: Int!
    clientsCount: Int!
    adminsCount: Int!
    activeTodayCount: Int!
  }

  type Query {
    adminStats: AdminStats! @requireAuth(roles: ["ADMIN"])
  }
`
