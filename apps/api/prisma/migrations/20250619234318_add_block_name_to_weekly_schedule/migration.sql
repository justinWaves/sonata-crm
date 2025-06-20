/*
  Warnings:

  - Added the required column `blockName` to the `WeeklySchedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ScheduleException_technicianId_date_key";

-- DropIndex
DROP INDEX "WeeklySchedule_technicianId_dayOfWeek_key";

-- AlterTable
ALTER TABLE "WeeklySchedule" ADD COLUMN     "blockName" TEXT NOT NULL;
