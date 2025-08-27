// Simple test script for the email system
const { sendEmail } = require('./api/src/lib/email.js')

async function testEmail() {
  try {
    console.log('🧪 Testing Route93 Email System...')
    console.log('📧 SMTP Host:', process.env.SMTP_HOST)
    console.log('📧 SMTP User:', process.env.SMTP_USER)
    
    const result = await sendEmail({
      to: 'aaron@route93.ie',
      subject: 'Test Email - Route93 Email System',
      template: 'auth/passwordReset',
      context: {
        userName: 'Test User',
        resetUrl: 'https://example.com/test',
        expiresIn: '24 hours',
        supportEmail: 'aaron@route93.ie'
      },
      priority: 'normal'
    })
    
    console.log('✅ Email sent successfully!')
    console.log('📨 Message ID:', result.messageId)
    console.log('📧 To:', result.accepted)
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message)
    console.error('🔍 Full error:', error)
  }
}

// Run the test
testEmail()

