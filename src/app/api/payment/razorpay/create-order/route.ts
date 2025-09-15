import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
  console.log('🔵 [CREATE-ORDER] Starting Razorpay order creation');
  
  // Initialize Razorpay inside the function to avoid build-time errors
  console.log('🔑 [CREATE-ORDER] Initializing Razorpay with credentials');
  console.log('🔑 [CREATE-ORDER] Key ID:', process.env.RAZORPAY_KEY_ID ? `${process.env.RAZORPAY_KEY_ID.substring(0, 8)}...` : 'NOT FOUND');
  console.log('🔑 [CREATE-ORDER] Key Secret:', process.env.RAZORPAY_KEY_SECRET ? 'SET' : 'NOT FOUND');
  
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
  
  try {
    console.log('👤 [CREATE-ORDER] Authenticating user');
    const { userId } = await auth();
    console.log('👤 [CREATE-ORDER] User ID:', userId);
    
    if (!userId) {
      console.error('❌ [CREATE-ORDER] User not authenticated');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('📝 [CREATE-ORDER] Parsing request body');
    const { amount, currency, credits } = await request.json();
    console.log('📝 [CREATE-ORDER] Request data:', { amount, currency, credits });

    if (!amount || !currency || !credits) {
      console.error('❌ [CREATE-ORDER] Missing required fields:', { amount, currency, credits });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate currency
    if (currency !== 'INR') {
      console.error('❌ [CREATE-ORDER] Invalid currency:', currency);
      return NextResponse.json(
        { error: 'Razorpay only supports INR currency' },
        { status: 400 }
      );
    }
    console.log('✅ [CREATE-ORDER] Currency validation passed');

    // Get user from database
    console.log('🔍 [CREATE-ORDER] Finding user in database');
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    console.log('👤 [CREATE-ORDER] User found:', user ? `ID: ${user.id}, Email: ${user.email}` : 'NOT FOUND');

    if (!user) {
      console.error('❌ [CREATE-ORDER] User not found in database');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create Razorpay order
    const orderAmount = Math.round(amount * 100); // Convert to paise
    const receipt = `cr_${user.id}_${Date.now().toString().slice(-8)}`;
    
    console.log('💰 [CREATE-ORDER] Creating Razorpay order with:', {
      amount: orderAmount,
      currency: 'INR',
      receipt: receipt,
      notes: {
        userId: user.id,
        credits: credits.toString(),
      }
    });
    
    const razorpayOrder = await razorpay.orders.create({
      amount: orderAmount,
      currency: 'INR',
      receipt: receipt,
      notes: {
        userId: user.id,
        credits: credits.toString(),
      },
    });
    
    console.log('✅ [CREATE-ORDER] Razorpay order created:', {
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      status: razorpayOrder.status
    });

    // Check for existing pending transactions for this user to handle retry scenarios
    console.log('🔍 [CREATE-ORDER] Checking for existing pending transactions');
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        userId: user.id,
        status: 'PENDING',
        amount: amount,
        credits: credits,
        paymentGateway: 'RAZORPAY'
      },
      orderBy: { createdAt: 'desc' }
    });
    
    let transaction;
    if (existingTransaction) {
      console.log('🔄 [CREATE-ORDER] Found existing pending transaction, updating attempt count:', existingTransaction.id);
      transaction = await prisma.transaction.update({
        where: { id: existingTransaction.id },
        data: {
          razorpayOrderId: razorpayOrder.id,
          attemptCount: { increment: 1 },
          lastAttemptAt: new Date(),
          metadata: {
            retryAttempt: true,
            previousOrderId: existingTransaction.razorpayOrderId,
            newOrderId: razorpayOrder.id
          }
        }
      });
    } else {
      console.log('💾 [CREATE-ORDER] Creating new transaction record');
      transaction = await prisma.transaction.create({
        data: {
          userId: user.id,
          type: 'CREDIT_PURCHASE',
          amount: amount,
          credits: credits,
          paymentGateway: 'RAZORPAY',
          status: 'PENDING',
          razorpayOrderId: razorpayOrder.id,
          description: `Paid ₹${amount} via Razorpay`,
          attemptCount: 1,
          lastAttemptAt: new Date()
        },
      });
    }
    
    console.log('✅ [CREATE-ORDER] Transaction created:', {
      id: transaction.id,
      amount: transaction.amount,
      credits: transaction.credits,
      status: transaction.status
    });

    const response = {
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      transactionId: transaction.id,
    };
    
    console.log('🎉 [CREATE-ORDER] Sending successful response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('💥 [CREATE-ORDER] Error occurred:', error);
    console.error('💥 [CREATE-ORDER] Error type:', typeof error);
    console.error('💥 [CREATE-ORDER] Error message:', error instanceof Error ? error.message : String(error));
    console.error('💥 [CREATE-ORDER] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Log additional error details if it's a Razorpay error
    if (error && typeof error === 'object' && 'statusCode' in error) {
      console.error('💥 [CREATE-ORDER] Razorpay error details:', JSON.stringify(error, null, 2));
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}