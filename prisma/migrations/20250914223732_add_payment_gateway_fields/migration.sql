-- CreateEnum
CREATE TYPE "public"."PaymentGateway" AS ENUM ('RAZORPAY', 'PAYPAL');

-- AlterTable
ALTER TABLE "public"."transactions" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR',
ADD COLUMN     "paymentGateway" "public"."PaymentGateway" NOT NULL DEFAULT 'RAZORPAY',
ADD COLUMN     "paypalOrderId" TEXT,
ADD COLUMN     "paypalPaymentId" TEXT;
