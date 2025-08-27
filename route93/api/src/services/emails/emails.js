import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { sendEmail, sendEmailDirect } from 'src/lib/email'

export const emails = () => {
  return db.email.findMany()
}

export const email = ({ id }) => {
  return db.email.findUnique({
    where: { id },
  })
}

export const createEmail = ({ input }) => {
  return db.email.create({
    data: input,
  })
}

export const updateEmail = ({ id, input }) => {
  return db.email.update({
    data: input,
    where: { id },
  })
}

export const deleteEmail = ({ id }) => {
  return db.email.delete({
    where: { id },
  })
}

// Email sending methods
export const sendPasswordResetEmail = async ({ email, resetToken, userName }) => {
  try {
    // Create hardcoded HTML email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Route93</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1f2937; color: white; padding: 20px; text-align: center; }
          .content { background-color: #ffffff; padding: 40px 20px; }
          .button { display: inline-block; background-color: #1f2937; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f3f4f6; padding: 30px 20px; text-align: center; color: #6b7280; }
          .warning { background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Route93</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Your trusted partner for quality products</p>
          </div>
          
          <div class="content">
            <h2 style="text-align: center; color: #111827; margin-bottom: 20px;">Reset Your Password</h2>
            
            <p>Hi ${userName || 'there'},</p>
            
            <p>We received a request to reset your password for your Route93 account.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.REDWOOD_WEB_URL}/reset-password?resetToken=${resetToken}" class="button">
                Reset Password
              </a>
            </div>
            
            <div class="warning">
              <p style="margin: 0;"><strong>Important:</strong> This link will expire in 24 hours.</p>
            </div>
            
            <p>If you didn't request this password reset, you can safely ignore this email.</p>
          </div>
          
          <div class="footer">
            <p>Need help? Contact our support team at <a href="mailto:aaron@route93.ie" style="color: #1f2937;">aaron@route93.ie</a></p>
            <p style="font-size: 12px; margin-top: 20px;">© 2025 Route93. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Create plain text version
    const textContent = `
Password Reset - Route93

Hi ${userName || 'there'},

We received a request to reset your password for your Route93 account.

Reset your password here: ${process.env.REDWOOD_WEB_URL}/reset-password?resetToken=${resetToken}

This link will expire in 24 hours.

If you didn't request this password reset, you can safely ignore this email.

Need help? Contact our support team at aaron@route93.ie

© 2025 Route93. All rights reserved.
    `

    // Send email directly without template
    const result = await sendEmailDirect({
      to: email,
      subject: 'Reset Your Password - Route93',
      html: htmlContent,
      text: textContent,
      priority: 'high'
    })
    
    logger.info({ email, type: 'password_reset' }, 'Password reset email sent via Titan SMTP')
    return result
  } catch (error) {
    logger.error({ email, error: error.message }, 'Password reset email failed')
    throw error
  }
}



export const sendLowStockAlert = async ({ productIds, threshold = 10 }) => {
  try {
    const products = await db.product.findMany({
      where: {
        id: { in: productIds },
        inventory: { lt: threshold }
      }
    })
    
    if (products.length === 0) return
    
    const result = await sendEmail({
      to: process.env.ADMIN_EMAIL || 'aaron@route93.ie',
      subject: 'Low Stock Alert - Route93',
      template: 'admin/lowStock',
      context: {
        products,
        threshold,
        adminUrl: `${process.env.REDWOOD_WEB_URL}/admin/inventory`,
        adminEmail: 'aaron@route93.ie'
      },
      priority: 'high'
    })
    
    logger.info({ productIds, threshold }, 'Low stock alert sent via Titan SMTP')
    return result
  } catch (error) {
    logger.error({ error: error.message }, 'Low stock alert failed')
    throw error
  }
}

// Order confirmation email with hardcoded HTML
export const sendOrderConfirmationEmail = async ({ order, user, orderItems, products }) => {
  try {
    // Format order items for display
    const itemsHtml = orderItems.map((item, index) => {
      const product = products.find(p => p.id === item.productId)
      return `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 15px 0; text-align: left;">
            <div style="display: flex; align-items: center;">
              <div style="margin-right: 15px;">
                <img src="${product?.images?.split(',')[0] || '/placeholder-product.jpg'}" 
                     alt="${product?.name || 'Product'}" 
                     style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
              </div>
              <div>
                <h4 style="margin: 0 0 5px 0; color: #111827; font-size: 16px;">${product?.name || 'Product'}</h4>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">SKU: ${product?.sku || 'N/A'}</p>
              </div>
            </div>
          </td>
          <td style="padding: 15px 0; text-align: center; color: #6b7280;">${item.quantity}</td>
          <td style="padding: 15px 0; text-align: right; color: #111827; font-weight: 600;">€${item.price.toFixed(2)}</td>
          <td style="padding: 15px 0; text-align: right; color: #111827; font-weight: 600;">€${item.totalPrice.toFixed(2)}</td>
        </tr>
      `
    }).join('')

    // Create hardcoded HTML email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Route93</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1f2937; color: white; padding: 20px; text-align: center; }
          .content { background-color: #ffffff; padding: 40px 20px; }
          .order-summary { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .order-table th { background-color: #f3f4f6; padding: 12px; text-align: left; font-weight: 600; color: #374151; }
          .order-table td { padding: 12px; }
          .total-section { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .total-row { display: flex; justify-content: space-between; margin: 8px 0; }
          .total-row.final { font-weight: 600; font-size: 18px; color: #111827; border-top: 2px solid #e5e7eb; padding-top: 15px; }
          .button { display: inline-block; background-color: #1f2937; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f3f4f6; padding: 30px 20px; text-align: center; color: #6b7280; }
          .status-badge { display: inline-block; background-color: #10b981; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Route93</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Your trusted partner for quality products</p>
          </div>
          
          <div class="content">
            <h2 style="text-align: center; color: #111827; margin-bottom: 20px;">Order Confirmation</h2>
            
            <p>Hi ${user.name},</p>
            
            <p>Thank you for your order! We're excited to confirm that we've received your order and it's being processed.</p>
            
            <div class="order-summary">
              <h3 style="margin: 0 0 15px 0; color: #111827;">Order Details</h3>
              <p style="margin: 0 0 10px 0;"><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p style="margin: 0 0 10px 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IE')}</p>
              <p style="margin: 0 0 10px 0;"><strong>Status:</strong> <span class="status-badge">${order.status}</span></p>
            </div>
            
            <h3 style="color: #111827; margin: 30px 0 20px 0;">Order Items</h3>
            <table class="order-table">
              <thead>
                <tr>
                  <th style="text-align: left;">Product</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <div class="total-section">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>€${(order.totalAmount - order.shippingCost - order.taxAmount).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Shipping:</span>
                <span>€${order.shippingCost.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Tax:</span>
                <span>€${order.taxAmount.toFixed(2)}</span>
              </div>
              <div class="total-row final">
                <span>Total:</span>
                <span>€${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.REDWOOD_WEB_URL}/orders/${order.id}" class="button">
                View Order Details
              </a>
            </div>
            
            <p><strong>Shipping Address:</strong></p>
            <p style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 10px 0;">
              ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
              ${order.shippingAddress.company ? order.shippingAddress.company + '<br>' : ''}
              ${order.shippingAddress.address1}<br>
              ${order.shippingAddress.address2 ? order.shippingAddress.address2 + '<br>' : ''}
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
              ${order.shippingAddress.country}
            </p>
            
            <p>We'll send you another email when your order ships. If you have any questions, please don't hesitate to contact us.</p>
          </div>
          
          <div class="footer">
            <p>Need help? Contact our support team at <a href="mailto:aaron@route93.ie" style="color: #1f2937;">aaron@route93.ie</a></p>
            <p style="font-size: 12px; margin-top: 20px;">© 2025 Route93. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Create plain text version
    const textContent = `
Order Confirmation - Route93

Hi ${user.name},

Thank you for your order! We're excited to confirm that we've received your order and it's being processed.

Order Details:
- Order Number: ${order.orderNumber}
- Order Date: ${new Date(order.createdAt).toLocaleDateString('en-IE')}
- Status: ${order.status}

Order Items:
${orderItems.map((item, index) => {
  const product = products.find(p => p.id === item.productId)
  return `${product?.name || 'Product'} - Qty: ${item.quantity} - Price: €${item.price.toFixed(2)} - Total: €${item.totalPrice.toFixed(2)}`
}).join('\n')}

Order Summary:
- Subtotal: €${(order.totalAmount - order.shippingCost - order.taxAmount).toFixed(2)}
- Shipping: €${order.shippingCost.toFixed(2)}
- Tax: €${order.taxAmount.toFixed(2)}
- Total: €${order.totalAmount.toFixed(2)}

Shipping Address:
${order.shippingAddress.firstName} ${order.shippingAddress.lastName}
${order.shippingAddress.company ? order.shippingAddress.company + '\n' : ''}
${order.shippingAddress.address1}
${order.shippingAddress.address2 ? order.shippingAddress.address2 + '\n' : ''}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
${order.shippingAddress.country}

View your order details: ${process.env.REDWOOD_WEB_URL}/orders/${order.id}

We'll send you another email when your order ships. If you have any questions, please don't hesitate to contact us.

Need help? Contact our support team at aaron@route93.ie

© 2025 Route93. All rights reserved.
    `

    const result = await sendEmailDirect({
      to: user.email,
      subject: `Order Confirmation #${order.orderNumber} - Route93`,
      html: htmlContent,
      text: textContent,
      priority: 'high'
    })
    
    logger.info({ 
      orderId: order.id, 
      orderNumber: order.orderNumber, 
      userEmail: user.email 
    }, 'Order confirmation email sent successfully via Titan SMTP')
    
    return result
  } catch (error) {
    logger.error({ 
      orderId: order.id, 
      orderNumber: order.orderNumber, 
      userEmail: user.email,
      error: error.message 
    }, 'Order confirmation email failed')
    throw error
  }
}

// Convenience function to send order confirmation email by order ID
export const sendOrderConfirmationEmailById = async ({ orderId }) => {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true
          }
        },
        shippingAddress: true,
        billingAddress: true
      }
    })
    
    if (!order) {
      throw new Error('Order not found')
    }
    
    // Extract products from order items
    const products = order.orderItems.map(item => item.product)
    
    // Send the confirmation email
    return await sendOrderConfirmationEmail({
      order,
      user: order.user,
      orderItems: order.orderItems,
      products
    })
    
  } catch (error) {
    logger.error({ 
      orderId, 
      error: error.message 
    }, 'Failed to send order confirmation email by ID')
    throw error
  }
}

// Test order confirmation email
export const sendTestOrderConfirmationEmail = async ({ to, orderId }) => {
  try {
    if (orderId) {
      // Send real order confirmation if orderId is provided
      return await sendOrderConfirmationEmailById({ orderId })
    } else {
      // Send test order confirmation with mock data
      const mockOrder = {
        id: 999,
        orderNumber: 'TEST-2025-001',
        status: 'CONFIRMED',
        totalAmount: 149.99,
        shippingCost: 9.99,
        taxAmount: 15.00,
        createdAt: new Date(),
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          company: 'Test Company',
          address1: '123 Test Street',
          address2: 'Apt 4B',
          city: 'Dublin',
          state: 'Dublin',
          zipCode: 'D01 ABC1',
          country: 'Ireland'
        }
      }
      
      const mockUser = {
        name: 'John Doe',
        email: to
      }
      
      const mockOrderItems = [
        {
          id: 1,
          quantity: 2,
          price: 49.99,
          totalPrice: 99.98,
          productId: 1
        },
        {
          id: 2,
          quantity: 1,
          price: 50.01,
          totalPrice: 50.01,
          productId: 2
        }
      ]
      
      const mockProducts = [
        {
          id: 1,
          name: 'Test Product 1',
          sku: 'TEST-001',
          images: 'https://via.placeholder.com/300x300?text=Product+1'
        },
        {
          id: 2,
          name: 'Test Product 2',
          sku: 'TEST-002',
          images: 'https://via.placeholder.com/300x300?text=Product+2'
        }
      ]
      
      return await sendOrderConfirmationEmail({
        order: mockOrder,
        user: mockUser,
        orderItems: mockOrderItems,
        products: mockProducts
      })
    }
  } catch (error) {
    logger.error({ to, orderId, error: error.message }, 'Test order confirmation email failed')
    throw error
  }
}

// Test email function
export const sendTestEmail = async ({ to, template = 'test' }) => {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Email - Route93</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1f2937; color: white; padding: 20px; text-align: center; }
          .content { background-color: #ffffff; padding: 40px 20px; }
          .footer { background-color: #f3f4f6; padding: 30px 20px; text-align: center; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Route93</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Your trusted partner for quality products</p>
          </div>
          
          <div class="content">
            <h2 style="text-align: center; color: #111827; margin-bottom: 20px;">Test Email</h2>
            
            <p>Hi Test User,</p>
            
            <p>This is a test email to verify that the Route93 email system is working correctly.</p>
            
            <p>If you received this email, the system is functioning properly!</p>
          </div>
          
          <div class="footer">
            <p>Need help? Contact our support team at <a href="mailto:aaron@route93.ie" style="color: #1f2937;">aaron@route93.ie</a></p>
            <p style="font-size: 12px; margin-top: 20px;">© 2025 Route93. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const textContent = `
Test Email - Route93

Hi Test User,

This is a test email to verify that the Route93 email system is working correctly.

If you received this email, the system is functioning properly!

Need help? Contact our support team at aaron@route93.ie

© 2025 Route93. All rights reserved.
    `

    const result = await sendEmailDirect({
      to,
      subject: 'Test Email - Route93 Email System',
      html: htmlContent,
      text: textContent,
      priority: 'normal'
    })
    
    logger.info({ to, template }, 'Test email sent successfully via Titan SMTP')
    return result
  } catch (error) {
    logger.error({ to, template, error: error.message }, 'Test email failed')
    throw error
  }
}
