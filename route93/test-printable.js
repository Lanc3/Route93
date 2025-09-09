// Quick test to check printable items
const { PrismaClient } = require('@prisma/client');

async function test() {
  const prisma = new PrismaClient();
  try {
    const count = await prisma.printableItem.count();
    console.log('Printable items count:', count);

    if (count > 0) {
      const items = await prisma.printableItem.findMany({ take: 5 });
      console.log('First 5 printable items:', items.map(item => ({ id: item.id, name: item.name })));
    }

    // Check order item
    const orderItem = await prisma.orderItem.findFirst({
      where: { orderId: 29 },
      include: { printableItem: true }
    });

    if (orderItem) {
      console.log('Order item 29 details:', {
        id: orderItem.id,
        printableItemId: orderItem.printableItemId,
        hasPrintableItem: !!orderItem.printableItem,
        printableItem: orderItem.printableItem
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();

