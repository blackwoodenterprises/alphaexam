"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  ArrowLeft,
  Shield,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface PaymentDetails {
  credits: number;
  amount: number;
  currency: 'INR' | 'USD';
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayInstance {
  open(): void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

function PaymentContent() {
  const { isLoaded, userId } = useAuth();
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<'razorpay' | 'paypal' | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      router.push("/sign-in");
      return;
    }

    // Get payment details from URL params
    const credits = searchParams.get('credits');
    const amount = searchParams.get('amount');
    const currency = searchParams.get('currency') as 'INR' | 'USD';

    if (!credits || !amount || !currency) {
      router.push('/buy-credits');
      return;
    }

    setPaymentDetails({
      credits: parseInt(credits),
      amount: parseFloat(amount),
      currency: currency,
    });

    setLoading(false);
  }, [isLoaded, userId, router, searchParams]);

  const handlePayment = async () => {
    if (!paymentDetails || !selectedGateway) return;

    setProcessing(true);

    try {
      if (selectedGateway === 'razorpay') {
        await handleRazorpayPayment();
      } else if (selectedGateway === 'paypal') {
        await handlePaypalPayment();
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!paymentDetails) return;

    // Create order
    const orderResponse = await fetch('/api/payment/razorpay/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        credits: paymentDetails.credits,
      }),
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      throw new Error(orderData.error || 'Failed to create order');
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (!window.Razorpay) {
        alert('Razorpay SDK failed to load');
        return;
      }

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        alert('Razorpay configuration error');
        return;
      }

      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: orderData.amount as number,
        currency: orderData.currency as string,
        name: 'AlphaExam',
        description: `${paymentDetails.credits} Credits`,
        order_id: orderData.id as string,
        handler: async (response: RazorpayResponse) => {
          // Verify payment
          const verifyResponse = await fetch('/api/payment/razorpay/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (verifyResponse.ok) {
            router.push('/dashboard?payment=success');
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: `${clerkUser?.firstName || ''} ${clerkUser?.lastName || ''}`.trim() || 'User',
          email: clerkUser?.emailAddresses[0]?.emailAddress || '',
        },
        theme: {
          color: '#7c3aed',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };
  };

  const handlePaypalPayment = async () => {
    if (!paymentDetails) return;

    // Create PayPal order
    const orderResponse = await fetch('/api/payment/paypal/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        credits: paymentDetails.credits,
      }),
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      throw new Error(orderData.error || 'Failed to create PayPal order');
    }

    // Redirect to PayPal
    window.location.href = orderData.approvalUrl;
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment page...</p>
        </div>
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Invalid payment details</p>
          <Button onClick={() => router.push('/buy-credits')} className="mt-4">
            Go back to credit selection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <main className="py-8">
        <div className="container-restricted px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4 text-purple-600 hover:text-purple-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Credit Selection
            </Button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Complete Payment
              </h1>
              <p className="text-gray-600">
                Secure payment powered by industry-leading providers
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Order Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Credits:</span>
                  <span className="font-semibold">{paymentDetails.credits} Credits</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">
                    {paymentDetails.currency === 'INR' ? '₹' : '$'}{paymentDetails.amount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Currency:</span>
                  <span className="font-semibold">{paymentDetails.currency}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-purple-600">
                    {paymentDetails.currency === 'INR' ? '₹' : '$'}{paymentDetails.amount}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
              <CardDescription>
                Choose your preferred payment gateway
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Razorpay Option */}
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedGateway === 'razorpay'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedGateway('razorpay')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Razorpay</h3>
                        <p className="text-sm text-gray-600">
                          Credit/Debit Cards, UPI, Net Banking, Wallets
                        </p>
                        <p className="text-xs text-gray-500">
                          Recommended for Indian students
                        </p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedGateway === 'razorpay'
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedGateway === 'razorpay' && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* PayPal Option */}
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedGateway === 'paypal'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedGateway('paypal')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">PayPal</h3>
                        <p className="text-sm text-gray-600">
                          PayPal Balance, Credit/Debit Cards
                        </p>
                        <p className="text-xs text-gray-500">
                          Recommended for international students
                        </p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedGateway === 'paypal'
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedGateway === 'paypal' && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-green-600" />
                <span>
                  Your payment information is secure and encrypted. We don&apos;t store your card details.
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Pay Button */}
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={handlePayment}
                disabled={!selectedGateway || processing}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
                size="lg"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ${paymentDetails.currency === 'INR' ? '₹' : '$'}${paymentDetails.amount}`
                )}
              </Button>
              
              {!selectedGateway && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  Please select a payment method to continue
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function Payment() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading payment page...</span>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}