import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Users,
  CreditCard,
  Shield,
  AlertTriangle,
  Scale,
  Globe,
  Calendar,
  CheckCircle,
} from "lucide-react";

export default function TermsPage() {
  const lastUpdated = "January 15, 2025";
  const effectiveDate = "January 1, 2025";

  const termsSections = [
    {
      icon: Users,
      title: "Account Registration and Use",
      content: [
        "You must be at least 13 years old to create an account on AlphaExam",
        "You are responsible for maintaining the confidentiality of your account credentials",
        "You must provide accurate and complete information during registration",
        "Each user is allowed only one active account unless explicitly authorized",
        "You are responsible for all activities that occur under your account",
        "You must notify us immediately of any unauthorized use of your account",
      ],
    },
    {
      icon: CheckCircle,
      title: "Acceptable Use Policy",
      content: [
        "Use our services only for lawful educational purposes",
        "Do not share, distribute, or sell test content or answers to third parties",
        "Respect intellectual property rights of all content on our platform",
        "Do not attempt to hack, reverse engineer, or compromise our systems",
        "Maintain respectful communication in all interactions with other users and staff",
        "Do not create multiple accounts to circumvent limitations or restrictions",
      ],
    },
    {
      icon: CreditCard,
      title: "Subscription and Payment Terms",
      content: [
        "Subscription fees are billed in advance on a monthly or annual basis",
        "All payments are processed securely through our authorized payment partners",
        "Subscription automatically renews unless cancelled before the renewal date",
        "Price changes will be communicated 30 days in advance for existing subscribers",
        "Refunds are available within 7 days of purchase subject to our refund policy",
        "Failure to pay may result in suspension or termination of your account",
      ],
    },
    {
      icon: Shield,
      title: "Intellectual Property Rights",
      content: [
        "All content, including questions, explanations, and materials, is owned by AlphaExam or licensed to us",
        "You may not copy, distribute, modify, or create derivative works from our content",
        "Your use of our content is limited to personal, non-commercial educational purposes",
        "We respect intellectual property rights and expect users to do the same",
        "Report any copyright infringement to our designated agent immediately",
        "We reserve the right to remove content that violates intellectual property rights",
      ],
    },
    {
      icon: AlertTriangle,
      title: "Prohibited Activities",
      content: [
        "Cheating, including using unauthorized aids during tests or sharing answers",
        "Attempting to access other users' accounts or personal information",
        "Uploading malicious software, viruses, or harmful code to our platform",
        "Using automated tools, bots, or scripts to access our services",
        "Engaging in any activity that disrupts or interferes with our services",
        "Violating any applicable laws or regulations while using our platform",
      ],
    },
    {
      icon: Scale,
      title: "Limitation of Liability",
      content: [
        "Our services are provided 'as is' without warranties of any kind",
        "We are not liable for any indirect, incidental, or consequential damages",
        "Our total liability is limited to the amount you paid for our services in the past 12 months",
        "We do not guarantee uninterrupted or error-free service availability",
        "You acknowledge that test results are for practice purposes and may not reflect actual exam performance",
        "We are not responsible for decisions made based on our test results or recommendations",
      ],
    },
    {
      icon: Globe,
      title: "Termination and Suspension",
      content: [
        "You may terminate your account at any time through your account settings",
        "We may suspend or terminate accounts that violate these terms",
        "Upon termination, your access to paid features will cease immediately",
        "We may retain certain information as required by law or for legitimate business purposes",
        "Termination does not relieve you of any payment obligations incurred before termination",
        "We will provide reasonable notice before termination unless immediate action is required for security",
      ],
    },
  ];

  const keyHighlights = [
    {
      icon: FileText,
      title: "Fair Use",
      description: "Use our platform responsibly for educational purposes only",
    },
    {
      icon: Shield,
      title: "Data Protection",
      description: "Your personal information is protected under our privacy policy",
    },
    {
      icon: Scale,
      title: "Legal Compliance",
      description: "All activities must comply with applicable laws and regulations",
    },
    {
      icon: Users,
      title: "Community Standards",
      description: "Maintain respectful and ethical behavior in our community",
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
                Terms of{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Service
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Please read these terms carefully before using AlphaExam. By using
                our services, you agree to be bound by these terms.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Last updated: {lastUpdated}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Effective: {effectiveDate}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Highlights */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Key Terms Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {keyHighlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <Card
                    key={index}
                    className="text-center border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:shadow-lg"
                  >
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {highlight.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{highlight.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Terms Sections */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
              {termsSections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <Card
                    key={index}
                    className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300"
                  >
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {section.title}
                        </h2>
                      </div>
                      <ul className="space-y-3">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                            <p className="text-gray-700 leading-relaxed">{item}</p>
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

        {/* Additional Legal Information */}
        <section className="py-16 bg-white/50">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Additional Legal Information
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Governing Law
                      </h3>
                      <p className="text-gray-700">
                        These terms are governed by the laws of India. Any disputes
                        arising from these terms will be subject to the exclusive
                        jurisdiction of the courts in Mumbai, Maharashtra, India.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Modifications to Terms
                      </h3>
                      <p className="text-gray-700">
                        We reserve the right to modify these terms at any time. Material
                        changes will be communicated via email or prominent notice on our
                        platform. Continued use after changes constitutes acceptance of
                        the modified terms.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Severability
                      </h3>
                      <p className="text-gray-700">
                        If any provision of these terms is found to be unenforceable,
                        the remaining provisions will continue to be valid and
                        enforceable to the fullest extent permitted by law.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Contact Information
                      </h3>
                      <p className="text-gray-700">
                        For questions about these terms, please contact us at
                        legal@alphaexam.com or through our contact page. We aim to
                        respond to all legal inquiries within 5 business days.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Agreement Section */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Scale className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Agreement Acknowledgment
                  </h2>
                  <p className="text-gray-700 mb-6">
                    By using AlphaExam, you acknowledge that you have read,
                    understood, and agree to be bound by these Terms of Service and
                    our Privacy Policy.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="/privacy"
                      className="inline-flex items-center justify-center px-6 py-3 bg-white text-purple-600 font-medium rounded-xl border border-purple-200 hover:bg-purple-50 transition-all duration-300"
                    >
                      View Privacy Policy
                    </a>
                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      Contact Legal Team
                    </a>
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