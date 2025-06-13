/*
  Warnings:

  - Added the required column `technicianId` to the `ServiceType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ServiceType` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `ServiceType` required. This step will fail if there are existing NULL values in that column.
  - Made the column `duration` on table `ServiceType` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `ServiceType` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "ServiceType_name_key";

-- AlterTable
ALTER TABLE "ServiceType" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "technicianId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "duration" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "ServiceType" ADD CONSTRAINT "ServiceType_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "Technician"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
