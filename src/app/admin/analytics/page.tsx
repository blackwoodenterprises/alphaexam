import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminHeader } from "@/components/admin/admin-header";
import { prisma } from "@/lib/prisma";
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Trophy,
  Clock,
  Target,
  DollarSign,
  Activity,
  Calendar,
} from "lucide-react";

async function getAnalyticsData() {
  try {
    const [
      totalUsers,
      totalExams,
      totalQuestions,
      totalAttempts,
      avgScore,
      recentActivity,
      categoryStats,
      monthlyStats,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),

      // Total exams
      prisma.exam.count(),

      // Total questions
      prisma.question.count(),

      // Total exam attempts
      prisma.examAttempt.count(),

      // Average score
      prisma.examAttempt.aggregate({
        _avg: { percentage: true },
        where: { status: "COMPLETED" },
      }),

      // Recent activity (last 7 days)
      prisma.examAttempt.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Category performance
      prisma.exam.groupBy({
        by: ["category"],
        _count: {
          id: true,
        },
      }),

      // Monthly stats for the last 6 months
      prisma.examAttempt.groupBy({
        by: ["createdAt"],
        _count: true,
        where: {
          createdAt: {
            gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return {
      totalUsers,
      totalExams,
      totalQuestions,
      totalAttempts,
      avgScore: avgScore._avg?.percentage || 0,
      recentActivity,
      categoryStats,
      monthlyStats,
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return {
      totalUsers: 0,
      totalExams: 0,
      totalQuestions: 0,
      totalAttempts: 0,
      avgScore: 0,
      recentActivity: 0,
      categoryStats: [],
      monthlyStats: [],
    };
  }
}

export default async function AnalyticsPage() {
  const analytics = await getAnalyticsData();

  const mainStats = [
    {
      title: "Total Users",
      value: analytics.totalUsers,
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Exams",
      value: analytics.totalExams,
      change: "+5%",
      trend: "up",
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Exam Attempts",
      value: analytics.totalAttempts,
      change: "+23%",
      trend: "up",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Average Score",
      value: `${Math.round(analytics.avgScore)}%`,
      change: "+3%",
      trend: "up",
      icon: Trophy,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const performanceStats = [
    {
      title: "Questions Bank",
      value: analytics.totalQuestions,
      subtitle: "Total questions available",
      icon: BookOpen,
    },
    {
      title: "Recent Activity",
      value: analytics.recentActivity,
      subtitle: "Attempts in last 7 days",
      icon: Activity,
    },
    {
      title: "Completion Rate",
      value: "87%",
      subtitle: "Users completing exams",
      icon: TrendingUp,
    },
    {
      title: "Avg Duration",
      value: "45m",
      subtitle: "Average exam time",
      icon: Clock,
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "OLYMPIAD":
        return "🏆";
      case "JEE":
        return "⚙️";
      case "NEET":
        return "🩺";
      default:
        return "📚";
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        user={{
          firstName: "Admin",
          lastName: "User",
          email: "admin@alphaexam.com"
        }}
      />

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div
                  className={`flex items-center text-sm ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span>Performance Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {performanceStats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <stat.icon className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {stat.title}
                      </p>
                      <p className="text-sm text-gray-600">{stat.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span>Category Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {["OLYMPIAD", "JEE", "NEET", "OTHER"].map((category, index) => {
                const attempts = Math.floor(Math.random() * 500) + 100;
                const avgScore = Math.floor(Math.random() * 30) + 60;

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {getCategoryIcon(category)}
                        </span>
                        <span className="font-medium text-gray-900">
                          {category}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {avgScore}%
                        </p>
                        <p className="text-xs text-gray-600">
                          {attempts} attempts
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${avgScore}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {[
                {
                  action: "New user registration",
                  user: "John Doe",
                  time: "2 minutes ago",
                  type: "user",
                },
                {
                  action: "Exam completed",
                  user: "Jane Smith",
                  time: "5 minutes ago",
                  type: "exam",
                },
                {
                  action: "Question uploaded",
                  user: "Admin",
                  time: "12 minutes ago",
                  type: "content",
                },
                {
                  action: "Payment received",
                  user: "Mike Johnson",
                  time: "25 minutes ago",
                  type: "payment",
                },
                {
                  action: "New exam created",
                  user: "Admin",
                  time: "1 hour ago",
                  type: "content",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 border-l-4 border-purple-200 bg-purple-50/50"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "user"
                        ? "bg-blue-500"
                        : activity.type === "exam"
                        ? "bg-green-500"
                        : activity.type === "content"
                        ? "bg-purple-500"
                        : "bg-orange-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-600">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue & Credits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <span>Revenue & Credits</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">₹45,280</p>
                  <p className="text-sm text-green-700">This Month</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">12,450</p>
                  <p className="text-sm text-blue-700">Credits Sold</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Credit Packages</span>
                  <span className="text-sm font-semibold">₹32,100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Premium Features
                  </span>
                  <span className="text-sm font-semibold">₹8,950</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subscriptions</span>
                  <span className="text-sm font-semibold">₹4,230</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center font-semibold">
                  <span>Total Revenue</span>
                  <span className="text-green-600">₹45,280</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
