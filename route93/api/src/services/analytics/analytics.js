import { db } from 'src/lib/db'

// Helper function to get date range
const getDateRange = (startDate, endDate) => {
  const now = new Date()
  const defaultEndDate = endDate ? new Date(endDate) : now
  const defaultStartDate = startDate ? new Date(startDate) : new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
  
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

  try {
    const { startDate: start, endDate: end } = getDateRange(startDate, endDate)
    
    // Get previous period for growth calculation
    const periodDiff = end.getTime() - start.getTime()
    const prevStart = new Date(start.getTime() - periodDiff)
    const prevEnd = start

    // Current period stats
    const [currentStats, previousStats, recentOrdersData] = await Promise.all([
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

    // Generate daily sales data using Prisma instead of raw SQL
    const dailySalesData = await db.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: start, lte: end },
        status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] }
      },
      _sum: { totalAmount: true },
      _count: true
    })


    // Generate monthly sales data
    const monthlyData = {}
    dailySalesData.forEach(day => {
      const month = day.createdAt.toISOString().substring(0, 7) // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, orders: 0, customers: new Set() }
      }
      monthlyData[month].revenue += day._sum.totalAmount || 0
      monthlyData[month].orders += day._count || 0
    })

    const monthlySales = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      orders: data.orders,
      customers: data.customers.size || 0
    }))

    // Get top categories using Prisma
    const topCategoriesData = await db.orderItem.findMany({
      where: {
        order: {
          createdAt: { gte: start, lte: end },
          status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] }
        }
      },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    })


    // Process category data
    const categoryStats = {}
    topCategoriesData.forEach(item => {
      const categoryName = item.product.category?.name || 'Uncategorized'
      if (!categoryStats[categoryName]) {
        categoryStats[categoryName] = { revenue: 0, orders: new Set(), products: new Set() }
      }
      categoryStats[categoryName].revenue += item.price * item.quantity
      categoryStats[categoryName].orders.add(item.orderId)
      categoryStats[categoryName].products.add(item.productId)
    })

    const topCategories = Object.entries(categoryStats)
      .map(([name, stats]) => ({
        categoryId: 0, // We don't have category ID in this approach
        categoryName: name,
        revenue: stats.revenue,
        orders: stats.orders.size,
        products: stats.products.size
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)


    // Format daily sales data
    const dailySales = dailySalesData.map(day => ({
      date: day.createdAt.toISOString().split('T')[0],
      revenue: day._sum.totalAmount || 0,
      orders: day._count || 0,
      customers: 0 // We'll need a separate query for this
    }))


    const result = {
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

    return result
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

  try {
    const { startDate: start, endDate: end } = getDateRange(startDate, endDate)

    // Get top selling products using Prisma
    const topSellingData = await db.orderItem.findMany({
      where: {
        order: {
          createdAt: { gte: start, lte: end },
          status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] }
        }
      },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    })


    // Process product data
    const productStats = {}
    topSellingData.forEach(item => {
      const productId = item.productId
      if (!productStats[productId]) {
        productStats[productId] = {
          productId,
          productName: item.product.name,
          sku: item.product.sku,
          totalSales: 0,
          totalQuantity: 0,
          category: item.product.category?.name || 'Uncategorized'
        }
      }
      productStats[productId].totalSales += item.price * item.quantity
      productStats[productId].totalQuantity += item.quantity
    })

    const topSellingProducts = Object.values(productStats)
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, limit)

    // Get low performing products (products with no sales in the period)
    const allProducts = await db.product.findMany({
      where: { status: 'ACTIVE' },
      include: { category: true }
    })

    const lowPerformingProducts = allProducts
      .filter(product => !productStats[product.id])
      .map(product => ({
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        totalSales: 0,
        totalQuantity: 0,
        category: product.category?.name || 'Uncategorized'
      }))
      .slice(0, limit)

    // Get products by category
    const productsByCategory = await db.category.findMany({
      include: {
        products: {
          where: { status: 'ACTIVE' }
        }
      }
    })

    const categoryProducts = productsByCategory.map(cat => ({
      categoryId: cat.id,
      categoryName: cat.name,
      productCount: cat.products.length,
      averagePrice: cat.products.length > 0 
        ? cat.products.reduce((sum, p) => sum + p.price, 0) / cat.products.length 
        : 0,
      totalRevenue: 0 // Would need additional query to calculate
    }))


    const result = {
      topSellingProducts,
      lowPerformingProducts,
      productsByCategory: categoryProducts,
      inventoryTurnover: [] // Would need additional query to calculate
    }

    return result
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

  try {
    const { startDate: start, endDate: end } = getDateRange(startDate, endDate)
    
    // Get previous period for growth calculation
    const periodDiff = end.getTime() - start.getTime()
    const prevStart = new Date(start.getTime() - periodDiff)

    const [userStats, prevUserStats, topCustomersData] = await Promise.all([
      // Current user stats
      db.user.count({
        where: { createdAt: { lte: end } }
      }),
      
      // Previous period user count for growth
      db.user.count({
        where: { createdAt: { lte: prevStart } }
      }),
      
      // Top customers by spending
      db.order.groupBy({
        by: ['userId'],
        where: {
          createdAt: { gte: start, lte: end },
          status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] }
        },
        _sum: { totalAmount: true },
        _count: true
      })
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

    // Process top customers data
    const topCustomers = await Promise.all(
      topCustomersData.slice(0, 10).map(async (customer) => {
        const user = await db.user.findUnique({
          where: { id: customer.userId },
          select: { name: true, email: true }
        })
        
        return {
          userId: customer.userId,
          userName: user?.name || 'Unknown User',
          userEmail: user?.email || 'No Email',
          totalOrders: customer._count,
          totalSpent: customer._sum.totalAmount || 0,
          averageOrderValue: customer._count > 0 ? (customer._sum.totalAmount || 0) / customer._count : 0,
          lastOrderDate: null // Would need additional query
        }
      })
    )


    // Calculate return customer rate (customers with more than 1 order)
    const returnCustomerCount = topCustomers.filter(c => c.totalOrders > 1).length
    const returnCustomerRate = topCustomers.length > 0 ? (returnCustomerCount / topCustomers.length) * 100 : 0


    const result = {
      totalUsers: userStats,
      newUsersThisMonth,
      activeUsers,
      userGrowth,
      topCustomers,
      usersByRegistrationDate: [], // Would need additional query
      userActivity: [], // Would need additional query
      returnCustomerRate
    }

    return result
  } catch (error) {
    console.error('Error generating user analytics:', error)
    return {
      totalUsers: 0,
      newUsersThisMonth: 0,
      activeUsers: 0,
      userGrowth: 0,
      topCustomers: [],
      usersByRegistrationDate: [],
      userActivity: [],
      returnCustomerRate: 0
    }
  }
}

export const overallAnalytics = async ({ startDate, endDate }) => {

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

    const result = {
      salesReport: salesData,
      productAnalytics: productData,
      userAnalytics: userData,
      conversionRate,
      averageSessionValue,
      returnCustomerRate
    }

    return result
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

export const dashboardData = async ({ startDate, endDate, period = 'daily' }) => {

  try {
    const [salesData, productData, userData] = await Promise.all([
      salesReport({ startDate, endDate, period }),
      productAnalytics({ startDate, endDate }),
      userAnalytics({ startDate, endDate })
    ])

    const result = {
      salesData,
      productData,
      userData
    }

    return result
  } catch (error) {
    console.error('Error generating dashboard data:', error)
    // Return fallback data to prevent null return
    return {
      salesData: await salesReport({ startDate, endDate, period }),
      productData: await productAnalytics({ startDate, endDate }),
      userData: await userAnalytics({ startDate, endDate })
    }
  }
}
