import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

interface TransactionMetadata {
  failures?: Array<{
    gateway: string;
    error: string;
    timestamp: string;
    attemptNumber: number;
  }>;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  console.log('🔴 [LOG-FAILURE] Payment failure logging started');
  
  try {
    const { userId } = await auth();
    console.log('👤 [LOG-FAILURE] User ID:', userId);
    
    if (!userId) {
      console.error('❌ [LOG-FAILURE] User not authenticated');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { gateway, amount, currency, credits, error, timestamp } = await request.json();
    console.log('📝 [LOG-FAILURE] Failure data:', { gateway, amount, currency, credits, error });

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      console.error('❌ [LOG-FAILURE] User not found in database');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find the most recent pending transaction for this user
    const pendingTransaction = await prisma.transaction.findFirst({
      where: {
        userId: user.id,
        status: 'PENDING',
        amount: amount,
        credits: credits
      },
      orderBy: { createdAt: 'desc' }
    });

    if (pendingTransaction) {
      console.log('🔄 [LOG-FAILURE] Updating existing transaction with failure reason and status');
      await prisma.transaction.update({
        where: { id: pendingTransaction.id },
        data: {
          status: 'FAILED',
          failureReason: error || 'Payment cancelled by user',
          lastAttemptAt: new Date(),
          metadata: {
            ...(pendingTransaction.metadata as TransactionMetadata || {}),
            failures: [
              ...((pendingTransaction.metadata as TransactionMetadata)?.failures || []),
              {
                gateway: gateway || 'razorpay',
                error: error || 'Payment cancelled by user',
                timestamp: timestamp || new Date().toISOString(),
                attemptNumber: pendingTransaction.attemptCount
              }
            ]
          }
        }
      });
    } else {
      console.log('⚠️ [LOG-FAILURE] No pending transaction found to update');
    }

    console.log('✅ [LOG-FAILURE] Payment failure logged successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('💥 [LOG-FAILURE] Error logging payment failure:', error);
    return NextResponse.json(
      { error: 'Failed to log payment failure' },
      { status: 500 }
    );
  }
}