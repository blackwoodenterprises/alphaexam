-- AlterTable
ALTER TABLE "public"."exam_attempts" ADD COLUMN     "servedQuestions" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "public"."questions" ALTER COLUMN "imageUrl" DROP NOT NULL;
