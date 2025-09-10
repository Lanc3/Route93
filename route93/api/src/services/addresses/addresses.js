import { db } from 'src/lib/db'

export const addresses = () => {
  return db.address.findMany()
}

export const addressesByUser = ({ userId }) => {
  return db.address.findMany({
    where: { userId },
    orderBy: { isDefault: 'desc', createdAt: 'desc' }
  })
}

export const address = ({ id }) => {
  return db.address.findUnique({
    where: { id },
  })
}

export const createAddress = ({ input }) => {
  return db.$transaction(async (tx) => {
    const userId = input.userId

    // Count existing addresses for the user
    const existingCount = await tx.address.count({ where: { userId } })

    const shouldBeDefault = input.isDefault === true || existingCount === 0

    if (shouldBeDefault) {
      // Ensure only one default per user
      await tx.address.updateMany({ where: { userId }, data: { isDefault: false } })
    }

    const created = await tx.address.create({
      data: { ...input, isDefault: shouldBeDefault },
    })

    return created
  })
}

export const updateAddress = ({ id, input }) => {
  return db.$transaction(async (tx) => {
    // Find the address to update to get its userId
    const existing = await tx.address.findUnique({ where: { id } })
    if (!existing) {
      throw new Error('Address not found')
    }

    const userId = existing.userId

    // If setting this address as default, unset others first
    if (input?.isDefault === true) {
      await tx.address.updateMany({ where: { userId }, data: { isDefault: false } })
    }

    const updated = await tx.address.update({
      data: input,
      where: { id },
    })

    // Ensure at least one default address exists per user
    const defaultsCount = await tx.address.count({ where: { userId, isDefault: true } })
    if (defaultsCount === 0) {
      // If none are default, set the most recently created as default
      const latest = await tx.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })
      if (latest) {
        await tx.address.update({ where: { id: latest.id }, data: { isDefault: true } })
      }
    }

    return updated
  })
}

export const deleteAddress = ({ id }) => {
  return db.$transaction(async (tx) => {
    // Get the address before deletion
    const addr = await tx.address.findUnique({ where: { id } })
    if (!addr) {
      throw new Error('Address not found')
    }
    const userId = addr.userId
    const wasDefault = addr.isDefault

    const deleted = await tx.address.delete({ where: { id } })

    // If we deleted the default, promote the most recent remaining to default
    if (wasDefault) {
      const replacement = await tx.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })
      if (replacement) {
        await tx.address.update({ where: { id: replacement.id }, data: { isDefault: true } })
      }
    }

    return deleted
  })
}

export const Address = {
  user: (_obj, { root }) => {
    return db.address.findUnique({ where: { id: root?.id } }).user()
  },
  shippingOrders: (_obj, { root }) => {
    return db.address.findUnique({ where: { id: root?.id } }).shippingOrders()
  },
  billingOrders: (_obj, { root }) => {
    return db.address.findUnique({ where: { id: root?.id } }).billingOrders()
  },
}
