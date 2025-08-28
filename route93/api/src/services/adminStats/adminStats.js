import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'

export const adminStats = async () => {
  requireAuth({ roles: ['ADMIN'] })
  try {
    // Get all counts in parallel for better performance
    const [
      productsCount,
      ordersCount,
      usersCount,
      categoriesCount,
      collectionsCount,
      recentOrdersCount,
      lowStockProducts,
      activeUsersCount,
      totalRevenueResult,
      pendingOrdersCount,
      processingOrdersCount,
      shippedOrdersCount,
      deliveredOrdersCount,
      clientsCount,
      adminsCount,
      activeTodayCount
    ] = await Promise.all([
      // Total products (all products for admin dashboard)
      db.product.count(),
      
      // Total orders
      db.order.count(),
      
      // Total users
      db.user.count(),
      
      // Total categories
      db.category.count(),
      
      // Total collections
      db.collection.count({
        where: { isActive: true }
      }),
      
      // Recent orders (last 30 days)
      db.order.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
          }
        }
      }),
      
      // Low stock products (assuming inventory < 10 is low)
      db.product.count({
        where: {
          inventory: {
            lt: 10
          },
          status: 'ACTIVE'
        }
      }),
      
      // Active users (logged in within last 30 days)
      db.user.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
          }
        }
      }),
      
      // Total revenue from completed orders
      db.order.aggregate({
        where: {
          status: {
            in: ['DELIVERED', 'COMPLETED']
          }
        },
        _sum: {
          totalAmount: true
        }
      }),
      
      // Pending orders count
      db.order.count({
        where: { status: 'PENDING' }
      }),
      
      // Processing orders count (including CONFIRMED and PROCESSING)
      db.order.count({
        where: { 
          status: {
            in: ['CONFIRMED', 'PROCESSING']
          }
        }
      }),
      
      // Shipped orders count
      db.order.count({
        where: { status: 'SHIPPED' }
      }),
      
      // Delivered orders count
      db.order.count({
        where: { status: 'DELIVERED' }
      }),
      
      // Clients count (users with CLIENT role)
      db.user.count({
        where: { role: 'CLIENT' }
      }),
      
      // Admins count (users with ADMIN role)
      db.user.count({
        where: { role: 'ADMIN' }
      }),
      
      // Active today count (users who were active today)
      db.user.count({
        where: {
          updatedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)) // Start of today
          }
        }
      })
    ])

    const result = {
      productsCount,
      ordersCount,
      usersCount,
      categoriesCount,
      collectionsCount,
      recentOrdersCount,
      lowStockCount: lowStockProducts,
      activeUsersCount,
      totalRevenue: totalRevenueResult._sum.totalAmount || 0.0,
      pendingOrdersCount,
      processingOrdersCount,
      shippedOrdersCount,
      deliveredOrdersCount,
      clientsCount,
      adminsCount,
      activeTodayCount
    }
    
    return result
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    
    // Return default values if there's an error
    return {
      productsCount: 0,
      ordersCount: 0,
      usersCount: 0,
      categoriesCount: 0,
      collectionsCount: 0,
      recentOrdersCount: 0,
      lowStockCount: 0,
      activeUsersCount: 0,
      totalRevenue: 0.0,
      pendingOrdersCount: 0,
      processingOrdersCount: 0,
      shippedOrdersCount: 0,
      deliveredOrdersCount: 0,
      clientsCount: 0,
      adminsCount: 0,
      activeTodayCount: 0
    }
  }
}
