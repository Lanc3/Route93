import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'

export const collections = async ({
  isActive,
  search,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  limit = 20,
  offset = 0,
}) => {
  const where = {}

  // Active status filter
  if (isActive !== undefined) {
    where.isActive = isActive
  }

  // Search filter
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ]
  }

  // Sort options
  const orderBy = {}
  if (sortBy === 'name') {
    orderBy.name = sortOrder
  } else if (sortBy === 'isActive') {
    orderBy.isActive = sortOrder
  } else {
    orderBy.createdAt = sortOrder
  }

  return db.collection.findMany({
    where,
    orderBy,
    take: limit,
    skip: offset,
    include: {
      products: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              price: true,
              salePrice: true,
            },
          },
        },
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
  })
}

export const collectionsCount = async ({ isActive, search }) => {
  requireAuth({ roles: ['ADMIN'] })

  const where = {}

  if (isActive !== undefined) {
    where.isActive = isActive
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ]
  }

  return db.collection.count({ where })
}

export const collection = ({ id }) => {
  return db.collection.findUnique({
    where: { id },
    include: {
      products: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              price: true,
              salePrice: true,
              status: true,
            },
          },
        },
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
  })
}

export const collectionBySlug = ({ slug }) => {
  return db.collection.findUnique({
    where: { slug },
    include: {
      products: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              price: true,
              salePrice: true,
              slug: true,
              status: true,
            },
          },
        },
      },
      _count: {
        select: { products: true },
      },
    },
  })
}

export const createCollection = ({ input }) => {
  requireAuth({ roles: ['ADMIN'] })
  return db.collection.create({
    data: input,
  })
}

export const updateCollection = ({ id, input }) => {
  requireAuth({ roles: ['ADMIN'] })
  return db.collection.update({
    data: input,
    where: { id },
  })
}

export const deleteCollection = ({ id }) => {
  requireAuth({ roles: ['ADMIN'] })
  return db.collection.delete({
    where: { id },
  })
}

export const addProductToCollection = async ({ collectionId, productId }) => {
  requireAuth({ roles: ['ADMIN'] })

  // Check if the relationship already exists
  const existing = await db.productCollection.findUnique({
    where: {
      productId_collectionId: {
        productId,
        collectionId,
      },
    },
  })

  if (existing) {
    throw new Error('Product is already in this collection')
  }

  // Create the relationship
  await db.productCollection.create({
    data: {
      productId,
      collectionId,
    },
  })

  // Return the updated collection
  return db.collection.findUnique({
    where: { id: collectionId },
    include: {
      products: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              price: true,
              salePrice: true,
            },
          },
        },
      },
    },
  })
}

export const removeProductFromCollection = async ({ collectionId, productId }) => {
  requireAuth({ roles: ['ADMIN'] })

  // Remove the relationship
  await db.productCollection.delete({
    where: {
      productId_collectionId: {
        productId,
        collectionId,
      },
    },
  })

  // Return the updated collection
  return db.collection.findUnique({
    where: { id: collectionId },
    include: {
      products: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              price: true,
              salePrice: true,
            },
          },
        },
      },
    },
  })
}

export const Collection = {
  products: (_obj, { root }) => {
    return db.collection.findUnique({ where: { id: root?.id } }).products()
  },
}