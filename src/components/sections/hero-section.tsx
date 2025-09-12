import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Trophy, Users, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-purple-500/5 bg-[radial-gradient(circle_at_1px_1px,rgba(168,85,247,0.15)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="container-restricted px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 mb-8">
            <Trophy className="w-4 h-4 mr-2" />
            India's #1 Mock Testing Platform
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6">
            Master
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              {" "}
              Olympiads
            </span>
            <br />
            with AlphaExam
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Take comprehensive mock tests for Mathematical Olympiads, JEE, NEET,
            and other competitive exams. Join 100,000+ students who trust
            AlphaExam for their success.
          </p>

          {/* Stats preview */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12 text-gray-600">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">1M+ Questions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">
                100K+ Students
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">99.9% Uptime</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/exams">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white btn-animate text-lg px-8 py-4 h-auto"
              >
                Browse Mock Tests
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <Link href="/sign-up">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-purple-200 hover:bg-purple-50 text-purple-700 btn-animate text-lg px-8 py-4 h-auto"
              >
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Trusted by students from top institutions
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-gray-400 font-semibold">IIT Delhi</div>
              <div className="text-gray-400 font-semibold">IIT Bombay</div>
              <div className="text-gray-400 font-semibold">IISc Bangalore</div>
              <div className="text-gray-400 font-semibold">BITS Pilani</div>
              <div className="text-gray-400 font-semibold">NIT Trichy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse animation-delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full opacity-20 animate-pulse animation-delay-2000" />
    </section>
  );
}
