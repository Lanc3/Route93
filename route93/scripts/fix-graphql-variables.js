import fs from 'fs'
import path from 'path'

const filesToFix = [
  'web/src/contexts/CartContext.jsx',
  'web/src/components/OrderConfirmationCell/OrderConfirmationCell.jsx',
  'web/src/components/OrderDetailsCell/OrderDetailsCell.jsx',
  'web/src/components/ProductForm/ProductForm.jsx',
  'web/src/components/AdminProductsCell/AdminProductsCell.jsx',
  'web/src/components/AdminOrdersCell/AdminOrdersCell.jsx',
  'web/src/components/ProductCell/ProductCell.jsx'
]

function fixGraphQLVariables(filePath) {
  try {
    const fullPath = path.resolve(process.cwd(), filePath)
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`)
      return false
    }

    let content = fs.readFileSync(fullPath, 'utf8')
    let updated = false

    // Fix GraphQL variables that were incorrectly converted from $ to €
    const graphQLVariablePattern = /€([a-zA-Z][a-zA-Z0-9]*)/g
    const matches = content.match(graphQLVariablePattern)
    
    if (matches) {
      content = content.replace(graphQLVariablePattern, '$$$1')
      updated = true
      console.log(`✅ Fixed ${matches.length} GraphQL variables in ${filePath}`)
    }

    if (updated) {
      fs.writeFileSync(fullPath, content, 'utf8')
      return true
    } else {
      console.log(`ℹ️  No GraphQL variable fixes needed in ${filePath}`)
      return false
    }

  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message)
    return false
  }
}

export default async function main() {
  console.log('🔧 Fixing GraphQL variables that were incorrectly converted...\n')

  let totalFixed = 0

  for (const filePath of filesToFix) {
    if (fixGraphQLVariables(filePath)) {
      totalFixed++
    }
  }

  console.log(`\n📊 GraphQL variable fix summary:`)
  console.log(`   Files fixed: ${totalFixed}`)
  
  if (totalFixed > 0) {
    console.log('\n✅ GraphQL variable fixes completed!')
  } else {
    console.log('\nℹ️  No GraphQL variable fixes needed.')
  }
}
