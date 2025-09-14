import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  FileQuestion,
  GraduationCap,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  Activity,
} from "lucide-react";

async function getDashboardStats() {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalQuestions,
      totalExams,
      activeExamAttempts,
      totalTransactions,
      recentUsers,
      completedExamAttempts,
      passedExamAttempts,
      lastMonthUsers,
      lastWeekQuestions,
      lastMonthExams,
      lastMonthRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.question.count(),
      prisma.exam.count(),
      prisma.examAttempt.count({
        where: { status: "IN_PROGRESS" },
      }),
      prisma.transaction.count({
        where: { status: "COMPLETED" },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          _count: {
            select: {
              examAttempts: true,
            },
          },
        },
      }),
      prisma.examAttempt.count({
        where: { status: "COMPLETED" },
      }),
      prisma.examAttempt.count({
        where: {
          status: "COMPLETED",
          percentage: { gte: 60 }, // Assuming 60% is passing score
        },
      }),
      // Last month users for growth calculation
      prisma.user.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
      }),
      // Last week questions for growth calculation
      prisma.question.count({
        where: {
          createdAt: {
            gte: lastWeek,
          },
        },
      }),
      // Last month exams for growth calculation
      prisma.exam.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
      }),
      // Last month revenue for growth calculation
      prisma.transaction.aggregate({
        where: {
          status: "COMPLETED",
          type: "CREDIT_PURCHASE",
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    // Calculate total revenue
    const revenueData = await prisma.transaction.aggregate({
      where: {
        status: "COMPLETED",
        type: "CREDIT_PURCHASE",
      },
      _sum: {
        amount: true,
      },
    });

    // Calculate success rate
    const successRate =
      completedExamAttempts > 0
        ? ((passedExamAttempts / completedExamAttempts) * 100).toFixed(1)
        : "0.0";

    // Calculate average duration from completed exams
    const completedAttemptsWithDuration = await prisma.examAttempt.findMany({
      where: {
        status: "COMPLETED",
        endTime: { not: null },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    const avgDuration =
      completedAttemptsWithDuration.length > 0
        ? Math.round(
            completedAttemptsWithDuration.reduce((sum, attempt) => {
              const duration =
                attempt.endTime && attempt.startTime
                  ? (attempt.endTime.getTime() - attempt.startTime.getTime()) /
                    (1000 * 60) // Convert to minutes
                  : 0;
              return sum + duration;
            }, 0) / completedAttemptsWithDuration.length
          )
        : 0;

    // Calculate growth rates
    const usersGrowth =
      lastMonthUsers > 0
        ? (((totalUsers - lastMonthUsers) / lastMonthUsers) * 100).toFixed(1)
        : "0.0";

    const examsGrowth = lastMonthExams > 0 ? lastMonthExams : 0;

    const currentRevenue = revenueData._sum.amount || 0;
    const lastMonthRevenueAmount = lastMonthRevenue._sum.amount || 0;
    const revenueGrowth =
      lastMonthRevenueAmount > 0
        ? (
            ((currentRevenue - lastMonthRevenueAmount) /
              lastMonthRevenueAmount) *
            100
          ).toFixed(1)
        : "0.0";

    return {
      totalUsers,
      totalQuestions,
      totalExams,
      activeExamAttempts,
      totalTransactions,
      totalRevenue: currentRevenue,
      recentUsers,
      completedExamAttempts,
      successRate,
      avgDuration,
      usersGrowth,
      questionsThisWeek: lastWeekQuestions,
      examsThisMonth: examsGrowth,
      revenueGrowth,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalUsers: 0,
      totalQuestions: 0,
      totalExams: 0,
      activeExamAttempts: 0,
      totalTransactions: 0,
      totalRevenue: 0,
      recentUsers: [],
      completedExamAttempts: 0,
      successRate: "0.0",
      avgDuration: 0,
      usersGrowth: "0.0",
      questionsThisWeek: 0,
      examsThisMonth: 0,
      revenueGrowth: "0.0",
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const quickStats = [
    {
      title: "Total Students",
      value: stats.totalUsers.toLocaleString(),
      change: `${parseFloat(stats.usersGrowth) >= 0 ? "+" : ""}${
        stats.usersGrowth
      }% from last month`,
      changeType:
        parseFloat(stats.usersGrowth) >= 0
          ? ("positive" as const)
          : ("negative" as const),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Question Bank",
      value: stats.totalQuestions.toLocaleString(),
      change: `+${stats.questionsThisWeek} this week`,
      changeType: "positive" as const,
      icon: FileQuestion,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Mock Exams",
      value: stats.totalExams.toString(),
      change: `+${stats.examsThisMonth} new exams`,
      changeType: "positive" as const,
      icon: GraduationCap,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      change: `${parseFloat(stats.revenueGrowth) >= 0 ? "+" : ""}${
        stats.revenueGrowth
      }% from last month`,
      changeType:
        parseFloat(stats.revenueGrowth) >= 0
          ? ("positive" as const)
          : ("negative" as const),
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      change: `Based on ${stats.completedExamAttempts} completed exams`,
      changeType: "neutral" as const,
      icon: Target,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Avg Duration",
      value: `${stats.avgDuration}m`,
      change: "Average exam completion time",
      changeType: "neutral" as const,
      icon: Activity,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here&apos;s what&apos;s happening with AlphaExam today.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => (
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-purple-600" />
              <span>Recent Students</span>
            </CardTitle>
            <CardDescription>Latest user registrations</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {stats.recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.firstName?.charAt(0) ||
                        user.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-900">
                      {user._count.examAttempts} exams
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/admin/questions"
                className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors duration-200 group"
              >
                <FileQuestion className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-200" />
                <div className="font-medium text-gray-900">Add Questions</div>
                <div className="text-sm text-gray-500">
                  Upload new questions
                </div>
              </a>

              <a
                href="/admin/exams"
                className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors duration-200 group"
              >
                <GraduationCap className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-200" />
                <div className="font-medium text-gray-900">Create Exam</div>
                <div className="text-sm text-gray-500">Setup mock test</div>
              </a>

              <Link
                href="/admin/users"
                className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors duration-200 group"
              >
                <Users className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform duration-200" />
                <div className="font-medium text-gray-900">Manage Users</div>
                <div className="text-sm text-gray-500">View all students</div>
              </Link>

              <a
                href="/admin/analytics"
                className="p-4 border border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-200 transition-colors duration-200 group"
              >
                <TrendingUp className="w-8 h-8 text-pink-600 mb-2 group-hover:scale-110 transition-transform duration-200" />
                <div className="font-medium text-gray-900">Analytics</div>
                <div className="text-sm text-gray-500">View insights</div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
