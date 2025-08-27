import mjml2html from 'mjml'
import Handlebars from 'handlebars'

// Register custom Handlebars helpers
Handlebars.registerHelper('formatPrice', function(price) {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
})

Handlebars.registerHelper('formatDate', function(date) {
  return new Date(date).toLocaleDateString('en-IE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

Handlebars.registerHelper('formatDateTime', function(date) {
  return new Date(date).toLocaleString('en-IE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this)
})

Handlebars.registerHelper('ifGreaterThan', function(arg1, arg2, options) {
  return (arg1 > arg2) ? options.fn(this) : options.inverse(this)
})

export const renderTemplate = (mjmlTemplate, context) => {
  try {
    // Replace Handlebars variables
    const template = Handlebars.compile(mjmlTemplate)
    const mjmlWithData = template(context)
    
    // Convert MJML to HTML
    const { html, errors } = mjml2html(mjmlWithData)
    
    if (errors.length > 0) {
      console.error('MJML compilation errors:', errors)
    }
    
    // Generate plain text version
    const text = htmlToText(html)
    
    return { html, text }
  } catch (error) {
    console.error('Template rendering error:', error)
    throw error
  }
}

// Simple HTML to text conversion
const htmlToText = (html) => {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim()
}
