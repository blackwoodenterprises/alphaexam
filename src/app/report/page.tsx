"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bug,
  Zap,
  Shield,
  CreditCard,
  Users,
  Globe,
  Send,
  CheckCircle,
  Upload,
  X,
} from "lucide-react";

export default function ReportPage() {
  const [formData, setFormData] = useState({
    category: "",
    priority: "",
    title: "",
    description: "",
    stepsToReproduce: "",
    expectedBehavior: "",
    actualBehavior: "",
    browserInfo: "",
    email: "",
    name: "",
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const issueCategories = [
    {
      id: "bug",
      icon: Bug,
      title: "Bug Report",
      description: "Something isn't working as expected",
      color: "from-red-500 to-pink-500",
    },
    {
      id: "performance",
      icon: Zap,
      title: "Performance Issue",
      description: "Slow loading or poor performance",
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: "security",
      icon: Shield,
      title: "Security Concern",
      description: "Potential security vulnerability",
      color: "from-purple-500 to-indigo-500",
    },
    {
      id: "payment",
      icon: CreditCard,
      title: "Payment Issue",
      description: "Billing or subscription problems",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "account",
      icon: Users,
      title: "Account Issue",
      description: "Login or profile related problems",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "accessibility",
      icon: Globe,
      title: "Accessibility",
      description: "Accessibility or usability concerns",
      color: "from-teal-500 to-green-500",
    },
  ];

  const priorityLevels = [
    {
      id: "low",
      title: "Low",
      description: "Minor issue, doesn't affect core functionality",
      color: "text-green-600 bg-green-50 border-green-200",
    },
    {
      id: "medium",
      title: "Medium",
      description: "Affects some functionality but has workarounds",
      color: "text-yellow-600 bg-yellow-50 border-yellow-200",
    },
    {
      id: "high",
      title: "High",
      description: "Significantly impacts user experience",
      color: "text-orange-600 bg-orange-50 border-orange-200",
    },
    {
      id: "critical",
      title: "Critical",
      description: "Prevents core functionality or causes data loss",
      color: "text-red-600 bg-red-50 border-red-200",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({
      category: "",
      priority: "",
      title: "",
      description: "",
      stepsToReproduce: "",
      expectedBehavior: "",
      actualBehavior: "",
      browserInfo: "",
      email: "",
      name: "",
    });
    setAttachments([]);

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Header />
        <main className="py-20">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Issue Reported Successfully!
                  </h1>
                  <p className="text-gray-600 mb-6">
                    Thank you for reporting this issue. We&apos;ve received your
                    report and our team will investigate it promptly. You&apos;ll
                    receive an email confirmation shortly.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => setSubmitted(false)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg"
                    >
                      Report Another Issue
                    </Button>
                    <a
                      href="/status"
                      className="px-6 py-3 bg-white text-purple-600 font-medium rounded-xl border border-purple-200 hover:bg-purple-50 transition-all duration-300 text-center"
                    >
                      Check System Status
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Report an{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Issue
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Help us improve AlphaExam by reporting bugs, performance issues,
                or other problems you encounter.
              </p>
            </div>
          </div>
        </section>

        {/* Issue Categories */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              What type of issue are you experiencing?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
              {issueCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card
                    key={category.id}
                    className={`cursor-pointer transition-all duration-300 border-2 ${
                      formData.category === category.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-transparent bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg"
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        category: category.id,
                      }))
                    }
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Report Form */}
        {formData.category && (
          <section className="py-16">
            <div className="container-restricted px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <Card className="border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Priority Selection */}
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-4">
                          Priority Level
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {priorityLevels.map((priority) => (
                            <div
                              key={priority.id}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                formData.priority === priority.id
                                  ? "border-purple-500 bg-purple-50"
                                  : `border-gray-200 hover:${
                                      priority.color.split(" ")[1]
                                    }`
                              }`}
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  priority: priority.id,
                                }))
                              }
                            >
                              <h4 className="font-semibold text-gray-900 mb-1">
                                {priority.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {priority.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
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

                      {/* Issue Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Issue Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Brief description of the issue"
                        />
                      </div>

                      {/* Issue Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Detailed Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          placeholder="Provide a detailed description of the issue you're experiencing"
                        />
                      </div>

                      {/* Steps to Reproduce */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Steps to Reproduce (Optional)
                        </label>
                        <textarea
                          name="stepsToReproduce"
                          value={formData.stepsToReproduce}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          placeholder="1. Go to...\n2. Click on...\n3. See error"
                        />
                      </div>

                      {/* Expected vs Actual Behavior */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expected Behavior (Optional)
                          </label>
                          <textarea
                            name="expectedBehavior"
                            value={formData.expectedBehavior}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            placeholder="What should have happened?"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Actual Behavior (Optional)
                          </label>
                          <textarea
                            name="actualBehavior"
                            value={formData.actualBehavior}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            placeholder="What actually happened?"
                          />
                        </div>
                      </div>

                      {/* Browser Information */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Browser/Device Information (Optional)
                        </label>
                        <input
                          type="text"
                          name="browserInfo"
                          value={formData.browserInfo}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="e.g., Chrome 120.0, iPhone 14, Windows 11"
                        />
                      </div>

                      {/* File Attachments */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Attachments (Optional)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors duration-300">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 mb-2">
                            Upload screenshots, videos, or other files
                          </p>
                          <input
                            type="file"
                            multiple
                            accept="image/*,video/*,.pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                          />
                          <label
                            htmlFor="file-upload"
                            className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-lg cursor-pointer hover:bg-purple-200 transition-colors duration-300"
                          >
                            Choose Files
                          </label>
                        </div>
                        {attachments.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {attachments.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <span className="text-sm text-gray-700">
                                  {file.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeAttachment(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div className="text-center">
                        <Button
                          type="submit"
                          disabled={isSubmitting || !formData.priority}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg px-8 py-3 text-lg"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              Submit Issue Report
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
