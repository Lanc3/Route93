import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'
import { context } from '@redwoodjs/graphql-server'

export const cartItems = () => {
  requireAuth()
  return db.cartItem.findMany({
    include: {
      product: true,
      user: true
    }
  })
}

export const cartItem = ({ id }) => {
  requireAuth()
  return db.cartItem.findUnique({
    where: { id },
    include: {
      product: true,
      user: true
    }
  })
}

export const userCartItems = ({ userId }) => {
  requireAuth()
  return db.cartItem.findMany({
    where: { userId },
    include: {
      product: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export const createCartItem = async ({ input }) => {
  requireAuth()
  
  // Check if item already exists for this user and product
  const existingItem = await db.cartItem.findFirst({
    where: {
      userId: input.userId,
      productId: input.productId
    }
  })

  if (existingItem) {
    // Update quantity if item already exists
    return db.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + input.quantity
      },
      include: {
        product: true
      }
    })
  } else {
    // Create new cart item
    return db.cartItem.create({
      data: input,
      include: {
        product: true
      }
    })
  }
}

export const updateCartItem = ({ id, input }) => {
  requireAuth()
  return db.cartItem.update({
    data: input,
    where: { id },
    include: {
      product: true
    }
  })
}

export const deleteCartItem = ({ id }) => {
  requireAuth()
  return db.cartItem.delete({
    where: { id },
  })
}

export const syncCart = async ({ items }) => {
  requireAuth()
  const { currentUser } = context
  
  if (!currentUser) {
    throw new Error('User not authenticated')
  }

  // Clear existing cart items for the user
  await db.cartItem.deleteMany({
    where: { userId: currentUser.id }
  })

  // Create new cart items
  const cartItems = await Promise.all(
    items.map(item =>
      db.cartItem.create({
        data: {
          userId: currentUser.id,
          productId: item.productId,
          quantity: item.quantity
        },
        include: {
          product: true
        }
      })
    )
  )

  return cartItems
}

export const clearUserCart = async ({ userId }) => {
  requireAuth()
  
  await db.cartItem.deleteMany({
    where: { userId }
  })
  
  return true
}

export const CartItem = {
  user: (_obj, { root }) => {
    return db.cartItem.findUnique({ where: { id: root?.id } }).user()
  },
  product: (_obj, { root }) => {
    return db.cartItem.findUnique({ where: { id: root?.id } }).product()
  },
}
