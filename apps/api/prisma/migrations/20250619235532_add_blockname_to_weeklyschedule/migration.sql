/*
  Warnings:

  - You are about to drop the column `endTime` on the `WeeklySchedule` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[technicianId,date]` on the table `ScheduleException` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[technicianId,dayOfWeek,startTime]` on the table `WeeklySchedule` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `duration` to the `WeeklySchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WeeklySchedule" DROP COLUMN "endTime",
ADD COLUMN     "duration" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleException_technicianId_date_key" ON "ScheduleException"("technicianId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklySchedule_technicianId_dayOfWeek_startTime_key" ON "WeeklySchedule"("technicianId", "dayOfWeek", "startTime");
