import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalExams,
      totalQuestions,
      totalAttempts,
      avgScore,
      recentActivity,
      categoryStats,
      monthlyStats,
      completedAttempts,
      lastMonthUsers,
      lastMonthExams,
      lastMonthAttempts,
      lastMonthAvgScore,
      recentTransactions,
      paymentGatewayStats,
      recentUsers,
      recentExams,
      totalRevenue,
      monthlyRevenue,
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
            gte: last7Days,
          },
        },
      }),

      // Real category performance with exam categories
      prisma.examCategory.findMany({
        include: {
          exams: {
            include: {
              examAttempts: {
                where: { status: "COMPLETED" },
                select: { percentage: true },
              },
            },
          },
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

      // Completed attempts
      prisma.examAttempt.count({
        where: { status: "COMPLETED" },
      }),

      // Last month data for growth calculation
      prisma.user.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
      }),
      prisma.exam.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
      }),
      prisma.examAttempt.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
      }),
      prisma.examAttempt.aggregate({
        _avg: { percentage: true },
        where: {
          status: "COMPLETED",
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
      }),

      // Recent transactions for activity feed
      prisma.transaction.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true },
          },
        },
      }),

      // Payment gateway statistics
      prisma.transaction.groupBy({
        by: ["paymentGateway", "status"],
        _count: true,
        _sum: { amount: true },
        where: {
          createdAt: {
            gte: thisMonth,
          },
        },
      }),

      // Recent users for activity feed
      prisma.user.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        select: { firstName: true, lastName: true, email: true, createdAt: true },
      }),

      // Recent exams for activity feed
      prisma.exam.findMany({
        take: 2,
        orderBy: { createdAt: "desc" },
        include: {
          createdBy: {
            select: { firstName: true, lastName: true },
          },
        },
      }),

      // Total revenue
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { status: "COMPLETED" },
      }),

      // Monthly revenue
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          status: "COMPLETED",
          createdAt: {
            gte: thisMonth,
          },
        },
      }),
    ]);

    // Calculate completion rate
    const completionRate = totalAttempts > 0 
      ? Math.round((completedAttempts / totalAttempts) * 100)
      : 0;

    // Calculate average duration from completed exams
    const completedAttemptsWithDuration = await prisma.examAttempt.findMany({
      where: {
        status: "COMPLETED",
        endTime: { not: null }
      },
      select: {
        startTime: true,
        endTime: true
      }
    });

    const avgDuration = completedAttemptsWithDuration.length > 0
      ? Math.round(
          completedAttemptsWithDuration.reduce((sum, attempt) => {
            const duration = attempt.endTime && attempt.startTime 
              ? (attempt.endTime.getTime() - attempt.startTime.getTime()) / (1000 * 60) // Convert to minutes
              : 0;
            return sum + duration;
          }, 0) / completedAttemptsWithDuration.length
        )
      : 0;

    // Calculate growth rates
    const usersGrowth = lastMonthUsers > 0
      ? (((totalUsers - lastMonthUsers) / lastMonthUsers) * 100).toFixed(0)
      : "0";

    const examsGrowth = lastMonthExams > 0
      ? (((totalExams - lastMonthExams) / lastMonthExams) * 100).toFixed(0)
      : "0";

    const attemptsGrowth = lastMonthAttempts > 0
      ? (((totalAttempts - lastMonthAttempts) / lastMonthAttempts) * 100).toFixed(0)
      : "0";

    const currentAvgScore = avgScore._avg?.percentage || 0;
    const lastMonthScore = lastMonthAvgScore._avg?.percentage || 0;
    const scoreGrowth = lastMonthScore > 0
      ? (((currentAvgScore - lastMonthScore) / lastMonthScore) * 100).toFixed(0)
      : "0";

    // Process category stats with real data
    const processedCategoryStats = categoryStats.map(category => {
      const allAttempts = category.exams.flatMap(exam => exam.examAttempts);
      const avgScore = allAttempts.length > 0
        ? allAttempts.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0) / allAttempts.length
        : 0;
      
      return {
        name: category.name,
        attempts: allAttempts.length,
        avgScore: Math.round(avgScore),
      };
    });

    // Process payment gateway stats
    const processedPaymentStats = paymentGatewayStats.reduce((acc, stat) => {
      if (!acc[stat.paymentGateway]) {
        acc[stat.paymentGateway] = { total: 0, completed: 0, revenue: 0 };
      }
      acc[stat.paymentGateway].total += stat._count;
      if (stat.status === 'COMPLETED') {
        acc[stat.paymentGateway].completed += stat._count;
        acc[stat.paymentGateway].revenue += stat._sum.amount || 0;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number; revenue: number }>);

    return {
      totalUsers,
      totalExams,
      totalQuestions,
      totalAttempts,
      avgScore: currentAvgScore,
      recentActivity,
      categoryStats: processedCategoryStats,
      monthlyStats,
      completionRate,
      avgDuration,
      usersGrowth,
      examsGrowth,
      attemptsGrowth,
      scoreGrowth,
      recentTransactions,
      paymentGatewayStats: processedPaymentStats,
      recentUsers,
      recentExams,
      totalRevenue: totalRevenue._sum.amount || 0,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
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
      completionRate: 0,
      avgDuration: 0,
      usersGrowth: "0",
      examsGrowth: "0",
      attemptsGrowth: "0",
      scoreGrowth: "0",
      recentTransactions: [],
      paymentGatewayStats: {},
      recentUsers: [],
      recentExams: [],
      totalRevenue: 0,
      monthlyRevenue: 0,
    };
  }
}

