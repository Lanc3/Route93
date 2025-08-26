import { db } from 'src/lib/db'

/**
 * Health check endpoint for monitoring application status
 * GET /api/health
 */
export const handler = async (event, context) => {
  try {
    // Basic health check
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0'
    }

    // Database health check
    try {
      await db.$queryRaw`SELECT 1`
      health.database = 'connected'
    } catch (dbError) {
      health.database = 'disconnected'
      health.status = 'unhealthy'
      health.error = 'Database connection failed'
    }

    // Return appropriate status code
    const statusCode = health.status === 'healthy' ? 200 : 503

    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(health)
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message
      })
    }
  }
}
