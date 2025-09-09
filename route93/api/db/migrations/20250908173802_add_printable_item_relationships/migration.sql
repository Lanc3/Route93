-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "printableItemId" INTEGER;

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "printableItemId" INTEGER;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_printableItemId_fkey" FOREIGN KEY ("printableItemId") REFERENCES "printable_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_printableItemId_fkey" FOREIGN KEY ("printableItemId") REFERENCES "printable_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
