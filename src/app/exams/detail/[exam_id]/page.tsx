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
import {
  Clock,
  Users,
  GraduationCap,
  Star,
  Target,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExamDetailClient } from "@/components/exam-detail-client/index";

interface ExamDetailPageProps {
  params: {
    exam_id: string;
  };
}

async function getExamDetail(examId: string) {
  try {
    const exam = await prisma.exam.findUnique({
      where: {
        id: examId,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        richDescription: true,
        price: true,
        duration: true,
        questionsToServe: true,
        isFree: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        examCategory: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            examQuestions: true,
            examAttempts: true,
          },
        },
      },
    });

    return exam;
  } catch (error) {
    console.error("Error fetching exam detail:", error);
    return null;
  }
}

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

export default async function ExamDetailPage({ params }: ExamDetailPageProps) {
  const { exam_id } = await params;
  const exam = await getExamDetail(exam_id);

  if (!exam) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Header />
      <main className="py-8">
        <div className="container-restricted px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-purple-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/exams" className="hover:text-purple-600">
            Exams
          </Link>
          <span>/</span>
          <span className="text-gray-900">{exam.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Exam Header */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      getCategoryColor(exam.examCategory?.name || 'Unknown')
                    }`}
                  >
                    <span className="mr-2">
                      {getCategoryIcon(exam.examCategory?.name || 'Unknown')}
                    </span>
                    {exam.examCategory?.name || 'Unknown'}
                  </span>
                  {exam.isFree ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Free
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                      {exam.price} Credits
                    </span>
                  )}
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  {exam.title}
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  {exam.description ||
                    "Comprehensive mock test to assess your knowledge and preparation level."}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Exam Stats */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Exam Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <GraduationCap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {exam.questionsToServe}
                    </div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {exam.duration}
                    </div>
                    <div className="text-sm text-gray-600">Minutes</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {exam._count.examAttempts}
                    </div>
                    <div className="text-sm text-gray-600">Attempts</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Target className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      Medium
                    </div>
                    <div className="text-sm text-gray-600">Difficulty</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exam Description */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  About This Exam
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {exam.richDescription ? (
                    <div 
                      className="text-gray-700 leading-relaxed rich-text-content"
                      dangerouslySetInnerHTML={{ __html: exam.richDescription }}
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {exam.description ||
                        "This comprehensive mock test is designed to evaluate your understanding and preparation level. It covers all important topics and follows the latest exam pattern to give you a realistic test experience."}
                    </p>
                  )}

                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Launch Exam Card */}
            <ExamDetailClient exam={exam} />

            {/* Rating */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Student Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">4.8</span>
                  <span className="text-gray-600">({exam._count.examAttempts} reviews)</span>
                </div>
                <p className="text-sm text-gray-600">
                  Highly rated by students for comprehensive coverage and quality questions.
                </p>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {exam._count.examAttempts} students attempted
                      </p>
                      <p className="text-xs text-gray-600">This month</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Updated recently
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(exam.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}