export default async function AnalyticsPage() {
  const analytics = await getAnalyticsData();

  const mainStats = [
    {
      title: "Total Users",
      value: analytics.totalUsers,
      change: `${parseFloat(analytics.usersGrowth) >= 0 ? '+' : ''}${analytics.usersGrowth}%`,
      trend: parseFloat(analytics.usersGrowth) >= 0 ? "up" : "down",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Exams",
      value: analytics.totalExams,
      change: `${parseFloat(analytics.examsGrowth) >= 0 ? '+' : ''}${analytics.examsGrowth}%`,
      trend: parseFloat(analytics.examsGrowth) >= 0 ? "up" : "down",
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Exam Attempts",
      value: analytics.totalAttempts,
      change: `${parseFloat(analytics.attemptsGrowth) >= 0 ? '+' : ''}${analytics.attemptsGrowth}%`,
      trend: parseFloat(analytics.attemptsGrowth) >= 0 ? "up" : "down",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Average Score",
      value: `${Math.round(analytics.avgScore)}%`,
      change: `${parseFloat(analytics.scoreGrowth) >= 0 ? '+' : ''}${analytics.scoreGrowth}%`,
      trend: parseFloat(analytics.scoreGrowth) >= 0 ? "up" : "down",
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
      value: `${analytics.completionRate}%`,
      subtitle: "Users completing exams",
      icon: TrendingUp,
    },
    {
      title: "Avg Duration",
      value: `${analytics.avgDuration}m`,
      subtitle: "Average exam time",
      icon: Clock,
    },
  ];



  return (
    <div className="space-y-6">
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
              {analytics.categoryStats.length > 0 ? (
                analytics.categoryStats.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {category.name === "JEE" ? "⚙️" : 
                           category.name === "NEET" ? "🩺" : 
                           category.name === "OLYMPIAD" ? "🏆" : "📚"}
                        </span>
                        <span className="font-medium text-gray-900">
                          {category.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {category.avgScore}%
                        </p>
                        <p className="text-xs text-gray-600">
                          {category.attempts} attempts
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${category.avgScore}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No category data available yet</p>
                </div>
              )}
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
              {/* Recent Users */}
              {analytics.recentUsers.map((user, index) => (
                <div
                  key={`user-${index}`}
                  className="flex items-center space-x-3 p-3 border-l-4 border-blue-200 bg-blue-50/50"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      New user registration
                    </p>
                    <p className="text-xs text-gray-600">
                      {user.firstName} {user.lastName} • {new Date(user.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              {/* Recent Exams */}
              {analytics.recentExams.map((exam, index) => (
                <div
                  key={`exam-${index}`}
                  className="flex items-center space-x-3 p-3 border-l-4 border-purple-200 bg-purple-50/50"
                >
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      New exam created: {exam.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      {exam.createdBy.firstName} {exam.createdBy.lastName} • {new Date(exam.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              {/* Recent Transactions */}
              {analytics.recentTransactions.slice(0, 3).map((transaction, index) => (
                <div
                  key={`transaction-${index}`}
                  className="flex items-center space-x-3 p-3 border-l-4 border-green-200 bg-green-50/50"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Payment {transaction.status.toLowerCase()}: ₹{transaction.amount}
                    </p>
                    <p className="text-xs text-gray-600">
                      {transaction.user.firstName} {transaction.user.lastName} • {new Date(transaction.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              {analytics.recentUsers.length === 0 && analytics.recentExams.length === 0 && analytics.recentTransactions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Revenue & Payment Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <span>Revenue & Payment Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    ₹{analytics.monthlyRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-700">This Month</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    ₹{analytics.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-700">Total Revenue</p>
                </div>
              </div>

              {/* Payment Gateway Stats */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Payment Gateways</h4>
                {Object.entries(analytics.paymentGatewayStats).map(([gateway, stats]) => (
                  <div key={gateway} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">
                        {gateway.toLowerCase()}
                      </span>
                      <span className="text-sm font-semibold">
                        ₹{stats.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{stats.completed}/{stats.total} transactions</span>
                      <span>{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% success rate</span>
                    </div>
                  </div>
                ))}
                
                {Object.keys(analytics.paymentGatewayStats).length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No payment data for this month</p>
                  </div>
                )}

                <hr className="my-2" />
                <div className="flex justify-between items-center font-semibold">
                  <span>Monthly Total</span>
                  <span className="text-green-600">₹{analytics.monthlyRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
