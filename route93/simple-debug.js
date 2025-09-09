const { PrismaClient } = require('@prisma/client');

async function simpleDebug() {
  const prisma = new PrismaClient();

  try {
    // Check printable items count
    const printableCount = await prisma.printableItem.count();
    console.log('Total printable items in database:', printableCount);

    // Check order 29
    const order = await prisma.order.findUnique({
      where: { id: 29 },
      include: {
        orderItems: true
      }
    });

    if (order) {
      console.log('Order 29 found with', order.orderItems.length, 'items');

      order.orderItems.forEach(item => {
        console.log('Order Item:', {
          id: item.id,
          printableItemId: item.printableItemId,
          designUrl: item.designUrl ? 'present' : 'null',
          printFee: item.printFee
        });
      });
    } else {
      console.log('Order 29 not found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

simpleDebug();

