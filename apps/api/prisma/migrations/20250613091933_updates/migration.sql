/*
  Warnings:

  - Made the column `technicianId` on table `ServiceType` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `ServiceType` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ServiceType" ALTER COLUMN "technicianId" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Technician" ADD COLUMN     "websiteURL" TEXT;
