import { db } from 'src/lib/db'

export const printOrderItems = () => {
  return db.printOrderItem.findMany()
}

export const printOrderItem = ({ id }) => {
  return db.printOrderItem.findUnique({
    where: { id },
  })
}

export const createPrintOrderItem = ({ input }) => {
  return db.printOrderItem.create({
    data: input,
  })
}

export const updatePrintOrderItem = ({ id, input }) => {
  return db.printOrderItem.update({
    data: input,
    where: { id },
  })
}

export const deletePrintOrderItem = ({ id }) => {
  return db.printOrderItem.delete({
    where: { id },
  })
}

export const PrintOrderItem = {
  printOrder: (_obj, { root }) => {
    return db.printOrderItem
      .findUnique({ where: { id: root?.id } })
      .printOrder()
  },
  orderItem: (_obj, { root }) => {
    return db.printOrderItem.findUnique({ where: { id: root?.id } }).orderItem()
  },
  printableItem: (_obj, { root }) => {
    return db.printOrderItem
      .findUnique({ where: { id: root?.id } })
      .printableItem()
  },
  design: (_obj, { root }) => {
    return db.printOrderItem.findUnique({ where: { id: root?.id } }).design()
  },
}
