import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  Target,
  Users,
  Award,
  BookOpen,
  Zap,
  Heart,
  Trophy,
  Globe,
  CheckCircle,
} from "lucide-react";

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Students Served", value: "50K+" },
    { icon: BookOpen, label: "Questions Available", value: "1M+" },
    { icon: Trophy, label: "Mock Tests", value: "500+" },
    { icon: Globe, label: "Countries", value: "25+" },
  ];

  const features = [
    {
      icon: Target,
      title: "Precision Learning",
      description:
        "AI-powered question recommendations tailored to your strengths and weaknesses.",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description:
        "Get detailed performance analytics and feedback immediately after each test.",
    },
    {
      icon: Award,
      title: "Expert Content",
      description:
        "Questions created and reviewed by olympiad winners and subject matter experts.",
    },
    {
      icon: Heart,
      title: "Student-Centric",
      description:
        "Designed with student success in mind, focusing on concept clarity and problem-solving.",
    },
  ];

  const team = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Founder & CEO",
      description:
        "Former IMO gold medalist with 15+ years in mathematical education.",
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23e879f9'/%3E%3Ctext x='60' y='70' font-family='Arial, sans-serif' font-size='48' fill='white' text-anchor='middle'%3ERK%3C/text%3E%3C/svg%3E",
    },
    {
      name: "Priya Sharma",
      role: "Head of Content",
      description:
        "IIT Delhi alumni specializing in competitive exam preparation strategies.",
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%236366f1'/%3E%3Ctext x='60' y='70' font-family='Arial, sans-serif' font-size='48' fill='white' text-anchor='middle'%3EPS%3C/text%3E%3C/svg%3E",
    },
    {
      name: "Amit Singh",
      role: "Tech Lead",
      description:
        "Full-stack developer passionate about educational technology and AI.",
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%2310b981'/%3E%3Ctext x='60' y='70' font-family='Arial, sans-serif' font-size='48' fill='white' text-anchor='middle'%3EAS%3C/text%3E%3C/svg%3E",
    },
  ];

  const achievements = [
    "Featured in Education Week as 'Top 10 EdTech Platforms 2024'",
    "Winner of National Education Innovation Award 2023",
    "Partner with 200+ schools across India",
    "98% student satisfaction rate",
    "Average 35% improvement in test scores",
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
                About{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AlphaExam
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Empowering students worldwide to excel in competitive
                examinations through innovative technology and expert guidance.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-8">
                    <stat.icon className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  At AlphaExam, we believe every student deserves access to
                  world-class preparation resources. Our mission is to
                  democratize competitive exam preparation by providing
                  AI-powered, personalized learning experiences that adapt to
                  each student&apos;s unique needs.
                </p>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  We started with a simple observation: traditional exam
                  preparation methods often leave students overwhelmed and
                  underprepared. By combining cutting-edge technology with
                  proven pedagogical approaches, we&apos;re revolutionizing how
                  students prepare for mathematical olympiads, JEE, NEET, and
                  other competitive examinations.
                </p>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <Card className="p-8 bg-gradient-to-br from-purple-100 to-pink-100 border-0">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Our Vision
                    </h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      To become the global leader in competitive exam
                      preparation, making quality education accessible to
                      students everywhere, regardless of their geographical or
                      economic constraints.
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Our Values
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        <span className="text-gray-700">
                          Excellence in education
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                        <span className="text-gray-700">
                          Innovation in technology
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700">
                          Accessibility for all
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-gray-700">
                          Student-centric approach
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white/50">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Makes Us Different
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We combine advanced technology with proven educational
                methodologies to create an unparalleled learning experience.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-all duration-300 group"
                >
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our diverse team of educators, technologists, and innovators is
                united by a passion for student success.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-8">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-6"
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-purple-600 font-medium mb-4">
                      {member.role}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="container-restricted px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Exam Preparation?
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Join thousands of students who have already started their
                journey to academic excellence with AlphaExam.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="/sign-up"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  Start Free Trial
                </a>
                <a
                  href="/exams"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-colors duration-200"
                >
                  Explore Exams
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
