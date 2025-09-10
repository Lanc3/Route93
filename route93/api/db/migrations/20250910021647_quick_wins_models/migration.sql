/*
  Warnings:

  - A unique constraint covering the columns `[trackingToken]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "trackingToken" TEXT;

-- CreateTable
CREATE TABLE "stock_alerts" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "variantId" INTEGER,
    "channel" TEXT NOT NULL DEFAULT 'EMAIL',
    "email" TEXT,
    "phone" TEXT,
    "unsubToken" TEXT NOT NULL,
    "notifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlists" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "variantId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wishlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_alerts" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "email" TEXT,
    "productId" INTEGER NOT NULL,
    "variantId" INTEGER,
    "targetType" TEXT NOT NULL DEFAULT 'SALE',
    "threshold" DOUBLE PRECISION,
    "unsubToken" TEXT NOT NULL,
    "notifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "price_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_synonyms" (
    "id" SERIAL NOT NULL,
    "term" TEXT NOT NULL,
    "synonyms" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "search_synonyms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stock_alerts_unsubToken_key" ON "stock_alerts"("unsubToken");

-- CreateIndex
CREATE UNIQUE INDEX "wishlists_userId_productId_variantId_key" ON "wishlists"("userId", "productId", "variantId");

-- CreateIndex
CREATE UNIQUE INDEX "price_alerts_unsubToken_key" ON "price_alerts"("unsubToken");

-- CreateIndex
CREATE UNIQUE INDEX "search_synonyms_term_key" ON "search_synonyms"("term");

-- CreateIndex
CREATE UNIQUE INDEX "orders_trackingToken_key" ON "orders"("trackingToken");

-- AddForeignKey
ALTER TABLE "stock_alerts" ADD CONSTRAINT "stock_alerts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_alerts" ADD CONSTRAINT "stock_alerts_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_alerts" ADD CONSTRAINT "price_alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_alerts" ADD CONSTRAINT "price_alerts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_alerts" ADD CONSTRAINT "price_alerts_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
