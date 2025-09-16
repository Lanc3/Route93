import { db } from 'src/lib/db'
import { notifyStockAlerts } from 'src/services/stockAlerts/stockAlerts'
import { requireAuth } from 'src/lib/auth'

export const products = async ({
  categoryId,
  minPrice,
  maxPrice,
  inStock,
  status,
  search,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  limit = 12,
  offset = 0,
  // Enhanced parameters
  minRating,
  tags,
  collectionId,
  brand,
  hasVariants,
}) => {
  const where = {}

  // Only filter by status if explicitly provided
  if (status) {
    where.status = status
  }

  // Category filter
  if (categoryId) {
    where.categoryId = categoryId
  }

  // Collection filter
  if (collectionId) {
    where.collections = {
      some: {
        collectionId: collectionId,
      },
    }
  }

  // Price range filter
  if ((minPrice !== undefined && minPrice !== null) || (maxPrice !== undefined && maxPrice !== null)) {
    where.price = {}
    if (minPrice !== undefined && minPrice !== null) where.price.gte = minPrice
    if (maxPrice !== undefined && maxPrice !== null) where.price.lte = maxPrice
  }

  // In stock filter
  if (inStock) {
    where.inventory = { gt: 0 }
  }

  // Minimum rating filter
  if (minRating) {
    where.reviews = {
      some: {
        rating: { gte: minRating }
      }
    }
  }

  // Tags filter
  if (tags && tags.length > 0) {
    where.tags = {
      contains: tags[0], // For now, filter by first tag
    }
  }

  // Brand filter (assuming brand is stored in tags or description)
  if (brand) {
    where.OR = where.OR || []
    where.OR.push(
      { tags: { contains: brand } },
      { description: { contains: brand } }
    )
  }

  // Variants filter
  if (hasVariants !== undefined) {
    if (hasVariants) {
      where.variants = {
        some: {}
      }
    } else {
      where.variants = {
        none: {}
      }
    }
  }

  // Search filter
  if (search) {
    const searchConditions = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
    ]

    if (where.OR) {
      where.OR.push(...searchConditions)
    } else {
      where.OR = searchConditions
    }
  }

  // Sort options
  const orderBy = {}
  if (sortBy === 'price') {
    orderBy.price = sortOrder
  } else if (sortBy === 'name') {
    orderBy.name = sortOrder
  } else if (sortBy === 'rating') {
    // Sort by average rating (simplified)
    orderBy.reviews = {
      _count: sortOrder
    }
  } else if (sortBy === 'popularity') {
    // Sort by review count as proxy for popularity
    orderBy.reviews = {
      _count: 'desc'
    }
  } else if (sortBy === 'newest') {
    orderBy.createdAt = 'desc'
  } else {
    orderBy.createdAt = sortOrder
  }

  return db.product.findMany({
    where,
    orderBy,
    take: limit,
    skip: offset,
    include: {
      category: true,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      variants: {
        take: 1, // Include one variant for display
      },
      collections: {
        include: {
          collection: true,
        },
      },
      _count: {
        select: {
          reviews: true,
          variants: true,
        },
      },
    },
  })
}

export const productsCount = async ({
  categoryId,
  minPrice,
  maxPrice,
  inStock,
  status,
  search,
  // Enhanced parameters
  minRating,
  tags,
  collectionId,
  brand,
  hasVariants,
}) => {
  const where = {}

  // Only filter by status if explicitly provided
  if (status) {
    where.status = status
  }

  // Category filter
  if (categoryId) {
    where.categoryId = categoryId
  }

  // Collection filter
  if (collectionId) {
    where.collections = {
      some: {
        collectionId: collectionId,
      },
    }
  }

  // Price range filter
  if ((minPrice !== undefined && minPrice !== null) || (maxPrice !== undefined && maxPrice !== null)) {
    where.price = {}
    if (minPrice !== undefined && minPrice !== null) where.price.gte = minPrice
    if (maxPrice !== undefined && maxPrice !== null) where.price.lte = maxPrice
  }

  // In stock filter
  if (inStock) {
    where.inventory = { gt: 0 }
  }

  // Minimum rating filter
  if (minRating) {
    where.reviews = {
      some: {
        rating: { gte: minRating }
      }
    }
  }

  // Tags filter
  if (tags && tags.length > 0) {
    where.tags = {
      contains: tags[0],
    }
  }

  // Brand filter
  if (brand) {
    where.OR = where.OR || []
    where.OR.push(
      { tags: { contains: brand } },
      { description: { contains: brand } }
    )
  }

  // Variants filter
  if (hasVariants !== undefined) {
    if (hasVariants) {
      where.variants = {
        some: {}
      }
    } else {
      where.variants = {
        none: {}
      }
    }
  }

  // Search filter
  if (search) {
    const searchConditions = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
    ]

    if (where.OR) {
      where.OR.push(...searchConditions)
    } else {
      where.OR = searchConditions
    }
  }

  return db.product.count({ where })
}

