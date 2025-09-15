import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

interface WebhookMetadata {
  lastFailedPaymentId?: string;
  lastFailureReason?: string;
  failureCount?: number;
  lastFailedAt?: string;
  finalFailureReason?: string;
  markedFailedAt?: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Invalid Razorpay webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    console.log('Razorpay webhook event:', event.event);

    // Handle payment.captured event
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;

      // Find the transaction - look for PENDING or FAILED status
      // (FAILED status might exist due to previous failed payment attempts)
      const transaction = await prisma.transaction.findFirst({
        where: {
          razorpayOrderId: orderId,
          status: {
            in: ['PENDING', 'FAILED']
          },
        },
        include: {
          user: true,
        },
      });

      if (!transaction) {
        console.error('Transaction not found for order:', orderId);
        return NextResponse.json(
          { error: 'Transaction not found' },
          { status: 404 }
        );
      }

      // Check if transaction is already completed to prevent duplicate processing
      if (transaction.status === 'COMPLETED') {
        console.log('Transaction already completed for order:', orderId);
        return NextResponse.json({ received: true });
      }

      // Update transaction and user credits in a database transaction
      await prisma.$transaction(async (tx) => {
        // Update transaction status with comprehensive logging
        console.log('📊 [WEBHOOK] Updating transaction for payment.captured:', {
          orderId,
          paymentId,
          amount: payment.amount,
          currency: payment.currency
        });
        
        await tx.transaction.update({
           where: { id: transaction.id },
           data: {
             status: 'COMPLETED',
             razorpayPaymentId: paymentId,
             completedAt: new Date(),
             lastAttemptAt: new Date(),
             metadata: {
               webhookEvent: 'payment.captured',
               capturedAt: new Date().toISOString(),
               paymentDetails: payment
             }
           },
         });
        console.log('✅ [WEBHOOK] Transaction updated to COMPLETED via webhook');

        // Add credits to user
        await tx.user.update({
          where: { id: transaction.userId },
          data: {
            credits: {
              increment: transaction.credits,
            },
          },
        });
      });

      console.log(`Credits added: ${transaction.credits} for user: ${transaction.userId}`);
    }

    // Handle payment.failed event
    if (event.event === 'payment.failed') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;

      // Find the transaction to update failure tracking
      const transaction = await prisma.transaction.findFirst({
        where: {
          razorpayOrderId: orderId,
          status: {
            in: ['PENDING', 'FAILED']
          },
        },
      });

      if (transaction) {
        // Update transaction with failure info but keep it available for retry
        // Don't mark as FAILED immediately to allow for successful retry
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            lastAttemptAt: new Date(),
            metadata: {
              ...((transaction.metadata as WebhookMetadata) || {}),
              lastFailedPaymentId: paymentId,
              lastFailureReason: payment.error_reason || 'Payment failed',
              failureCount: ((transaction.metadata as WebhookMetadata)?.failureCount || 0) + 1,
              lastFailedAt: new Date().toISOString()
            }
          },
        });

        console.log(`Payment failed for order: ${orderId}, attempt tracked but transaction kept available for retry`);
         
         // If too many failures (>5) and last attempt was more than 1 hour ago, mark as FAILED
         const failureCount = ((transaction.metadata as WebhookMetadata)?.failureCount || 0) + 1;
         const lastAttempt = new Date(transaction.lastAttemptAt || transaction.createdAt);
         const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
         
         if (failureCount > 5 && lastAttempt < oneHourAgo) {
           await prisma.transaction.update({
             where: { id: transaction.id },
             data: {
               status: 'FAILED',
               metadata: {
                 ...((transaction.metadata as WebhookMetadata) || {}),
                 finalFailureReason: 'Too many failed attempts',
                 markedFailedAt: new Date().toISOString()
               }
             },
           });
           console.log(`Transaction marked as FAILED after ${failureCount} attempts for order: ${orderId}`);
         }
       } else {
         console.log(`Payment failed for order: ${orderId}, but no transaction found to update`);
       }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}