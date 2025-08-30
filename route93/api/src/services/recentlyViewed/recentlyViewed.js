import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'

export const recentlyViewed = async ({ limit = 10 }, { context }) => {
  const userId = context.currentUser?.id
  if (!userId) {
    throw new Error('Authentication required')
  }

  return db.recentlyViewed.findMany({
    where: { userId },
    orderBy: { viewedAt: 'desc' },
    take: limit,
    include: {
      product: {
        include: {
          category: true,
          reviews: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      },
    },
  })
}

export const recentlyViewedCount = async ({}, { context }) => {
  const userId = context.currentUser?.id
  if (!userId) {
    throw new Error('Authentication required')
  }

  return db.recentlyViewed.count({
    where: { userId },
  })
}

export const addToRecentlyViewed = async ({ productId }, { context }) => {
  const userId = context.currentUser?.id
  if (!userId) {
    throw new Error('Authentication required')
  }

  // Check if product exists
  const product = await db.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    throw new Error('Product not found')
  }

  // Remove existing entry if it exists (to update timestamp)
  await db.recentlyViewed.deleteMany({
    where: {
      userId,
      productId,
    },
  })

  // Add new entry
  return db.recentlyViewed.create({
    data: {
      userId,
      productId,
    },
    include: {
      product: {
        include: {
          category: true,
          reviews: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}

export const removeFromRecentlyViewed = async ({ productId }, { context }) => {
  const userId = context.currentUser?.id
  if (!userId) {
    throw new Error('Authentication required')
  }

  await db.recentlyViewed.deleteMany({
    where: {
      userId,
      productId,
    },
  })

  return true
}

export const clearRecentlyViewed = async ({}, { context }) => {
  const userId = context.currentUser?.id
  if (!userId) {
    throw new Error('Authentication required')
  }

  await db.recentlyViewed.deleteMany({
    where: { userId },
  })

  return true
}
