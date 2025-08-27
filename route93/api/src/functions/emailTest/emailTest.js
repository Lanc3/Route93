import { sendTestEmail, sendTestOrderConfirmationEmail } from '../../services/emails/emails'

export const handler = async (event, context) => {
  try {
    const { method, email, template, orderId } = JSON.parse(event.body || '{}')
    
    let result
    
    switch (method) {
      case 'orderConfirmation':
        // Test order confirmation email
        result = await sendTestOrderConfirmationEmail({ to: email, orderId })
        break
        
      case 'orderConfirmationMock':
        // Test order confirmation email with mock data
        result = await sendTestOrderConfirmationEmail({ to: email })
        break
        
      default:
        // Default test email
        result = await sendTestEmail({ to: email, template })
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Email sent successfully',
        result: {
          messageId: result.messageId,
          method: method || 'default'
        }
      }),
    }
  } catch (error) {
    console.error('Email test failed:', error)
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Email test failed',
        message: error.message,
      }),
    }
  }
}
