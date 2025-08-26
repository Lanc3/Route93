import { db } from 'src/lib/db'

export const addresses = () => {
  return db.address.findMany()
}

export const address = ({ id }) => {
  return db.address.findUnique({
    where: { id },
  })
}

export const createAddress = ({ input }) => {
  return db.address.create({
    data: input,
  })
}

export const updateAddress = ({ id, input }) => {
  return db.address.update({
    data: input,
    where: { id },
  })
}

export const deleteAddress = ({ id }) => {
  return db.address.delete({
    where: { id },
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
