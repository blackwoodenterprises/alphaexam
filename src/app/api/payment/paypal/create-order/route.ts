import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
const PAYPAL_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { amount, currency, credits } = await request.json();

    if (!amount || !currency || !credits) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate currency
    if (currency !== 'USD') {
      return NextResponse.json(
        { error: 'PayPal only supports USD currency' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Create PayPal order
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount.toString(),
        },
        description: `${credits} Credits for AlphaExam`,
        custom_id: user.id,
      }],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/paypal/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/paypal/cancel`,
        brand_name: 'AlphaExam',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
      },
    };

    const paypalResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const paypalOrder = await paypalResponse.json();

    if (!paypalResponse.ok) {
      console.error('PayPal order creation error:', paypalOrder);
      return NextResponse.json(
        { error: 'Failed to create PayPal order' },
        { status: 500 }
      );
    }

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'CREDIT_PURCHASE',
        amount: amount,
        credits: credits,
        paymentGateway: 'PAYPAL',
        status: 'PENDING',
        paypalOrderId: paypalOrder.id,
        description: `Purchase of ${credits} credits`,
      },
    });

    // Find approval URL
    const approvalUrl = paypalOrder.links.find(
      (link: PayPalLink) => link.rel === 'approve'
    )?.href;

    return NextResponse.json({
      id: paypalOrder.id,
      approvalUrl,
      transactionId: transaction.id,
    });
  } catch (error) {
    console.error('PayPal order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}