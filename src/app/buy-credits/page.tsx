"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function BuyCredits() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [loading, setLoading] = useState(true);
  const [userCredits, setUserCredits] = useState<number>(0);

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      router.push("/sign-in");
      return;
    }

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
  }, [isLoaded, userId, router]);

  const handleProceedToPayment = () => {
    if (!selectedPackage) return;
    
    const queryParams = new URLSearchParams({
      credits: selectedPackage.credits.toString(),
      amount: (currency === 'INR' ? selectedPackage.priceINR : selectedPackage.priceUSD).toString(),
      currency: currency,
    });
    
    router.push(`/payment?${queryParams.toString()}`);
  };

  if (!isLoaded || loading) {
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
          {/* Header Section */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4 text-purple-600 hover:text-purple-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Buy Credits
              </h1>
              <p className="text-gray-600 mb-4">
                Choose a credit package to continue your exam preparation
              </p>
              
              {/* Current Credits Display */}
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
                  onClick={() => setSelectedPackage(pkg)}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
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
                    <div className="space-y-2">
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
                    </div>
                    
                    {isSelected && (
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

          {/* Proceed Button */}
          {selectedPackage && (
            <Card>
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
        </div>
      </main>

      <Footer />
    </div>
  );
}