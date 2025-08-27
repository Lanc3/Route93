const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  const db = new PrismaClient()
  
  try {
    console.log('🔍 Testing database connection...')
    
    // Test basic connection
    const result = await db.$queryRaw`SELECT 1 as test`
    console.log('✅ Basic query successful:', result)
    
    // Test table access
    const userCount = await db.user.count()
    console.log('✅ User table accessible, count:', userCount)
    
    // Test product table
    const productCount = await db.product.count()
    console.log('✅ Product table accessible, count:', productCount)
    
    console.log('🎉 Database connection test completed successfully!')
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

testConnection()
