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
  currency: "INR" | "USD";
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
  handler: (response: RazorpayResponse) => void | Promise<void>;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
  modal?: {
    backdropclose?: boolean;
    escape?: boolean;
    handleback?: boolean;
    ondismiss?: () => void;
    confirm_close?: boolean;
    animation?: boolean;
  };
}

interface RazorpayInstance {
  open(): void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

function PaymentContent() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [processing, setProcessing] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationCountdown, setVerificationCountdown] = useState(10);
  const [selectedGateway, setSelectedGateway] = useState<"razorpay" | "paypal">(
    "razorpay"
  );
  const [loading, setLoading] = useState(true);

  // Preconnect to Razorpay domains for better performance
  useEffect(() => {
    const preconnectLinks = [
      "https://checkout.razorpay.com",
      "https://api.razorpay.com",
      "https://lumberjack.razorpay.com",
    ];

    preconnectLinks.forEach((href) => {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = href;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });

    return () => {
      // Cleanup preconnect links on unmount
      preconnectLinks.forEach((href) => {
        const existingLink = document.querySelector(`link[href="${href}"]`);
        if (existingLink) {
          document.head.removeChild(existingLink);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      router.push("/sign-in");
      return;
    }

    const credits = searchParams.get("credits");
    const amount = searchParams.get("amount");
    const currency = searchParams.get("currency") as "INR" | "USD";

    if (!credits || !amount || !currency) {
      router.push("/buy-credits");
      return;
    }

    setPaymentDetails({
      credits: parseInt(credits),
      amount: parseFloat(amount),
      currency,
    });

    setLoading(false);
  }, [isLoaded, userId, router, searchParams]);

  const handlePayment = async () => {
    if (!paymentDetails) return;

    if (selectedGateway === "razorpay") {
      await handleRazorpayPayment();
    } else {
      await handlePaypalPayment();
    }
  };

  const handleRazorpayPayment = async () => {
    if (!paymentDetails || paymentDetails.currency !== "INR") {
      alert("Razorpay is only available for INR payments");
      return;
    }

    try {
      setProcessing(true);
      console.log("🚀 Starting Razorpay payment process...");
      console.log("💰 Payment details:", paymentDetails);

      // Create order
      const orderResponse = await fetch("/api/payment/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          credits: paymentDetails.credits,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await orderResponse.json();
      console.log("📋 Order created:", orderData);

      // Load Razorpay SDK if not already loaded
      if (!window.Razorpay) {
        console.log("📦 Loading Razorpay SDK...");
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.defer = true;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);

        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Razorpay SDK loading timeout"));
          }, 10000);

          script.onload = () => {
            clearTimeout(timeout);
            resolve(undefined);
          };
          script.onerror = () => {
            clearTimeout(timeout);
            reject(new Error("Failed to load Razorpay SDK"));
          };
        });
      }

      if (!window.Razorpay) {
        console.error("❌ Razorpay SDK not available on window object");
        alert("Razorpay SDK failed to load");
        return;
      }
      console.log("✅ Razorpay SDK available");

      // Get Razorpay key from server-side API
      const keyResponse = await fetch("/api/payment/razorpay/get-key");
      const keyData = await keyResponse.json();

      if (!keyData.key) {
        console.error("❌ Failed to get Razorpay key from server");
        alert("Razorpay configuration error");
        return;
      }

      const razorpayKey = keyData.key;
      console.log(
        "🔑 Razorpay key received from server:",
        razorpayKey ? `${razorpayKey.substring(0, 8)}...` : "NOT FOUND"
      );

      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: orderData.amount as number,
        currency: orderData.currency as string,
        name: "AlphaExam",
        description: `${paymentDetails.credits} Credits`,
        order_id: orderData.id as string,
        handler: async (response: RazorpayResponse) => {
          console.log("💰 Payment successful, response:", response);
          console.log("🔍 Starting payment verification process...");

          setProcessing(false);
          setVerifying(true);
          setVerificationCountdown(10);

          // Start countdown
          const countdownInterval = setInterval(() => {
            setVerificationCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          // Wait for webhook processing (10 seconds)
          setTimeout(() => {
            console.log(
              "⏰ Webhook processing time completed, attempting verification..."
            );

            // Verify payment
            fetch("/api/payment/razorpay/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })
              .then((verifyResponse) => {
                console.log(
                  "📡 Verification response status:",
                  verifyResponse.status
                );
                return verifyResponse
                  .json()
                  .then((verifyData) => ({ verifyResponse, verifyData }));
              })
              .then(({ verifyResponse, verifyData }) => {
                console.log("✅ Verification data:", verifyData);

                setVerifying(false);
                clearInterval(countdownInterval);

                if (verifyResponse.ok) {
                  console.log(
                    "🎉 Payment verified successfully, redirecting to dashboard"
                  );
                  router.push("/dashboard?payment=success");
                } else {
                  console.error("❌ Payment verification failed:", verifyData);
                  // Try one more time after additional delay
                  console.log("🔄 Retrying verification in 5 seconds...");

                  setTimeout(() => {
                    fetch("/api/payment/razorpay/verify", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                      }),
                    })
                      .then((retryResponse) => {
                        if (retryResponse.ok) {
                          console.log(
                            "🎉 Payment verified on retry, redirecting to dashboard"
                          );
                          router.push("/dashboard?payment=success");
                        } else {
                          console.error(
                            "❌ Payment verification failed after retry"
                          );
                          alert(
                            "Payment verification failed. Please contact support if the amount was deducted."
                          );
                        }
                      })
                      .catch((error) => {
                        console.error(
                          "❌ Payment verification retry error:",
                          error
                        );
                        alert(
                          "Payment verification failed. Please contact support if the amount was deducted."
                        );
                      });
                  }, 5000);
                }
              })
              .catch((error) => {
                console.error("❌ Payment verification error:", error);
                setVerifying(false);
                clearInterval(countdownInterval);
                alert(
                  "Payment verification failed. Please contact support if the amount was deducted."
                );
              });
          }, 10000);
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
        },
        theme: {
          color: "#7c3aed",
        },
        modal: {
          backdropclose: false,
          escape: true,
          handleback: true,
          confirm_close: true,
          animation: false,
          ondismiss: () => {
            console.log("🚫 Payment modal dismissed/cancelled by user");
            setProcessing(false);

            // Log the cancellation and mark transaction as failed
            if (orderData?.id && paymentDetails) {
              fetch("/api/payment/log-failure", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  gateway: "razorpay",
                  amount: paymentDetails.amount,
                  currency: paymentDetails.currency,
                  credits: paymentDetails.credits,
                  error: "Payment cancelled by user",
                  timestamp: new Date().toISOString(),
                }),
              }).catch((error) => {
                console.error("❌ Failed to log payment cancellation:", error);
              });
            }
          },
        },
      };

      console.log("🚀 Opening Razorpay payment modal");
      const razorpay = new window.Razorpay(options);

      // Add error handling for modal opening
      try {
        razorpay.open();
      } catch (modalError) {
        console.error("❌ Error opening Razorpay modal:", modalError);
        setProcessing(false);
        alert(
          "Payment modal failed to open. Please try again or use a different browser."
        );
        return;
      }
    } catch (error) {
      console.error("❌ Error in Razorpay payment:", error);
      setProcessing(false);

      if (error instanceof Error) {
        if (error.message.includes("timeout")) {
          alert(
            "Payment system is taking longer than expected. Please check your internet connection and try again."
          );
        } else if (error.message.includes("Failed to load")) {
          alert(
            "Unable to load payment system. Please disable ad blockers and try again."
          );
        } else {
          alert("Payment initialization failed. Please try again.");
        }
      } else {
        alert("Payment initialization failed. Please try again.");
      }
    }
  };

  const handlePaypalPayment = async () => {
    console.log("💳 Initializing PayPal payment...");
    alert("PayPal integration coming soon!");
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Invalid payment details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />
      <main className="py-8">
        <div className="container-restricted px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
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
                  <span className="font-semibold">
                    {paymentDetails.credits} Credits
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">
                    {paymentDetails.currency === "INR" ? "₹" : "$"}
                    {paymentDetails.amount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Currency:</span>
                  <span className="font-semibold">
                    {paymentDetails.currency}
                  </span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-purple-600">
                    {paymentDetails.currency === "INR" ? "₹" : "$"}
                    {paymentDetails.amount}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
              <CardDescription>
                Choose your preferred payment gateway
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Razorpay */}
                <div
                  className={`p-4 border rounded-lg transition-all duration-200 ${
                    paymentDetails.currency === "USD"
                      ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                      : selectedGateway === "razorpay"
                      ? "border-purple-500 bg-purple-50 cursor-pointer"
                      : "border-gray-200 hover:border-gray-300 cursor-pointer"
                  }`}
                  onClick={() => {
                    if (paymentDetails.currency !== "USD") {
                      setSelectedGateway("razorpay");
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          paymentDetails.currency === "USD"
                            ? "bg-gray-100"
                            : "bg-blue-100"
                        }`}
                      >
                        <CreditCard
                          className={`w-6 h-6 ${
                            paymentDetails.currency === "USD"
                              ? "text-gray-400"
                              : "text-blue-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h3
                          className={`font-semibold ${
                            paymentDetails.currency === "USD"
                              ? "text-gray-400"
                              : "text-gray-900"
                          }`}
                        >
                          Razorpay
                        </h3>
                        <p
                          className={`text-sm ${
                            paymentDetails.currency === "USD"
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          Credit/Debit Cards, UPI, Net Banking, Wallets
                        </p>
                        <p
                          className={`text-xs ${
                            paymentDetails.currency === "USD"
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          {paymentDetails.currency === "USD"
                            ? "Not available for USD payments"
                            : "Recommended for Indian students"}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        paymentDetails.currency === "USD"
                          ? "border-gray-300 bg-gray-100"
                          : selectedGateway === "razorpay"
                          ? "border-purple-500 bg-purple-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedGateway === "razorpay" &&
                        paymentDetails.currency !== "USD" && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                    </div>
                  </div>
                </div>

                {/* PayPal */}
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedGateway === "paypal"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedGateway("paypal")}
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
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        selectedGateway === "paypal"
                          ? "border-purple-500 bg-purple-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedGateway === "paypal" && (
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
                  Your payment information is secure and encrypted. We
                  don&apos;t store your card details.
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Button */}
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
                  `Pay ${paymentDetails.currency === "INR" ? "₹" : "$"}${
                    paymentDetails.amount
                  }`
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

      {/* Processing Modal */}
      {processing && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
            <p className="text-gray-600">
              Please wait while we process your payment...
            </p>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {verifying && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
            <div className="animate-pulse rounded-full h-16 w-16 bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-green-600">
              Payment Successful!
            </h3>
            <p className="text-gray-600 mb-4">Verifying your payment...</p>
            {verificationCountdown > 0 && (
              <div className="mb-4">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {verificationCountdown}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${((10 - verificationCountdown) / 10) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
            <p className="text-sm text-gray-500">
              Please don&apos;t close this window
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Payment() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
