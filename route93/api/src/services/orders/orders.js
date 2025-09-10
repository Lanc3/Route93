import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'
import { sendOrderConfirmationEmailById } from 'src/services/emails/emails'

export const orders = async ({
  status,
  userId,
  search,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  limit = 20,
  offset = 0,
}) => {
  requireAuth({ roles: ['ADMIN'] })

  const where = {}

  // Status filter
  if (status) {
    where.status = status
  }

  // User filter
  if (userId) {
    where.userId = userId
  }

  // Search filter (by order number or user name/email)
  if (search) {
    where.OR = [
      { orderNumber: { contains: search } },
      { user: { name: { contains: search } } },
      { user: { email: { contains: search } } },
    ]
  }

  // Sort options
  const orderBy = {}
  if (sortBy === 'totalAmount') {
    orderBy.totalAmount = sortOrder
  } else if (sortBy === 'status') {
    orderBy.status = sortOrder
  } else if (sortBy === 'orderNumber') {
    orderBy.orderNumber = sortOrder
  } else {
    orderBy.createdAt = sortOrder
  }

  return db.order.findMany({
    where,
    orderBy,
    take: limit,
    skip: offset,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      shippingAddress: true,
      billingAddress: true,
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
          printableItem: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              price: true,
            },
          },
        },
      },
      payments: true,
    },
  })
}

export const ordersCount = async ({ status, userId, search }) => {
  requireAuth({ roles: ['ADMIN'] })

  const where = {}

  if (status) {
    where.status = status
  }

  if (userId) {
    where.userId = userId
  }

  if (search) {
    where.OR = [
      { orderNumber: { contains: search } },
      { user: { name: { contains: search } } },
      { user: { email: { contains: search } } },
    ]
  }

  return db.order.count({ where })
}

export const order = async ({ id }) => {
  const { currentUser } = context

  const result = await db.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      shippingAddress: true,
      billingAddress: true,
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              price: true,
            },
          },
          printableItem: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              price: true,
            },
          },
        },
      },
      payments: true,
    },
  })

  // Authorization check: user must own the order or be an admin
  if (currentUser) {
    if (currentUser.roles?.includes('ADMIN') || result?.userId === currentUser.id) {
      return result
    } else {
      throw new Error('You do not have permission to view this order')
    }
  } else {
    // Public access allowed for confirmation
    return result
  }
}

export const orderByTrackingToken = async ({ token }) => {
  return db.order.findFirst({
    where: { trackingToken: token },
    include: {
      user: { select: { id: true, name: true } },
      orderItems: {
        include: {
          product: { select: { id: true, name: true, images: true, price: true } },
        },
      },
      payments: true,
    },
  })
}

export const findOrderByNumberAndEmail = ({ orderNumber, email }) => {
  return db.order.findFirst({
    where: {
      orderNumber: {
        equals: orderNumber,
        mode: 'insensitive',
      },
      user: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      shippingAddress: true,
      billingAddress: true,
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              price: true,
            },
          },
          printableItem: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              price: true,
            },
          },
        },
      },
      payments: true,
    },
  })
}

export const createOrder = async ({ input }) => {
  requireAuth()

  try {
    const {
      shippingAddress,
      billingAddress,
      orderItems,
      ...orderData
    } = input

    // Generate order number if not provided
    const orderNumber = orderData.orderNumber || `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create shipping address first
    const createdShippingAddress = await db.address.create({
      data: {
        ...shippingAddress,
        userId: orderData.userId
      }
    })

    // Create billing address (use shipping if not provided)
    const billingAddressData = billingAddress || shippingAddress
    const createdBillingAddress = await db.address.create({
      data: {
        ...billingAddressData,
        userId: orderData.userId
      }
    })

    // Create the order with address IDs
    const finalOrderData = {
      ...orderData,
      orderNumber,
      shippingCost: orderData.shippingCost || 0,
      taxAmount: orderData.taxAmount || 0,
      shippingAddressId: createdShippingAddress.id,
      billingAddressId: createdBillingAddress.id,
      orderItems: {
        create: orderItems
      }
    }

    const order = await db.order.create({
      data: finalOrderData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        },
        shippingAddress: true,
        billingAddress: true,
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                price: true,
              },
            },
            printableItem: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
        payments: true
      }
    })

    return order
  } catch (error) {
    console.error('Error creating order:', error)
    throw new Error(`Failed to create order: ${error.message}`)
  }
}

export const updateOrder = ({ id, input }) => {
  requireAuth({ roles: ['ADMIN'] })
  return db.order.update({
    data: input,
    where: { id },
  })
}

export const updateTrackingInfo = ({ id, input }) => {
  requireAuth({ roles: ['ADMIN'] })

  // Parse trackingEvents if it's a string
  const data = { ...input }
  if (data.trackingEvents && typeof data.trackingEvents === 'string') {
    try {
      data.trackingEvents = JSON.parse(data.trackingEvents)
    } catch (error) {
      console.error('Invalid trackingEvents JSON:', error)
      throw new Error('Invalid tracking events format')
    }
  }

  return db.order.update({
    data,
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      shippingAddress: true,
      billingAddress: true,
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              price: true,
            },
          },
          printableItem: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      },
      payments: true,
    },
  })
}

export const updateOrderStatus = async ({ id, status }) => {
  requireAuth({ roles: ['ADMIN'] })
  
  const order = await db.order.update({
    data: { 
      status,
      updatedAt: new Date(),
    },
    where: { id },
  })
  
  // If order is being confirmed and has a completed payment, send confirmation email
  if (status === 'CONFIRMED') {
    try {
      const payment = await db.payment.findFirst({
        where: { 
          orderId: id,
          status: 'COMPLETED'
        }
      })
      
      if (payment) {
        await sendOrderConfirmationEmailById({
          orderId: id
        })
      }
    } catch (emailError) {
      console.error('Failed to send order confirmation email for manually confirmed order:', emailError)
    }
  }
  
  return order
}

export const deleteOrder = ({ id }) => {
  requireAuth({ roles: ['ADMIN'] })
  return db.order.delete({
    where: { id },
  })
}

export const Order = {
  user: (_obj, { root }) => {
    return db.order.findUnique({ where: { id: root?.id } }).user()
  },
  shippingAddress: (_obj, { root }) => {
    return db.order.findUnique({ where: { id: root?.id } }).shippingAddress()
  },
  billingAddress: (_obj, { root }) => {
    return db.order.findUnique({ where: { id: root?.id } }).billingAddress()
  },
  orderItems: (_obj, { root }) => {
    return db.order.findUnique({ where: { id: root?.id } }).orderItems({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: true,
            price: true,
          },
        },
        printableItem: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    })
  },
  payments: (_obj, { root }) => {
    return db.order.findUnique({ where: { id: root?.id } }).payments()
  },
}