export const product = ({ id }) => {
  return db.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  })
}

export const productBySlug = ({ slug }) => {
  return db.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  })
}

export const createProduct = ({ input }) => {
  return db.product.create({
    data: input,
  })
}

export const updateProduct = ({ id, input }) => {
  return db.product.update({
    data: input,
    where: { id },
  })
}

export const deleteProduct = ({ id }) => {
  return db.product
    .delete({
      where: { id },
    })
    .catch(async (error) => {
      // If the product is referenced by order items (historical orders), fall back to soft delete
      const message = String(error?.message || '')
      const isFkViolation =
        message.includes('Foreign key constraint violated') ||
        message.includes('order_items_productId_fkey')

      if (!isFkViolation) {
        throw error
      }

      // Soft-delete: mark as INACTIVE and make it non-purchasable
      return db.product.update({
        where: { id },
        data: {
          status: 'INACTIVE',
          inventory: 0,
        },
      })
    })
}

// Inventory-specific queries
export const inventoryProducts = async ({
  lowStockThreshold = 10,
  stockStatus,
  sortBy = 'inventory',
  sortOrder = 'asc',
  limit = 50,
  offset = 0,
  search,
}) => {
  requireAuth({ roles: ['ADMIN'] })

  const where = {
    status: 'ACTIVE', // Only show active products in inventory
  }

  // Stock status filter
  if (stockStatus === 'OUT_OF_STOCK') {
    where.inventory = { lte: 0 }
  } else if (stockStatus === 'LOW_STOCK') {
    where.inventory = { gt: 0, lte: lowStockThreshold }
  } else if (stockStatus === 'IN_STOCK') {
    where.inventory = { gt: lowStockThreshold }
  } else if (stockStatus === 'CRITICAL') {
    where.inventory = { lte: 5 } // Critical threshold
  }

  // Search filter
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { sku: { contains: search } },
      { description: { contains: search } },
    ]
  }

  // Sort options
  const orderBy = {}
  if (sortBy === 'name') {
    orderBy.name = sortOrder
  } else if (sortBy === 'price') {
    orderBy.price = sortOrder
  } else if (sortBy === 'sku') {
    orderBy.sku = sortOrder
  } else if (sortBy === 'updatedAt') {
    orderBy.updatedAt = sortOrder
  } else {
    orderBy.inventory = sortOrder
  }

  return db.product.findMany({
    where,
    orderBy,
    take: limit,
    skip: offset,
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}

export const inventoryStats = async () => {
  requireAuth({ roles: ['ADMIN'] })

  try {
    const [
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      lowStockProducts,
      criticalStockProducts,
      overstockedProducts,
      inventoryValueResult,
      averageStockResult,
    ] = await Promise.all([
      // Total active products
      db.product.count({ where: { status: 'ACTIVE' } }),
      
      // In stock (> 10 items)
      db.product.count({
        where: { status: 'ACTIVE', inventory: { gt: 10 } }
      }),
      
      // Out of stock (0 items)
      db.product.count({
        where: { status: 'ACTIVE', inventory: { lte: 0 } }
      }),
      
      // Low stock (1-10 items)
      db.product.count({
        where: { status: 'ACTIVE', inventory: { gt: 0, lte: 10 } }
      }),
      
      // Critical stock (1-5 items)
      db.product.count({
        where: { status: 'ACTIVE', inventory: { gt: 0, lte: 5 } }
      }),
      
      // Overstocked (> 100 items)
      db.product.count({
        where: { status: 'ACTIVE', inventory: { gt: 100 } }
      }),
      
      // Total inventory value
      db.product.aggregate({
        where: { status: 'ACTIVE' },
        _sum: {
          inventory: true,
        },
      }),
      
      // Average stock level
      db.product.aggregate({
        where: { status: 'ACTIVE' },
        _avg: {
          inventory: true,
        },
      }),
    ])

    return {
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      lowStockProducts: lowStockProducts,
      criticalStockProducts,
      overstockedProducts,
      totalInventoryValue: inventoryValueResult._sum.inventory || 0,
      averageStockLevel: Math.round(averageStockResult._avg.inventory || 0),
    }
  } catch (error) {
    console.error('Error fetching inventory stats:', error)
    return {
      totalProducts: 0,
      inStockProducts: 0,
      outOfStockProducts: 0,
      lowStockProducts: 0,
      criticalStockProducts: 0,
      overstockedProducts: 0,
      totalInventoryValue: 0,
      averageStockLevel: 0,
    }
  }
}

// Inventory-specific mutations
export const updateProductInventory = async ({ id, inventory }) => {
  requireAuth({ roles: ['ADMIN'] })
  
  if (inventory < 0) {
    throw new Error('Inventory cannot be negative')
  }

  const before = await db.product.findUnique({ where: { id }, select: { inventory: true } })
  const updated = await db.product.update({
    where: { id },
    data: { inventory },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  if ((before?.inventory || 0) <= 0 && updated.inventory > 0) {
    // fire-and-forget
    notifyStockAlerts({ productId: id }).catch(() => {})
  }
  return updated
}

export const bulkUpdateInventory = async ({ updates }) => {
  requireAuth({ roles: ['ADMIN'] })

  // Validate all updates first
  for (const update of updates) {
    if (update.inventory < 0) {
      throw new Error(`Inventory cannot be negative for product ID ${update.id}`)
    }
  }

  // Perform bulk update using transaction
  const updatedProducts = await db.$transaction(
    updates.map((update) =>
      db.product.update({
        where: { id: update.id },
        data: { inventory: update.inventory },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
    )
  )

  // trigger notifications for any that crossed the threshold
  for (const p of updatedProducts) {
    if (p.inventory > 0) {
      notifyStockAlerts({ productId: p.id }).catch(() => {})
    }
  }

  return updatedProducts
}

// Enhanced product queries
export const featuredProducts = async ({ limit = 12 }) => {
  return db.product.findMany({
    where: {
      status: 'ACTIVE',
      inventory: { gt: 0 },
    },
    orderBy: {
      reviews: {
        _count: 'desc', // Most reviewed products
      },
    },
    take: limit,
    include: {
      category: true,
      reviews: {
        take: 3,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  })
}

export const trendingProducts = async ({ limit = 12 }) => {
  // Get products with most recent reviews (proxy for trending)
  return db.product.findMany({
    where: {
      status: 'ACTIVE',
      inventory: { gt: 0 },
      reviews: {
        some: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      },
    },
    orderBy: {
      reviews: {
        _count: 'desc',
      },
    },
    take: limit,
    include: {
      category: true,
      reviews: {
        take: 3,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  })
}

export const relatedProducts = async ({ productId, limit = 6 }) => {
  // Get the original product to find related ones
  const product = await db.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      tags: true,
    },
  })

  if (!product) {
    return []
  }

  // Find products in same category or with similar tags
  const relatedProducts = await db.product.findMany({
    where: {
      id: { not: productId },
      status: 'ACTIVE',
      inventory: { gt: 0 },
      OR: [
        { categoryId: product.categoryId },
        { tags: { contains: product.tags?.split(',')[0] || '' } },
      ],
    },
    orderBy: {
      reviews: {
        _count: 'desc',
      },
    },
    take: limit,
    include: {
      category: true,
      reviews: {
        take: 3,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  })

  return relatedProducts
}

// Cart recommendations based on items in cart
export const cartRecommendations = async ({ productIds, limit = 6 }) => {
  if (!productIds || productIds.length === 0) {
    return []
  }

  // Get the categories and tags from the products in cart
  const cartProducts = await db.product.findMany({
    where: {
      id: { in: productIds },
      status: 'ACTIVE',
    },
    select: {
      categoryId: true,
      tags: true,
    },
  })

  if (cartProducts.length === 0) {
    return []
  }

  // Extract categories and tags from cart products
  const categories = [...new Set(cartProducts.map(p => p.categoryId).filter(Boolean))]
  const allTags = cartProducts
    .map(p => p.tags)
    .filter(Boolean)
    .join(',')
    .split(',')
    .filter(tag => tag.trim())
  const uniqueTags = [...new Set(allTags)]

  // Build the OR conditions
  const orConditions = []

  // Products in same categories
  if (categories.length > 0) {
    orConditions.push({ categoryId: { in: categories } })
  }

  // Products with similar tags
  if (uniqueTags.length > 0) {
    orConditions.push({ tags: { contains: uniqueTags[0] } })
  }

  // Popular products in related categories (fallback)
  orConditions.push({ categoryId: { not: null } })

  // Find recommended products
  let recommendations = await db.product.findMany({
    where: {
      id: { notIn: productIds }, // Exclude products already in cart
      status: 'ACTIVE',
      inventory: { gt: 0 },
      OR: orConditions,
    },
    orderBy: [
      { reviews: { _count: 'desc' } },
      { createdAt: 'desc' },
    ],
    take: limit,
    include: {
      category: true,
      reviews: {
        take: 3,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  })

  // If we don't have enough recommendations, fill with trending products
  if (recommendations.length < limit) {
    const additionalProducts = await db.product.findMany({
      where: {
        id: { notIn: [...productIds, ...recommendations.map(p => p.id)] },
        status: 'ACTIVE',
        inventory: { gt: 0 },
        reviews: {
          some: {}, // Has at least one review
        },
      },
      orderBy: {
        reviews: { _count: 'desc' },
      },
      take: limit - recommendations.length,
      include: {
        category: true,
        reviews: {
          take: 3,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
            },
          },
        },
      },
      _count: {
          select: {
            reviews: true,
          },
        },
      },
    })

    recommendations.push(...additionalProducts)
  }

  return recommendations
}

export const Product = {
  category: (_obj, { root }) => {
    return db.product.findUnique({ where: { id: root?.id } }).category()
  },
}
