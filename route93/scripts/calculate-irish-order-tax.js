import { db } from '../api/src/lib/db'

// Import the tax calculation function
async function calculateOrderTax(orderId) {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: { product: { include: { category: true } } }
        },
        billingAddress: true,
        user: true,
        taxRecord: true
      }
    })
    
    if (!order) {
      throw new Error(`Order ${orderId} not found`)
    }
    
    // Skip if tax record already exists
    if (order.taxRecord) {
      console.log(`⏭️  Tax record already exists for order ${order.orderNumber}`)
      return order.taxRecord
    }
    
    // Only calculate tax for completed orders
    if (!['DELIVERED', 'COMPLETED'].includes(order.status)) {
      throw new Error(`Order ${orderId} is not completed (status: ${order.status})`)
    }
    
    const customerCountry = order.billingAddress?.country || 'IE'
    const customerVatNumber = null // TODO: Add VAT number field to address/user
    
    // Determine customer type
    const determineCustomerType = (country, vatNumber = null) => {
      if (country === 'IE') {
        return vatNumber ? 'B2B_IE' : 'B2C'
      }
      
      const EU_COUNTRIES = [
        'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GR', 
        'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 
        'SE', 'SI', 'SK'
      ]
      
      if (EU_COUNTRIES.includes(country)) {
        return vatNumber ? 'B2B_EU' : 'B2B_EU'
      }
      
      return 'B2B_NON_EU'
    }
    
    const customerType = determineCustomerType(customerCountry, customerVatNumber)
    
    console.log(`🔍 Processing order ${order.orderNumber}:`)
    console.log(`  Customer: ${order.user.name}`)
    console.log(`  Country: ${customerCountry}`)
    console.log(`  Customer Type: ${customerType}`)
    
    // Calculate tax for each order item
    let totalSubtotal = 0
    let totalVatAmount = 0
    let totalStandardVat = 0
    let totalReducedVat = 0
    let totalSecondReducedVat = 0
    let totalZeroVat = 0
    let totalExemptAmount = 0
    let reverseCharge = false
    
    for (const item of order.orderItems) {
      const vatRate = item.product.category?.vatRate || 23.0
      const itemTotal = item.totalPrice
      
      console.log(`  📦 ${item.product.name}: €${itemTotal} at ${vatRate}% VAT`)
      
      // For Irish customers (B2C or B2B_IE), calculate VAT normally
      if (customerType === 'B2C' || customerType === 'B2B_IE') {
        // VAT exclusive calculation (assuming prices are VAT exclusive)
        const vatAmount = (itemTotal * vatRate) / 100
        const subtotal = itemTotal
        
        totalSubtotal += subtotal
        totalVatAmount += vatAmount
        
        // Categorize VAT by rate
        if (vatRate === 23.0) {
          totalStandardVat += vatAmount
        } else if (vatRate === 13.5) {
          totalReducedVat += vatAmount
        } else if (vatRate === 9.0) {
          totalSecondReducedVat += vatAmount
        } else if (vatRate === 0.0) {
          totalZeroVat += vatAmount
        }
        
        console.log(`    Subtotal: €${subtotal.toFixed(2)}, VAT: €${vatAmount.toFixed(2)}`)
      } else {
        // For non-Irish customers, no VAT
        totalSubtotal += itemTotal
        totalZeroVat += itemTotal
        console.log(`    No VAT (export sale)`)
      }
    }
    
    // Add shipping cost to subtotal (shipping is typically standard rate VAT)
    const shippingVat = customerType === 'B2C' || customerType === 'B2B_IE' 
      ? (order.shippingCost * 23.0) / 123.0  // Extract VAT from VAT-inclusive shipping
      : 0
    
    const shippingSubtotal = order.shippingCost - shippingVat
    totalSubtotal += shippingSubtotal
    totalVatAmount += shippingVat
    totalStandardVat += shippingVat
    
    console.log(`  🚚 Shipping: €${shippingSubtotal.toFixed(2)} + €${shippingVat.toFixed(2)} VAT`)
    
    // Calculate tax period
    const calculateTaxPeriod = (date) => {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const quarter = Math.ceil(month / 3)
      
      return {
        monthly: `${year}-${month.toString().padStart(2, '0')}`,
        quarterly: `${year}-Q${quarter}`,
        year,
        quarter,
        month
      }
    }
    
    const taxPeriod = calculateTaxPeriod(order.createdAt)
    
    console.log(`💰 Tax Summary:`)
    console.log(`  Subtotal: €${totalSubtotal.toFixed(2)}`)
    console.log(`  VAT Amount: €${totalVatAmount.toFixed(2)}`)
    console.log(`  Standard VAT (23%): €${totalStandardVat.toFixed(2)}`)
    console.log(`  Total Amount: €${order.totalAmount.toFixed(2)}`)
    
    // Create tax record
    const taxRecord = await db.taxRecord.create({
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerType,
        customerCountry,
        customerVatNumber,
        subtotal: totalSubtotal,
        vatAmount: totalVatAmount,
        totalAmount: order.totalAmount,
        standardVat: totalStandardVat,
        reducedVat: totalReducedVat,
        secondReducedVat: totalSecondReducedVat,
        zeroVat: totalZeroVat,
        exemptAmount: totalExemptAmount,
        vatNumber: 'IE1234567A', // Your company VAT number
        invoiceNumber: `INV-${order.orderNumber}`,
        reverseCharge,
        taxPeriod: taxPeriod.monthly,
        reportingYear: taxPeriod.year,
        reportingQuarter: taxPeriod.quarter,
        reportingMonth: taxPeriod.month
      },
      include: { order: true }
    })
    
    return taxRecord
  } catch (error) {
    console.error('Error calculating order tax:', error)
    throw error
  }
}

async function calculateIrishOrderTax() {
  try {
    console.log('🇮🇪 Calculating tax for Irish test order...')

    // Find the test Irish order
    const testOrder = await db.order.findFirst({
      where: {
        orderNumber: { contains: 'TEST-IE' },
        status: 'DELIVERED'
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!testOrder) {
      throw new Error('Test Irish order not found')
    }

    console.log(`📋 Found test order: ${testOrder.orderNumber}`)

    // Calculate tax for this order
    const taxRecord = await calculateOrderTax(testOrder.id)
    
    console.log(`✅ Tax record created successfully!`)
    console.log(`📊 Tax Record ID: ${taxRecord.id}`)

    return taxRecord

  } catch (error) {
    console.error('❌ Error calculating Irish order tax:', error)
    throw error
  }
}

export default async function main() {
  try {
    await calculateIrishOrderTax()
    console.log('\n🎉 Irish order tax calculation completed!')
    console.log('Now check the Tax Management page to see the VAT being reported correctly.')
  } catch (error) {
    console.error('❌ Script failed:', error)
    throw error
  } finally {
    await db.$disconnect()
  }
}
