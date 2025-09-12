import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Zap } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      {/* Floating elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse" />
      <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse animation-delay-1000" />
      <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse animation-delay-2000" />

      <div className="container-restricted px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center text-white">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            Ready to Ace Your Exams?
          </h2>

          <p className="text-xl sm:text-2xl opacity-90 max-w-3xl mx-auto mb-12 leading-relaxed">
            Join 100,000+ students who are already using AlphaExam to achieve
            their academic goals. Start your journey to success today!
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12 text-white/90">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6" />
              <span className="font-medium">1M+ Questions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6" />
              <span className="font-medium">Expert Curated</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-6 h-6" />
              <span className="font-medium">Instant Results</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-50 btn-animate text-lg px-8 py-4 h-auto font-semibold"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <Link href="/exams">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/30 hover:bg-white/10 text-white btn-animate text-lg px-8 py-4 h-auto backdrop-blur-sm"
              >
                Browse Exams
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 text-center">
            <p className="text-white/80 mb-4">
              Join students from top institutions
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 opacity-70">
              <div className="text-white/90 font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                IIT
              </div>
              <div className="text-white/90 font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                NIT
              </div>
              <div className="text-white/90 font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                AIIMS
              </div>
              <div className="text-white/90 font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                BITS
              </div>
              <div className="text-white/90 font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                ISI
              </div>
            </div>
          </div>

          {/* Special offer */}
          <div className="mt-16 inline-flex items-center bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-left">
              <div className="text-sm font-medium text-white/80">
                Limited Time Offer
              </div>
              <div className="text-lg font-bold text-white">
                Get 50% off on your first purchase
              </div>
              <div className="text-sm text-white/80">
                Use code: ALPHA50 at checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
