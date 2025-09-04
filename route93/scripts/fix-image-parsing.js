import { db } from '../api/src/lib/db'

/**
 * Fix any products that have invalid JSON in their images field
 */
async function fixProductImages() {
  console.log('🔧 Checking for products with invalid image JSON...')
  
  try {
    const products = await db.product.findMany({
      where: {
        images: {
          not: null
        }
      }
    })

    let fixedCount = 0
    
    for (const product of products) {
      try {
        // Try to parse the existing images
        JSON.parse(product.images)
        // If it parses successfully, it's valid JSON - no action needed
      } catch (error) {
        // If parsing fails, it's likely a plain string or comma-separated values
        console.log(`⚠️  Product "${product.name}" has invalid image JSON: ${product.images}`)
        
        let fixedImages
        if (typeof product.images === 'string') {
          const trimmed = product.images.trim()
          if (trimmed.includes(',')) {
            // Comma-separated URLs
            const urls = trimmed.split(',').map(url => url.trim()).filter(Boolean)
            fixedImages = JSON.stringify(urls)
          } else if (trimmed) {
            // Single URL
            fixedImages = JSON.stringify([trimmed])
          } else {
            // Empty string
            fixedImages = null
          }
        } else {
          fixedImages = null
        }

        if (fixedImages !== product.images) {
          await db.product.update({
            where: { id: product.id },
            data: { images: fixedImages }
          })
          
          console.log(`✅ Fixed images for product "${product.name}": ${fixedImages}`)
          fixedCount++
        }
      }
    }

    console.log(`\n📊 Summary:`)
    console.log(`   Products checked: ${products.length}`)
    console.log(`   Products fixed: ${fixedCount}`)
    
    if (fixedCount > 0) {
      console.log('\n🎉 Image parsing issues have been resolved!')
    } else {
      console.log('\n✅ All product images are already in valid JSON format.')
    }

  } catch (error) {
    console.error('❌ Error fixing product images:', error)
    throw error
  }
}

export default async function main() {
  try {
    await fixProductImages()
  } catch (error) {
    console.error('Script failed:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}
