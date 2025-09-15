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
            <Link href="/sign-up" className="inline-block">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-purple-600 hover:bg-purple-600 hover:text-white btn-animate text-lg px-8 py-4 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <Link href="/exams" className="inline-block">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-white/90 text-white hover:bg-white/20 hover:border-white hover:text-white btn-animate text-lg px-8 py-4 h-auto backdrop-blur-sm bg-white/10 transition-all duration-200"
              >
                Browse Exams
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
