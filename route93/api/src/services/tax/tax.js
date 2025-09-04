import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

// Irish VAT rates (2024)
const VAT_RATES = {
  STANDARD: 23.0,      // Most goods and services
  REDUCED: 13.5,       // Fuel, electricity, newspapers, construction
  SECOND_REDUCED: 9.0, // Hospitality, tourism, hairdressing
  ZERO: 0.0,          // Books, children's clothing, food, medical equipment
  EXEMPT: 0.0         // Financial services, insurance, education
}

// EU country codes for VAT purposes
const EU_COUNTRIES = [
  'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GR', 
  'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 
  'SE', 'SI', 'SK'
]

/**
 * Determine customer type based on country and VAT number
 */
const determineCustomerType = (country, vatNumber = null) => {
  if (country === 'IE') {
    return vatNumber ? 'B2B_IE' : 'B2C'
  }
  
  if (EU_COUNTRIES.includes(country)) {
    return vatNumber ? 'B2B_EU' : 'B2B_EU' // EU B2C is treated as B2B for VAT purposes
  }
  
  return 'B2B_NON_EU'
}

/**
 * Get VAT rate for a product based on its category
 */
const getVatRateForProduct = async (productId) => {
  try {
    const product = await db.product.findUnique({
      where: { id: productId },
      include: { category: true }
    })

    if (!product) {
      return VAT_RATES.STANDARD // Default to standard rate
    }

    // Use category VAT rate if available, otherwise standard rate
    return product.category?.vatRate || VAT_RATES.STANDARD
  } catch (error) {
    logger.error('Error getting VAT rate for product:', error)
    return VAT_RATES.STANDARD
  }
}

/**
 * Calculate tax for a single order item
 */
const calculateItemTax = async (orderItem, customerType) => {
  const vatRate = await getVatRateForProduct(orderItem.productId)
  const itemTotal = orderItem.totalPrice
  
  // For EU B2B with valid VAT number, apply reverse charge (0% VAT)
  if (customerType === 'B2B_EU') {
    return {
      subtotal: itemTotal,
      vatAmount: 0,
      vatRate: 0,
      reverseCharge: true,
      standardVat: 0,
      reducedVat: 0,
      secondReducedVat: 0,
      zeroVat: 0,
      exemptAmount: 0
    }
  }
  
  // For non-EU, no VAT
  if (customerType === 'B2B_NON_EU') {
    return {
      subtotal: itemTotal,
      vatAmount: 0,
      vatRate: 0,
      reverseCharge: false,
      standardVat: 0,
      reducedVat: 0,
      secondReducedVat: 0,
      zeroVat: itemTotal,
      exemptAmount: 0
    }
  }
  
  // Calculate VAT for Irish customers (B2C and B2B_IE)
  const vatAmount = (itemTotal * vatRate) / (100 + vatRate) // VAT inclusive calculation
  const subtotal = itemTotal - vatAmount
  
  let breakdown = {
    subtotal,
    vatAmount,
    vatRate,
    reverseCharge: false,
    standardVat: 0,
    reducedVat: 0,
    secondReducedVat: 0,
    zeroVat: 0,
    exemptAmount: 0
  }
  
  // Categorize VAT by rate
  if (vatRate === VAT_RATES.STANDARD) {
    breakdown.standardVat = vatAmount
  } else if (vatRate === VAT_RATES.REDUCED) {
    breakdown.reducedVat = vatAmount
  } else if (vatRate === VAT_RATES.SECOND_REDUCED) {
    breakdown.secondReducedVat = vatAmount
  } else if (vatRate === VAT_RATES.ZERO) {
    breakdown.zeroVat = vatAmount
  } else {
    breakdown.exemptAmount = vatAmount
  }
  
  return breakdown
}

/**
 * Calculate tax period string
 */
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

// Queries
export const taxRates = async () => {
  return db.taxRate.findMany({
    where: { isActive: true },
    orderBy: { rate: 'desc' }
  })
}

export const taxRecord = async ({ id }) => {
  return db.taxRecord.findUnique({
    where: { id },
    include: { order: true, taxRate: true }
  })
}

export const taxRecords = async () => {
  return db.taxRecord.findMany({
    include: { order: true, taxRate: true },
    orderBy: { createdAt: 'desc' }
  })
}

export const taxRecordsByPeriod = async ({ period }) => {
  return db.taxRecord.findMany({
    where: { taxPeriod: period },
    include: { order: true, taxRate: true },
    orderBy: { createdAt: 'desc' }
  })
}

export const taxReturn = async ({ id }) => {
  return db.taxReturn.findUnique({
    where: { id }
  })
}

