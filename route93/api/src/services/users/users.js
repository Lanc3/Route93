import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'

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

export const User = {
  orders: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).orders()
  },
  addresses: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).addresses()
  },
  cartItems: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).cartItems()
  },
  reviews: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).reviews()
  },
}