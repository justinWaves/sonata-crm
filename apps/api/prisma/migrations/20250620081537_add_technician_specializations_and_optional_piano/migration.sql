-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_pianoId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "pianoId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Technician" ADD COLUMN     "isMusicTeacher" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPianoTechnician" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_pianoId_fkey" FOREIGN KEY ("pianoId") REFERENCES "Piano"("id") ON DELETE SET NULL ON UPDATE CASCADE;