export const taxReturns = async () => {
  return db.taxReturn.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export const taxSummary = async ({ input }) => {
  const { startDate, endDate, period } = input
  
  try {
    const whereClause = {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }
    
    if (period) {
      whereClause.taxPeriod = period
    }
    
    const taxRecords = await db.taxRecord.findMany({
      where: whereClause,
      include: { order: true }
    })
    
    const summary = taxRecords.reduce((acc, record) => {
      acc.totalOrders += 1
      acc.totalSales += record.subtotal
      acc.totalVatCollected += record.vatAmount
      acc.standardVatSales += record.standardVat > 0 ? record.subtotal : 0
      acc.standardVatAmount += record.standardVat
      acc.reducedVatSales += record.reducedVat > 0 ? record.subtotal : 0
      acc.reducedVatAmount += record.reducedVat
      acc.secondReducedVatSales += record.secondReducedVat > 0 ? record.subtotal : 0
      acc.secondReducedVatAmount += record.secondReducedVat
      acc.zeroVatSales += record.zeroVat > 0 ? record.subtotal : 0
      acc.exemptSales += record.exemptAmount > 0 ? record.subtotal : 0
      
      if (record.customerType === 'B2B_EU') {
        acc.euB2BSales += record.subtotal
      } else if (record.customerCountry !== 'IE' && EU_COUNTRIES.includes(record.customerCountry)) {
        acc.euB2CSales += record.subtotal
      }
      
      return acc
    }, {
      period: period || `${startDate} to ${endDate}`,
      totalOrders: 0,
      totalSales: 0,
      totalVatCollected: 0,
      standardVatSales: 0,
      standardVatAmount: 0,
      reducedVatSales: 0,
      reducedVatAmount: 0,
      secondReducedVatSales: 0,
      secondReducedVatAmount: 0,
      zeroVatSales: 0,
      exemptSales: 0,
      euB2BSales: 0,
      euB2CSales: 0
    })
    
    return summary
  } catch (error) {
    logger.error('Error generating tax summary:', error)
    throw new Error(`Failed to generate tax summary: ${error.message}`)
  }
}

export const vatBreakdown = async ({ input }) => {
  const { startDate, endDate, period } = input
  
  try {
    const whereClause = {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }
    
    if (period) {
      whereClause.taxPeriod = period
    }
    
    const taxRecords = await db.taxRecord.findMany({
      where: whereClause
    })
    
    const breakdown = [
      {
        rate: VAT_RATES.STANDARD,
        rateName: 'Standard Rate (23%)',
        salesAmount: 0,
        vatAmount: 0,
        orderCount: 0
      },
      {
        rate: VAT_RATES.REDUCED,
        rateName: 'Reduced Rate (13.5%)',
        salesAmount: 0,
        vatAmount: 0,
        orderCount: 0
      },
      {
        rate: VAT_RATES.SECOND_REDUCED,
        rateName: 'Second Reduced Rate (9%)',
        salesAmount: 0,
        vatAmount: 0,
        orderCount: 0
      },
      {
        rate: VAT_RATES.ZERO,
        rateName: 'Zero Rate (0%)',
        salesAmount: 0,
        vatAmount: 0,
        orderCount: 0
      },
      {
        rate: 0,
        rateName: 'Exempt',
        salesAmount: 0,
        vatAmount: 0,
        orderCount: 0
      }
    ]
    
    taxRecords.forEach(record => {
      if (record.standardVat > 0) {
        breakdown[0].salesAmount += record.subtotal
        breakdown[0].vatAmount += record.standardVat
        breakdown[0].orderCount += 1
      }
      if (record.reducedVat > 0) {
        breakdown[1].salesAmount += record.subtotal
        breakdown[1].vatAmount += record.reducedVat
        breakdown[1].orderCount += 1
      }
      if (record.secondReducedVat > 0) {
        breakdown[2].salesAmount += record.subtotal
        breakdown[2].vatAmount += record.secondReducedVat
        breakdown[2].orderCount += 1
      }
      if (record.zeroVat > 0) {
        breakdown[3].salesAmount += record.subtotal
        breakdown[3].vatAmount += record.zeroVat
        breakdown[3].orderCount += 1
      }
      if (record.exemptAmount > 0) {
        breakdown[4].salesAmount += record.subtotal
        breakdown[4].vatAmount += record.exemptAmount
        breakdown[4].orderCount += 1
      }
    })
    
    return breakdown.filter(item => item.orderCount > 0)
  } catch (error) {
    logger.error('Error generating VAT breakdown:', error)
    throw new Error(`Failed to generate VAT breakdown: ${error.message}`)
  }
}

// Mutations
export const createTaxRecord = async ({ input }) => {
  return db.taxRecord.create({
    data: input,
    include: { order: true }
  })
}

export const calculateOrderTax = async ({ orderId }) => {
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
      return order.taxRecord
    }
    
    // Only calculate tax for completed orders
    if (!['DELIVERED', 'COMPLETED'].includes(order.status)) {
      throw new Error(`Order ${orderId} is not completed (status: ${order.status})`)
    }
    
    const customerCountry = order.billingAddress?.country || 'IE'
    const customerVatNumber = null // TODO: Add VAT number field to address/user
    const customerType = determineCustomerType(customerCountry, customerVatNumber)
    
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
      const itemTax = await calculateItemTax(item, customerType)
      
      totalSubtotal += itemTax.subtotal
      totalVatAmount += itemTax.vatAmount
      totalStandardVat += itemTax.standardVat
      totalReducedVat += itemTax.reducedVat
      totalSecondReducedVat += itemTax.secondReducedVat
      totalZeroVat += itemTax.zeroVat
      totalExemptAmount += itemTax.exemptAmount
      
      if (itemTax.reverseCharge) {
        reverseCharge = true
      }
    }
    
    // Add shipping cost to subtotal (shipping is typically standard rate VAT)
    const shippingVat = customerType === 'B2C' || customerType === 'B2B_IE' 
      ? (order.shippingCost * VAT_RATES.STANDARD) / (100 + VAT_RATES.STANDARD)
      : 0
    
    totalSubtotal += order.shippingCost - shippingVat
    totalVatAmount += shippingVat
    totalStandardVat += shippingVat
    
    const taxPeriod = calculateTaxPeriod(order.createdAt)
    
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
        vatNumber: 'IE1234567A', // TODO: Get from environment/settings
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
    logger.error('Error calculating order tax:', error)
    throw new Error(`Failed to calculate tax for order ${orderId}: ${error.message}`)
  }
}

