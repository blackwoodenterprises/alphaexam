import { SignIn } from "@clerk/nextjs";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { BookOpen, Shield, Zap, BarChart3 } from "lucide-react";

export default function SignInPage() {
  const features = [
    {
      icon: BookOpen,
      title: "Resume Your Practice",
      description:
        "Continue where you left off with personalized recommendations",
    },
    {
      icon: BarChart3,
      title: "Track Progress",
      description: "Monitor your improvement with detailed analytics",
    },
    {
      icon: Shield,
      title: "Secure Environment",
      description: "Your data is protected with enterprise-grade security",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized platform for the best exam experience",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <main className="py-12">
        <div className="container-restricted px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Welcome Back */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Welcome Back to
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {" "}
                    AlphaExam
                  </span>
                </h1>
                <p className="text-xl text-gray-600">
                  Continue your exam preparation journey with personalized
                  insights and progress tracking.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-3">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-xs">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Recent activity or stats could go here */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="font-bold text-lg mb-2">Did you know?</h3>
                <p className="text-blue-100 mb-2">
                  Students who practice regularly score 40% higher in their
                  actual exams.
                </p>
                <div className="text-sm text-blue-200">
                  Join 100,000+ students already improving their scores
                </div>
              </div>
            </div>

            {/* Right side - Sign In Form */}
            <div className="flex justify-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Sign In to Your Account
                  </h2>
                  <p className="text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/sign-up"
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Sign up for free
                    </Link>
                  </p>
                </div>

                <SignIn
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

                {/* Demo credentials for testing */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Demo Account (for testing):
                  </h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Email: demo@alphaexam.in</div>
                    <div>Password: Demo123!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
