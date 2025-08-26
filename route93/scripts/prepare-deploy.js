#!/usr/bin/env node

/**
 * Pre-deployment preparation script
 * Ensures the application is ready for production deployment
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Preparing Route93 for deployment...\n')

// Check if we're using PostgreSQL for production
const schemaPath = path.join(__dirname, '..', 'api', 'db', 'schema.prisma')
const schemaContent = fs.readFileSync(schemaPath, 'utf8')

if (schemaContent.includes('provider = "sqlite"')) {
  console.log('⚠️  Warning: Still using SQLite. For production, update schema.prisma to use PostgreSQL:')
  console.log('   datasource db {')
  console.log('     provider = "postgresql"')
  console.log('     url      = env("DATABASE_URL")')
  console.log('   }\n')
}

// Check environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'SESSION_SECRET',
  'STRIPE_SECRET_KEY',
  'REDWOOD_ENV_STRIPE_PUBLISHABLE_KEY'
]

console.log('🔍 Checking environment variables...')
const missingVars = []

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName)
  }
})

if (missingVars.length > 0) {
  console.log('⚠️  Missing environment variables:')
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`)
  })
  console.log('\nMake sure to set these in your Vercel dashboard.\n')
} else {
  console.log('✅ All required environment variables are set.\n')
}

// Check for test/development values that shouldn't be in production
const testStripeKey = process.env.STRIPE_SECRET_KEY
if (testStripeKey && testStripeKey.includes('sk_test_')) {
  console.log('⚠️  Warning: Using test Stripe keys. Make sure to use live keys in production.\n')
}

// Verify Prisma client is generated
console.log('🔧 Generating Prisma client...')
try {
  execSync('yarn rw prisma generate', { stdio: 'inherit' })
  console.log('✅ Prisma client generated successfully.\n')
} catch (error) {
  console.log('❌ Failed to generate Prisma client:', error.message)
  process.exit(1)
}

// Generate GraphQL types
console.log('📝 Generating GraphQL types...')
try {
  execSync('yarn rw g types', { stdio: 'inherit' })
  console.log('✅ GraphQL types generated successfully.\n')
} catch (error) {
  console.log('❌ Failed to generate GraphQL types:', error.message)
  process.exit(1)
}

// Build the application
console.log('🏗️  Building application...')
try {
  execSync('yarn rw build', { stdio: 'inherit' })
  console.log('✅ Application built successfully.\n')
} catch (error) {
  console.log('❌ Build failed:', error.message)
  process.exit(1)
}

// Check build output
const webDistPath = path.join(__dirname, '..', 'web', 'dist')
const apiDistPath = path.join(__dirname, '..', 'api', 'dist')

if (!fs.existsSync(webDistPath)) {
  console.log('❌ Web build output not found')
  process.exit(1)
}

if (!fs.existsSync(apiDistPath)) {
  console.log('❌ API build output not found')
  process.exit(1)
}

console.log('✅ Build outputs verified.\n')

// Final checklist
console.log('📋 Deployment Checklist:')
console.log('   ✅ Prisma client generated')
console.log('   ✅ GraphQL types generated')
console.log('   ✅ Application built successfully')
console.log('   ✅ Build outputs verified')

if (schemaContent.includes('provider = "postgresql"')) {
  console.log('   ✅ Using PostgreSQL for production')
} else {
  console.log('   ⚠️  Still using SQLite (update for production)')
}

if (missingVars.length === 0) {
  console.log('   ✅ Environment variables configured')
} else {
  console.log('   ⚠️  Some environment variables missing')
}

console.log('\n🎉 Route93 is ready for deployment!')
console.log('\nNext steps:')
console.log('1. Push your code to GitHub')
console.log('2. Connect to Vercel and import your repository')
console.log('3. Set environment variables in Vercel dashboard')
console.log('4. Deploy!')
console.log('\nSee DEPLOYMENT.md for detailed instructions.\n')
