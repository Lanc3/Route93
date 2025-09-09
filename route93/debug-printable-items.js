const { PrismaClient } = require('@prisma/client');

async function debugPrintableItems() {
  const prisma = new PrismaClient();

  try {
    console.log('=== PRINTABLE ITEMS DEBUG ===');

    // Check all printable items
    const printableItems = await prisma.printableItem.findMany();
    console.log('Total printable items:', printableItems.length);
    printableItems.forEach(item => {
      console.log(`- ID: ${item.id}, Name: ${item.name}, ImageUrl: ${item.imageUrl}`);
    });

    // Check order 29 items
    const order = await prisma.order.findUnique({
      where: { id: 29 },
      include: {
        orderItems: {
          include: {
            product: true,
            printableItem: true
          }
        }
      }
    });

    if (order) {
      console.log('\n=== ORDER 29 ITEMS ===');
      console.log('Order ID:', order.id);
      console.log('Order Number:', order.orderNumber);
      console.log('Total Items:', order.orderItems.length);

      order.orderItems.forEach((item, index) => {
        console.log(`\nItem ${index + 1}:`);
        console.log('- ID:', item.id);
        console.log('- Product:', item.product?.name);
        console.log('- Quantity:', item.quantity);
        console.log('- Design URL:', item.designUrl);
        console.log('- Design ID:', item.designId);
        console.log('- Print Fee:', item.printFee);
        console.log('- Printable Item ID:', item.printableItemId);
        console.log('- Printable Item:', item.printableItem);
        console.log('- Has Printable Item:', !!item.printableItem);
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

debugPrintableItems();

