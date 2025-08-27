const { PrismaClient } = require('@prisma/client')

async function getDatabaseUrl() {
  try {
    console.log('🔍 Current DATABASE_URL:')
    console.log(process.env.DATABASE_URL)
    console.log('\n📊 Database connection details:')
    
    const db = new PrismaClient()
    
    // Get database info
    const result = await db.$queryRaw`SELECT current_database() as db_name, current_user as user, inet_server_addr() as host, inet_server_port() as port`
    console.log('Database Info:', result[0])
    
    await db.$disconnect()
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

getDatabaseUrl()
