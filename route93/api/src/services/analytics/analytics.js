import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'

// Helper function to get date range
const getDateRange = (startDate, endDate) => {
  const now = new Date()
  const defaultEndDate = endDate ? new Date(endDate) : now
  const defaultStartDate = startDate ? new Date(startDate) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
  
  return { startDate: defaultStartDate, endDate: defaultEndDate }
}

// Helper function to format date for grouping
const formatDateForGrouping = (date, period = 'daily') => {
  if (period === 'monthly') {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export const salesReport = async ({ startDate, endDate, period = 'daily' }) => {
  requireAuth({ roles: ['ADMIN'] })

  try {
    const { startDate: start, endDate: end } = getDateRange(startDate, endDate)
    
    // Get previous period for growth calculation
    const periodDiff = end.getTime() - start.getTime()
    const prevStart = new Date(start.getTime() - periodDiff)
    const prevEnd = start

    // Current period stats
    const [currentStats, previousStats, dailySalesData, topCategoriesData, recentOrdersData] = await Promise.all([
      // Current period revenue and orders
      db.order.aggregate({
        where: {
          createdAt: { gte: start, lte: end },
          status: { in: ['DELIVERED', 'COMPLETED'] }
        },
        _sum: { totalAmount: true },
        _count: true
      }),
      
      // Previous period for growth calculation
      db.order.aggregate({
        where: {
          createdAt: { gte: prevStart, lte: prevEnd },
          status: { in: ['DELIVERED', 'COMPLETED'] }
        },
        _sum: { totalAmount: true },
        _count: true
      }),
      
      // Daily sales breakdown
      db.$queryRaw`
        SELECT 
          DATE(createdAt) as date,
          SUM(totalAmount) as revenue,
          COUNT(*) as orders,
          COUNT(DISTINCT userId) as customers
        FROM "Order" 
        WHERE createdAt >= ${start} AND createdAt <= ${end}
          AND status IN ('DELIVERED', 'COMPLETED')
        GROUP BY DATE(createdAt)
        ORDER BY date DESC
        LIMIT 30
      `,
      
      // Top categories by revenue
      db.$queryRaw`
        SELECT 
          c.id as categoryId,
          c.name as categoryName,
          SUM(oi.price * oi.quantity) as revenue,
          COUNT(DISTINCT o.id) as orders,
          COUNT(DISTINCT p.id) as products
        FROM "Category" c
        JOIN "Product" p ON p.categoryId = c.id
        JOIN "OrderItem" oi ON oi.productId = p.id
        JOIN "Order" o ON o.id = oi.orderId
        WHERE o.createdAt >= ${start} AND o.createdAt <= ${end}
          AND o.status IN ('DELIVERED', 'COMPLETED')
        GROUP BY c.id, c.name
        ORDER BY revenue DESC
        LIMIT 10
      `,
      
      // Recent orders
      db.order.findMany({
        where: {
          createdAt: { gte: start, lte: end }
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      })
    ])

    const totalRevenue = currentStats._sum.totalAmount || 0
    const totalOrders = currentStats._count || 0
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    const prevRevenue = previousStats._sum.totalAmount || 0
    const prevOrders = previousStats._count || 0

    const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0
    const ordersGrowth = prevOrders > 0 ? ((totalOrders - prevOrders) / prevOrders) * 100 : 0

    // Format daily sales data
    const dailySales = dailySalesData.map(day => ({
      date: day.date.toISOString().split('T')[0],
      revenue: parseFloat(day.revenue) || 0,
      orders: parseInt(day.orders) || 0,
      customers: parseInt(day.customers) || 0
    }))

    // Generate monthly sales from daily data
    const monthlyData = {}
    dailySales.forEach(day => {
      const month = day.date.substring(0, 7) // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, orders: 0, customers: new Set() }
      }
      monthlyData[month].revenue += day.revenue
      monthlyData[month].orders += day.orders
    })

    const monthlySales = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      orders: data.orders,
      customers: data.customers.size || 0
    }))

    // Format categories data
    const topCategories = topCategoriesData.map(cat => ({
      categoryId: parseInt(cat.categoryId),
      categoryName: cat.categoryName,
      revenue: parseFloat(cat.revenue) || 0,
      orders: parseInt(cat.orders) || 0,
      products: parseInt(cat.products) || 0
    }))

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      revenueGrowth,
      ordersGrowth,
      dailySales,
      monthlySales,
      topCategories,
      recentOrders: recentOrdersData
    }
  } catch (error) {
    console.error('Error generating sales report:', error)
    return {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      revenueGrowth: 0,
      ordersGrowth: 0,
      dailySales: [],
      monthlySales: [],
      topCategories: [],
      recentOrders: []
    }
  }
}

