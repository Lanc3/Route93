import { db } from 'src/lib/db'

export const priceAlerts = () => {
  return db.priceAlert.findMany()
}

export const priceAlert = ({ id }) => {
  return db.priceAlert.findUnique({
    where: { id },
  })
}

export const createPriceAlert = ({ input }) => {
  return db.priceAlert.create({
    data: input,
  })
}

export const updatePriceAlert = ({ id, input }) => {
  return db.priceAlert.update({
    data: input,
    where: { id },
  })
}

export const deletePriceAlert = ({ id }) => {
  return db.priceAlert.delete({
    where: { id },
  })
}

export const PriceAlert = {
  user: (_obj, { root }) => {
    return db.priceAlert.findUnique({ where: { id: root?.id } }).user()
  },
  product: (_obj, { root }) => {
    return db.priceAlert.findUnique({ where: { id: root?.id } }).product()
  },
  variant: (_obj, { root }) => {
    return db.priceAlert.findUnique({ where: { id: root?.id } }).variant()
  },
}
