import { Shield, Clock, BarChart3, Users, Smartphone, Zap } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Secure Exam Environment",
      description:
        "Full-screen mode with anti-cheat measures ensures fair testing conditions.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Clock,
      title: "Real-time Timer",
      description:
        "Accurate countdown timer with auto-submit functionality when time expires.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description:
        "Comprehensive performance reports with topic-wise analysis and improvement suggestions.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Users,
      title: "Peer Comparison",
      description:
        "Compare your performance with thousands of other students taking the same exams.",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description:
        "Take exams on any device - desktop, tablet, or smartphone with seamless experience.",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description:
        "Get immediate results and explanations as soon as you submit your exam.",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-restricted px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}
              Better Learning
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform is designed with advanced features to simulate real
            exam conditions and provide comprehensive learning analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white hover:shadow-xl transition-all duration-300 border border-gray-100 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional feature highlight */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Advanced Question Processing
          </h3>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Our AI-powered system processes mathematical equations and diagrams
            with 99.9% accuracy, ensuring perfect rendering of complex formulas
            and geometric figures.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">LaTeX</div>
              <div className="text-sm opacity-80">
                Mathematical notation support
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">MathJax</div>
              <div className="text-sm opacity-80">
                Real-time formula rendering
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">AI OCR</div>
              <div className="text-sm opacity-80">
                Intelligent image processing
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
