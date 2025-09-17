import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'
import { context } from '@redwoodjs/graphql-server'

export const printCartItems = () => {
  requireAuth()
  const { currentUser } = context
  return db.printCartItem.findMany({
    where: { userId: currentUser.id },
    include: {
      printableItem: true,
      design: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export const printCartItem = ({ id }) => {
  requireAuth()
  const { currentUser } = context
  return db.printCartItem.findFirst({
    where: { id, userId: currentUser.id },
    include: { printableItem: true, design: true },
  })
}

export const userPrintCartItems = ({ userId }) => {
  requireAuth()
  return db.printCartItem.findMany({
    where: { userId },
    include: { printableItem: true, design: true },
    orderBy: { createdAt: 'desc' },
  })
}

export const createPrintCartItem = async ({ input }) => {
  requireAuth()
  const { currentUser } = context

  // Ensure base/total prices if not provided
  const printable = await db.printableItem.findUnique({
    where: { id: input.printableItemId },
  })
  if (!printable) {
    throw new Error('Printable item not found')
  }
  const basePrice =
    typeof input.basePrice === 'number' ? input.basePrice : printable.price || 0
  const printFee = typeof input.printFee === 'number' ? input.printFee : 0
  const quantity = input.quantity || 1
  const totalPrice = basePrice * quantity + printFee * quantity

  return db.printCartItem.create({
    data: {
      ...input,
      userId: input.userId || currentUser.id,
      basePrice,
      totalPrice,
    },
    include: { printableItem: true, design: true },
  })
}

export const updatePrintCartItem = async ({ id, input }) => {
  requireAuth()
  const existing = await db.printCartItem.findUnique({ where: { id } })
  if (!existing) throw new Error('Print cart item not found')

  const printable = input.printableItemId
    ? await db.printableItem.findUnique({ where: { id: input.printableItemId } })
    : await db.printableItem.findUnique({ where: { id: existing.printableItemId } })

  const quantity = input.quantity ?? existing.quantity
  const basePrice =
    input.basePrice ?? (printable?.price ?? existing.basePrice ?? 0)
  const printFee = input.printFee ?? existing.printFee ?? 0
  const totalPrice = basePrice * quantity + printFee * quantity

  return db.printCartItem.update({
    data: { ...input, basePrice, totalPrice },
    where: { id },
    include: { printableItem: true, design: true },
  })
}

export const deletePrintCartItem = ({ id }) => {
  requireAuth()
  return db.printCartItem.delete({
    where: { id },
  })
}

export const clearUserPrintCart = async ({ userId }) => {
  requireAuth()
  await db.printCartItem.deleteMany({ where: { userId } })
  return true
}

export const PrintCartItem = {
  user: (_obj, { root }) => {
    return db.printCartItem.findUnique({ where: { id: root?.id } }).user()
  },
  printableItem: (_obj, { root }) => {
    return db.printCartItem
      .findUnique({ where: { id: root?.id } })
      .printableItem()
  },
  design: (_obj, { root }) => {
    return db.printCartItem.findUnique({ where: { id: root?.id } }).design()
  },
}
