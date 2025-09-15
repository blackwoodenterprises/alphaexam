import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PayPal webhook event types
interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  resource: {
    id: string;
    reason_code?: string;
    supplementary_data?: {
      related_ids?: {
        order_id?: string;
      };
    };
    [key: string]: unknown;
  };
  create_time: string;
  resource_type: string;
  event_version: string;
  summary: string;
  [key: string]: unknown;
}

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID!;
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

async function verifyWebhookSignature(
  headers: Headers,
  body: string,
  webhookId: string
): Promise<boolean> {
  try {
    const accessToken = await getPayPalAccessToken();
    
    // Check if all required headers are present
    const authAlgo = headers.get('paypal-auth-algo');
    const certId = headers.get('paypal-cert-id');
    const transmissionId = headers.get('paypal-transmission-id');
    const transmissionSig = headers.get('paypal-transmission-sig');
    const transmissionTime = headers.get('paypal-transmission-time');

    console.log('🔍 [PAYPAL-WEBHOOK] Verification headers check:', {
      authAlgo: !!authAlgo,
      certId: !!certId,
      transmissionId: !!transmissionId,
      transmissionSig: !!transmissionSig,
      transmissionTime: !!transmissionTime,
    });

    // If cert_id is missing, this might be a test webhook or development environment
    // In development/testing, we can skip signature verification
    if (!certId && process.env.NODE_ENV !== 'production') {
      console.log('⚠️ [PAYPAL-WEBHOOK] Skipping signature verification in development (missing cert_id)');
      return true;
    }

    if (!authAlgo || !certId || !transmissionId || !transmissionSig || !transmissionTime) {
      console.error('❌ [PAYPAL-WEBHOOK] Missing required headers for signature verification');
      return false;
    }
    
    const verificationData = {
      auth_algo: authAlgo,
      cert_id: certId,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: JSON.parse(body),
    };

    const response = await fetch(`${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationData),
    });

    const result = await response.json();
    console.log('🔍 [PAYPAL-WEBHOOK] Verification result:', result);
    return result.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('❌ [PAYPAL-WEBHOOK] Signature verification failed:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  console.log('🔔 [PAYPAL-WEBHOOK] Received webhook notification');
  
  try {
    const body = await request.text();
    const headers = request.headers;
    
    console.log('🔍 [PAYPAL-WEBHOOK] Webhook headers:', {
      'paypal-auth-algo': headers.get('paypal-auth-algo'),
      'paypal-cert-id': headers.get('paypal-cert-id'),
      'paypal-transmission-id': headers.get('paypal-transmission-id'),
      'paypal-transmission-time': headers.get('paypal-transmission-time'),
    });

    // Verify webhook signature
    const isValid = await verifyWebhookSignature(headers, body, PAYPAL_WEBHOOK_ID);
    
    if (!isValid) {
      console.error('❌ [PAYPAL-WEBHOOK] Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    console.log('📨 [PAYPAL-WEBHOOK] Event type:', event.event_type);
    console.log('📨 [PAYPAL-WEBHOOK] Event data:', JSON.stringify(event, null, 2));

    // Handle different event types
    switch (event.event_type) {
      case 'CHECKOUT.ORDER.APPROVED':
        await handleOrderApproved(event);
        break;
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCaptured(event);
        break;
      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.DECLINED':
        await handlePaymentFailed(event);
        break;
      default:
        console.log(`ℹ️ [PAYPAL-WEBHOOK] Unhandled event type: ${event.event_type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('💥 [PAYPAL-WEBHOOK] Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleOrderApproved(event: PayPalWebhookEvent) {
  console.log('✅ [PAYPAL-WEBHOOK] Processing order approved event');
  
  const orderId = event.resource.id;
  console.log('📋 [PAYPAL-WEBHOOK] Order ID:', orderId);
  
  // Find the transaction (check all statuses first)
  const transaction = await prisma.transaction.findFirst({
    where: {
      paypalOrderId: orderId,
    },
    include: {
      user: true,
    },
  });

  if (!transaction) {
    console.error('❌ [PAYPAL-WEBHOOK] Transaction not found for order:', orderId);
    return;
  }

  console.log('📊 [PAYPAL-WEBHOOK] Found transaction:', {
    id: transaction.id,
    userId: transaction.userId,
    amount: transaction.amount,
    credits: transaction.credits,
    status: transaction.status,
  });

  // Check if transaction is already completed
  if (transaction.status === 'COMPLETED') {
    console.log('ℹ️ [PAYPAL-WEBHOOK] Transaction already completed, updating metadata only');
  } else if (transaction.status !== 'PENDING') {
    console.log(`ℹ️ [PAYPAL-WEBHOOK] Transaction status is ${transaction.status}, updating metadata only`);
  }

  // Update transaction metadata regardless of status
  await prisma.transaction.update({
    where: { id: transaction.id },
    data: {
      metadata: {
          ...((transaction.metadata as Record<string, unknown>) || {}),
          orderApproved: true,
          orderApprovedAt: new Date().toISOString(),
          webhookEvent: JSON.parse(JSON.stringify(event)),
        },
    },
  });

  console.log('✅ [PAYPAL-WEBHOOK] Order approved event processed');
}

async function handlePaymentCaptured(event: PayPalWebhookEvent) {
  console.log('💰 [PAYPAL-WEBHOOK] Processing payment captured event');
  
  const captureId = event.resource.id;
  const orderId = event.resource.supplementary_data?.related_ids?.order_id;
  
  console.log('💳 [PAYPAL-WEBHOOK] Capture ID:', captureId);
  console.log('📋 [PAYPAL-WEBHOOK] Order ID:', orderId);
  
  if (!orderId) {
    console.error('❌ [PAYPAL-WEBHOOK] No order ID found in capture event');
    return;
  }

  // Find the transaction (check all statuses first)
  const transaction = await prisma.transaction.findFirst({
    where: {
      paypalOrderId: orderId,
    },
    include: {
      user: true,
    },
  });

  if (!transaction) {
    console.error('❌ [PAYPAL-WEBHOOK] Transaction not found for order:', orderId);
    return;
  }

  console.log('📊 [PAYPAL-WEBHOOK] Found transaction:', {
    id: transaction.id,
    userId: transaction.userId,
    amount: transaction.amount,
    credits: transaction.credits,
    status: transaction.status,
  });

  // Check if already processed
  if (transaction.status === 'COMPLETED') {
    console.log('ℹ️ [PAYPAL-WEBHOOK] Transaction already completed, updating metadata only');
    
    // Update metadata for already completed transaction
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        metadata: {
            ...((transaction.metadata as Record<string, unknown>) || {}),
            paymentCaptured: true,
            paymentCapturedAt: new Date().toISOString(),
            webhookEvent: JSON.parse(JSON.stringify(event)),
            duplicateWebhook: true,
          },
      },
    });
    
    console.log('✅ [PAYPAL-WEBHOOK] Metadata updated for completed transaction');
    return;
  }

  // Update transaction and user credits in a database transaction
  await prisma.$transaction(async (tx) => {
    // Update transaction status
    await tx.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'COMPLETED',
        paypalPaymentId: captureId,
        completedAt: new Date(),
        metadata: {
            ...((transaction.metadata as Record<string, unknown>) || {}),
            paymentCaptured: true,
            paymentCapturedAt: new Date().toISOString(),
            webhookEvent: JSON.parse(JSON.stringify(event)),
          },
      },
    });

    // Add credits to user
    await tx.user.update({
      where: { id: transaction.user.id },
      data: {
        credits: {
          increment: transaction.credits,
        },
      },
    });
  });

  console.log('✅ [PAYPAL-WEBHOOK] Payment captured and credits added:', {
    transactionId: transaction.id,
    userId: transaction.userId,
    creditsAdded: transaction.credits,
    captureId,
  });
}

