"use client";

import Link from "next/link";
import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

export function Footer() {
  // Static product links - no database dependency
  const productLinks = [
    { name: "JEE Tests", href: "/exams?category=jee" },
    { name: "NEET Tests", href: "/exams?category=neet" },
    { name: "GATE Tests", href: "/exams?category=gate" },
    { name: "CAT Tests", href: "/exams?category=cat" },
    { name: "Question Bank", href: "/questions" },
  ];

  const footerSections = [
    {
      title: "Product",
      links: productLinks,
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Contact Us", href: "/contact" },
        { name: "Careers", href: "/careers" },
        { name: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "FAQs", href: "/faq" },
        { name: "System Status", href: "/status" },
        { name: "Report Issue", href: "/report" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Refund Policy", href: "/refund" },
      ],
    },
  ];

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-t border-purple-100">
      <div className="container-restricted px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AlphaExam
              </span>
            </Link>

            <p className="text-gray-600 max-w-md">
              India&apos;s best online mock testing platform for mathematical
              olympiads and competitive exams. Join 100,000+ students preparing
              for success.
            </p>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm">support@alphaexam.in</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Mumbai, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 pt-4">
              {socialLinks.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-gray-600 hover:text-purple-600"
                  aria-label={name}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold text-gray-900">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-purple-600 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-purple-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-600 text-sm">
              © {new Date().getFullYear()} AlphaExam. All rights reserved.
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="hidden sm:inline">
                🌟 Rated 4.9/5 by students
              </span>
              <span className="hidden sm:inline">•</span>
              <span>1,000,000+ Questions</span>
              <span>•</span>
              <span className="text-green-600 font-medium">99.9% Uptime</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
