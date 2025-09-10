import { db } from 'src/lib/db'
import { sendVerificationEmail } from 'src/services/emails/emails'
import { requireAuth } from 'src/lib/auth'
import { context } from '@redwoodjs/graphql-server'

export const users = async ({
  role,
  search,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  limit = 20,
  offset = 0,
}) => {
  requireAuth({ roles: ['ADMIN'] })

  const where = {}

  // Role filter
  if (role) {
    where.role = role
  }

  // Search filter
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
    ]
  }

  // Sort options
  const orderBy = {}
  if (sortBy === 'name') {
    orderBy.name = sortOrder
  } else if (sortBy === 'email') {
    orderBy.email = sortOrder
  } else if (sortBy === 'role') {
    orderBy.role = sortOrder
  } else {
    orderBy.createdAt = sortOrder
  }

  return db.user.findMany({
    where,
    orderBy,
    take: limit,
    skip: offset,
    include: {
      _count: {
        select: {
          orders: true,
          addresses: true,
          cartItems: true,
          reviews: true,
        },
      },
    },
  })
}

export const usersCount = async ({ role, search }) => {
  requireAuth({ roles: ['ADMIN'] })

  const where = {}

  if (role) {
    where.role = role
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
    ]
  }

  return db.user.count({ where })
}

export const user = ({ id }) => {
  requireAuth({ roles: ['ADMIN'] })
  
  return db.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          orders: true,
          addresses: true,
          cartItems: true,
          reviews: true,
        },
      },
      orders: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          totalAmount: true,
          createdAt: true,
        },
      },
      addresses: {
        take: 3,
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}

export const currentUser = () => {
  requireAuth()
  
  const { currentUser } = context
  
  if (!currentUser || !currentUser.id) {
    throw new Error('Authentication context not available. Please log in again.')
  }
  
  return db.user.findUnique({
    where: { id: currentUser.id },
    include: {
      _count: {
        select: {
          orders: true,
          addresses: true,
          cartItems: true,
          reviews: true,
        },
      },
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
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
            },
          },
          billingAddress: true,
          shippingAddress: true,
        },
      },
      addresses: {
        orderBy: [
          { isDefault: 'desc' },
          { createdAt: 'desc' },
        ],
      },
    },
  })
}

export const createUser = ({ input }) => {
  requireAuth({ roles: ['ADMIN'] })
  return db.user.create({
    data: input,
  })
}

export const updateUser = ({ id, input }) => {
  requireAuth({ roles: ['ADMIN'] })
  return db.user.update({
    data: input,
    where: { id },
  })
}

export const updateCurrentUser = ({ input }) => {
  requireAuth()
  
  const { currentUser } = context
  
  if (!currentUser || !currentUser.id) {
    throw new Error('Authentication context not available. Please log in again.')
  }
  
  return db.user.update({
    data: input,
    where: { id: currentUser.id },
  })
}

export const updateUserRole = async ({ id, role }) => {
  requireAuth({ roles: ['ADMIN'] })
  
  // Validate role
  const validRoles = ['CLIENT', 'ADMIN']
  if (!validRoles.includes(role)) {
    throw new Error(`Invalid role: ${role}. Must be one of: ${validRoles.join(', ')}`)
  }

  return db.user.update({
    data: { role },
    where: { id },
  })
}

export const deleteUser = ({ id }) => {
  requireAuth({ roles: ['ADMIN'] })
  return db.user.delete({
    where: { id },
  })
}

export const verifyEmail = async ({ token }) => {
  const user = await db.user.findFirst({ where: { verificationToken: token } })
  if (!user) return false
  await db.user.update({ where: { id: user.id }, data: { emailVerifiedAt: new Date(), verificationToken: null } })
  return true
}

export const resendVerification = async () => {
  requireAuth()
  const { currentUser } = context
  if (!currentUser) throw new Error('Not authenticated')
  await sendVerificationEmail({ userId: currentUser.id })
  return true
}

export const resendVerificationByEmail = async ({ email }) => {
  // Allow unauthenticated users to request resend by providing email
  const user = await db.user.findUnique({ where: { email } })
  if (!user) {
    // Do not reveal whether the email exists
    return true
  }
  // Only resend if not already verified
  if (user.emailVerifiedAt) {
    return true
  }
  await sendVerificationEmail({ userId: user.id })
  return true
}

// No custom resolvers needed when using include in the main query