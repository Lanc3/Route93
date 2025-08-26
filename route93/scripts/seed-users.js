import { db } from 'api/src/lib/db'
import { hashPassword } from '@redwoodjs/auth-dbauth-api'

export default async () => {
  try {
    console.info('🔑 Creating test users for authentication...')

    // Create Admin User
    const [adminHashedPassword, adminSalt] = hashPassword('admin123')
    const adminUser = await db.user.upsert({
      where: { email: 'admin@route93.com' },
      update: {
        hashedPassword: adminHashedPassword,
        salt: adminSalt,
        role: 'ADMIN'
      },
      create: {
        email: 'admin@route93.com',
        name: 'Admin User',
        role: 'ADMIN',
        phone: '+1-555-0123',
        hashedPassword: adminHashedPassword,
        salt: adminSalt
      }
    })

    // Create Test Customer
    const [customerHashedPassword, customerSalt] = hashPassword('customer123')
    const customerUser = await db.user.upsert({
      where: { email: 'customer@route93.com' },
      update: {
        hashedPassword: customerHashedPassword,
        salt: customerSalt,
        role: 'CLIENT'
      },
      create: {
        email: 'customer@route93.com',
        name: 'John Customer',
        role: 'CLIENT',
        phone: '+1-555-0456',
        hashedPassword: customerHashedPassword,
        salt: customerSalt
      }
    })

    console.info('✅ Test users created successfully!')
    console.info(`\n🔑 Test Accounts:`)
    console.info(`   Admin: admin@route93.com (password: admin123)`)
    console.info(`   Customer: customer@route93.com (password: customer123)`)

  } catch (error) {
    console.error('❌ Error creating test users:', error)
  }
}
