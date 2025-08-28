import { db } from 'src/lib/db'
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

  // Search filter
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { tags: { contains: search } },
    ]
  }

  // Sort options
  const orderBy = {}
  if (sortBy === 'price') {
    orderBy.price = sortOrder
  } else if (sortBy === 'name') {
    orderBy.name = sortOrder
  } else if (sortBy === 'popularity') {
    // For now, use createdAt as proxy for popularity
    orderBy.createdAt = sortOrder
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
      _count: {
        select: {
          reviews: true,
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
}) => {
  const where = {}

  // Only filter by status if explicitly provided
  if (status) {
    where.status = status
  }

  if (categoryId) {
    where.categoryId = categoryId
  }

  if ((minPrice !== undefined && minPrice !== null) || (maxPrice !== undefined && maxPrice !== null)) {
    where.price = {}
    if (minPrice !== undefined && minPrice !== null) where.price.gte = minPrice
    if (maxPrice !== undefined && maxPrice !== null) where.price.lte = maxPrice
  }

  if (inStock) {
    where.inventory = { gt: 0 }
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { tags: { contains: search } },
    ]
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
  return db.product.delete({
    where: { id },
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

  return db.product.update({
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

  return updatedProducts
}

export const Product = {
  category: (_obj, { root }) => {
    return db.product.findUnique({ where: { id: root?.id } }).category()
  },
}
