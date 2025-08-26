import { db } from 'api/src/lib/db'

export default async () => {
  try {
    console.info('🔍 Checking users in database...')

    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        hashedPassword: true,
        salt: true,
        createdAt: true,
      }
    })

    console.info(`Found ${users.length} users:`)
    users.forEach(user => {
      console.info(`  - ID: ${user.id}`)
      console.info(`    Email: ${user.email}`)
      console.info(`    Name: ${user.name}`)
      console.info(`    Role: ${user.role}`)
      console.info(`    Has Password: ${user.hashedPassword ? 'Yes' : 'No'}`)
      console.info(`    Has Salt: ${user.salt ? 'Yes' : 'No'}`)
      console.info(`    Created: ${user.createdAt}`)
      console.info('    ---')
    })

  } catch (error) {
    console.error('❌ Error checking users:', error)
  }
}
