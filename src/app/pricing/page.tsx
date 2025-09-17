"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
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
  Check,
  ArrowLeft,
  Coins,
  Star,
  Shield,
  Zap,
  Users,
  Gift,
} from "lucide-react";

interface CreditPackage {
  credits: number;
  priceINR: number;
  priceUSD: number;
  popular?: boolean;
}

const creditPackages: CreditPackage[] = [
  { credits: 100, priceINR: 80, priceUSD: 2 },
  { credits: 200, priceINR: 160, priceUSD: 4 },
  { credits: 500, priceINR: 400, priceUSD: 10, popular: true },
  { credits: 1000, priceINR: 800, priceUSD: 20 },
  { credits: 2000, priceINR: 1600, priceUSD: 40 },
  { credits: 5000, priceINR: 4000, priceUSD: 100 },
];

export default function Pricing() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [userCredits, setUserCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn) {
      const fetchUserData = async () => {
        try {
          const response = await fetch("/api/user/profile");
          if (response.ok) {
            const data = await response.json();
            if (data.redirect) {
              router.push(data.redirect);
              return;
            }
            setUserCredits(data.user.credits || 0);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [isSignedIn, router]);

  const handleProceedToPayment = () => {
    if (!selectedPackage) return;
    
    const queryParams = new URLSearchParams({
      credits: selectedPackage.credits.toString(),
      amount: (currency === 'INR' ? selectedPackage.priceINR : selectedPackage.priceUSD).toString(),
      currency: currency,
    });
    
    router.push(`/payment?${queryParams.toString()}`);
  };

  if (isSignedIn && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <main className="py-8">
        <div className="container-restricted px-4 sm:px-6 lg:px-8">
          {/* Back Button and Current Credits for Signed-in Users */}
          {isSignedIn && (
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-4 text-purple-600 hover:text-purple-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              
              {/* Current Credits Display */}
              <div className="text-center mb-6">
                <Card className="inline-block">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center space-x-2">
                      <Coins className="w-5 h-5 text-purple-600" />
                      <span className="text-lg font-semibold text-gray-900">
                        Current Balance: {userCredits} Credits
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Header Section */}
          <div className="mb-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isSignedIn ? "Buy Credits" : "Pricing Plans"}
              </h1>
              <p className="text-gray-600 mb-6">
                {isSignedIn 
                  ? "Choose a credit package to continue your exam preparation"
                  : "Choose the perfect credit package for your exam preparation journey"
                }
              </p>
              
              {/* Comprehensive Signup Banner - Only show for non-authenticated users */}
              {!isSignedIn && (
                <Card className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white border-0 shadow-2xl">
                  <CardContent className="py-8 px-6">
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <Gift className="w-8 h-8" />
                        <span className="text-3xl">🎉</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-3">
                        Start Your Success Journey Today!
                      </h2>
                      <p className="text-xl md:text-2xl font-semibold mb-2">
                        Get 100 Credits Absolutely FREE
                      </p>
                      <p className="text-lg opacity-90 mb-4">
                        Join thousands of students who have already boosted their exam scores
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Check className="w-8 h-8" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">100 Free Credits</h3>
                        <p className="text-sm opacity-90">
                          Worth ₹80 - Take multiple practice exams without spending a penny
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Star className="w-8 h-8" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Premium Features</h3>
                        <p className="text-sm opacity-90">
                          Access detailed analytics, performance tracking, and expert explanations
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <CreditCard className="w-8 h-8" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">No Hidden Costs</h3>
                        <p className="text-sm opacity-90">
                          Transparent pricing, no subscriptions, pay only for what you need
                        </p>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
                        <Link href="/sign-up">
                          <Button 
                            size="lg"
                            className="bg-white text-purple-600 hover:bg-gray-100 font-bold text-lg px-8 py-3 shadow-lg transform hover:scale-105 transition-all duration-200"
                          >
                            🚀 Claim Your Free Credits
                          </Button>
                        </Link>
                        <Link href="/sign-in">
                          <Button 
                            size="lg"
                            variant="ghost" 
                            className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/30 font-semibold text-lg px-8 py-3 transition-all duration-200 hover:scale-105"
                          >
                            Already have an account? Sign In
                          </Button>
                        </Link>
                      </div>
                      <p className="text-sm opacity-80">
                        ⏰ Limited time offer • No credit card required • Instant access
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Currency Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center">Select Currency</CardTitle>
              <CardDescription className="text-center">
                Choose your preferred currency for payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center space-x-4">
                <Button
                  variant={currency === 'INR' ? 'default' : 'outline'}
                  onClick={() => setCurrency('INR')}
                  className={currency === 'INR' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  INR (₹) - Indian Students
                </Button>
                <Button
                  variant={currency === 'USD' ? 'default' : 'outline'}
                  onClick={() => setCurrency('USD')}
                  className={currency === 'USD' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  USD ($) - International Students
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Credit Packages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {creditPackages.map((pkg, index) => {
              const price = currency === 'INR' ? pkg.priceINR : pkg.priceUSD;
              const currencySymbol = currency === 'INR' ? '₹' : '$';
              const isSelected = selectedPackage?.credits === pkg.credits;
              
              return (
                <Card
                  key={index}
                  className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isSelected
                      ? 'ring-2 ring-purple-500 shadow-lg'
                      : 'hover:shadow-md'
                  } ${
                    pkg.popular ? 'border-purple-500 border-2' : ''
                  }`}
                  onClick={() => isSignedIn ? setSelectedPackage(pkg) : null}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>Most Popular</span>
                      </span>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className={`p-3 rounded-full ${
                        pkg.popular ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        <CreditCard className={`w-8 h-8 ${
                          pkg.popular ? 'text-purple-600' : 'text-gray-600'
                        }`} />
                      </div>
                    </div>
                    
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {pkg.credits} Credits
                    </CardTitle>
                    
                    <div className="text-3xl font-bold text-purple-600">
                      {currencySymbol}{price}
                    </div>
                    
                    <CardDescription>
                      {currencySymbol}{(price / pkg.credits).toFixed(3)} per credit
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">
                          {pkg.credits} exam credits
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">
                          No expiration date
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">
                          Instant activation
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">
                          24/7 support
                        </span>
                      </div>
                    </div>
                    
                    <Link href={isSignedIn ? "#" : "/sign-up"} className="block">
                      <Button 
                        className={`w-full ${
                          pkg.popular 
                            ? 'bg-purple-600 hover:bg-purple-700' 
                            : 'bg-gray-600 hover:bg-gray-700'
                        } text-white`}
                        onClick={(e) => {
                          if (isSignedIn) {
                            e.preventDefault();
                            setSelectedPackage(pkg);
                          }
                        }}
                      >
                        {isSignedIn ? "Select Package" : "Get Started"}
                      </Button>
                    </Link>

                    {isSelected && isSignedIn && (
                      <div className="mt-4 p-2 bg-purple-50 rounded-lg">
                        <div className="flex items-center justify-center space-x-2">
                          <Check className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-600">
                            Selected
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Proceed to Payment Button for Signed-in Users */}
          {selectedPackage && isSignedIn && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Order Summary
                    </h3>
                    <div className="text-gray-600">
                      <p>{selectedPackage.credits} Credits</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {currency === 'INR' ? '₹' : '$'}
                        {currency === 'INR' ? selectedPackage.priceINR : selectedPackage.priceUSD}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleProceedToPayment}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
                    size="lg"
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Why Choose AlphaExam?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Quality Questions</h4>
                    <p className="text-sm text-gray-600">
                      Expertly crafted questions that mirror real exam patterns
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Detailed Analytics</h4>
                    <p className="text-sm text-gray-600">
                      Track your progress with comprehensive performance insights
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Gift className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Free Credits</h4>
                    <p className="text-sm text-gray-600">
                      Start with 100 free credits when you sign up today
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}