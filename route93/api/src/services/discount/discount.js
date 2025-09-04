import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'

export const discountCodes = async ({
  limit = 10,
  offset = 0,
  search,
  isActive
}, { context }) => {
  requireAuth({ roles: ['ADMIN'] }, { context })

  const where = {}

  if (search) {
    where.OR = [
      { code: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ]
  }

  if (isActive !== undefined) {
    where.isActive = isActive
  }

  return db.discountCode.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset
  })
}

export const discountCode = async ({ id }, { context }) => {
  requireAuth({ roles: ['ADMIN'] }, { context })

  return db.discountCode.findUnique({
    where: { id }
  })
}

export const discountCodesCount = async ({ search, isActive }, { context }) => {
  requireAuth({ roles: ['ADMIN'] }, { context })

  const where = {}

  if (search) {
    where.OR = [
      { code: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ]
  }

  if (isActive !== undefined) {
    where.isActive = isActive
  }

  return db.discountCode.count({ where })
}

export const createDiscountCode = async ({ input }, { context }) => {
  requireAuth({ roles: ['ADMIN'] }, { context })

  // Validate the code is unique
  const existingCode = await db.discountCode.findUnique({
    where: { code: input.code.toUpperCase() }
  })

  if (existingCode) {
    throw new Error('Discount code already exists')
  }

  return db.discountCode.create({
    data: {
      ...input,
      code: input.code.toUpperCase()
    }
  })
}

export const updateDiscountCode = async ({ id, input }, { context }) => {
  requireAuth({ roles: ['ADMIN'] }, { context })

  // If updating code, validate it's unique
  if (input.code) {
    const existingCode = await db.discountCode.findFirst({
      where: {
        code: input.code.toUpperCase(),
        id: { not: id }
      }
    })

    if (existingCode) {
      throw new Error('Discount code already exists')
    }
  }

  return db.discountCode.update({
    where: { id },
    data: {
      ...input,
      ...(input.code && { code: input.code.toUpperCase() })
    }
  })
}

export const deleteDiscountCode = async ({ id }, { context }) => {
  requireAuth({ roles: ['ADMIN'] }, { context })

  await db.discountCode.delete({
    where: { id }
  })

  return true
}

export const toggleDiscountCode = async ({ id }, { context }) => {
  requireAuth({ roles: ['ADMIN'] }, { context })

  const discountCode = await db.discountCode.findUnique({
    where: { id }
  })

  if (!discountCode) {
    throw new Error('Discount code not found')
  }

  return db.discountCode.update({
    where: { id },
    data: { isActive: !discountCode.isActive }
  })
}

export const validateDiscountCode = async ({ code }, { context }) => {
  const discountCode = await db.discountCode.findUnique({
    where: { code: code.toUpperCase() }
  })

  if (!discountCode) {
    return {
      isValid: false,
      errorMessage: 'Invalid discount code',
      discountAmount: 0,
      finalTotal: 0
    }
  }

  // Check if code is active
  if (!discountCode.isActive) {
    return {
      isValid: false,
      errorMessage: 'Discount code is not active',
      discountAmount: 0,
      finalTotal: 0
    }
  }

  // Check expiration
  const now = new Date()
  if (discountCode.startsAt && now < discountCode.startsAt) {
    return {
      isValid: false,
      errorMessage: 'Discount code is not yet valid',
      discountAmount: 0,
      finalTotal: 0
    }
  }

  if (discountCode.expiresAt && now > discountCode.expiresAt) {
    return {
      isValid: false,
      errorMessage: 'Discount code has expired',
      discountAmount: 0,
      finalTotal: 0
    }
  }

  // Check usage limit
  if (discountCode.usageLimit && discountCode.usageCount >= discountCode.usageLimit) {
    return {
      isValid: false,
      errorMessage: 'Discount code usage limit exceeded',
      discountAmount: 0,
      finalTotal: 0
    }
  }

  return {
    isValid: true,
    discountCode,
    errorMessage: null,
    discountAmount: 0, // Will be calculated based on cart
    finalTotal: 0 // Will be calculated based on cart
  }
}

export const applyDiscountToCart = async ({ code }, { context }) => {
  const userId = context.currentUser?.id
  if (!userId) {
    throw new Error('Authentication required')
  }

  // Get user's cart
  const cartItems = await db.cartItem.findMany({
    where: { userId },
    include: { product: true }
  })

  if (cartItems.length === 0) {
    return {
      isValid: false,
      errorMessage: 'Your cart is empty',
      discountAmount: 0,
      finalTotal: 0
    }
  }

  // Validate the discount code
  const validation = await validateDiscountCode({ code }, { context })

  if (!validation.isValid) {
    return validation
  }

  const discountCode = validation.discountCode

  // Check per-customer usage limit
  if (discountCode.perCustomerLimit) {
    const customerUsage = await db.orderDiscount.count({
      where: {
        discountCodeId: discountCode.id,
        order: { userId }
      }
    })

    if (customerUsage >= discountCode.perCustomerLimit) {
      return {
        isValid: false,
        errorMessage: 'You have already used this discount code the maximum number of times',
        discountAmount: 0,
        finalTotal: 0
      }
    }
  }

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.product.salePrice || item.product.price) * item.quantity
  }, 0)

  // Check minimum order value
  if (discountCode.minOrderValue && cartTotal < discountCode.minOrderValue) {
    return {
      isValid: false,
      errorMessage: `Minimum order value of $${discountCode.minOrderValue} required`,
      discountAmount: 0,
      finalTotal: cartTotal
    }
  }

  // Check if discount applies to cart items
  const applicableItems = getApplicableItems(cartItems, discountCode)

  if (applicableItems.length === 0) {
    return {
      isValid: false,
      errorMessage: 'No items in your cart qualify for this discount',
      discountAmount: 0,
      finalTotal: cartTotal
    }
  }

  // Calculate discount amount
  const discountAmount = calculateDiscountAmount(applicableItems, discountCode, cartTotal)

  return {
    isValid: true,
    discountCode,
    errorMessage: null,
    discountAmount,
    finalTotal: cartTotal - discountAmount
  }
}