export const recalculateAllTaxRecords = async () => {
  try {
    // Get all completed orders without tax records
    const orders = await db.order.findMany({
      where: {
        status: { in: ['DELIVERED', 'COMPLETED'] },
        taxRecord: null
      },
      include: { taxRecord: true }
    })
    
    let processedCount = 0
    
    for (const order of orders) {
      try {
        await calculateOrderTax({ orderId: order.id })
        processedCount++
      } catch (error) {
        logger.error(`Failed to calculate tax for order ${order.id}:`, error)
        // Continue processing other orders
      }
    }
    
    return processedCount
  } catch (error) {
    logger.error('Error recalculating tax records:', error)
    throw new Error(`Failed to recalculate tax records: ${error.message}`)
  }
}

export const createTaxReturn = async ({ input }) => {
  try {
    const { period, periodType, startDate, endDate } = input
    
    // Check if return already exists for this period
    const existingReturn = await db.taxReturn.findUnique({
      where: { period }
    })
    
    if (existingReturn) {
      throw new Error(`Tax return for period ${period} already exists`)
    }
    
    // Get tax summary for the period
    const summary = await taxSummary({
      input: { startDate, endDate, period }
    })
    
    // Create tax return
    const taxReturn = await db.taxReturn.create({
      data: {
        period,
        periodType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalSales: summary.totalSales,
        totalVatCollected: summary.totalVatCollected,
        totalVatDue: summary.totalVatCollected, // Simplified - in reality this would account for input VAT
        standardVatSales: summary.standardVatSales,
        standardVatAmount: summary.standardVatAmount,
        reducedVatSales: summary.reducedVatSales,
        reducedVatAmount: summary.reducedVatAmount,
        secondReducedVatSales: summary.secondReducedVatSales,
        secondReducedVatAmount: summary.secondReducedVatAmount,
        zeroVatSales: summary.zeroVatSales,
        exemptSales: summary.exemptSales,
        euB2BSales: summary.euB2BSales,
        euB2CSales: summary.euB2CSales,
        status: 'DRAFT'
      }
    })
    
    return taxReturn
  } catch (error) {
    logger.error('Error creating tax return:', error)
    throw new Error(`Failed to create tax return: ${error.message}`)
  }
}

export const generateTaxReturn = async ({ input }) => {
  return createTaxReturn({ input })
}

export const updateTaxReturn = async ({ id, status }) => {
  try {
    const taxReturn = await db.taxReturn.update({
      where: { id },
      data: {
        status,
        filedAt: status === 'FILED' ? new Date() : null,
        filedBy: status === 'FILED' ? 'admin' : null // TODO: Get from context
      }
    })
    
    return taxReturn
  } catch (error) {
    logger.error('Error updating tax return:', error)
    throw new Error(`Failed to update tax return: ${error.message}`)
  }
}
