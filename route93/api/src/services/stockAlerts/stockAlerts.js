import { db } from 'src/lib/db'
import crypto from 'crypto'
import { sendEmail } from 'src/lib/email'

export const stockAlerts = () => {
  return db.stockAlert.findMany()
}

export const stockAlert = ({ id }) => {
  return db.stockAlert.findUnique({
    where: { id },
  })
}

export const createStockAlert = async ({ input }) => {
  const unsubToken = input.unsubToken || crypto.randomBytes(16).toString('hex')
  return db.stockAlert.create({
    data: { ...input, unsubToken },
  })
}

export const updateStockAlert = ({ id, input }) => {
  return db.stockAlert.update({
    data: input,
    where: { id },
  })
}

export const deleteStockAlert = ({ id }) => {
  return db.stockAlert.delete({
    where: { id },
  })
}

// Notify and cleanup alerts for a product or variant now in stock
export const notifyStockAlerts = async ({ productId, variantId = null }) => {
  const product = await db.product.findUnique({ where: { id: productId } })
  if (!product) return 0

  const alerts = await db.stockAlert.findMany({
    where: { productId, OR: [{ variantId: null }, { variantId }] },
  })

  let sent = 0
  for (const alert of alerts) {
    try {
      if (alert.channel === 'EMAIL' && alert.email) {
        await sendEmail({
          to: alert.email,
          subject: `${product.name} is back in stock`,
          template: 'stock-back',
          context: {
            productName: product.name,
            price: product.salePrice || product.price,
            productUrl: `${process.env.WEB_URL || ''}/product/${product.slug}`,
            imageUrl: '',
            unsubscribeUrl: `${process.env.WEB_URL || ''}/unsubscribe/${alert.unsubToken}`,
          },
        })
      }
      await db.stockAlert.update({ where: { id: alert.id }, data: { notifiedAt: new Date() } })
      await db.stockAlert.delete({ where: { id: alert.id } })
      sent++
    } catch (e) {
      // continue
    }
  }
  return sent
}

export const StockAlert = {
  product: (_obj, { root }) => {
    return db.stockAlert.findUnique({ where: { id: root?.id } }).product()
  },
  variant: (_obj, { root }) => {
    return db.stockAlert.findUnique({ where: { id: root?.id } }).variant()
  },
}
