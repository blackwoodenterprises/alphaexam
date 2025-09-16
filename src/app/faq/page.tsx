"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Search,
  BookOpen,
  CreditCard,
  Users,
  Clock,
  Award,
  Smartphone,
  Globe,
  Mail,
  MessageCircle,
} from "lucide-react";

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const faqCategories = [
    { id: "all", name: "All Questions", icon: HelpCircle, count: 24 },
    { id: "exams", name: "Exams & Tests", icon: BookOpen, count: 8 },
    { id: "account", name: "Account & Profile", icon: Users, count: 5 },
    { id: "payment", name: "Payment & Billing", icon: CreditCard, count: 4 },
    { id: "technical", name: "Technical Issues", icon: Smartphone, count: 4 },
    { id: "general", name: "General", icon: Globe, count: 3 },
  ];

  const faqs = [
    {
      id: "1",
      category: "exams",
      question: "How do I start taking a mock test?",
      answer:
        "To start a mock test, navigate to the 'Exams' section from the main menu, select your desired exam category (JEE, NEET, GATE, etc.), choose a specific test, and click 'Start Test'. Make sure you have a stable internet connection and sufficient time to complete the exam.",
    },
    {
      id: "2",
      category: "exams",
      question: "Can I pause a test and resume it later?",
      answer:
        "Yes, you can pause most practice tests and resume them later. However, timed mock tests that simulate real exam conditions cannot be paused. Look for the 'Save & Continue Later' option during the test. Your progress will be automatically saved.",
    },
    {
      id: "3",
      category: "exams",
      question: "How is my score calculated?",
      answer:
        "Your score is calculated based on the marking scheme of the respective exam. Typically, correct answers earn positive marks while incorrect answers may have negative marking (usually -1 for every wrong answer). The detailed scoring breakdown is available in your test results.",
    },
    {
      id: "4",
      category: "exams",
      question: "Can I review my answers after submitting the test?",
      answer:
        "Yes, after submitting your test, you can access a detailed analysis that shows your answers, correct solutions, explanations, and performance statistics. This helps you understand your mistakes and improve for future tests.",
    },
    {
      id: "5",
      category: "exams",
      question: "What happens if my internet connection drops during a test?",
      answer:
        "Our platform automatically saves your progress every few seconds. If your connection drops, you can resume from where you left off when you reconnect. For timed tests, the timer continues running, so reconnect as quickly as possible.",
    },
    {
      id: "6",
      category: "exams",
      question: "How many times can I attempt the same test?",
      answer:
        "You can attempt most practice tests multiple times to improve your performance. However, some premium mock tests may have attempt limits. Check the test details before starting to see if there are any restrictions.",
    },
    {
      id: "7",
      category: "exams",
      question: "Are the questions updated regularly?",
      answer:
        "Yes, we regularly update our question bank with new questions and remove outdated ones. Our content team ensures that all questions align with the latest exam patterns and syllabus changes.",
    },
    {
      id: "8",
      category: "exams",
      question: "Can I get explanations for all questions?",
      answer:
        "Yes, every question in our database comes with detailed explanations and step-by-step solutions. These explanations help you understand the concept and approach needed to solve similar problems.",
    },
    {
      id: "9",
      category: "account",
      question: "How do I create an account?",
      answer:
        "Click on 'Sign Up' in the top right corner, enter your email address, create a strong password, and verify your email. You can also sign up using your Google account for faster registration.",
    },
    {
      id: "10",
      category: "account",
      question: "I forgot my password. How can I reset it?",
      answer:
        "Click on 'Forgot Password' on the login page, enter your registered email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password.",
    },
    {
      id: "11",
      category: "account",
      question: "Can I change my email address?",
      answer:
        "Yes, you can update your email address from your profile settings. Go to 'Profile' > 'Account Settings' > 'Email Address'. You'll need to verify the new email address before the change takes effect.",
    },
    {
      id: "12",
      category: "account",
      question: "How do I delete my account?",
      answer:
        "To delete your account, go to 'Profile' > 'Account Settings' > 'Delete Account'. Please note that this action is irreversible and will permanently remove all your test history and progress data.",
    },
    {
      id: "13",
      category: "account",
      question: "Can I have multiple accounts?",
      answer:
        "Each user should maintain only one account. Having multiple accounts may lead to account suspension. If you need to change your details, please update your existing account or contact our support team.",
    },
    {
      id: "14",
      category: "payment",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit/debit cards (Visa, MasterCard, American Express), UPI payments, net banking, and digital wallets like Paytm, PhonePe, and Google Pay. All payments are processed securely.",
    },
    {
      id: "15",
      category: "payment",
      question: "Is my payment information secure?",
      answer:
        "Yes, we use industry-standard SSL encryption and partner with trusted payment gateways like Razorpay and Stripe. We never store your complete card details on our servers.",
    },
    {
      id: "16",
      category: "payment",
      question: "Can I get a refund if I'm not satisfied?",
      answer:
        "Yes, we offer a 7-day money-back guarantee for all premium subscriptions. If you're not satisfied with our service, contact our support team within 7 days of purchase for a full refund.",
    },
    {
      id: "17",
      category: "payment",
      question: "Do you offer student discounts?",
      answer:
        "Yes, we offer special discounts for students. You can verify your student status using your college email ID or student ID card to avail of discounted pricing on our premium plans.",
    },
    {
      id: "18",
      category: "technical",
      question: "Which browsers are supported?",
      answer:
        "AlphaExam works best on modern browsers including Chrome (recommended), Firefox, Safari, and Edge. Make sure your browser is updated to the latest version for the best experience.",
    },
    {
      id: "19",
      category: "technical",
      question: "Can I use AlphaExam on my mobile device?",
      answer:
        "Yes, our platform is fully responsive and works on all devices including smartphones and tablets. For the best experience, we recommend using the latest version of Chrome or Safari on mobile.",
    },
    {
      id: "20",
      category: "technical",
      question: "The website is loading slowly. What should I do?",
      answer:
        "Try clearing your browser cache and cookies, disable browser extensions temporarily, or try using a different browser. If the issue persists, check your internet connection or contact our technical support.",
    },
    {
      id: "21",
      category: "technical",
      question: "I'm having trouble uploading documents. What's wrong?",
      answer:
        "Ensure your file is in the correct format (PDF, JPG, PNG) and under the size limit (usually 5MB). Try using a different browser or device. If the problem continues, contact our support team with details about the error message.",
    },
    {
      id: "22",
      category: "general",
      question: "How do I contact customer support?",
      answer:
        "You can reach our support team through multiple channels: email us at support@alphaexam.in, use the live chat feature on our website, or call us at 8851134099 during business hours (9 AM - 6 PM IST).",
    },
    {
      id: "23",
      category: "general",
      question: "What are your business hours?",
      answer:
        "Our platform is available 24/7 for taking tests and accessing content. Our customer support team is available Monday to Friday, 9 AM to 6 PM IST. We also provide email support outside these hours.",
    },
    {
      id: "24",
      category: "general",
      question: "Do you have a mobile app?",
      answer:
        "Currently, we offer a fully responsive web platform that works excellently on mobile browsers. We're working on dedicated mobile apps for iOS and Android, which will be available soon. Stay tuned for updates!",
    },
  ];

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Frequently Asked{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Questions
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Find quick answers to common questions about AlphaExam. Can&apos;t
                find what you&apos;re looking for? Contact our support team.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-white/50">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-4 justify-center">
              {faqCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        selectedCategory === category.id
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {category.id === "all" ? faqs.length : category.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Items */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-4">
              {filteredFAQs.map((faq) => {
                const isExpanded = expandedItems.includes(faq.id);
                return (
                  <Card
                    key={faq.id}
                    className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleExpanded(faq.id)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-6 pb-6">
                          <div className="border-t border-gray-100 pt-4">
                            <p className="text-gray-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or browse different
                  categories.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-16 bg-white/50">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="border-0 bg-white/80 backdrop-blur-sm text-center">
                <CardContent className="p-6">
                  <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    24/7
                  </div>
                  <div className="text-sm text-gray-600">
                    Platform Availability
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 bg-white/80 backdrop-blur-sm text-center">
                <CardContent className="p-6">
                  <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    &lt;2h
                  </div>
                  <div className="text-sm text-gray-600">
                    Average Response Time
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 bg-white/80 backdrop-blur-sm text-center">
                <CardContent className="p-6">
                  <Award className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    98%
                  </div>
                  <div className="text-sm text-gray-600">
                    Issue Resolution Rate
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Still Need Help?
              </h2>
              <p className="text-gray-600 mb-8">
                Our support team is here to help you succeed. Get in touch and
                we&apos;ll respond as quickly as possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg">
                  <Mail className="w-5 h-5 mr-2" />
                  Email Support
                </Button>
                <a
                  href="/contact"
                  className="px-6 py-3 bg-white text-purple-600 font-medium rounded-xl border border-purple-200 hover:bg-purple-50 transition-all duration-300 text-center"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
