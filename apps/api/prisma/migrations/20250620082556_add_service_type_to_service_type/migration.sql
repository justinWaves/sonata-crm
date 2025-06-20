/*
  Warnings:

  - Added the required column `serviceType` to the `ServiceType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServiceType" ADD COLUMN     "serviceType" TEXT NOT NULL;
