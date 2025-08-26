import { db } from 'src/lib/db'

/**
 * Database health check endpoint for detailed database monitoring
 * GET /api/db-health
 */
export const handler = async (event, context) => {
  try {
    const startTime = Date.now()
    
    // Test basic database connection
    await db.$queryRaw`SELECT 1 as test`
    
    const connectionTime = Date.now() - startTime

    // Test key tables exist and are accessible
    const checks = {
      users: false,
      products: false,
      orders: false,
      categories: false
    }

    try {
      await db.user.findFirst()
      checks.users = true
    } catch (error) {
      console.log('Users table check failed:', error.message)
    }

    try {
      await db.product.findFirst()
      checks.products = true
    } catch (error) {
      console.log('Products table check failed:', error.message)
    }

    try {
      await db.order.findFirst()
      checks.orders = true
    } catch (error) {
      console.log('Orders table check failed:', error.message)
    }

    try {
      await db.category.findFirst()
      checks.categories = true
    } catch (error) {
      console.log('Categories table check failed:', error.message)
    }

    const allTablesHealthy = Object.values(checks).every(check => check === true)

    const health = {
      status: allTablesHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        connectionTime: `${connectionTime}ms`,
        tables: checks
      }
    }

    return {
      statusCode: allTablesHealthy ? 200 : 206, // 206 = Partial Content for degraded
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(health)
    }
  } catch (error) {
    return {
      statusCode: 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: {
          connected: false,
          error: error.message
        }
      })
    }
  }
}