export const productAnalytics = async ({ startDate, endDate, limit = 10 }) => {
  requireAuth({ roles: ['ADMIN'] })

  try {
    const { startDate: start, endDate: end } = getDateRange(startDate, endDate)

    const [topSellingData, lowPerformingData, categoryData, turnoverData] = await Promise.all([
      // Top selling products
      db.$queryRaw`
        SELECT 
          p.id as productId,
          p.name as productName,
          p.sku,
          SUM(oi.price * oi.quantity) as totalSales,
          SUM(oi.quantity) as totalQuantity,
          c.name as category
        FROM "Product" p
        LEFT JOIN "Category" c ON c.id = p.categoryId
        JOIN "OrderItem" oi ON oi.productId = p.id
        JOIN "Order" o ON o.id = oi.orderId
        WHERE o.createdAt >= ${start} AND o.createdAt <= ${end}
          AND o.status IN ('DELIVERED', 'COMPLETED')
        GROUP BY p.id, p.name, p.sku, c.name
        ORDER BY totalSales DESC
        LIMIT ${limit}
      `,
      
      // Low performing products (products with sales)
      db.$queryRaw`
        SELECT 
          p.id as productId,
          p.name as productName,
          p.sku,
          COALESCE(SUM(oi.price * oi.quantity), 0) as totalSales,
          COALESCE(SUM(oi.quantity), 0) as totalQuantity,
          c.name as category
        FROM "Product" p
        LEFT JOIN "Category" c ON c.id = p.categoryId
        LEFT JOIN "OrderItem" oi ON oi.productId = p.id
        LEFT JOIN "Order" o ON o.id = oi.orderId 
          AND o.createdAt >= ${start} AND o.createdAt <= ${end}
          AND o.status IN ('DELIVERED', 'COMPLETED')
        WHERE p.status = 'ACTIVE'
        GROUP BY p.id, p.name, p.sku, c.name
        ORDER BY totalSales ASC
        LIMIT ${limit}
      `,
      
      // Products by category
      db.$queryRaw`
        SELECT 
          c.id as categoryId,
          c.name as categoryName,
          COUNT(p.id) as productCount,
          AVG(p.price) as averagePrice,
          COALESCE(SUM(oi.price * oi.quantity), 0) as totalRevenue
        FROM "Category" c
        LEFT JOIN "Product" p ON p.categoryId = c.id AND p.status = 'ACTIVE'
        LEFT JOIN "OrderItem" oi ON oi.productId = p.id
        LEFT JOIN "Order" o ON o.id = oi.orderId 
          AND o.createdAt >= ${start} AND o.createdAt <= ${end}
          AND o.status IN ('DELIVERED', 'COMPLETED')
        GROUP BY c.id, c.name
        ORDER BY totalRevenue DESC
      `,
      
      // Inventory turnover
      db.$queryRaw`
        SELECT 
          p.id as productId,
          p.name as productName,
          p.inventory as currentStock,
          COALESCE(SUM(oi.quantity), 0) as soldQuantity,
          CASE 
            WHEN p.inventory > 0 THEN COALESCE(SUM(oi.quantity), 0)::float / p.inventory::float
            ELSE 0
          END as turnoverRate
        FROM "Product" p
        LEFT JOIN "OrderItem" oi ON oi.productId = p.id
        LEFT JOIN "Order" o ON o.id = oi.orderId 
          AND o.createdAt >= ${start} AND o.createdAt <= ${end}
          AND o.status IN ('DELIVERED', 'COMPLETED')
        WHERE p.status = 'ACTIVE'
        GROUP BY p.id, p.name, p.inventory
        ORDER BY turnoverRate DESC
        LIMIT ${limit}
      `
    ])

    return {
      topSellingProducts: topSellingData.map(p => ({
        productId: parseInt(p.productId),
        productName: p.productName,
        sku: p.sku,
        totalSales: parseFloat(p.totalSales) || 0,
        totalQuantity: parseInt(p.totalQuantity) || 0,
        averageRating: null, // Could be calculated from reviews if needed
        category: p.category
      })),
      lowPerformingProducts: lowPerformingData.map(p => ({
        productId: parseInt(p.productId),
        productName: p.productName,
        sku: p.sku,
        totalSales: parseFloat(p.totalSales) || 0,
        totalQuantity: parseInt(p.totalQuantity) || 0,
        averageRating: null,
        category: p.category
      })),
      productsByCategory: categoryData.map(c => ({
        categoryId: parseInt(c.categoryId),
        categoryName: c.categoryName,
        productCount: parseInt(c.productCount) || 0,
        averagePrice: parseFloat(c.averagePrice) || 0,
        totalRevenue: parseFloat(c.totalRevenue) || 0
      })),
      inventoryTurnover: turnoverData.map(p => ({
        productId: parseInt(p.productId),
        productName: p.productName,
        currentStock: parseInt(p.currentStock) || 0,
        soldQuantity: parseInt(p.soldQuantity) || 0,
        turnoverRate: parseFloat(p.turnoverRate) || 0
      }))
    }
  } catch (error) {
    console.error('Error generating product analytics:', error)
    return {
      topSellingProducts: [],
      lowPerformingProducts: [],
      productsByCategory: [],
      inventoryTurnover: []
    }
  }
}

