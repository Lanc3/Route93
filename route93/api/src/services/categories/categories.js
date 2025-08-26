import { db } from 'src/lib/db'

export const categories = () => {
  return db.category.findMany({
    include: {
      _count: {
        select: {
          products: {
            where: {
              status: 'ACTIVE',
            },
          },
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })
}

export const category = ({ id }) => {
  return db.category.findUnique({
    where: { id },
    include: {
      products: {
        where: {
          status: 'ACTIVE',
        },
        take: 10,
      },
      children: true,
      parent: true,
      _count: {
        select: {
          products: {
            where: {
              status: 'ACTIVE',
            },
          },
        },
      },
    },
  })
}

export const categoryBySlug = ({ slug }) => {
  return db.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: {
          status: 'ACTIVE',
        },
        take: 10,
      },
      children: true,
      parent: true,
      _count: {
        select: {
          products: {
            where: {
              status: 'ACTIVE',
            },
          },
        },
      },
    },
  })
}

export const createCategory = ({ input }) => {
  return db.category.create({
    data: input,
  })
}

export const updateCategory = ({ id, input }) => {
  return db.category.update({
    data: input,
    where: { id },
  })
}

export const deleteCategory = ({ id }) => {
  return db.category.delete({
    where: { id },
  })
}

export const Category = {
  products: (_obj, { root }) => {
    return db.category.findUnique({ where: { id: root?.id } }).products()
  },
  children: (_obj, { root }) => {
    return db.category.findUnique({ where: { id: root?.id } }).children()
  },
  parent: (_obj, { root }) => {
    return db.category.findUnique({ where: { id: root?.id } }).parent()
  },
}
