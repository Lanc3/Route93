import PDFDocument from 'pdfkit'
import { db } from 'src/lib/db'

export const handler = async (event) => {
  try {
    const orderId = parseInt(event.queryStringParameters?.orderId)
    if (!orderId) {
      return { statusCode: 400, body: 'orderId is required' }
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        shippingAddress: true,
        billingAddress: true,
        orderItems: {
          include: {
            product: true,
            printableItem: true,
          }
        }
      }
    })

    if (!order) {
      return { statusCode: 404, body: 'Order not found' }
    }

    // Create PDF in memory
    const doc = new PDFDocument({ size: 'A4', margin: 36 })
    const chunks = []
    doc.on('data', (c) => chunks.push(c))

    // Header
    doc.fontSize(18).text('Shipping Label', { align: 'center' })
    doc.moveDown(0.5)
    doc.fontSize(12).text(`Order #: ${order.orderNumber}`)
    doc.text(`Order ID: ${order.id}`)
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`)
    doc.moveDown(1)

    // From (placeholder - company info)
    doc.fontSize(14).text('From:', { underline: true })
    doc.fontSize(12).text('Route93')
    doc.text('Dublin, Ireland')
    doc.text('support@route93.com')
    doc.moveDown(1)

    // To
    const to = order.shippingAddress
    doc.fontSize(14).text('To:', { underline: true })
    doc.fontSize(12).text(`${to.firstName} ${to.lastName}`)
    if (to.company) doc.text(to.company)
    doc.text(to.address1)
    if (to.address2) doc.text(to.address2)
    doc.text(`${to.city}, ${to.state} ${to.zipCode}`)
    doc.text(to.country)
    if (to.phone) doc.text(`Phone: ${to.phone}`)
    doc.moveDown(1)

    // Items summary (brief)
    doc.fontSize(14).text('Contents:', { underline: true })
    doc.fontSize(12)
    order.orderItems.slice(0, 5).forEach((item) => {
      const isCustom = item.designUrl && item.printableItemId && item.printableItem
      const name = isCustom ? `${item.printableItem.name} (Custom on ${item.product.name})` : item.product.name
      doc.text(`• ${item.quantity} x ${name}`)
    })
    if (order.orderItems.length > 5) {
      doc.text(`• ... and ${order.orderItems.length - 5} more`)
    }
    doc.moveDown(1)

    // Optional shipment metadata
    doc.fontSize(14).text('Shipment Info:', { underline: true })
    doc.fontSize(12)
    doc.text(`Carrier: ${order.carrier || 'An Post'}`)
    if (order.trackingNumber) doc.text(`Tracking #: ${order.trackingNumber}`)
    if (order.estimatedDelivery) doc.text(`ETA: ${new Date(order.estimatedDelivery).toLocaleDateString()}`)
    doc.moveDown(1)

    // Footer note
    doc.fontSize(10).fillColor('#555').text('Thank you for your order!', { align: 'center' })

    doc.end()

    const pdfBuffer = await new Promise((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)
    })

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="shipping-label-${order.orderNumber}.pdf"`,
        'Cache-Control': 'no-store'
      },
      body: pdfBuffer.toString('base64'),
      isBase64Encoded: true,
    }
  } catch (e) {
    return { statusCode: 500, body: e.message }
  }
}


