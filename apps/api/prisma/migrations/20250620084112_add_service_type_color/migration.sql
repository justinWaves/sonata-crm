/*
  Warnings:

  - Added the required column `serviceTypeColor` to the `ServiceType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServiceType" ADD COLUMN     "serviceTypeColor" TEXT NOT NULL;
