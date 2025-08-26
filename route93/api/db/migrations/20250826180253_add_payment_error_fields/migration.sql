-- AlterTable
ALTER TABLE "payments" ADD COLUMN "errorCode" TEXT;
ALTER TABLE "payments" ADD COLUMN "errorMessage" TEXT;
ALTER TABLE "payments" ADD COLUMN "errorType" TEXT;
