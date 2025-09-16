import { SignUp } from "@clerk/nextjs";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { BookOpen, Users, Trophy, Zap } from "lucide-react";

export default function SignUpPage() {
  const benefits = [
    {
      icon: BookOpen,
      title: "Access 1M+ Questions",
      description: "Comprehensive question bank for all competitive exams",
    },
    {
      icon: Users,
      title: "Join 100K+ Students",
      description: "Be part of India's largest mock testing community",
    },
    {
      icon: Trophy,
      title: "Track Your Progress",
      description: "Detailed analytics and performance insights",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get immediate feedback and explanations",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <main className="py-12">
        <div className="container-restricted px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Benefits */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Join
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {" "}
                    AlphaExam
                  </span>
                </h1>
                <p className="text-xl text-gray-600">
                  Start your journey to exam success with India&apos;s most
                  trusted mock testing platform.
                </p>
              </div>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
                <h3 className="font-bold text-lg mb-2">🎉 Welcome Bonus!</h3>
                <p className="text-green-100 mb-3">
                  New students who sign up and complete onboarding receive{" "}
                  <span className="font-bold bg-white/20 px-2 py-1 rounded">
                    100 FREE credits
                  </span>
                </p>
                <div className="text-sm text-green-200">
                  Start practicing immediately • No payment required
                </div>
              </div>
            </div>

            {/* Right side - Sign Up Form */}
            <div className="flex justify-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Create Your Account
                  </h2>
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link
                      href="/sign-in"
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>

                <SignUp
                  appearance={{
                    elements: {
                      formButtonPrimary:
                        "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white",
                      card: "shadow-none bg-transparent",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton:
                        "border-gray-200 hover:bg-gray-50",
                      formFieldInput:
                        "border-gray-200 focus:border-purple-500 focus:ring-purple-500",
                      footerActionLink: "text-purple-600 hover:text-purple-700",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
