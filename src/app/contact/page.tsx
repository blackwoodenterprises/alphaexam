"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  HelpCircle,
  Users,
  Building,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      primary: "support@alphaexam.com",
      secondary: "hello@alphaexam.com",
      description: "Get in touch for any queries or support",
    },
    {
      icon: Phone,
      title: "Call Us",
      primary: "+91 98765 43210",
      secondary: "+91 98765 43211",
      description: "Monday to Friday, 9 AM to 6 PM IST",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      primary: "AlphaExam Technologies",
      secondary: "Bangalore, Karnataka 560001, India",
      description: "Our headquarters in the Silicon Valley of India",
    },
    {
      icon: Clock,
      title: "Support Hours",
      primary: "24/7 Online Support",
      secondary: "Phone: Mon-Fri 9AM-6PM IST",
      description: "We're here to help you succeed",
    },
  ];

  const categories = [
    { value: "general", label: "General Inquiry", icon: MessageCircle },
    { value: "support", label: "Technical Support", icon: HelpCircle },
    { value: "academic", label: "Academic Support", icon: Users },
    { value: "business", label: "Business Partnership", icon: Building },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "",
      message: "",
    });

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

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Header />
        <main className="py-20">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <Card className="max-w-2xl mx-auto text-center">
              <CardContent className="p-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Message Sent Successfully!
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Thank you for reaching out to us. We&apos;ve received your
                  message and will get back to you within 24 hours.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Send Another Message
                </Button>
              </CardContent>
            </Card>
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
                Get in{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Touch
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Have questions? Need support? Want to partner with us? We&apos;d
                love to hear from you and help you succeed.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-all duration-300 group"
                >
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <info.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {info.title}
                    </h3>
                    <p className="text-purple-600 font-semibold mb-1">
                      {info.primary}
                    </p>
                    <p className="text-gray-600 mb-3">{info.secondary}</p>
                    <p className="text-sm text-gray-500">{info.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Send us a Message
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Fill out the form below and we&apos;ll get back to you as
                    soon as possible.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Category *
                      </label>
                      <select
                        id="category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Brief subject of your message"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
                        placeholder="Tell us more about your inquiry..."
                      ></textarea>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Categories & FAQ */}
              <div className="space-y-8">
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      How can we help?
                    </h3>
                    <div className="space-y-4">
                      {categories.map((category, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors duration-200"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <category.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {category.label}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {category.value === "general" &&
                                "Questions about our platform, features, or pricing"}
                              {category.value === "support" &&
                                "Technical issues, login problems, or bug reports"}
                              {category.value === "academic" &&
                                "Content questions, exam strategies, or study guidance"}
                              {category.value === "business" &&
                                "School partnerships, bulk licensing, or custom solutions"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-0">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Quick Response Time
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">
                          General inquiries: Within 4 hours
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-700">
                          Technical support: Within 2 hours
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700">
                          Urgent issues: Within 30 minutes
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">
                          Business partnerships: Within 24 hours
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-6">
                      * Response times are during business hours (Mon-Fri, 9 AM
                      - 6 PM IST)
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white/50">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Find quick answers to common questions about AlphaExam.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[
                {
                  question: "How do I get started with AlphaExam?",
                  answer:
                    "Simply sign up for a free account, complete your profile, and start exploring our mock tests. No credit card required for the trial.",
                },
                {
                  question: "What exams do you cover?",
                  answer:
                    "We specialize in Mathematical Olympiads, JEE Main/Advanced, NEET, and other competitive exams. Our question bank covers all major topics.",
                },
                {
                  question: "Is there a mobile app available?",
                  answer:
                    "Our platform is fully responsive and works perfectly on all devices. A dedicated mobile app is coming soon!",
                },
                {
                  question: "How accurate are the AI-powered recommendations?",
                  answer:
                    "Our AI analyzes your performance patterns and has a 95% accuracy rate in identifying your strengths and areas for improvement.",
                },
                {
                  question: "Can I track my progress over time?",
                  answer:
                    "Yes! Our detailed analytics dashboard shows your progress, performance trends, and personalized insights to help you improve.",
                },
                {
                  question: "Do you offer refunds?",
                  answer:
                    "We offer a 30-day money-back guarantee if you're not satisfied with our premium features. Contact support for assistance.",
                },
              ].map((faq, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
