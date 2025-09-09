// Debug script for cart synchronization issues
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function debugCartSync() {
  try {
    console.log('=== CART SYNC DEBUG ===')

    // Check all cart items
    const allCartItems = await prisma.cartItem.findMany({
      include: {
        product: true,
        user: true
      }
    })
    console.log('All cart items:', allCartItems.length)
    console.log('Cart items details:', allCartItems.map(item => ({
      id: item.id,
      userId: item.userId,
      productId: item.productId,
      quantity: item.quantity,
      printableItemId: item.printableItemId
    })))

    // Check for cart items with temporary IDs (this shouldn't happen)
    const tempItems = allCartItems.filter(item => typeof item.id === 'string' && item.id.startsWith('temp-'))
    console.log('Cart items with temporary IDs:', tempItems.length)
    if (tempItems.length > 0) {
      console.log('Temporary ID items:', tempItems)
    }

    // Check for cart items without users (orphaned items)
    const orphanedItems = allCartItems.filter(item => !item.user)
    console.log('Orphaned cart items:', orphanedItems.length)
    if (orphanedItems.length > 0) {
      console.log('Orphaned items:', orphanedItems)
    }

    // Check for cart items with printableItemId
    const customPrintItems = allCartItems.filter(item => item.printableItemId)
    console.log('Custom print cart items:', customPrintItems.length)
    console.log('Custom print items details:', customPrintItems.map(item => ({
      id: item.id,
      printableItemId: item.printableItemId,
      designUrl: !!item.designUrl
    })))

  } catch (error) {
    console.error('Error in debug script:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugCartSync()

