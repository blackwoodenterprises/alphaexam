import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch user's transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10, // Limit to last 10 transactions
      select: {
        id: true,
        type: true,
        amount: true,
        credits: true,
        status: true,
        description: true,
        createdAt: true,
        currency: true,
        paymentGateway: true,
        razorpayPaymentId: true,
        paypalPaymentId: true,
      },
    });

    return NextResponse.json({ 
      transactions
    });

  } catch (error) {
    console.error('Get user transactions API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}