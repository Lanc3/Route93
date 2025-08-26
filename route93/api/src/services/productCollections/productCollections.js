import { db } from 'src/lib/db'

export const productCollections = () => {
  return db.productCollection.findMany()
}

export const productCollection = ({ id }) => {
  return db.productCollection.findUnique({
    where: { id },
  })
}

export const createProductCollection = ({ input }) => {
  return db.productCollection.create({
    data: input,
  })
}

export const updateProductCollection = ({ id, input }) => {
  return db.productCollection.update({
    data: input,
    where: { id },
  })
}

export const deleteProductCollection = ({ id }) => {
  return db.productCollection.delete({
    where: { id },
  })
}

export const ProductCollection = {
  product: (_obj, { root }) => {
    return db.productCollection
      .findUnique({ where: { id: root?.id } })
      .product()
  },
  collection: (_obj, { root }) => {
    return db.productCollection
      .findUnique({ where: { id: root?.id } })
      .collection()
  },
}
