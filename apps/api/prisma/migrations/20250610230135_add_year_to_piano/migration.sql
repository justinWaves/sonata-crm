/*
  Warnings:

  - You are about to drop the `Tech` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_techId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_techId_fkey";

-- AlterTable
ALTER TABLE "Piano" ADD COLUMN     "year" INTEGER;

-- DropTable
DROP TABLE "Tech";

-- CreateTable
CREATE TABLE "Technician" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Technician_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Technician_email_key" ON "Technician"("email");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_techId_fkey" FOREIGN KEY ("techId") REFERENCES "Technician"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_techId_fkey" FOREIGN KEY ("techId") REFERENCES "Technician"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
