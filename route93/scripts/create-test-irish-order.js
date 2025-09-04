import { db } from '../api/src/lib/db'

async function createTestIrishOrder() {
  try {
    console.log('🇮🇪 Creating test Irish order...')

    // First, get or create a test Irish user
    let testUser = await db.user.findFirst({
      where: { email: 'test-irish@route93.ie' }
    })

    if (!testUser) {
      testUser = await db.user.create({
        data: {
          email: 'test-irish@route93.ie',
          name: 'Test Irish Customer',
          phone: '+353 1 234 5678',
          role: 'CLIENT',
          hashedPassword: 'test-hash',
          salt: 'test-salt'
        }
      })
      console.log('✅ Created test Irish user')
    } else {
      console.log('📋 Using existing test Irish user')
    }

    // Create Irish billing and shipping addresses
    const irishAddress = await db.address.create({
      data: {
        firstName: 'Seán',
        lastName: 'Murphy',
        company: 'Dublin Tech Ltd',
        address1: '123 Grafton Street',
        address2: 'Unit 4B',
        city: 'Dublin',
        state: 'Dublin',
        zipCode: 'D02 XY45',
        country: 'IE',
        phone: '+353 1 234 5678',
        isDefault: true,
        userId: testUser.id
      }
    })
    console.log('✅ Created Irish address')

    // Get some products to add to the order
    const products = await db.product.findMany({
      where: { status: 'ACTIVE' },
      include: { category: true },
      take: 3
    })

    if (products.length === 0) {
      throw new Error('No active products found to create test order')
    }

    // Calculate order totals (including VAT for Irish customer)
    let subtotal = 0
    let vatAmount = 0
    const orderItems = []

    products.forEach((product, index) => {
      const quantity = index + 1 // 1, 2, 3 quantities
      const itemPrice = product.salePrice || product.price
      const itemTotal = itemPrice * quantity
      
      // Calculate VAT (23% standard rate for Irish customers)
      const vatRate = product.category?.vatRate || 23.0
      const itemVat = (itemTotal * vatRate) / 100
      
      subtotal += itemTotal
      vatAmount += itemVat
      
      orderItems.push({
        productId: product.id,
        quantity: quantity,
        price: itemPrice,
        totalPrice: itemTotal
      })

      console.log(`📦 Product: ${product.name} - €${itemPrice} x ${quantity} = €${itemTotal.toFixed(2)} (VAT: €${itemVat.toFixed(2)} at ${vatRate}%)`)
    })

    const shippingCost = 9.99
    const shippingVat = (shippingCost * 23) / 100 // 23% VAT on shipping
    const totalAmount = subtotal + vatAmount + shippingCost + shippingVat

    console.log(`💰 Subtotal: €${subtotal.toFixed(2)}`)
    console.log(`💶 VAT Amount: €${vatAmount.toFixed(2)}`)
    console.log(`🚚 Shipping: €${shippingCost.toFixed(2)} (+ €${shippingVat.toFixed(2)} VAT)`)
    console.log(`💳 Total: €${totalAmount.toFixed(2)}`)

    // Create the order
    const orderNumber = `ORD-${Date.now()}-TEST-IE`
    const order = await db.order.create({
      data: {
        orderNumber,
        status: 'DELIVERED', // Set as delivered so it will be processed for tax
        totalAmount,
        discountAmount: 0,
        shippingCost: shippingCost + shippingVat, // Include VAT in shipping cost
        taxAmount: vatAmount + shippingVat,
        userId: testUser.id,
        shippingAddressId: irishAddress.id,
        billingAddressId: irishAddress.id,
        deliveredAt: new Date(),
        orderItems: {
          create: orderItems
        }
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: { category: true }
            }
          }
        },
        billingAddress: true
      }
    })

    console.log(`✅ Created test Irish order: ${orderNumber}`)
    console.log(`📋 Order ID: ${order.id}`)

    return order

  } catch (error) {
    console.error('❌ Error creating test Irish order:', error)
    throw error
  }
}

export default async function main() {
  try {
    const order = await createTestIrishOrder()
    console.log('\n🎉 Test Irish order created successfully!')
    console.log('Now you can run the tax calculation to see VAT being calculated for Irish customers.')
    console.log('\nNext steps:')
    console.log('1. Go to Tax Management in admin')
    console.log('2. Click "Recalculate Tax Records"')
    console.log('3. You should see VAT being calculated for the Irish order')
    
    return order
  } catch (error) {
    console.error('❌ Script failed:', error)
    throw error
  } finally {
    await db.$disconnect()
  }
}
