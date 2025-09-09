-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "designId" TEXT,
ADD COLUMN     "designUrl" TEXT,
ADD COLUMN     "printFee" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "designId" TEXT,
ADD COLUMN     "designUrl" TEXT,
ADD COLUMN     "printFee" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "orderType" TEXT NOT NULL DEFAULT 'REGULAR';
