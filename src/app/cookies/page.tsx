"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Cookie,
  Shield,
  BarChart3,
  Target,
  Settings,
  CheckCircle,
  X,
  Info,
  Lock,
  Eye,
  Zap,
} from "lucide-react";

export default function CookiePage() {
  const [preferences, setPreferences] = useState({
    essential: true, // Always required
    analytics: true,
    marketing: false,
    personalization: true,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [saved, setSaved] = useState(false);

  const cookieTypes = [
    {
      id: "essential",
      icon: Shield,
      title: "Essential Cookies",
      description: "Required for basic website functionality and security",
      examples: [
        "Authentication tokens",
        "Session management",
        "Security preferences",
        "Load balancing",
      ],
      color: "from-green-500 to-emerald-500",
      required: true,
    },
    {
      id: "analytics",
      icon: BarChart3,
      title: "Analytics Cookies",
      description: "Help us understand how visitors interact with our website",
      examples: [
        "Page views and traffic",
        "User behavior patterns",
        "Performance metrics",
        "Error tracking",
      ],
      color: "from-blue-500 to-cyan-500",
      required: false,
    },
    {
      id: "marketing",
      icon: Target,
      title: "Marketing Cookies",
      description: "Used to deliver personalized advertisements and content",
      examples: [
        "Ad targeting",
        "Campaign tracking",
        "Social media integration",
        "Retargeting pixels",
      ],
      color: "from-purple-500 to-pink-500",
      required: false,
    },
    {
      id: "personalization",
      icon: Settings,
      title: "Personalization Cookies",
      description: "Remember your preferences and customize your experience",
      examples: [
        "Language preferences",
        "Theme settings",
        "Dashboard layout",
        "Notification settings",
      ],
      color: "from-orange-500 to-red-500",
      required: false,
    },
  ];

  const keyPrinciples = [
    {
      icon: Lock,
      title: "Transparency",
      description: "We clearly explain what cookies we use and why",
    },
    {
      icon: Eye,
      title: "Control",
      description: "You have full control over your cookie preferences",
    },
    {
      icon: Shield,
      title: "Security",
      description: "All cookies are secured and encrypted when necessary",
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Cookies help us optimize website performance and speed",
    },
  ];

  const thirdPartyServices = [
    {
      name: "Google Analytics",
      purpose: "Website analytics and performance monitoring",
      type: "Analytics",
      retention: "26 months",
    },
    {
      name: "Stripe",
      purpose: "Payment processing and fraud prevention",
      type: "Essential",
      retention: "Session",
    },
    {
      name: "Intercom",
      purpose: "Customer support and live chat functionality",
      type: "Personalization",
      retention: "12 months",
    },
    {
      name: "Facebook Pixel",
      purpose: "Social media integration and advertising",
      type: "Marketing",
      retention: "90 days",
    },
  ];

  const handlePreferenceChange = (type: string, value: boolean) => {
    if (type === "essential") return; // Essential cookies cannot be disabled
    setPreferences((prev) => ({ ...prev, [type]: value }));
  };

  const savePreferences = () => {
    // In a real application, this would save to localStorage or send to server
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem("cookiePreferences", JSON.stringify(allAccepted));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const rejectOptional = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
    setPreferences(essentialOnly);
    localStorage.setItem("cookiePreferences", JSON.stringify(essentialOnly));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Cookie className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Cookie{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Policy
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Learn about how we use cookies to enhance your experience and
                protect your privacy on AlphaExam.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setShowSettings(!showSettings)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Manage Cookie Preferences
                </Button>
                <a
                  href="/privacy"
                  className="px-6 py-3 bg-white text-purple-600 font-medium rounded-xl border border-purple-200 hover:bg-purple-50 transition-all duration-300 text-center"
                >
                  View Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Cookie Preferences Panel */}
        {showSettings && (
          <section className="py-16 bg-white/50">
            <div className="container-restricted px-4 sm:px-6 lg:px-8">
              <Card className="max-w-4xl mx-auto border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Cookie Preferences
                    </h2>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {cookieTypes.map((type) => {
                      const Icon = type.icon;
                      const isEnabled =
                        preferences[type.id as keyof typeof preferences];
                      return (
                        <div
                          key={type.id}
                          className="flex items-start justify-between p-6 bg-gray-50 rounded-xl"
                        >
                          <div className="flex items-start space-x-4 flex-1">
                            <div
                              className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                            >
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {type.title}
                                </h3>
                                {type.required && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                    Required
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 mb-3">
                                {type.description}
                              </p>
                              <div className="text-sm text-gray-500">
                                <strong>Examples:</strong>{" "}
                                {type.examples.join(", ")}
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isEnabled}
                                onChange={(e) =>
                                  handlePreferenceChange(
                                    type.id,
                                    e.target.checked
                                  )
                                }
                                disabled={type.required}
                                className="sr-only peer"
                              />
                              <div
                                className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                                  isEnabled ? "peer-checked:bg-purple-600" : ""
                                } ${
                                  type.required
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              ></div>
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Button
                      onClick={acceptAll}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Accept All
                    </Button>
                    <Button
                      onClick={savePreferences}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg"
                    >
                      Save Preferences
                    </Button>
                    <Button
                      onClick={rejectOptional}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Reject Optional
                    </Button>
                  </div>

                  {saved && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                      <p className="text-green-700 font-medium">
                        ✓ Your cookie preferences have been saved successfully!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Key Principles */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Cookie Principles
              </h2>
              <p className="text-gray-600">
                We believe in transparency and user control when it comes to
                cookies and data collection.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyPrinciples.map((principle, index) => {
                const Icon = principle.icon;
                return (
                  <Card
                    key={index}
                    className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {principle.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {principle.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Cookie Types Details */}
        <section className="py-16 bg-white/50">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Types of Cookies We Use
              </h2>
              <p className="text-gray-600">
                Understanding the different types of cookies helps you make
                informed decisions about your privacy.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {cookieTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Card
                    key={type.id}
                    className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-4 mb-6">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${type.color} rounded-2xl flex items-center justify-center`}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {type.title}
                          </h3>
                          {type.required && (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full mt-1">
                              Always Active
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{type.description}</p>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Examples:
                        </h4>
                        <ul className="space-y-1">
                          {type.examples.map((example, index) => (
                            <li
                              key={index}
                              className="text-sm text-gray-600 flex items-center"
                            >
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2" />
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Third-Party Services */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Third-Party Services
              </h2>
              <p className="text-gray-600">
                We work with trusted partners to provide you with the best
                possible experience. Here are the third-party services that may
                set cookies.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left p-6 font-semibold text-gray-900">
                            Service
                          </th>
                          <th className="text-left p-6 font-semibold text-gray-900">
                            Purpose
                          </th>
                          <th className="text-left p-6 font-semibold text-gray-900">
                            Type
                          </th>
                          <th className="text-left p-6 font-semibold text-gray-900">
                            Retention
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {thirdPartyServices.map((service, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="p-6 font-medium text-gray-900">
                              {service.name}
                            </td>
                            <td className="p-6 text-gray-600">
                              {service.purpose}
                            </td>
                            <td className="p-6">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  service.type === "Essential"
                                    ? "bg-green-100 text-green-700"
                                    : service.type === "Analytics"
                                    ? "bg-blue-100 text-blue-700"
                                    : service.type === "Marketing"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-orange-100 text-orange-700"
                                }`}
                              >
                                {service.type}
                              </span>
                            </td>
                            <td className="p-6 text-gray-600">
                              {service.retention}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="py-16 bg-white/50">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Info className="w-6 h-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Additional Information
                    </h2>
                  </div>
                  <div className="space-y-6 text-gray-600">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        How to Control Cookies
                      </h3>
                      <p>
                        You can control and manage cookies in various ways. Most
                        web browsers automatically accept cookies, but you can
                        modify your browser settings to decline cookies if you
                        prefer. You can also use our cookie preference center
                        above to customize your experience.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Cookie Retention
                      </h3>
                      <p>
                        Different cookies have different retention periods.
                        Session cookies are deleted when you close your browser,
                        while persistent cookies remain on your device for a
                        specified period or until you delete them manually.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Updates to This Policy
                      </h3>
                      <p>
                        We may update this Cookie Policy from time to time to
                        reflect changes in our practices or for other
                        operational, legal, or regulatory reasons. We will
                        notify you of any material changes by posting the
                        updated policy on our website.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Contact Us
                      </h3>
                      <p>
                        If you have any questions about our use of cookies or
                        this Cookie Policy, please contact us at{" "}
                        <a
                          href="mailto:privacy@alphaexam.com"
                          className="text-purple-600 hover:text-purple-700 font-medium"
                        >
                          privacy@alphaexam.com
                        </a>{" "}
                        or visit our{" "}
                        <a
                          href="/contact"
                          className="text-purple-600 hover:text-purple-700 font-medium"
                        >
                          contact page
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
