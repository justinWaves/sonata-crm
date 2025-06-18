/*
  Warnings:

  - You are about to drop the column `wantUpdates` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "wantUpdates",
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "emailUpdates" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "textUpdates" BOOLEAN NOT NULL DEFAULT true;
