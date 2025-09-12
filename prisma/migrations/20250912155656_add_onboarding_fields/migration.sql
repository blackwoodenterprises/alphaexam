-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "academicLevel" TEXT,
ADD COLUMN     "goals" TEXT,
ADD COLUMN     "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preferredExams" TEXT[];
