import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface PayPalWebhookHeaders {
  'paypal-auth-algo'?: string;
  'paypal-cert-id'?: string;
  'paypal-transmission-id'?: string;
  'paypal-transmission-sig'?: string;
  'paypal-transmission-time'?: string;
  [key: string]: string | undefined;
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

async function verifyPayPalWebhook(headers: PayPalWebhookHeaders, body: string, webhookId: string) {
  try {
    const accessToken = await getPayPalAccessToken();
    
    const verificationData = {
      auth_algo: headers['paypal-auth-algo'],
      cert_id: headers['paypal-cert-id'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
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
    return result.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('PayPal webhook verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headers = Object.fromEntries(request.headers.entries());
    
    // Verify webhook signature (optional but recommended for production)
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (webhookId) {
      const isValid = await verifyPayPalWebhook(headers, body, webhookId);
      if (!isValid) {
        console.error('Invalid PayPal webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 400 }
        );
      }
    }

    const event = JSON.parse(body);
    console.log('PayPal webhook event:', event.event_type);

    // Handle CHECKOUT.ORDER.APPROVED event
    if (event.event_type === 'CHECKOUT.ORDER.APPROVED') {
      const orderId = event.resource.id;
      console.log(`PayPal order approved: ${orderId}`);
      // Order is approved but not yet captured
      // We'll handle the actual credit addition in the capture endpoint
    }

    // Handle PAYMENT.CAPTURE.COMPLETED event
    if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const capture = event.resource;
      const orderId = capture.supplementary_data?.related_ids?.order_id;
      const captureId = capture.id;

      if (!orderId) {
        console.error('No order ID found in capture event');
        return NextResponse.json(
          { error: 'No order ID found' },
          { status: 400 }
        );
      }

      // Find the transaction
      const transaction = await prisma.transaction.findFirst({
        where: {
          paypalOrderId: orderId,
          status: 'PENDING',
        },
        include: {
          user: true,
        },
      });

      if (!transaction) {
        console.error('Transaction not found for PayPal order:', orderId);
        return NextResponse.json(
          { error: 'Transaction not found' },
          { status: 404 }
        );
      }

      // Update transaction and user credits in a database transaction
      await prisma.$transaction(async (tx) => {
        // Update transaction status
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'COMPLETED',
            paypalPaymentId: captureId,
          },
        });

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

    // Handle PAYMENT.CAPTURE.DENIED or PAYMENT.CAPTURE.FAILED events
    if (event.event_type === 'PAYMENT.CAPTURE.DENIED' || event.event_type === 'PAYMENT.CAPTURE.FAILED') {
      const capture = event.resource;
      const orderId = capture.supplementary_data?.related_ids?.order_id;

      if (orderId) {
        // Update transaction status to failed
        await prisma.transaction.updateMany({
          where: {
            paypalOrderId: orderId,
            status: 'PENDING',
          },
          data: {
            status: 'FAILED',
          },
        });

        console.log(`PayPal payment failed for order: ${orderId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}