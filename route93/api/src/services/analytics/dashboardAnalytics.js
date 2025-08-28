import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'

// Helper function to get date range
const getDateRange = (startDate, endDate) => {
  const now = new Date()
  const defaultEndDate = endDate ? new Date(endDate) : now
  const defaultStartDate = startDate ? new Date(startDate) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
  
  return { startDate: defaultStartDate, endDate: defaultEndDate }
}

export const getDashboardData = async ({ startDate, endDate, period = '30d' }) => {
  requireAuth({ roles: ['ADMIN'] })

  try {
    const { startDate: start, endDate: end } = getDateRange(startDate, endDate)
    
    // Get previous period for growth calculation
    const periodDiff = end.getTime() - start.getTime()
    const prevStart = new Date(start.getTime() - periodDiff)
    const prevEnd = start

    const [
      currentStats,
      previousStats,
      dailySalesData,
      topCategoriesData,
      topProductsData,
      userStats,
      prevUserStats,
      topCustomersData,
      userActivityData
    ] = await Promise.all([
      // Current period revenue and orders
      db.order.aggregate({
        where: {
          createdAt: { gte: start, lte: end },
          status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] }
        },
        _sum: { totalAmount: true },
        _count: true
      }),
      
      // Previous period for growth calculation
      db.order.aggregate({
        where: {
          createdAt: { gte: prevStart, lte: prevEnd },
          status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] }
        },
        _sum: { totalAmount: true },
        _count: true
      }),
      
      // Daily sales breakdown
      db.$queryRaw`
        SELECT 
          DATE("createdAt") as date,
          SUM("totalAmount") as revenue,
          COUNT(*) as orders,
          COUNT(DISTINCT "userId") as customers
        FROM orders 
        WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
          AND status IN ('CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED')
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
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
        FROM categories c
        JOIN products p ON p."categoryId" = c.id
        JOIN order_items oi ON oi."productId" = p.id
        JOIN orders o ON o.id = oi."orderId"
        WHERE o."createdAt" >= ${start} AND o."createdAt" <= ${end}
          AND o.status IN ('CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED')
        GROUP BY c.id, c.name
        ORDER BY revenue DESC
        LIMIT 10
      `,
      
      // Top selling products
      db.$queryRaw`
        SELECT 
          p.id as productId,
          p.name as productName,
          p.sku,
          SUM(oi.price * oi.quantity) as totalSales,
          SUM(oi.quantity) as totalQuantity,
          COALESCE(c.name, 'Uncategorized') as category
        FROM products p
        LEFT JOIN categories c ON c.id = p."categoryId"
        JOIN order_items oi ON oi."productId" = p.id
        JOIN orders o ON o.id = oi."orderId"
        WHERE o."createdAt" >= ${start} AND o."createdAt" <= ${end}
          AND o.status IN ('CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED')
          AND p.name IS NOT NULL
        GROUP BY p.id, p.name, p.sku, c.name
        ORDER BY totalSales DESC
        LIMIT 10
      `,
      
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
          SUM(o."totalAmount") as totalSpent,
          AVG(o."totalAmount") as averageOrderValue,
          MAX(o."createdAt") as lastOrderDate
        FROM users u
        JOIN orders o ON o."userId" = u.id
        WHERE o."createdAt" >= ${start} AND o."createdAt" <= ${end}
          AND o.status IN ('CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED')
        GROUP BY u.id, u.name, u.email
        ORDER BY totalSpent DESC
        LIMIT 10
      `,
      
      // User activity (users who placed orders)
      db.$queryRaw`
        SELECT 
          DATE(o."createdAt") as date,
          COUNT(DISTINCT o."userId") as activeUsers,
          COUNT(o.id) as orders,
          SUM(o."totalAmount") as revenue
        FROM orders o
        WHERE o."createdAt" >= ${start} AND o."createdAt" <= ${end}
          AND o.status IN ('CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED')
        GROUP BY DATE(o."createdAt")
        ORDER BY date ASC
        LIMIT 30
      `
    ])

    const totalRevenue = currentStats._sum.totalAmount || 0
    const totalOrders = currentStats._count || 0
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    const prevRevenue = previousStats._sum.totalAmount || 0
    const prevOrders = previousStats._count || 0

    const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0
    const ordersGrowth = prevOrders > 0 ? ((totalOrders - prevOrders) / prevOrders) * 100 : 0

    // Calculate conversion rate (orders per user)
    const conversionRate = userStats > 0 ? (totalOrders / userStats) * 100 : 0

    // Get additional user metrics
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

    // Format daily sales data
    const dailySales = dailySalesData.map(day => ({
      date: day.date.toISOString().split('T')[0],
      revenue: parseFloat(day.revenue) || 0,
      orders: parseInt(day.orders) || 0,
      customers: parseInt(day.customers) || 0
    }))

    // Format categories data
    const topCategories = topCategoriesData.map(cat => ({
      categoryId: parseInt(cat.categoryId),
      categoryName: cat.categoryName,
      revenue: parseFloat(cat.revenue) || 0,
      orders: parseInt(cat.orders) || 0,
      products: parseInt(cat.products) || 0
    }))

    // Format products data
    const topSellingProducts = topProductsData.map(p => ({
      productId: parseInt(p.productId),
      productName: p.productName || 'Unknown Product',
      sku: p.sku || 'N/A',
      totalSales: parseFloat(p.totalSales) || 0,
      totalQuantity: parseInt(p.totalQuantity) || 0,
      category: p.category || 'Uncategorized'
    }))

    // Format customers data
    const topCustomers = topCustomersData.map(c => ({
      userId: parseInt(c.userId),
      userName: c.userName,
      userEmail: c.userEmail,
      totalOrders: parseInt(c.totalOrders),
      totalSpent: parseFloat(c.totalSpent),
      averageOrderValue: parseFloat(c.averageOrderValue),
      lastOrderDate: c.lastOrderDate
    }))

    // Format user activity data
    const userActivity = userActivityData.map(a => ({
      date: a.date.toISOString().split('T')[0],
      activeUsers: parseInt(a.activeUsers),
      orders: parseInt(a.orders),
      revenue: parseFloat(a.revenue) || 0
    }))

    // Calculate return customer rate
    const returnCustomerCount = topCustomers.filter(c => c.totalOrders > 1).length
    const returnCustomerRate = topCustomers.length > 0 ? (returnCustomerCount / topCustomers.length) * 100 : 0

    return {
      salesData: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        revenueGrowth,
        ordersGrowth,
        conversionRate,
        dailySales,
        topCategories
      },
      productData: {
        topSellingProducts,
        totalProducts: await db.product.count({ where: { status: 'ACTIVE' } }),
        averagePrice: await db.product.aggregate({
          where: { status: 'ACTIVE' },
          _avg: { price: true }
        }).then(result => result._avg.price || 0)
      },
      userData: {
        totalUsers: userStats,
        newUsersThisMonth,
        activeUsers,
        userGrowth,
        topCustomers,
        userActivity,
        returnCustomerRate
      }
    }
  } catch (error) {
    console.error('Error generating dashboard data:', error)
    return {
      salesData: {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        revenueGrowth: 0,
        ordersGrowth: 0,
        conversionRate: 0,
        dailySales: [],
        topCategories: []
      },
      productData: {
        topSellingProducts: [],
        totalProducts: 0,
        averagePrice: 0
      },
      userData: {
        totalUsers: 0,
        newUsersThisMonth: 0,
        activeUsers: 0,
        userGrowth: 0,
        topCustomers: [],
        userActivity: [],
        returnCustomerRate: 0
      }
    }
  }
}
