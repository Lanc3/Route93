-- CreateTable
CREATE TABLE "print_cart_items" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "printableItemId" INTEGER NOT NULL,
    "designId" INTEGER,
    "designPublicId" TEXT,
    "designUrl" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "printFee" DOUBLE PRECISION DEFAULT 0,
    "note" TEXT,
    "basePrice" DOUBLE PRECISION,
    "totalPrice" DOUBLE PRECISION,

    CONSTRAINT "print_cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "print_orders" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'REVIEW',
    "proofUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "print_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "print_order_items" (
    "id" SERIAL NOT NULL,
    "printOrderId" INTEGER NOT NULL,
    "orderItemId" INTEGER,
    "printableItemId" INTEGER NOT NULL,
    "designId" INTEGER,
    "designPublicId" TEXT,
    "designUrl" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "printFee" DOUBLE PRECISION DEFAULT 0,
    "totalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "print_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "print_orders_orderId_key" ON "print_orders"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "print_order_items_orderItemId_key" ON "print_order_items"("orderItemId");

-- AddForeignKey
ALTER TABLE "print_cart_items" ADD CONSTRAINT "print_cart_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "print_cart_items" ADD CONSTRAINT "print_cart_items_printableItemId_fkey" FOREIGN KEY ("printableItemId") REFERENCES "printable_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "print_cart_items" ADD CONSTRAINT "print_cart_items_designId_fkey" FOREIGN KEY ("designId") REFERENCES "designs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "print_orders" ADD CONSTRAINT "print_orders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "print_order_items" ADD CONSTRAINT "print_order_items_printOrderId_fkey" FOREIGN KEY ("printOrderId") REFERENCES "print_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "print_order_items" ADD CONSTRAINT "print_order_items_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "print_order_items" ADD CONSTRAINT "print_order_items_printableItemId_fkey" FOREIGN KEY ("printableItemId") REFERENCES "printable_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "print_order_items" ADD CONSTRAINT "print_order_items_designId_fkey" FOREIGN KEY ("designId") REFERENCES "designs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
