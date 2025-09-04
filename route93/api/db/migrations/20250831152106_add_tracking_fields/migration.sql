-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "carrier" TEXT DEFAULT 'An Post',
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "estimatedDelivery" TIMESTAMP(3),
ADD COLUMN     "shippedAt" TIMESTAMP(3),
ADD COLUMN     "trackingEvents" JSONB,
ADD COLUMN     "trackingNumber" TEXT;
