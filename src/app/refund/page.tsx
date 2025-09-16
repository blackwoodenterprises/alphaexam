"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Clock,
  CheckCircle,
  X,
  CreditCard,
  AlertTriangle,
  FileText,
  Mail,
  Phone,
  MessageCircle,
  DollarSign,
  Shield,
  Zap,
} from "lucide-react";

export default function RefundPage() {

  const [showRefundForm, setShowRefundForm] = useState(false);
  const [formData, setFormData] = useState({
    orderNumber: "",
    email: "",
    reason: "",
    details: "",
  });

  const refundPolicies = [
    {
      id: "subscription",
      icon: RefreshCw,
      title: "Subscription Plans",
      period: "30 days",
      description: "Full refund within 30 days of purchase",
      conditions: [
        "Unused subscription time will be refunded",
        "Refund processed within 5-7 business days",
        "Original payment method will be credited",
        "Account access continues until refund is processed",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "premium",
      icon: Zap,
      title: "Premium Features",
      period: "14 days",
      description: "Refund available for premium add-ons",
      conditions: [
        "Must request within 14 days of purchase",
        "Feature usage will be evaluated",
        "Partial refunds may apply for used features",
        "Credits may be offered as alternative",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "courses",
      icon: FileText,
      title: "Course Materials",
      period: "7 days",
      description: "Limited refund window for course content",
      conditions: [
        "Must not have completed more than 20% of course",
        "Request within 7 days of purchase",
        "Downloaded materials must be deleted",
        "Certificate eligibility will be revoked",
      ],
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "enterprise",
      icon: Shield,
      title: "Enterprise Plans",
      period: "Custom",
      description: "Negotiated refund terms apply",
      conditions: [
        "Refund terms specified in contract",
        "May require 30-day notice period",
        "Setup fees may be non-refundable",
        "Contact account manager for details",
      ],
      color: "from-orange-500 to-red-500",
    },
  ];

  const refundReasons = [
    "Technical issues preventing usage",
    "Service not as described",
    "Accidental purchase",
    "Found alternative solution",
    "Budget constraints",
    "Unsatisfied with quality",
    "Other (please specify)",
  ];

  const refundProcess = [
    {
      step: 1,
      title: "Submit Request",
      description: "Fill out the refund request form with your order details",
      icon: FileText,
    },
    {
      step: 2,
      title: "Review Process",
      description: "Our team reviews your request within 2 business days",
      icon: Clock,
    },
    {
      step: 3,
      title: "Approval Decision",
      description: "You'll receive an email with the refund decision",
      icon: Mail,
    },
    {
      step: 4,
      title: "Refund Processing",
      description: "Approved refunds are processed within 5-7 business days",
      icon: CreditCard,
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      value: "support@alphaexam.in",
      description: "Best for detailed refund requests",
      response: "Within 24 hours",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      value: "Available 9 AM - 6 PM EST",
      description: "Quick questions and status updates",
      response: "Immediate",
    },
    {
      icon: Phone,
      title: "Phone Support",
      value: "8851134099",
      description: "Urgent refund matters",
      response: "Business hours only",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would submit to the server
    alert(
      "Refund request submitted successfully! You'll receive a confirmation email shortly."
    );
    setFormData({ orderNumber: "", email: "", reason: "", details: "" });
    setShowRefundForm(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Refund{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Policy
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We want you to be completely satisfied with AlphaExam. If you&apos;re
                not happy with your purchase, we&apos;re here to help with our fair
                refund policy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setShowRefundForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Request Refund
                </Button>
                <a
                  href="/contact"
                  className="px-6 py-3 bg-white text-purple-600 font-medium rounded-xl border border-purple-200 hover:bg-purple-50 transition-all duration-300 text-center"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Refund Policies */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Refund Policies by Product Type
              </h2>
              <p className="text-gray-600">
                Different products have different refund windows and conditions.
                Find your product type below for specific details.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {refundPolicies.map((policy) => {
                const Icon = policy.icon;
                return (
                  <Card
                    key={policy.id}
                    className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-4 mb-6">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${policy.color} rounded-2xl flex items-center justify-center`}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {policy.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="w-4 h-4 text-purple-600" />
                            <span className="text-purple-600 font-medium">
                              {policy.period} refund window
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{policy.description}</p>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Conditions:
                        </h4>
                        <ul className="space-y-2">
                          {policy.conditions.map((condition, index) => (
                            <li
                              key={index}
                              className="text-sm text-gray-600 flex items-start"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {condition}
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

        {/* Refund Process */}
        <section className="py-16 bg-white/50">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How the Refund Process Works
              </h2>
              <p className="text-gray-600">
                Our streamlined refund process ensures quick and fair resolution
                of your request.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {refundProcess.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-purple-600">
                            {step.step}
                          </span>
                        </div>
                        {index < refundProcess.length - 1 && (
                          <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 to-pink-300 transform -translate-y-1/2" />
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Refund Request Form */}
        {showRefundForm && (
          <section className="py-16">
            <div className="container-restricted px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl mx-auto">
                <Card className="border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Refund Request Form
                      </h2>
                      <button
                        onClick={() => setShowRefundForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Order Number *
                          </label>
                          <input
                            type="text"
                            name="orderNumber"
                            value={formData.orderNumber}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="e.g., ORD-123456"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reason for Refund *
                        </label>
                        <select
                          name="reason"
                          value={formData.reason}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select a reason</option>
                          {refundReasons.map((reason, index) => (
                            <option key={index} value={reason}>
                              {reason}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Details
                        </label>
                        <textarea
                          name="details"
                          value={formData.details}
                          onChange={handleChange}
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          placeholder="Please provide any additional information that might help us process your refund request..."
                        />
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-800 mb-1">
                              Important Information
                            </h4>
                            <p className="text-sm text-yellow-700">
                              Please ensure all information is accurate. Refund
                              requests with incorrect details may be delayed or
                              denied.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg px-8 py-3"
                        >
                          <RefreshCw className="w-5 h-5 mr-2" />
                          Submit Refund Request
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* Contact Information */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Need Help with Your Refund?
              </h2>
              <p className="text-gray-600">
                Our support team is here to assist you with any questions about
                refunds or our policies.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
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
                        {method.title}
                      </h3>
                      <p className="text-purple-600 font-medium mb-2">
                        {method.value}
                      </p>
                      <p className="text-gray-600 text-sm mb-2">
                        {method.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        Response time: {method.response}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Additional Terms */}
        <section className="py-16 bg-white/50">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Important Terms and Conditions
                  </h2>
                  <div className="space-y-6 text-gray-600">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Non-Refundable Items
                      </h3>
                      <p>
                        Certain items are not eligible for refunds, including:
                        completed courses with certificates issued, custom
                        enterprise setups after implementation, and promotional
                        credits or discounts.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Processing Time
                      </h3>
                      <p>
                        Refunds are typically processed within 5-7 business days
                        after approval. The time it takes for the refund to
                        appear in your account depends on your payment method
                        and financial institution.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Partial Refunds
                      </h3>
                      <p>
                        In some cases, partial refunds may be offered based on
                        usage, time elapsed since purchase, or specific
                        circumstances. Our support team will work with you to
                        find a fair solution.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Dispute Resolution
                      </h3>
                      <p>
                        If you disagree with a refund decision, you can appeal
                        by contacting our support team with additional
                        information. We&apos;re committed to fair and transparent
                        resolution of all refund requests.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Policy Updates
                      </h3>
                      <p>
                        This refund policy may be updated from time to time. Any
                        changes will be posted on this page and will apply to
                        purchases made after the effective date of the changes.
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
