# PayPal Integration Setup Guide

This guide will help you set up PayPal checkout for international customers.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id_here

# App URL (required for PayPal redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # For development
# NEXT_PUBLIC_APP_URL=https://yourdomain.com  # For production
```

## PayPal Developer Setup

### 1. Create PayPal Developer Account
1. Go to [PayPal Developer](https://developer.paypal.com/)
2. Sign in with your PayPal account or create a new one
3. Navigate to "My Apps & Credentials"

### 2. Create Application
1. Click "Create App"
2. Choose "Default Application" or create a custom name
3. Select your merchant account
4. Choose "Merchant" as the account type
5. Check the following features:
   - **Accept payments** (required)
   - **Process payments** (required)

### 3. Get Credentials
After creating the app, you'll get:
- **Client ID**: Use this for `PAYPAL_CLIENT_ID`
- **Client Secret**: Use this for `PAYPAL_CLIENT_SECRET`

### 4. Configure Webhooks
1. In your PayPal app dashboard, go to "Webhooks"
2. Click "Add Webhook"
3. Set the webhook URL to: `https://yourdomain.com/api/payment/paypal/webhook`
   - For development: `https://your-ngrok-url.ngrok.io/api/payment/paypal/webhook`
4. Select the following event types:
   - `CHECKOUT.ORDER.APPROVED`
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `PAYMENT.CAPTURE.DECLINED`
5. Save the webhook and copy the **Webhook ID** for `PAYPAL_WEBHOOK_ID`

## Testing with Sandbox

### 1. Sandbox Accounts
1. Go to "Sandbox" → "Accounts" in PayPal Developer
2. Create test accounts:
   - **Business Account**: For receiving payments
   - **Personal Account**: For making test payments

### 2. Test Cards
Use these test credit card numbers in sandbox:
- **Visa**: 4111111111111111
- **Mastercard**: 5555555555554444
- **American Express**: 378282246310005
- **Expiry**: Any future date
- **CVV**: Any 3-4 digit number

## Currency Support

- **PayPal**: Supports USD payments for international customers
- **Razorpay**: Supports INR payments for Indian customers

The system automatically:
- Shows PayPal for USD payments
- Shows Razorpay for INR payments
- Disables inappropriate payment methods based on currency

## Payment Flow

1. **User selects PayPal** → Creates PayPal order
2. **Redirects to PayPal** → User completes payment
3. **Returns to success page** → Captures payment and adds credits
4. **Webhook notification** → Backup verification for reliability

## Troubleshooting

### Common Issues

1. **"PayPal only supports USD currency" error**
   - Ensure you're testing with USD amounts
   - Check that currency is set to "USD" in your payment flow

2. **Webhook signature verification fails**
   - Verify `PAYPAL_WEBHOOK_ID` is correct
   - Ensure webhook URL is accessible from internet
   - Check that all required headers are present

3. **Sandbox payments not working**
   - Use sandbox credentials in development
   - Ensure you're using test PayPal accounts
   - Check that sandbox mode is enabled

### Logs
Check the browser console and server logs for detailed error messages:
- PayPal order creation: `🔵 [CREATE-ORDER]`
- Payment capture: `💰 [CAPTURE]`
- Webhook processing: `🔔 [PAYPAL-WEBHOOK]`

## Production Deployment

1. **Switch to Live Credentials**
   - Replace sandbox credentials with live ones
   - Update `PAYPAL_BASE_URL` logic (handled automatically)

2. **Update Webhook URL**
   - Point webhook to your production domain
   - Test webhook delivery in PayPal dashboard

3. **SSL Certificate**
   - Ensure your domain has a valid SSL certificate
   - PayPal requires HTTPS for webhooks

## Security Notes

- Never expose PayPal credentials in client-side code
- All sensitive operations are handled server-side
- Webhook signatures are verified for security
- Payment amounts are validated on the server

## Support

For PayPal-specific issues:
- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal Developer Community](https://developer.paypal.com/community/)
- [PayPal Merchant Technical Support](https://www.paypal.com/merchantsupport/)