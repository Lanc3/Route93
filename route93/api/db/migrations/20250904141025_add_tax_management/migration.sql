-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "vatRate" DOUBLE PRECISION NOT NULL DEFAULT 23.0;

-- CreateTable
CREATE TABLE "tax_rates" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "country" TEXT NOT NULL DEFAULT 'IE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_records" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerType" TEXT NOT NULL,
    "customerCountry" TEXT NOT NULL DEFAULT 'IE',
    "customerVatNumber" TEXT,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "vatAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "standardVat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reducedVat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "secondReducedVat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "zeroVat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "exemptAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "vatNumber" TEXT,
    "invoiceNumber" TEXT,
    "reverseCharge" BOOLEAN NOT NULL DEFAULT false,
    "taxPeriod" TEXT NOT NULL,
    "reportingYear" INTEGER NOT NULL,
    "reportingQuarter" INTEGER,
    "reportingMonth" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "taxRateId" INTEGER,

    CONSTRAINT "tax_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_returns" (
    "id" SERIAL NOT NULL,
    "period" TEXT NOT NULL,
    "periodType" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalSales" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalVatCollected" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalVatDue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "standardVatSales" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "standardVatAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reducedVatSales" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reducedVatAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "secondReducedVatSales" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "secondReducedVatAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "zeroVatSales" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "exemptSales" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "euB2BSales" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "euB2CSales" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "filedAt" TIMESTAMP(3),
    "filedBy" TEXT,
    "rosReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_returns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tax_records_orderId_key" ON "tax_records"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "tax_returns_period_key" ON "tax_returns"("period");

-- AddForeignKey
ALTER TABLE "tax_records" ADD CONSTRAINT "tax_records_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_records" ADD CONSTRAINT "tax_records_taxRateId_fkey" FOREIGN KEY ("taxRateId") REFERENCES "tax_rates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