export const removeDiscountFromCart = async ({}, { context }) => {
  const userId = context.currentUser?.id
  if (!userId) {
    throw new Error('Authentication required')
  }

  // For now, this just returns true as we're not storing applied discounts in cart
  // In a full implementation, you'd remove the discount from the cart state
  return true
}

export const discountAnalytics = async ({ startDate, endDate }, { context }) => {
  requireAuth({ roles: ['ADMIN'] }, { context })

  try {
    const { startDate: start, endDate: end } = getDateRange(startDate, endDate)

    // Get basic discount code statistics
    const [totalCodes, activeCodes, orderDiscounts] = await Promise.all([
      db.discountCode.count(),
      db.discountCode.count({ where: { isActive: true } }),
      db.orderDiscount.findMany({
        where: {
          createdAt: { gte: start, lte: end }
        },
        include: {
          discount: true
        }
      })
    ])


    // Calculate total usage and amounts
    const totalUsageCount = orderDiscounts.length
    const totalDiscountAmount = orderDiscounts.reduce((sum, od) => sum + od.discountAmount, 0)

    // Get orders with discounts to calculate average discount per order
    const ordersWithDiscounts = await db.order.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        orderDiscounts: {
          some: {} // Has at least one discount
        }
      },
      include: {
        orderDiscounts: true
      }
    })

    const averageDiscountPerOrder = ordersWithDiscounts.length > 0
      ? ordersWithDiscounts.reduce((sum, order) =>
          sum + order.orderDiscounts.reduce((orderSum, od) => orderSum + od.discountAmount, 0), 0
        ) / ordersWithDiscounts.length
      : 0

    // Calculate discount performance by code
    const discountPerformanceMap = {}
    orderDiscounts.forEach(od => {
      const codeId = od.discountCodeId
      if (!discountPerformanceMap[codeId]) {
        discountPerformanceMap[codeId] = {
          discountCodeId: codeId,
          code: od.discount.code,
          name: od.discount.name,
          type: od.discount.type,
          usageCount: 0,
          totalDiscountAmount: 0,
          lastUsed: od.createdAt
        }
      }
      discountPerformanceMap[codeId].usageCount++
      discountPerformanceMap[codeId].totalDiscountAmount += od.discountAmount
      if (od.createdAt > discountPerformanceMap[codeId].lastUsed) {
        discountPerformanceMap[codeId].lastUsed = od.createdAt
      }
    })

    const discountPerformance = Object.values(discountPerformanceMap)
      .map(dp => ({
        ...dp,
        averageDiscountPerUse: dp.usageCount > 0 ? dp.totalDiscountAmount / dp.usageCount : 0,
        revenueImpact: dp.totalDiscountAmount // Could be enhanced with conversion tracking
      }))
      .sort((a, b) => b.usageCount - a.usageCount)

    const mostPopularDiscount = discountPerformance.length > 0 ? discountPerformance[0] : {
      discountCodeId: 0,
      code: 'N/A',
      name: 'No discounts used',
      type: 'none',
      usageCount: 0,
      totalDiscountAmount: 0,
      averageDiscountPerUse: 0,
      revenueImpact: 0,
      lastUsed: null
    }

    // Calculate usage by discount type
    const typeUsageMap = {}
    orderDiscounts.forEach(od => {
      const type = od.discount.type
      if (!typeUsageMap[type]) {
        typeUsageMap[type] = { count: 0, totalAmount: 0 }
      }
      typeUsageMap[type].count++
      typeUsageMap[type].totalAmount += od.discountAmount
    })

    const totalDiscountUses = orderDiscounts.length
    const usageByType = Object.entries(typeUsageMap).map(([type, data]) => ({
      type,
      count: data.count,
      totalAmount: data.totalAmount,
      percentage: totalDiscountUses > 0 ? (data.count / totalDiscountUses) * 100 : 0
    }))

    // Calculate monthly trends
    const monthlyData = {}
    orderDiscounts.forEach(od => {
      const month = od.createdAt.toISOString().substring(0, 7) // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = {
          totalDiscounts: 0,
          totalAmount: 0,
          uniqueCodes: new Set()
        }
      }
      monthlyData[month].totalDiscounts++
      monthlyData[month].totalAmount += od.discountAmount
      monthlyData[month].uniqueCodes.add(od.discountCodeId)
    })

    const monthlyDiscountTrends = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        totalDiscounts: data.totalDiscounts,
        totalAmount: data.totalAmount,
        uniqueCodes: data.uniqueCodes.size
      }))
      .sort((a, b) => a.month.localeCompare(b.month))

    const result = {
      totalDiscountCodes: totalCodes,
      activeDiscountCodes: activeCodes,
      totalUsageCount,
      totalDiscountAmount,
      averageDiscountPerOrder,
      mostPopularDiscount,
      discountPerformance,
      usageByType,
      monthlyDiscountTrends
    }

    return result
  } catch (error) {
    console.error('Error generating discount analytics:', error)
    return {
      totalDiscountCodes: 0,
      activeDiscountCodes: 0,
      totalUsageCount: 0,
      totalDiscountAmount: 0,
      averageDiscountPerOrder: 0,
      mostPopularDiscount: {
        discountCodeId: 0,
        code: 'N/A',
        name: 'Error loading data',
        type: 'none',
        usageCount: 0,
        totalDiscountAmount: 0,
        averageDiscountPerUse: 0,
        revenueImpact: 0,
        lastUsed: null
      },
      discountPerformance: [],
      usageByType: [],
      monthlyDiscountTrends: []
    }
  }
}

