import { prisma } from "@/lib/prisma";
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
    const [
      totalUsers,
      totalQuestions,
      totalExams,
      activeExamAttempts,
      totalTransactions,
      recentUsers,
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
    ]);

    // Calculate total revenue (example calculation)
    const revenueData = await prisma.transaction.aggregate({
      where: {
        status: "COMPLETED",
        type: "CREDIT_PURCHASE",
      },
      _sum: {
        amount: true,
      },
    });

    return {
      totalUsers,
      totalQuestions,
      totalExams,
      activeExamAttempts,
      totalTransactions,
      totalRevenue: revenueData._sum.amount || 0,
      recentUsers,
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
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const quickStats = [
    {
      title: "Total Students",
      value: stats.totalUsers.toLocaleString(),
      change: "+12% from last month",
      changeType: "positive" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Question Bank",
      value: stats.totalQuestions.toLocaleString(),
      change: "+847 this week",
      changeType: "positive" as const,
      icon: FileQuestion,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Mock Exams",
      value: stats.totalExams.toString(),
      change: "+5 new exams",
      changeType: "positive" as const,
      icon: GraduationCap,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Active Tests",
      value: stats.activeExamAttempts.toString(),
      change: "Students taking exams now",
      changeType: "neutral" as const,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      change: "+8.2% from last month",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Success Rate",
      value: "94.2%",
      change: "+2.1% improvement",
      changeType: "positive" as const,
      icon: Target,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
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

              <a
                href="/admin/users"
                className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors duration-200 group"
              >
                <Users className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform duration-200" />
                <div className="font-medium text-gray-900">Manage Users</div>
                <div className="text-sm text-gray-500">View all students</div>
              </a>

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

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Current system health and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-gray-500">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1.2s</div>
              <div className="text-sm text-gray-500">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">45ms</div>
              <div className="text-sm text-gray-500">DB Query Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">12GB</div>
              <div className="text-sm text-gray-500">Storage Used</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
