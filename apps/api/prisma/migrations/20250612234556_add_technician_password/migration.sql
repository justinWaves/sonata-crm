/*
  Warnings:

  - Added the required column `password` to the `Technician` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Technician" ADD COLUMN     "password" TEXT NOT NULL;
