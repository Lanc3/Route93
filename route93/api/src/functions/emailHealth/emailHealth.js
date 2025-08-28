import { testEmailConnection } from 'src/lib/email'

export const handler = async (event, context) => {
  try {
    // Test SMTP connection
    const smtpWorking = await testEmailConnection()
    
    // Check environment variables
    const envCheck = {
      SMTP_HOST: process.env.SMTP_HOST ? '✅ Set' : '❌ Missing',
      SMTP_PORT: process.env.SMTP_PORT ? '✅ Set' : '❌ Missing',
      SMTP_USER: process.env.SMTP_USER ? '✅ Set' : '❌ Missing',
      SMTP_PASS: process.env.SMTP_PASS ? '✅ Set' : '❌ Missing',
      REDWOOD_WEB_URL: process.env.REDWOOD_WEB_URL ? '✅ Set' : '❌ Missing',
      NODE_ENV: process.env.NODE_ENV || 'Not set'
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'Email System Health Check',
        timestamp: new Date().toISOString(),
        smtpConnection: smtpWorking ? '✅ Working' : '❌ Failed',
        environment: envCheck,
        message: smtpWorking 
          ? 'Email system is configured correctly' 
          : 'Email system has configuration issues'
      }),
    }
  } catch (error) {
    console.error('Email health check failed:', error)
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'Email System Health Check Failed',
        timestamp: new Date().toISOString(),
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
    }
  }
}
