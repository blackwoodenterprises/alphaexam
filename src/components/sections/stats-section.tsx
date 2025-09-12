import { BookOpen, Users, Trophy, Clock, Target, Star } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      icon: BookOpen,
      number: "1,000,000+",
      label: "Questions in Bank",
      description: "Comprehensive question database",
    },
    {
      icon: Users,
      number: "100,000+",
      label: "Active Students",
      description: "Students trust AlphaExam",
    },
    {
      icon: Trophy,
      number: "50,000+",
      label: "Exams Completed",
      description: "Mock tests taken monthly",
    },
    {
      icon: Clock,
      number: "99.9%",
      label: "Uptime",
      description: "Reliable testing platform",
    },
    {
      icon: Target,
      number: "95%",
      label: "Success Rate",
      description: "Students improve scores",
    },
    {
      icon: Star,
      number: "4.9/5",
      label: "Student Rating",
      description: "Highly rated platform",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-restricted px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Students Choose
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}
              AlphaExam
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We&apos;re committed to providing the best online mock testing
            experience for competitive exam preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-6">
                <stat.icon className="w-8 h-8 text-white" />
              </div>

              <div className="text-4xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>

              <div className="text-lg font-semibold text-purple-600 mb-2">
                {stat.label}
              </div>

              <div className="text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Additional highlight */}
        <div className="mt-16 text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Join the Success Story</h3>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Over 50,000 students have improved their exam scores using
            AlphaExam. Be part of India&apos;s fastest-growing mock testing
            community.
          </p>
        </div>
      </div>
    </section>
  );
}
