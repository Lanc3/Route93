# Order Confirmation Email System

This document explains how to use the order confirmation email system in Route93.

## Overview

The system provides three main functions for sending order confirmation emails:

1. **`sendOrderConfirmationEmail`** - Send email with provided data
2. **`sendOrderConfirmationEmailById`** - Fetch order data and send email
3. **`sendTestOrderConfirmationEmail`** - Test the system with mock or real data

## Functions

### 1. sendOrderConfirmationEmail

Send an order confirmation email with pre-fetched data.

```javascript
import { sendOrderConfirmationEmail } from 'src/services/emails/emails'

await sendOrderConfirmationEmail({
  order: orderData,
  user: userData,
  orderItems: orderItemsData,
  products: productsData
})
```

**Parameters:**
- `order` - Order object with all order details
- `user` - User object with name and email
- `orderItems` - Array of order items with quantities and prices
- `products` - Array of product details (name, SKU, images)

### 2. sendOrderConfirmationEmailById

Fetch order data from database and send confirmation email.

```javascript
import { sendOrderConfirmationEmailById } from 'src/services/emails/emails'

await sendOrderConfirmationEmailById({
  orderId: 123
})
```

**Parameters:**
- `orderId` - The ID of the order to send confirmation for

**What it fetches:**
- Order details (number, status, totals, dates)
- User information (name, email)
- Order items (quantities, prices)
- Product details (name, SKU, images)
- Shipping and billing addresses

### 3. sendTestOrderConfirmationEmail

Test the order confirmation email system.

```javascript
import { sendTestOrderConfirmationEmail } from 'src/services/emails/emails'

// Test with mock data
await sendTestOrderConfirmationEmail({
  to: 'test@example.com'
})

// Test with real order
await sendTestOrderConfirmationEmail({
  to: 'test@example.com',
  orderId: 123
})
```

## Email Content

The order confirmation email includes:

- **Header**: Route93 branding
- **Order Details**: Order number, date, status
- **Order Items Table**: Product images, names, SKUs, quantities, prices
- **Order Summary**: Subtotal, shipping, tax, total
- **Shipping Address**: Complete delivery information
- **Action Button**: Link to view order details
- **Footer**: Support contact information

## Testing

### Test Endpoint

Use the `/emailTest` endpoint to test order confirmation emails:

```bash
# Test with mock data
curl -X POST http://localhost:8911/emailTest \
  -H "Content-Type: application/json" \
  -d '{
    "method": "orderConfirmationMock",
    "email": "your-email@example.com"
  }'

# Test with real order
curl -X POST http://localhost:8911/emailTest \
  -H "Content-Type: application/json" \
  -d '{
    "method": "orderConfirmation",
    "email": "your-email@example.com",
    "orderId": 123
  }'
```

### Test Methods

- **`orderConfirmationMock`** - Send test email with mock order data
- **`orderConfirmation`** - Send real order confirmation for existing order
- **`default`** - Send basic test email

## Integration Examples

### Automatic Order Confirmation (Recommended)

The system now automatically sends order confirmation emails when:

1. **Payment is completed** - Email sent automatically via `createPayment` service
2. **Order status is manually updated to CONFIRMED** - Email sent via `updateOrderStatus` service  
3. **Payment is confirmed via webhook** - Email sent via `confirmPayment` service

**No manual integration needed** - emails are sent automatically!

### Manual Email Sending

```javascript
// Send confirmation for existing order
import { sendOrderConfirmationEmailById } from 'src/services/emails/emails'

await sendOrderConfirmationEmailById({
  orderId: orderId
})
```

### Admin Functions

```javascript
// Resend confirmation email (admin only)
import { resendOrderConfirmationEmail } from 'src/services/payments/payments'

await resendOrderConfirmationEmail({
  orderId: orderId
})
```

### Custom Integration

```javascript
// Send with custom data
import { sendOrderConfirmationEmail } from 'src/services/emails/emails'

await sendOrderConfirmationEmail({
  order: orderData,
  user: userData,
  orderItems: orderItemsData,
  products: productsData
})
```

## Automatic Triggers

The system automatically sends order confirmation emails when:

### 1. Payment Completion
- **Trigger**: `createPayment` with status `'COMPLETED'`
- **Action**: Updates order status to `'CONFIRMED'` and sends email
- **Location**: `api/src/services/payments/payments.js`

### 2. Manual Order Confirmation
- **Trigger**: Admin updates order status to `'CONFIRMED'`
- **Action**: Sends confirmation email if payment exists
- **Location**: `api/src/services/orders/orders.js`

### 3. Webhook Payment Confirmation
- **Trigger**: Stripe webhook confirms payment success
- **Action**: Updates order status and sends confirmation email
- **Location**: `api/src/services/payments/payments.js`

## Email Features

- **Responsive Design**: Works on all devices
- **Professional Styling**: Route93 branding and colors
- **Complete Information**: All order details included
- **Plain Text Fallback**: Accessible email format
- **High Priority**: Marked as high priority for customer attention
- **Tracking**: Full logging and error handling
- **Automatic Sending**: No manual intervention required

## Error Handling

All functions include comprehensive error handling:

- Database connection errors
- Missing order data
- Email sending failures
- Invalid email addresses

Errors are logged with context and re-thrown for proper handling.

## Environment Variables

Make sure these are set:

```bash
REDWOOD_WEB_URL=https://your-domain.com
SMTP_HOST=smtp0101.titan.email
SMTP_USER=aaron@route93.ie
SMTP_PASS=your-smtp-password
```

## Notes

- Emails are sent immediately (no queuing system yet)
- Images use placeholder URLs for testing
- All prices are displayed in Euros (€)
- Dates are formatted for Irish locale
- Shipping address is prominently displayed
