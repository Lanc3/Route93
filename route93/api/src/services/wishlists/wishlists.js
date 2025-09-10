import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'

export const wishlists = () => {
  return db.wishlist.findMany()
}

export const wishlist = ({ id }) => {
  return db.wishlist.findUnique({
    where: { id },
  })
}

export const myWishlist = async () => {
  requireAuth()
  const { currentUser } = context
  return db.wishlist.findMany({ where: { userId: currentUser.id }, include: { product: true } })
}

export const wishlistByProduct = async ({ productId }) => {
  requireAuth()
  const { currentUser } = context
  return db.wishlist.findFirst({ where: { userId: currentUser.id, productId } })
}

export const createWishlist = ({ input }) => {
  return db.wishlist.create({
    data: input,
  })
}

export const updateWishlist = ({ id, input }) => {
  return db.wishlist.update({
    data: input,
    where: { id },
  })
}

export const deleteWishlist = ({ id }) => {
  return db.wishlist.delete({
    where: { id },
  })
}

export const Wishlist = {
  user: (_obj, { root }) => {
    return db.wishlist.findUnique({ where: { id: root?.id } }).user()
  },
  product: (_obj, { root }) => {
    return db.wishlist.findUnique({ where: { id: root?.id } }).product()
  },
  variant: (_obj, { root }) => {
    return db.wishlist.findUnique({ where: { id: root?.id } }).variant()
  },
}
