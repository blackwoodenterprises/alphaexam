import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Eye,
  Lock,
  Users,
  Database,
  Globe,
  Mail,
  Settings,
  Calendar,
} from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "January 15, 2025";

  const privacySections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Personal information you provide when creating an account (name, email, phone number)",
        "Educational information such as your academic level, subjects of interest, and test preferences",
        "Usage data including test scores, time spent on platform, and learning progress",
        "Technical information like IP address, browser type, device information, and cookies",
        "Communication data when you contact our support team or participate in surveys",
      ],
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "Provide and improve our educational services and platform functionality",
        "Personalize your learning experience with AI-powered recommendations",
        "Generate detailed performance analytics and progress reports",
        "Send important updates about your account, tests, and new features",
        "Provide customer support and respond to your inquiries",
        "Conduct research to enhance our educational content and methodology",
      ],
    },
    {
      icon: Users,
      title: "Information Sharing",
      content: [
        "We do not sell, trade, or rent your personal information to third parties",
        "Educational institutions may access aggregated, anonymized performance data if you're part of their program",
        "Service providers who help us operate our platform (hosting, analytics, payment processing) under strict confidentiality agreements",
        "Legal authorities when required by law or to protect our rights and safety",
        "Business transfers in case of merger, acquisition, or sale of assets (with prior notice)",
      ],
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "Industry-standard encryption for data transmission and storage (AES-256)",
        "Regular security audits and penetration testing by third-party experts",
        "Multi-factor authentication options for enhanced account security",
        "Secure data centers with 24/7 monitoring and access controls",
        "Employee training on data protection and confidentiality protocols",
        "Incident response procedures for any potential security breaches",
      ],
    },
    {
      icon: Settings,
      title: "Your Rights and Controls",
      content: [
        "Access and download your personal data at any time through your account settings",
        "Correct or update your information whenever needed",
        "Delete your account and associated data (some data may be retained for legal compliance)",
        "Opt-out of marketing communications while maintaining essential service notifications",
        "Control cookie preferences and tracking settings",
        "Request data portability to transfer your information to another service",
      ],
    },
    {
      icon: Globe,
      title: "International Data Transfers",
      content: [
        "Your data is primarily stored on servers located in India",
        "Some service providers may process data in other countries with adequate protection laws",
        "We ensure appropriate safeguards are in place for any international transfers",
        "Data processing agreements comply with applicable privacy regulations",
        "You can request information about where your data is processed",
      ],
    },
  ];

  const keyPrinciples = [
    {
      icon: Shield,
      title: "Transparency",
      description: "We clearly explain what data we collect and how we use it",
    },
    {
      icon: Lock,
      title: "Security First",
      description: "Your data is protected with enterprise-grade security measures",
    },
    {
      icon: Users,
      title: "User Control",
      description: "You have full control over your personal information and privacy settings",
    },
    {
      icon: Eye,
      title: "Minimal Collection",
      description: "We only collect data that's necessary to provide our services",
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
                Privacy{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Policy
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Your privacy is fundamental to us. Learn how we collect, use, and
                protect your personal information.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Last updated: {lastUpdated}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Key Principles */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Our Privacy Principles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {keyPrinciples.map((principle, index) => {
                const Icon = principle.icon;
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
                        {principle.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{principle.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Privacy Sections */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
              {privacySections.map((section, index) => {
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

        {/* Additional Information */}
        <section className="py-16 bg-white/50">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Additional Information
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Children&apos;s Privacy
                      </h3>
                      <p className="text-gray-700">
                        Our services are designed for users aged 13 and above. We do not
                        knowingly collect personal information from children under 13. If
                        you believe we have collected information from a child under 13,
                        please contact us immediately.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Cookies and Tracking
                      </h3>
                      <p className="text-gray-700">
                        We use cookies and similar technologies to enhance your experience,
                        analyze usage patterns, and provide personalized content. You can
                        manage your cookie preferences through your browser settings or our
                        cookie preference center.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Changes to This Policy
                      </h3>
                      <p className="text-gray-700">
                        We may update this privacy policy from time to time. We will notify
                        you of any material changes by email or through a prominent notice
                        on our platform. Your continued use of our services after such
                        changes constitutes acceptance of the updated policy.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Questions About Privacy?
              </h2>
              <p className="text-gray-600 mb-8">
                If you have any questions about this privacy policy or how we handle
                your personal information, we&apos;re here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Us
                </a>
                <a
                  href="/help"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-purple-600 font-medium rounded-xl border border-purple-200 hover:bg-purple-50 transition-all duration-300"
                >
                  Visit Help Center
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