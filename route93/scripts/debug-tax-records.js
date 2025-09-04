import { db } from '../api/src/lib/db'

async function debugTaxRecords() {
  try {
    console.log('🔍 Debugging tax records...')

    // Get all tax records with order details
    const taxRecords = await db.taxRecord.findMany({
      include: {
        order: {
          include: {
            billingAddress: true,
            orderItems: {
              include: {
                product: {
                  include: { category: true }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`📋 Found ${taxRecords.length} tax records`)

    taxRecords.forEach((record, index) => {
      console.log(`\n📦 Tax Record ${index + 1}:`)
      console.log(`  Order: ${record.orderNumber}`)
      console.log(`  Customer Type: ${record.customerType}`)
      console.log(`  Customer Country: ${record.customerCountry}`)
      console.log(`  Subtotal: €${record.subtotal.toFixed(2)}`)
      console.log(`  VAT Amount: €${record.vatAmount.toFixed(2)}`)
      console.log(`  Total: €${record.totalAmount.toFixed(2)}`)
      console.log(`  Standard VAT (23%): €${record.standardVat.toFixed(2)}`)
      console.log(`  Reduced VAT (13.5%): €${record.reducedVat.toFixed(2)}`)
      console.log(`  Zero VAT: €${record.zeroVat.toFixed(2)}`)
      console.log(`  Reverse Charge: ${record.reverseCharge}`)
      
      if (record.order.orderItems.length > 0) {
        console.log(`  Products:`)
        record.order.orderItems.forEach(item => {
          console.log(`    - ${item.product.name} (Category: ${item.product.category?.name || 'None'}, VAT Rate: ${item.product.category?.vatRate || 'N/A'}%)`)
          console.log(`      Price: €${item.price.toFixed(2)}, Qty: ${item.quantity}, Total: €${item.totalPrice.toFixed(2)}`)
        })
      }
      
      if (record.order.billingAddress) {
        console.log(`  Billing Country: ${record.order.billingAddress.country}`)
      }
    })

    // Check category VAT rates
    console.log('\n🏷️ Category VAT Rates:')
    const categories = await db.category.findMany({
      orderBy: { name: 'asc' }
    })
    
    categories.forEach(cat => {
      console.log(`  ${cat.name}: ${cat.vatRate}%`)
    })

  } catch (error) {
    console.error('❌ Error debugging tax records:', error)
    throw error
  }
}

export default async function main() {
  try {
    await debugTaxRecords()
  } catch (error) {
    console.error('❌ Script failed:', error)
    throw error
  } finally {
    await db.$disconnect()
  }
}