// Helper function for date range (same as in analytics.js)
const getDateRange = (startDate, endDate) => {
  const now = new Date()
  const defaultEndDate = endDate ? new Date(endDate) : now
  const defaultStartDate = startDate ? new Date(startDate) : new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) // 90 days ago

  return { startDate: defaultStartDate, endDate: defaultEndDate }
}

// Helper functions
function getApplicableItems(cartItems, discountCode) {
  if (discountCode.applicableTo === 'all') {
    return cartItems
  }

  if (discountCode.applicableTo === 'categories' && discountCode.categoryIds) {
    const categoryIds = JSON.parse(discountCode.categoryIds)
    return cartItems.filter(item => categoryIds.includes(item.product.categoryId))
  }

  if (discountCode.applicableTo === 'products' && discountCode.productIds) {
    const productIds = JSON.parse(discountCode.productIds)
    return cartItems.filter(item => productIds.includes(item.product.id))
  }

  return []
}

function calculateDiscountAmount(applicableItems, discountCode, cartTotal) {
  switch (discountCode.type) {
    case 'fixed':
      return Math.min(discountCode.value, cartTotal)

    case 'percentage':
      const percentageDiscount = cartTotal * (discountCode.value / 100)
      if (discountCode.maxDiscount) {
        return Math.min(percentageDiscount, discountCode.maxDiscount)
      }
      return percentageDiscount

    case 'free_shipping':
      // This would be handled separately in shipping calculation
      return 0

    case 'bogo':
      // Buy one get one - simplified implementation
      // This would need more complex logic based on your BOGO rules
      return 0

    default:
      return 0
  }
}