export const userAnalytics = async ({ startDate, endDate }) => {
  requireAuth({ roles: ['ADMIN'] })

  try {
    const { startDate: start, endDate: end } = getDateRange(startDate, endDate)
    
    // Get previous period for growth calculation
    const periodDiff = end.getTime() - start.getTime()
    const prevStart = new Date(start.getTime() - periodDiff)

    const [userStats, prevUserStats, topCustomersData, registrationData, activityData] = await Promise.all([
      // Current user stats
      db.user.count({
        where: { createdAt: { lte: end } }
      }),
      
      // Previous period user count for growth
      db.user.count({
        where: { createdAt: { lte: prevStart } }
      }),
      
      // Top customers by spending
      db.$queryRaw`
        SELECT 
          u.id as userId,
          u.name as userName,
          u.email as userEmail,
          COUNT(o.id) as totalOrders,
          SUM(o.totalAmount) as totalSpent,
          AVG(o.totalAmount) as averageOrderValue,
          MAX(o.createdAt) as lastOrderDate
        FROM "User" u
        JOIN "Order" o ON o.userId = u.id
        WHERE o.createdAt >= ${start} AND o.createdAt <= ${end}
          AND o.status IN ('DELIVERED', 'COMPLETED')
        GROUP BY u.id, u.name, u.email
        ORDER BY totalSpent DESC
        LIMIT 10
      `,
      
      // User registrations over time
      db.$queryRaw`
        SELECT 
          DATE(createdAt) as date,
          COUNT(*) as newUsers
        FROM "User"
        WHERE createdAt >= ${start} AND createdAt <= ${end}
        GROUP BY DATE(createdAt)
        ORDER BY date DESC
      `,
      
      // User activity (users who placed orders)
      db.$queryRaw`
        SELECT 
          DATE(o.createdAt) as date,
          COUNT(DISTINCT o.userId) as activeUsers,
          COUNT(o.id) as orders,
          SUM(o.totalAmount) as revenue
        FROM "Order" o
        WHERE o.createdAt >= ${start} AND o.createdAt <= ${end}
        GROUP BY DATE(o.createdAt)
        ORDER BY date DESC
      `
    ])

    const newUsersThisMonth = await db.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    })

    const activeUsers = await db.user.count({
      where: {
        updatedAt: { gte: start }
      }
    })

    const userGrowth = prevUserStats > 0 ? ((userStats - prevUserStats) / prevUserStats) * 100 : 0

    return {
      totalUsers: userStats,
      newUsersThisMonth,
      activeUsers,
      userGrowth,
      topCustomers: topCustomersData.map(c => ({
        userId: parseInt(c.userId),
        userName: c.userName,
        userEmail: c.userEmail,
        totalOrders: parseInt(c.totalOrders),
        totalSpent: parseFloat(c.totalSpent),
        averageOrderValue: parseFloat(c.averageOrderValue),
        lastOrderDate: c.lastOrderDate
      })),
      usersByRegistrationDate: registrationData.map(r => ({
        date: r.date.toISOString().split('T')[0],
        newUsers: parseInt(r.newUsers)
      })),
      userActivity: activityData.map(a => ({
        date: a.date.toISOString().split('T')[0],
        activeUsers: parseInt(a.activeUsers),
        orders: parseInt(a.orders),
        revenue: parseFloat(a.revenue) || 0
      }))
    }
  } catch (error) {
    console.error('Error generating user analytics:', error)
    return {
      totalUsers: 0,
      newUsersThisMonth: 0,
      activeUsers: 0,
      userGrowth: 0,
      topCustomers: [],
      usersByRegistrationDate: [],
      userActivity: []
    }
  }
}

export const overallAnalytics = async ({ startDate, endDate }) => {
  requireAuth({ roles: ['ADMIN'] })

  try {
    const [salesData, productData, userData] = await Promise.all([
      salesReport({ startDate, endDate }),
      productAnalytics({ startDate, endDate }),
      userAnalytics({ startDate, endDate })
    ])

    // Calculate additional metrics
    const conversionRate = userData.totalUsers > 0 ? (salesData.totalOrders / userData.totalUsers) * 100 : 0
    const averageSessionValue = salesData.totalOrders > 0 ? salesData.totalRevenue / salesData.totalOrders : 0
    
    // Calculate return customer rate (customers with more than 1 order)
    const returnCustomerCount = userData.topCustomers.filter(c => c.totalOrders > 1).length
    const returnCustomerRate = userData.topCustomers.length > 0 ? (returnCustomerCount / userData.topCustomers.length) * 100 : 0

    return {
      salesReport: salesData,
      productAnalytics: productData,
      userAnalytics: userData,
      conversionRate,
      averageSessionValue,
      returnCustomerRate
    }
  } catch (error) {
    console.error('Error generating overall analytics:', error)
    return {
      salesReport: await salesReport({ startDate, endDate }),
      productAnalytics: await productAnalytics({ startDate, endDate }),
      userAnalytics: await userAnalytics({ startDate, endDate }),
      conversionRate: 0,
      averageSessionValue: 0,
      returnCustomerRate: 0
    }
  }
}
