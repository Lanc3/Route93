import { db } from 'src/lib/db'
import { sendReviewRequestEmail } from 'src/services/emails/emails'

export const handler = async () => {
  // Send review requests for orders delivered 3 days ago without a request sent
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  const orders = await db.order.findMany({
    where: {
      deliveredAt: { lte: threeDaysAgo },
      reviewRequestSentAt: null,
    },
    select: { id: true }
  })

  let sent = 0
  for (const o of orders) {
    try { await sendReviewRequestEmail({ orderId: o.id }); sent++ } catch (_) {}
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ sent })
  }
}


