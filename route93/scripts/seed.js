import { db } from 'api/src/lib/db'
import { hashPassword } from '@redwoodjs/auth-dbauth-api'

// Manually apply seeds via the `yarn rw prisma db seed` command.
//
// Seeds automatically run the first time you run the `yarn rw prisma migrate dev`
// command and every time you run the `yarn rw prisma migrate reset` command.
//
// See https://redwoodjs.com/docs/database-seeds for more info

export default async () => {
  try {
    console.info('🌱 Seeding database with Route93 e-commerce data...')

    // Create Categories (using upsert to handle existing data)
    await Promise.all([
      db.category.upsert({
        where: { slug: 'electronics' },
        update: {},
        create: {
          name: 'Electronics',
          description: 'Latest electronic devices and gadgets',
          slug: 'electronics',
          image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'
        }
      }),
      db.category.upsert({
        where: { slug: 'clothing' },
        update: {},
        create: {
          name: 'Clothing',
          description: 'Fashion and apparel for all occasions',
          slug: 'clothing',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'
        }
      }),
      db.category.upsert({
        where: { slug: 'home-garden' },
        update: {},
        create: {
          name: 'Home & Garden',
          description: 'Everything for your home and garden',
          slug: 'home-garden',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
        }
      }),
      db.category.upsert({
        where: { slug: 'sports-outdoor' },
        update: {},
        create: {
          name: 'Sports & Outdoor',
          description: 'Gear for sports and outdoor activities',
          slug: 'sports-outdoor',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
        }
      })
    ])

    // Create Collections
    const collections = await db.collection.createMany({
      data: [
        {
          name: 'Featured Products',
          description: 'Our handpicked featured products',
          slug: 'featured',
          image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'
        },
        {
          name: 'New Arrivals',
          description: 'Latest products in our store',
          slug: 'new-arrivals',
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'
        },
        {
          name: 'Best Sellers',
          description: 'Most popular products',
          slug: 'best-sellers',
          image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400'
        }
      ]
    })

    // Create Products
    const products = await db.product.createMany({
      data: [
        {
          name: 'Wireless Bluetooth Headphones',
          description: 'Premium quality wireless headphones with noise cancellation',
          price: 199.99,
          salePrice: 149.99,
          sku: 'WBH-001',
          slug: 'wireless-bluetooth-headphones',
          status: 'ACTIVE',
          inventory: 50,
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400'
          ]),
          tags: JSON.stringify(['electronics', 'audio', 'wireless', 'bluetooth']),
          categoryId: 1
        },
        {
          name: 'Premium Cotton T-Shirt',
          description: 'Comfortable 100% organic cotton t-shirt',
          price: 29.99,
          sku: 'PCT-001',
          slug: 'premium-cotton-t-shirt',
          status: 'ACTIVE',
          inventory: 100,
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
            'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400'
          ]),
          tags: JSON.stringify(['clothing', 'cotton', 'casual', 'comfortable']),
          categoryId: 2
        },
        {
          name: 'Smart Home Security Camera',
          description: 'HD security camera with night vision and mobile app',
          price: 129.99,
          salePrice: 99.99,
          sku: 'SHSC-001',
          slug: 'smart-home-security-camera',
          status: 'ACTIVE',
          inventory: 25,
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
            'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400'
          ]),
          tags: JSON.stringify(['electronics', 'security', 'smart-home', 'camera']),
          categoryId: 3
        },
        {
          name: 'Running Shoes',
          description: 'Lightweight running shoes with superior comfort',
          price: 89.99,
          sku: 'RS-001',
          slug: 'running-shoes',
          status: 'ACTIVE',
          inventory: 75,
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400'
          ]),
          tags: JSON.stringify(['sports', 'running', 'shoes', 'comfortable']),
          categoryId: 4
        },
        {
          name: 'Smartphone Case',
          description: 'Protective case with premium materials',
          price: 24.99,
          salePrice: 19.99,
          sku: 'SC-001',
          slug: 'smartphone-case',
          status: 'ACTIVE',
          inventory: 200,
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1601593346740-925612772716?w=400'
          ]),
          tags: JSON.stringify(['electronics', 'accessories', 'protection', 'smartphone']),
          categoryId: 1
        },
        {
          name: 'Denim Jeans',
          description: 'Classic fit denim jeans for everyday wear',
          price: 59.99,
          sku: 'DJ-001',
          slug: 'denim-jeans',
          status: 'ACTIVE',
          inventory: 80,
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
            'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400'
          ]),
          tags: JSON.stringify(['clothing', 'denim', 'jeans', 'casual']),
          categoryId: 2
        }
      ]
    })

    // Create Admin User
    const [adminHashedPassword, adminSalt] = hashPassword('admin123')
    const adminUser = await db.user.upsert({
      where: { email: 'admin@route93.com' },
      update: {
        hashedPassword: adminHashedPassword,
        salt: adminSalt
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
        salt: customerSalt
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

    // Create Address for Customer
    const customerAddress = await db.address.create({
      data: {
        userId: customerUser.id,
        firstName: 'John',
        lastName: 'Customer',
        address1: '123 Main Street',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'US',
        phone: '+1-555-0456',
        isDefault: true
      }
    })

    console.info('✅ Database seeded successfully!')
    console.info(`📊 Created:`)
    console.info(`   - 4 Categories`)
    console.info(`   - 3 Collections`)
    console.info(`   - 6 Products`)
    console.info(`   - 2 Users (1 Admin, 1 Customer)`)
    console.info(`   - 1 Address`)
    console.info(`\n🔑 Test Accounts:`)
    console.info(`   Admin: admin@route93.com (password: admin123)`)
    console.info(`   Customer: customer@route93.com (password: customer123)`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
  }
}
