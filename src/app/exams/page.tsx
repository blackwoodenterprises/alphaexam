import { prisma } from "@/lib/prisma";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Users,
  GraduationCap,
  Star,
  Search,
  Filter,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

async function getPublicExams() {
  try {
    const exams = await prisma.exam.findMany({
      where: {
        isActive: true,
      },
      include: {
        _count: {
          select: {
            examQuestions: true,
            examAttempts: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20, // Limit for performance
    });

    return exams;
  } catch (error) {
    console.error("Error fetching public exams:", error);
    return [];
  }
}

export default async function ExamsPage() {
  const exams = await getPublicExams();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "OLYMPIAD":
        return "bg-purple-100 text-purple-800";
      case "JEE":
        return "bg-blue-100 text-blue-800";
      case "NEET":
        return "bg-green-100 text-green-800";
      case "OTHER":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "OLYMPIAD":
        return "🏆";
      case "JEE":
        return "⚙️";
      case "NEET":
        return "🩺";
      case "OTHER":
        return "📚";
      default:
        return "📚";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <main className="py-12">
        <div className="container-restricted px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Mock Tests & Practice Exams
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive collection of mock tests for Mathematical Olympiads,
              JEE, NEET and other competitive exams. Practice with our
              AI-powered question bank and track your progress.
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search exams by title, category, or topic..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <select className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white">
                    <option value="">All Categories</option>
                    <option value="OLYMPIAD">Mathematical Olympiad</option>
                    <option value="JEE">JEE Main/Advanced</option>
                    <option value="NEET">NEET</option>
                    <option value="OTHER">Other Exams</option>
                  </select>
                  <select className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white">
                    <option value="">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <select className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white">
                    <option value="">Sort By</option>
                    <option value="newest">Newest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="duration">Duration</option>
                  </select>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center space-x-2 h-12"
                  >
                    <Filter className="w-4 h-4" />
                    <span>More Filters</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <Card className="text-center hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col justify-center items-center min-h-[120px]">
                <div className="text-2xl lg:text-3xl font-bold text-purple-600 mb-2">
                  {exams.length}
                </div>
                <div className="text-sm lg:text-base text-gray-600">
                  Available Exams
                </div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col justify-center items-center min-h-[120px]">
                <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-2">
                  1M+
                </div>
                <div className="text-sm lg:text-base text-gray-600">
                  Questions
                </div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col justify-center items-center min-h-[120px]">
                <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-2">
                  50K+
                </div>
                <div className="text-sm lg:text-base text-gray-600">
                  Students
                </div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col justify-center items-center min-h-[120px]">
                <div className="text-2xl lg:text-3xl font-bold text-orange-600 mb-2">
                  4.9★
                </div>
                <div className="text-sm lg:text-base text-gray-600">
                  Average Rating
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Exams Grid */}
          {exams.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No exams available
                </h3>
                <p className="text-gray-600">
                  Check back soon for new mock tests and practice exams!
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Mock Tests ({exams.length})
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="hidden sm:inline">Sort by:</span>
                  <select className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white min-w-[120px]">
                    <option>Most Recent</option>
                    <option>Most Popular</option>
                    <option>Difficulty</option>
                    <option>Duration</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam) => (
                  <Card
                    key={exam.id}
                    className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col h-full"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                            exam.category
                          )}`}
                        >
                          <span className="mr-1">
                            {getCategoryIcon(exam.category)}
                          </span>
                          {exam.category}
                        </span>
                        {exam.isFree ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Free
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            ₹{exam.price}
                          </span>
                        )}
                      </div>
                      <CardTitle className="group-hover:text-purple-600 transition-colors">
                        {exam.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {exam.description ||
                          "Comprehensive mock test to assess your knowledge and preparation level."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col h-full pt-0">
                      <div className="grid grid-cols-3 gap-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center justify-center space-x-1 bg-gray-50 rounded-lg p-2">
                          <GraduationCap className="w-4 h-4" />
                          <span className="font-medium">
                            {exam._count.examQuestions}
                          </span>
                        </div>
                        <div className="flex items-center justify-center space-x-1 bg-gray-50 rounded-lg p-2">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">{exam.duration}m</span>
                        </div>
                        <div className="flex items-center justify-center space-x-1 bg-gray-50 rounded-lg p-2">
                          <Users className="w-4 h-4" />
                          <span className="font-medium">
                            {exam._count.examAttempts}
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600 ml-1 font-medium">
                              4.8
                            </span>
                          </div>
                        </div>
                        <Link href={`/exams/${exam.id}`} className="block">
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white group-hover:shadow-lg transition-all">
                            Start Test
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" className="px-8">
                  Load More Exams
                </Button>
              </div>
            </>
          )}

          {/* CTA Section */}
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
              <CardContent className="text-center py-12 px-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Ready to Start Your Preparation?
                </h2>
                <p className="text-purple-100 mb-8 max-w-2xl mx-auto text-base sm:text-lg">
                  Join thousands of students who have improved their scores with
                  our comprehensive mock tests and AI-powered practice sessions.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/sign-up" className="inline-block">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 font-semibold"
                    >
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/dashboard" className="inline-block">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 font-semibold"
                    >
                      View Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
