import fs from 'fs'
import path from 'path'

const __dirname = process.cwd()

// Files to update
const filesToUpdate = [
  // Core components
  'web/src/components/ProductCard/ProductCard.jsx',
  'web/src/components/EnhancedProductCard/EnhancedProductCard.jsx',
  'web/src/components/ProductCell/ProductCell.jsx',
  'web/src/components/CartButton/CartButton.jsx',
  'web/src/contexts/CartContext.jsx',
  'web/src/pages/ProductPage/ProductPage.jsx',
  'web/src/pages/CartPage/CartPage.jsx',
  
  // Admin components
  'web/src/components/AdminStatsCell/AdminStatsCell.jsx',
  'web/src/components/AdminOrdersCell/AdminOrdersCell.jsx',
  'web/src/components/AdminProductsCell/AdminProductsCell.jsx',
  'web/src/components/ProductForm/ProductForm.jsx',
  
  // Order components
  'web/src/components/OrderDetailsCell/OrderDetailsCell.jsx',
  'web/src/components/OrderConfirmationCell/OrderConfirmationCell.jsx',
  'web/src/components/PurchaseHistoryTab/PurchaseHistoryTab.jsx',
  'web/src/components/CurrentOrdersTab/CurrentOrdersTab.jsx'
]

function updateCurrencyInFile(filePath) {
  try {
    const fullPath = path.resolve(__dirname, filePath)
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`)
      return false
    }

    let content = fs.readFileSync(fullPath, 'utf8')
    let updated = false

    // Replace USD formatPrice functions with EUR
    const oldFormatPrice = /new Intl\.NumberFormat\(['"]en-US['"], \{\s*style: ['"]currency['"],\s*currency: ['"]USD['"][\s\S]*?\}\.format/g
    if (content.match(oldFormatPrice)) {
      content = content.replace(
        oldFormatPrice,
        "new Intl.NumberFormat('en-IE', {\n      style: 'currency',\n      currency: 'EUR'\n    }).format"
      )
      updated = true
      console.log(`✅ Updated formatPrice function in ${filePath}`)
    }

    // Add import for formatPrice utility if formatPrice is used but not imported
    if (content.includes('formatPrice') && !content.includes("from 'src/lib/currency'") && !content.includes('formatPrice = ')) {
      // Find existing imports
      const importMatch = content.match(/import.*from ['"]@redwoodjs\/web['"]/)
      if (importMatch) {
        const importIndex = content.indexOf(importMatch[0]) + importMatch[0].length
        content = content.slice(0, importIndex) + "\nimport { formatPrice } from 'src/lib/currency'" + content.slice(importIndex)
        updated = true
        console.log(`✅ Added formatPrice import to ${filePath}`)
      }
    }

    // Replace inline $ currency symbols with € (but be careful not to replace template literals)
    const dollarMatches = content.match(/\$\{[^}]+\}/g) // Find template literals first
    const templateLiterals = dollarMatches || []
    
    // Replace standalone $ symbols that aren't part of template literals
    const dollarReplacements = content.match(/\$(?!\{)/g)
    if (dollarReplacements && dollarReplacements.length > 0) {
      // Only replace $ that aren't followed by { (template literals)
      content = content.replace(/\$(?!\{)/g, '€')
      updated = true
      console.log(`✅ Replaced ${dollarReplacements.length} $ symbols with € in ${filePath}`)
    }

    if (updated) {
      fs.writeFileSync(fullPath, content, 'utf8')
      return true
    } else {
      console.log(`ℹ️  No currency updates needed in ${filePath}`)
      return false
    }

  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message)
    return false
  }
}

export default async function main() {
  console.log('💶 Starting currency conversion from USD ($) to EUR (€)...\n')

  let totalUpdated = 0
  let totalProcessed = 0

  for (const filePath of filesToUpdate) {
    totalProcessed++
    if (updateCurrencyInFile(filePath)) {
      totalUpdated++
    }
  }

  console.log(`\n📊 Currency conversion summary:`)
  console.log(`   Files processed: ${totalProcessed}`)
  console.log(`   Files updated: ${totalUpdated}`)
  console.log(`   Files unchanged: ${totalProcessed - totalUpdated}`)

  if (totalUpdated > 0) {
    console.log('\n✅ Currency conversion completed successfully!')
    console.log('💡 Next steps:')
    console.log('   1. Test the checkout process with Irish addresses')
    console.log('   2. Verify VAT calculations are working correctly')
    console.log('   3. Check all price displays show € instead of $')
  } else {
    console.log('\nℹ️  No files needed currency updates.')
  }
}