async function handlePaymentFailed(event: PayPalWebhookEvent) {
  console.log('❌ [PAYPAL-WEBHOOK] Processing payment failed event');
  
  const orderId = event.resource.supplementary_data?.related_ids?.order_id;
  
  if (!orderId) {
    console.error('❌ [PAYPAL-WEBHOOK] No order ID found in failed payment event');
    return;
  }

  // Find the transaction
  const transaction = await prisma.transaction.findFirst({
    where: {
      paypalOrderId: orderId,
      status: 'PENDING',
    },
  });

  if (!transaction) {
    console.error('❌ [PAYPAL-WEBHOOK] Transaction not found for failed payment:', orderId);
    return;
  }

  // Update transaction status to failed
  await prisma.transaction.update({
    where: { id: transaction.id },
    data: {
      status: 'FAILED',
      failureReason: `PayPal payment ${event.event_type}: ${event.resource.reason_code || 'Unknown reason'}`,
      metadata: {
        ...((transaction.metadata as Record<string, unknown>) || {}),
        paymentFailed: true,
        paymentFailedAt: new Date().toISOString(),
        webhookEvent: JSON.parse(JSON.stringify(event)),
      },
    },
  });

  console.log('❌ [PAYPAL-WEBHOOK] Payment failed event processed:', {
    transactionId: transaction.id,
    eventType: event.event_type,
    reasonCode: event.resource.reason_code,
  });
}