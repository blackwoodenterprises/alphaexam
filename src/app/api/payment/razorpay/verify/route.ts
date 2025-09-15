import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [VERIFY] Starting payment verification');
    const { userId } = await auth();
    console.log('👤 [VERIFY] User ID:', userId);
    
    if (!userId) {
      console.error('❌ [VERIFY] Unauthorized - no user ID');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
    console.log('📝 [VERIFY] Request data:', { razorpay_order_id, razorpay_payment_id, razorpay_signature: razorpay_signature ? 'SET' : 'MISSING' });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('❌ [VERIFY] Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify signature
    console.log('🔐 [VERIFY] Verifying signature');
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    console.log('🔐 [VERIFY] Signature match:', expectedSignature === razorpay_signature);
    if (expectedSignature !== razorpay_signature) {
      console.error('❌ [VERIFY] Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Get user from database
    console.log('🔍 [VERIFY] Finding user in database');
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      console.error('❌ [VERIFY] User not found in database');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    console.log('👤 [VERIFY] User found:', { id: user.id, email: user.email });

    // Find the transaction (check both PENDING and COMPLETED status)
    console.log('🔍 [VERIFY] Finding transaction with order ID:', razorpay_order_id);
    const transaction = await prisma.transaction.findFirst({
      where: {
        userId: user.id,
        razorpayOrderId: razorpay_order_id,
        status: {
          in: ['PENDING', 'COMPLETED']
        },
      },
    });

    console.log('💾 [VERIFY] Transaction found:', transaction ? { id: transaction.id, status: transaction.status, credits: transaction.credits } : 'NOT FOUND');
    if (!transaction) {
      console.error('❌ [VERIFY] Transaction not found');
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // If transaction is already completed (processed by webhook), return success
    if (transaction.status === 'COMPLETED') {
      console.log('✅ [VERIFY] Transaction already completed by webhook');
      return NextResponse.json({
        success: true,
        message: 'Payment already verified and processed',
        creditsAdded: transaction.credits,
        alreadyProcessed: true,
      });
    }

    // Update transaction and user credits in a transaction
    console.log('💾 [VERIFY] Updating transaction and user credits');
    await prisma.$transaction(async (tx) => {
      // Update transaction status with comprehensive logging
      console.log('📊 [VERIFY] Transaction update data:', {
        transactionId: transaction.id,
        razorpay_payment_id,
        previousStatus: transaction.status,
        newStatus: 'COMPLETED'
      });
      
      const updatedTransaction = await tx.transaction.update({
         where: { id: transaction.id },
         data: {
           status: 'COMPLETED',
           razorpayPaymentId: razorpay_payment_id,
           completedAt: new Date(),
           lastAttemptAt: new Date(),
           metadata: {
             verificationMethod: 'manual_verify_api',
             verifiedAt: new Date().toISOString(),
             paymentDetails: {
               razorpay_order_id,
               razorpay_payment_id,
               razorpay_signature
             }
           }
         },
       });
      console.log('✅ [VERIFY] Transaction status updated to COMPLETED:', {
        id: updatedTransaction.id,
        status: updatedTransaction.status,
        razorpayPaymentId: updatedTransaction.razorpayPaymentId
      });

      // Add credits to user
      await tx.user.update({
        where: { id: user.id },
        data: {
          credits: {
            increment: transaction.credits,
          },
        },
      });
      console.log('✅ [VERIFY] Credits added to user:', transaction.credits);
    });

    console.log('🎉 [VERIFY] Payment verification completed successfully');
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      creditsAdded: transaction.credits,
    });
  } catch (error) {
    console.error('❌ [VERIFY] Payment verification error:', error);
    console.error('❌ [VERIFY] Error type:', typeof error);
    console.error('❌ [VERIFY] Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('❌ [VERIFY] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Failed to verify payment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}