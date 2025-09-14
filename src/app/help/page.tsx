import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  HelpCircle,
  BookOpen,
  Users,
  Settings,
  CreditCard,
  Shield,
  Clock,
  MessageCircle,
  ChevronRight,
  Search,
} from "lucide-react";

export default function HelpPage() {
  const helpCategories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics of using AlphaExam",
      articles: [
        "How to create your account",
        "Taking your first mock test",
        "Understanding your dashboard",
        "Setting up your study plan",
      ],
    },
    {
      icon: Users,
      title: "Account & Profile",
      description: "Manage your account settings and profile",
      articles: [
        "Updating your profile information",
        "Changing your password",
        "Managing notification preferences",
        "Deleting your account",
      ],
    },
    {
      icon: Settings,
      title: "Tests & Exams",
      description: "Everything about taking tests and exams",
      articles: [
        "How to start a mock test",
        "Understanding test results",
        "Reviewing your answers",
        "Test time management tips",
      ],
    },
    {
      icon: CreditCard,
      title: "Billing & Payments",
      description: "Payment methods and billing information",
      articles: [
        "Subscription plans and pricing",
        "Payment methods accepted",
        "How to cancel your subscription",
        "Refund policy and process",
      ],
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Your data protection and account security",
      articles: [
        "How we protect your data",
        "Two-factor authentication setup",
        "Privacy policy overview",
        "Reporting security issues",
      ],
    },
    {
      icon: Clock,
      title: "Technical Issues",
      description: "Troubleshooting common problems",
      articles: [
        "Browser compatibility issues",
        "Connection problems",
        "Test loading issues",
        "Mobile app troubleshooting",
      ],
    },
  ];

  const popularFAQs = [
    {
      question: "How do I reset my password?",
      answer:
        "Click on 'Forgot Password' on the login page, enter your email address, and follow the instructions sent to your email.",
    },
    {
      question: "Can I pause a test and resume later?",
      answer:
        "Yes, you can pause most practice tests and resume them later. However, timed mock tests cannot be paused once started.",
    },
    {
      question: "How are my test scores calculated?",
      answer:
        "Scores are calculated based on correct answers, with negative marking for incorrect answers as per the exam pattern you're practicing for.",
    },
    {
      question: "Can I access tests offline?",
      answer:
        "Currently, all tests require an internet connection. We're working on offline capabilities for future updates.",
    },
    {
      question: "How do I cancel my subscription?",
      answer:
        "You can cancel your subscription anytime from your account settings under 'Billing & Subscription' section.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Yes, we offer refunds within 7 days of purchase if you haven't used more than 20% of your subscription benefits.",
    },
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "Available 24/7",
      action: "Start Chat",
    },
    {
      icon: HelpCircle,
      title: "Submit Ticket",
      description: "Send us a detailed message about your issue",
      availability: "Response within 24 hours",
      action: "Create Ticket",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Help{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Center
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Find answers to your questions and get the support you need to
                succeed with AlphaExam.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help articles, FAQs, or topics..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Browse by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {helpCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Card
                    key={index}
                    className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {category.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{category.description}</p>
                      <ul className="space-y-2">
                        {category.articles.map((article, articleIndex) => (
                          <li key={articleIndex}>
                            <a
                              href="#"
                              className="flex items-center justify-between text-sm text-gray-700 hover:text-purple-600 transition-colors duration-200 py-1"
                            >
                              <span>{article}</span>
                              <ChevronRight className="w-4 h-4" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Popular FAQs */}
        <section className="py-16 bg-white/50">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              {popularFAQs.map((faq, index) => (
                <Card
                  key={index}
                  className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Still Need Help?
              </h2>
              <p className="text-xl text-gray-600">
                Our support team is here to assist you 24/7
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {contactOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <Card
                    key={index}
                    className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white cursor-pointer"
                  >
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {option.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{option.description}</p>
                      <p className="text-sm text-purple-600 font-medium mb-6">
                        {option.availability}
                      </p>
                      <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                        {option.action}
                      </button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}