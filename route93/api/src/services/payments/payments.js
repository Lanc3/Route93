import Stripe from 'stripe'
import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'
import { sendOrderConfirmationEmailById } from 'src/services/emails/emails'

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

export const createPayment = async ({ input }) => {
  requireAuth()
  
  // Validate that orderId is provided
  if (!input.orderId) {
    throw new Error('orderId is required for payment creation')
  }
  
  // Create the payment record
  const payment = await db.payment.create({
    data: input,
    include: {
      order: true
    }
  })
  
  // If payment is completed, send order confirmation email
  if (input.status === 'COMPLETED') {
    try {
      // Update order status to CONFIRMED
      await db.order.update({
        where: { id: input.orderId },
        data: { status: 'CONFIRMED' }
      })
      
      // Send order confirmation email
      await sendOrderConfirmationEmailById({
        orderId: input.orderId
      })
      
      console.log(`Order confirmation email sent for order ${input.orderId}`)
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError)
      // Don't throw error here - payment was successful, email failure shouldn't break the flow
    }
  }
  
  return payment
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

// Admin function to manually send order confirmation email
export const resendOrderConfirmationEmail = async ({ orderId }) => {
  requireAuth({ roles: ['ADMIN'] })
  
  try {
    // Verify order exists and has a completed payment
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        payments: {
          where: { status: 'COMPLETED' }
        }
      }
    })
    
    if (!order) {
      throw new Error('Order not found')
    }
    
    if (order.payments.length === 0) {
      throw new Error('Order has no completed payments')
    }
    
    // Send the order confirmation email
    await sendOrderConfirmationEmailById({
      orderId: orderId
    })
    
    console.log(`Order confirmation email resent for order ${orderId}`)
    
    return { success: true, message: 'Order confirmation email sent successfully' }
    
  } catch (error) {
    console.error('Failed to resend order confirmation email:', error)
    throw new Error(`Failed to resend order confirmation email: ${error.message}`)
  }
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
        // Update order status to CONFIRMED
        await db.order.update({
          where: { id: orderId },
          data: { status: 'CONFIRMED' }
        })

        // Update payment status
        await db.payment.updateMany({
          where: { orderId },
          data: { 
            status: 'COMPLETED',
            stripePaymentIntentId: paymentIntentId
          }
        })
        
        // Send order confirmation email
        try {
          await sendOrderConfirmationEmailById({
            orderId: orderId
          })
          
          console.log(`Order confirmation email sent for order ${orderId} via webhook`)
        } catch (emailError) {
          console.error('Failed to send order confirmation email via webhook:', emailError)
          // Don't throw error here - payment was successful, email failure shouldn't break the flow
        }
      }
    }

    return paymentIntent
  } catch (error) {
    console.error('Error confirming payment:', error)
    throw new Error(`Payment confirmation failed: ${error.message}`)
  }
}