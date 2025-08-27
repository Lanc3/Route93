import nodemailer from 'nodemailer'
import { logger } from './logger'
import { renderTemplate } from './templates/templateEngine'
import fs from 'fs'
import path from 'path'

// Titan SMTP configuration
const emailConfig = {
  smtp: {
    host: process.env.SMTP_HOST || 'smtp0101.titan.email',
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'true' || true, // SSL/TLS for port 465
    auth: {
      user: process.env.SMTP_USER || 'aaron@route93.ie',
      pass: process.env.SMTP_PASS,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateLimit: 14, // 14 emails per second
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false
    }
  },
  from: {
    email: process.env.SMTP_FROM_EMAIL || 'aaron@route93.ie',
    name: process.env.SMTP_FROM_NAME || 'Route93',
  }
}

// Create reusable transporter
let transporter = null

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport(emailConfig.smtp)
    
    // Verify connection
    transporter.verify((error, success) => {
      if (error) {
        logger.error('Titan SMTP connection failed:', error)
      } else {
        logger.info('✅ Titan SMTP connection verified successfully')
      }
    })
  }
  return transporter
}

// Load template from file
const loadTemplate = (templatePath) => {
  try {
    // Use __dirname to get the current directory of this file
    const templateDir = path.join(__dirname, 'templates')
    const fullPath = path.join(templateDir, `${templatePath}.mjml`)
    
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf8')
    } else {
      throw new Error(`Template not found: ${templatePath}`)
    }
  } catch (error) {
    logger.error(`Failed to load template ${templatePath}:`, error)
    throw error
  }
}

// Send email immediately
export const sendEmail = async ({ to, subject, template, context, priority = 'normal' }) => {
  try {
    // Validate email
    if (!to || !subject) {
      throw new Error('Email and subject are required')
    }
    
    // Load and render template
    const mjmlTemplate = loadTemplate(template)
    const { html, text } = await renderTemplate(mjmlTemplate, context)
    
    // Prepare mail options
    const mailOptions = {
      from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
      to,
      subject,
      html,
      text,
      headers: {
        'X-Priority': priority === 'high' ? '1' : priority === 'low' ? '5' : '3',
        'X-MSMail-Priority': priority === 'high' ? 'High' : priority === 'low' ? 'Low' : 'Normal',
        'Importance': priority === 'high' ? 'high' : priority === 'low' ? 'low' : 'normal'
      }
    }
    
    // Send email
    const result = await getTransporter().sendMail(mailOptions)
    
    logger.info({ 
      to, 
      subject, 
      messageId: result.messageId,
      priority,
      template 
    }, 'Email sent successfully via Titan SMTP')
    
    return result
    
  } catch (error) {
    logger.error({ 
      to, 
      subject, 
      template,
      error: error.message,
      stack: error.stack 
    }, 'Email sending failed')
    throw error
  }
}

// Send email directly with HTML and text content (no template)
export const sendEmailDirect = async ({ to, subject, html, text, priority = 'normal' }) => {
  try {
    // Validate email
    if (!to || !subject || !html) {
      throw new Error('Email, subject, and HTML content are required')
    }
    
    // Prepare mail options
    const mailOptions = {
      from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text if not provided
      headers: {
        'X-Priority': priority === 'high' ? '1' : priority === 'low' ? '5' : '3',
        'X-MSMail-Priority': priority === 'high' ? 'High' : priority === 'low' ? 'Low' : 'Normal',
        'Importance': priority === 'high' ? 'high' : priority === 'low' ? 'low' : 'normal'
      }
    }
    
    // Send email
    const result = await getTransporter().sendMail(mailOptions)
    
    logger.info({ 
      to, 
      subject, 
      messageId: result.messageId,
      priority
    }, 'Email sent successfully via Titan SMTP (direct)')
    
    return result
    
  } catch (error) {
    logger.error({ 
      to, 
      subject,
      error: error.message,
      stack: error.stack 
    }, 'Email sending failed')
    throw error
  }
}

// Queue email for later (if you want to add queue system later)
export const queueEmail = async (emailData) => {
  // For now, just send immediately
  // Later you can integrate with Bull or similar
  return await sendEmail(emailData)
}

// Test email function
export const testEmailConnection = async () => {
  try {
    const transporter = getTransporter()
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          reject(error)
        } else {
          resolve(success)
        }
      })
    })
    return true
  } catch (error) {
    logger.error('Email connection test failed:', error)
    return false
  }
}
