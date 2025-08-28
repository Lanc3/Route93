import { db } from 'src/lib/db'

export const reviews = () => {
  return db.review.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export const review = ({ id }) => {
  return db.review.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}

export const createReview = ({ input }) => {
  return db.review.create({
    data: input,
  })
}

export const updateReview = ({ id, input }) => {
  return db.review.update({
    data: input,
    where: { id },
  })
}

export const deleteReview = ({ id }) => {
  return db.review.delete({
    where: { id },
  })
}

export const Review = {
  user: (_obj, { root }) => {
    return db.review.findUnique({ where: { id: root?.id } }).user()
  },
  product: (_obj, { root }) => {
    return db.review.findUnique({ where: { id: root?.id } }).product()
  },
}
