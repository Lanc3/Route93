// Quick script to check printable items in database
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkPrintableItems() {
  try {
    console.log('=== CHECKING PRINTABLE ITEMS ===')

    // Check all printable items
    const allItems = await prisma.printableItem.findMany()
    console.log('All printable items:', allItems)
    console.log('Total count:', allItems.length)

    // Check specific item with ID 1
    const item1 = await prisma.printableItem.findUnique({
      where: { id: 1 }
    })
    console.log('Item with ID 1:', item1)

    // Check order items with printableItemId
    const orderItemsWithPrintable = await prisma.orderItem.findMany({
      where: {
        printableItemId: { not: null }
      },
      include: {
        printableItem: true
      }
    })
    console.log('Order items with printableItemId:', orderItemsWithPrintable)
    console.log('Count:', orderItemsWithPrintable.length)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkPrintableItems()
