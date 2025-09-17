import { db } from 'src/lib/db'

export const printOrders = () => {
  return db.printOrder.findMany()
}

export const printOrder = ({ id }) => {
  return db.printOrder.findUnique({
    where: { id },
  })
}

export const createPrintOrder = ({ input }) => {
  return db.printOrder.create({
    data: input,
  })
}

export const updatePrintOrder = ({ id, input }) => {
  return db.printOrder.update({
    data: input,
    where: { id },
  })
}

export const deletePrintOrder = ({ id }) => {
  return db.printOrder.delete({
    where: { id },
  })
}

export const PrintOrder = {
  order: (_obj, { root }) => {
    return db.printOrder.findUnique({ where: { id: root?.id } }).order()
  },
  items: (_obj, { root }) => {
    return db.printOrder.findUnique({ where: { id: root?.id } }).items()
  },
}
