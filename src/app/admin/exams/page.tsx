import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Filter,
  GraduationCap,
  Clock,
  Users,
  DollarSign,
  Edit,
  Eye,
  Trash2,
} from "lucide-react";
import { ExamCreateModal } from "@/components/admin/exam-create-modal";

async function getExams() {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            examQuestions: true,
            examAttempts: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return exams;
  } catch (error) {
    console.error("Error fetching exams:", error);
    return [];
  }
}

async function getExamStats() {
  try {
    const [totalExams, activeExams, totalAttempts, totalRevenue] =
      await Promise.all([
        prisma.exam.count(),
        prisma.exam.count({ where: { isActive: true } }),
        prisma.examAttempt.count(),
        prisma.transaction.aggregate({
          where: {
            status: "COMPLETED",
            type: "CREDIT_PURCHASE",
          },
          _sum: {
            amount: true,
          },
        }),
      ]);

    return {
      totalExams,
      activeExams,
      totalAttempts,
      totalRevenue: totalRevenue._sum.amount || 0,
    };
  } catch (error) {
    console.error("Error fetching exam stats:", error);
    return {
      totalExams: 0,
      activeExams: 0,
      totalAttempts: 0,
      totalRevenue: 0,
    };
  }
}

export default async function ExamsManagementPage() {
  const exams = await getExams();
  const stats = await getExamStats();

  const statsCards = [
    {
      title: "Total Exams",
      value: stats.totalExams.toString(),
      change: `${stats.activeExams} active`,
      changeType: "neutral" as const,
      icon: GraduationCap,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Attempts",
      value: stats.totalAttempts.toLocaleString(),
      change: "+12% this month",
      changeType: "positive" as const,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Avg Duration",
      value: "45 min",
      change: "Standard duration",
      changeType: "neutral" as const,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      change: "+8.5% this month",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exam Management</h1>
          <p className="text-gray-600 mt-1">
            Create and manage mock tests for students
          </p>
        </div>
        <ExamCreateModal>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Exam
          </Button>
        </ExamCreateModal>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <p
                className={`text-xs ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : stat.changeType === "neutral"
                    ? "text-gray-500"
                    : "text-red-600"
                }`}
              >
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search exams by title, category..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500">
              <option value="">All Categories</option>
              <option value="OLYMPIAD">Olympiad</option>
              <option value="JEE">JEE</option>
              <option value="NEET">NEET</option>
              <option value="OTHER">Other</option>
            </select>
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exams List */}
      <Card>
        <CardHeader>
          <CardTitle>All Exams ({exams.length})</CardTitle>
          <CardDescription>
            Manage your mock tests and practice exams
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {exams.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No exams created yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start by creating your first mock test for students
              </p>
              <ExamCreateModal>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Exam
                </Button>
              </ExamCreateModal>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Exam Details
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Questions
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Duration
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Attempts
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam) => (
                    <tr
                      key={exam.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {exam.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            Created by {exam.createdBy.firstName}{" "}
                            {exam.createdBy.lastName}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                            exam.category
                          )}`}
                        >
                          {exam.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-900">
                        {exam._count.examQuestions}
                      </td>
                      <td className="py-4 px-4 text-gray-900">
                        {exam.duration} min
                      </td>
                      <td className="py-4 px-4">
                        {exam.isFree ? (
                          <span className="text-green-600 font-medium">
                            Free
                          </span>
                        ) : (
                          <span className="text-gray-900">₹{exam.price}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-900">
                        {exam._count.examAttempts}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            exam.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {exam.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
