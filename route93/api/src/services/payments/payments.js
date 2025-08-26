import Stripe from 'stripe'
import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'

// Initialize Stripe with your secret key
// You'll need to set STRIPE_SECRET_KEY in your environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_secret_key_here', {
  apiVersion: '2023-10-16'
})

// Standard CRUD operations
export const payments = () => {
  requireAuth({ roles: ['ADMIN'] })
  return db.payment.findMany({
    include: {
      order: {
        include: {
          user: true
        }
      }
    }
  })
}

export const payment = ({ id }) => {
  requireAuth()
  return db.payment.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          user: true
        }
      }
    }
  })
}

export const createPayment = ({ input }) => {
  requireAuth()
  
  // Validate that orderId is provided
  if (!input.orderId) {
    throw new Error('orderId is required for payment creation')
  }
  
  return db.payment.create({
    data: input,
    include: {
      order: true
    }
  })
}

export const recordFailedPayment = ({ input }) => {
  requireAuth()

  // Validate that orderId is provided
  if (!input.orderId) {
    throw new Error('orderId is required for payment record creation')
  }

  // Ensure status is set to FAILED for failed payments
  const failedPaymentInput = {
    ...input,
    status: 'FAILED'
  }

  return db.payment.create({
    data: failedPaymentInput,
    include: {
      order: true
    }
  })
}

export const updatePayment = ({ id, input }) => {
  requireAuth()
  return db.payment.update({
    data: input,
    where: { id },
    include: {
      order: true
    }
  })
}

export const deletePayment = ({ id }) => {
  requireAuth({ roles: ['ADMIN'] })
  return db.payment.delete({
    where: { id }
  })
}

// Relation resolvers
export const Payment = {
  order: (_obj, { root }) => {
    return db.payment.findUnique({ where: { id: root?.id } }).order()
  }
}

export const createPaymentIntent = async ({ input }) => {
  try {
    const { amount, currency = 'usd', orderId } = input

    // Validate amount
    if (!amount || amount < 50) { // Minimum $0.50
      throw new Error('Invalid payment amount. Minimum amount is $0.50')
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: orderId?.toString() || 'pending'
      }
    })

    // Optionally save payment intent to database
    if (orderId) {
      try {
        await db.payment.updateMany({
          where: { orderId },
          data: {
            stripePaymentIntentId: paymentIntent.id,
            status: 'PENDING'
          }
        })
      } catch (error) {
        console.log('No existing payment record to update, will create during order processing')
      }
    }

    return {
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status
    }

  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw new Error(`Payment intent creation failed: ${error.message}`)
  }
}

// Helper function to confirm payment (can be used in webhooks)
export const confirmPayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    if (paymentIntent.status === 'succeeded') {
      // Update order status in database
      const orderId = parseInt(paymentIntent.metadata.orderId)
      
      if (orderId) {
        await db.order.update({
          where: { id: orderId },
          data: { status: 'PROCESSING' }
        })

        await db.payment.updateMany({
          where: { orderId },
          data: { 
            status: 'COMPLETED',
            stripePaymentIntentId: paymentIntentId
          }
        })
      }
    }

    return paymentIntent
  } catch (error) {
    console.error('Error confirming payment:', error)
    throw new Error(`Payment confirmation failed: ${error.message}`)
  }
}