-- Delete all existing weekly schedules to prevent data integrity issues
TRUNCATE TABLE "WeeklySchedule" RESTART IDENTITY;

/*
  Warnings:

  - You are about to drop the column `duration` on the `WeeklySchedule` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `WeeklySchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WeeklySchedule" DROP COLUMN "duration",
ADD COLUMN     "endTime" TEXT NOT NULL;
