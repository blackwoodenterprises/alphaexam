import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calculator,
  Atom,
  TestTube,
  Brain,
  BookOpen,
  Award,
} from "lucide-react";

export function ExamCategoriesSection() {
  const examCategories = [
    {
      id: "olympiad",
      title: "Mathematical Olympiads",
      description:
        "IMO, RMO, INMO, and other prestigious mathematical competitions",
      icon: Calculator,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      features: [
        "Problem-solving techniques",
        "Advanced mathematics",
        "Competition strategies",
      ],
      examCount: 25,
      questionCount: 500000,
      difficulty: "Advanced",
      duration: "3-4 hours",
    },
    {
      id: "jee",
      title: "JEE Main & Advanced",
      description:
        "Complete preparation for JEE Main and JEE Advanced examinations",
      icon: Atom,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      features: [
        "Physics concepts",
        "Chemistry reactions",
        "Mathematical applications",
      ],
      examCount: 40,
      questionCount: 300000,
      difficulty: "Hard",
      duration: "3 hours",
    },
    {
      id: "neet",
      title: "NEET Preparation",
      description:
        "Medical entrance exam preparation with comprehensive coverage",
      icon: TestTube,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      features: [
        "Biology concepts",
        "Chemistry fundamentals",
        "Physics applications",
      ],
      examCount: 30,
      questionCount: 200000,
      difficulty: "Hard",
      duration: "3 hours",
    },
    {
      id: "reasoning",
      title: "Logical Reasoning",
      description:
        "Enhance your logical thinking and problem-solving abilities",
      icon: Brain,
      color: "from-pink-500 to-pink-600",
      bgColor: "from-pink-50 to-pink-100",
      features: [
        "Analytical reasoning",
        "Logical puzzles",
        "Pattern recognition",
      ],
      examCount: 20,
      questionCount: 150000,
      difficulty: "Medium",
      duration: "2 hours",
    },
    {
      id: "general",
      title: "General Knowledge",
      description: "Current affairs, history, geography, and general awareness",
      icon: BookOpen,
      color: "from-amber-500 to-amber-600",
      bgColor: "from-amber-50 to-amber-100",
      features: ["Current affairs", "Static GK", "General awareness"],
      examCount: 15,
      questionCount: 100000,
      difficulty: "Easy",
      duration: "1-2 hours",
    },
    {
      id: "competitive",
      title: "Other Competitive Exams",
      description: "UPSC, SSC, Banking, and other government job preparations",
      icon: Award,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "from-indigo-50 to-indigo-100",
      features: ["Government jobs", "Banking exams", "Civil services"],
      examCount: 35,
      questionCount: 250000,
      difficulty: "Medium",
      duration: "2-3 hours",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container-restricted px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Choose Your
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}
              Exam Category
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive mock tests designed specifically for different
            competitive exams. Select your target exam and start practicing
            today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examCategories.map((category, index) => (
            <Card
              key={category.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader
                className={`bg-gradient-to-br ${category.bgColor} relative overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 bg-gradient-to-br ${category.color} rounded-xl shadow-lg`}
                  >
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-600">
                      {category.examCount} Tests
                    </div>
                    <div className="text-xs text-gray-500">
                      {category.questionCount.toLocaleString()} Questions
                    </div>
                  </div>
                </div>

                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {category.title}
                </CardTitle>

                <CardDescription className="text-gray-600">
                  {category.description}
                </CardDescription>

                {/* Floating decoration */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-full blur-xl" />
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Key Topics:
                    </h4>
                    <ul className="space-y-1">
                      {category.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-600 flex items-center"
                        >
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exam details */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-purple-100">
                    <div>
                      <div className="text-xs text-gray-500">Difficulty</div>
                      <div className="text-sm font-medium text-gray-900">
                        {category.difficulty}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Duration</div>
                      <div className="text-sm font-medium text-gray-900">
                        {category.duration}
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/exams?category=${category.id}`}
                    className="block mt-6"
                  >
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white btn-animate">
                      Explore Tests
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="text-gray-900">
              <div className="font-semibold">
                Can't find your exam category?
              </div>
              <div className="text-sm text-gray-600">
                We're constantly adding new exams and subjects
              </div>
            </div>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                Request New Category
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
