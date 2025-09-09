const { PrismaClient } = require('@prisma/client');

async function checkOrder() {
  const prisma = new PrismaClient();

  try {
    const order = await prisma.order.findUnique({
      where: { id: 29 },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    console.log('Order 29 exists:', !!order);
    if (order) {
      console.log('Order details:', {
        id: order.id,
        orderNumber: order.orderNumber,
        userId: order.userId,
        userEmail: order.user?.email,
        status: order.status,
        createdAt: order.createdAt
      });
    } else {
      console.log('Order 29 not found in database');
    }
  } catch (error) {
    console.error('Error checking order:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrder();

