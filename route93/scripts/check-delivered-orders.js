import { db } from '../api/src/lib/db'

async function checkDeliveredOrders() {
  try {
    console.log('🔍 Checking delivered orders...')

    // Get all delivered/completed orders
    const deliveredOrders = await db.order.findMany({
      where: {
        status: { in: ['DELIVERED', 'COMPLETED'] }
      },
      include: {
        taxRecord: true,
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

    console.log(`📦 Found ${deliveredOrders.length} delivered/completed orders`)

    const ordersWithoutTax = deliveredOrders.filter(order => !order.taxRecord)
    console.log(`💰 Orders without tax records: ${ordersWithoutTax.length}`)

    if (ordersWithoutTax.length > 0) {
      console.log('\n📋 Orders without tax records:')
      ordersWithoutTax.forEach(order => {
        console.log(`  - Order ${order.orderNumber}: €${order.totalAmount} (${order.status}) - ${order.createdAt.toDateString()}`)
      })
    }

    const ordersWithTax = deliveredOrders.filter(order => order.taxRecord)
    console.log(`✅ Orders with tax records: ${ordersWithTax.length}`)

    if (ordersWithTax.length > 0) {
      const totalVat = ordersWithTax.reduce((sum, order) => sum + order.taxRecord.vatAmount, 0)
      const totalSales = ordersWithTax.reduce((sum, order) => sum + order.taxRecord.subtotal, 0)
      console.log(`💶 Total VAT collected: €${totalVat.toFixed(2)}`)
      console.log(`💰 Total sales (ex VAT): €${totalSales.toFixed(2)}`)
    }

    return {
      totalOrders: deliveredOrders.length,
      ordersWithoutTax: ordersWithoutTax.length,
      ordersWithTax: ordersWithTax.length
    }

  } catch (error) {
    console.error('❌ Error checking delivered orders:', error)
    throw error
  }
}

export default async function main() {
  try {
    const result = await checkDeliveredOrders()
    console.log('\n📊 Summary:', result)
  } catch (error) {
    console.error('❌ Script failed:', error)
    throw error
  } finally {
    await db.$disconnect()
  }
}
