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
      product: true,
      printableItem: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export const createCartItem = async ({ input }) => {
  requireAuth()
  
  // Ensure productId refers to an existing product. If not, derive one from printable item (find-or-create).
  let validatedProduct = await db.product.findUnique({ where: { id: input.productId } })
  if (!validatedProduct && input.printableItemId) {
    const printable = await db.printableItem.findUnique({ where: { id: input.printableItemId } })
    if (printable) {
      // Try to find by deterministic slug PRINTABLE-<id>
      const deterministicSlug = `printable-${printable.id}`
      validatedProduct = await db.product.findFirst({ where: { slug: deterministicSlug } })
      if (!validatedProduct) {
        // Create a backing product for this printable item
        validatedProduct = await db.product.create({
          data: {
            name: printable.name,
            description: printable.description || `Printable product for ${printable.name}`,
            price: printable.price || 0,
            sku: `PRINTABLE-${printable.id}`,
            slug: deterministicSlug,
            status: 'ACTIVE',
            inventory: 999999, // virtual stock for printable items
            images: printable.imageUrl || null,
          }
        })
      }
      input.productId = validatedProduct.id
    }
  }
  // Final validation
  validatedProduct = await db.product.findUnique({ where: { id: input.productId } })
  if (!validatedProduct) {
    throw new Error('Selected printable item cannot be added to cart at this time (no backing product).')
  }

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
        product: true,
        printableItem: true
      }
    })
  } else {
    // Create new cart item
    return db.cartItem.create({
      data: input,
      include: {
        product: true,
        printableItem: true
      }
    })
  }
}

export const updateCartItem = ({ id, input }) => {
  requireAuth()

  console.log('=== UPDATE CART ITEM DEBUG ===')
  console.log('Cart item ID to update:', id)
  console.log('Update input:', input)

  // Check if cart item exists first
  return db.cartItem.findUnique({
    where: { id }
  }).then(existingItem => {
    if (!existingItem) {
      console.log('Cart item not found in database:', id)
      throw new Error(`Cart item with ID ${id} not found`)
    }

    console.log('Found existing cart item:', existingItem)
    return db.cartItem.update({
      data: input,
      where: { id },
      include: {
        product: true
      }
    })
  }).catch(error => {
    console.error('Error in updateCartItem:', error)
    throw error
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

  // Create new cart items with validation/mapping similar to createCartItem
  const cartItems = []
  for (const item of items) {
    let product = await db.product.findUnique({ where: { id: item.productId } })
    if (!product && item.printableItemId) {
      const printable = await db.printableItem.findUnique({ where: { id: item.printableItemId } })
      if (printable) {
        const slug = `printable-${printable.id}`
        product = await db.product.findFirst({ where: { slug } })
        if (!product) {
          product = await db.product.create({
            data: {
              name: printable.name,
              description: printable.description || `Printable product for ${printable.name}`,
              price: printable.price || 0,
              sku: `PRINTABLE-${printable.id}`,
              slug,
              status: 'ACTIVE',
              inventory: 999999,
              images: printable.imageUrl || null,
            }
          })
        }
        item.productId = product.id
      }
    }
    if (!item.productId) {
      throw new Error('One or more cart items could not be synced due to missing backing product.')
    }
    const created = await db.cartItem.create({
      data: {
        userId: currentUser.id,
        productId: item.productId,
        quantity: item.quantity,
        designUrl: item.designUrl,
        designId: item.designId,
        printFee: item.printFee,
        printableItemId: item.printableItemId
      },
      include: {
        product: true,
        printableItem: true
      }
    })
    cartItems.push(created)
  }

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
