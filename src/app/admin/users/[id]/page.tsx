import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  CreditCard,
  Trophy,
  BookOpen,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Target,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface StudentDetailPageProps {
  params: {
    id: string;
  };
}

async function getStudentData(userId: string) {
  try {
    const [student, examAttempts, transactions] = await Promise.all([
      // Get student details
      prisma.user.findUnique({
        where: { id: userId },
        include: {
          _count: {
            select: {
              examAttempts: true,
              transactions: true,
            },
          },
        },
      }),
      // Get exam attempts with exam details
      prisma.examAttempt.findMany({
        where: { userId },
        include: {
          exam: {
            select: {
              id: true,
              title: true,
              examCategory: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      // Get transactions
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    if (!student) {
      return null;
    }

    // Calculate stats
    const completedAttempts = examAttempts.filter(
      (attempt) => attempt.status === "COMPLETED"
    );
    const passedAttempts = completedAttempts.filter(
      (attempt) => attempt.percentage && attempt.percentage >= 60
    );
    const avgScore = completedAttempts.length > 0
      ? completedAttempts.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0) / completedAttempts.length
      : 0;

    const completedTransactions = transactions.filter(
      (transaction) => transaction.status === "COMPLETED"
    );
    const totalSpent = completedTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    return {
      student,
      examAttempts,
      transactions,
      stats: {
        totalAttempts: examAttempts.length,
        completedAttempts: completedAttempts.length,
        passedAttempts: passedAttempts.length,
        successRate: completedAttempts.length > 0 
          ? ((passedAttempts.length / completedAttempts.length) * 100).toFixed(1)
          : "0.0",
        avgScore: avgScore.toFixed(1),
        totalTransactions: transactions.length,
        totalSpent,
      },
    };
  } catch (error) {
    console.error("Error fetching student data:", error);
    return null;
  }
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const data = await getStudentData(params.id);

  if (!data) {
    notFound();
  }

  const { student, examAttempts, transactions, stats } = data;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "ABANDONED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4" />;
      case "IN_PROGRESS":
        return <Clock className="w-4 h-4" />;
      case "ABANDONED":
        return <XCircle className="w-4 h-4" />;
      case "PENDING":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const overviewStats = [
    {
      title: "Total Attempts",
      value: stats.totalAttempts,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      icon: Trophy,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Average Score",
      value: `${stats.avgScore}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Credit Balance",
      value: student.credits,
      icon: CreditCard,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/users">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {student.firstName
                ? `${student.firstName} ${student.lastName}`
                : student.email}
            </h1>
            <p className="text-gray-600">Student Details</p>
          </div>
        </div>
      </div>

      {/* Student Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Student Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                {student.firstName?.charAt(0) ||
                  student.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-semibold">
                  {student.firstName
                    ? `${student.firstName} ${student.lastName}`
                    : "Not provided"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{student.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Joined</p>
                <p className="font-semibold">{formatDate(student.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge
                variant="outline"
                className={`${
                  student.role === "ADMIN"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {student.role}
              </Badge>
              {student.onboardingComplete && (
                <Badge variant="secondary">Onboarded</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Exam Attempts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Exam Attempts</span>
            <Badge variant="secondary">{examAttempts.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {examAttempts.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No exam attempts found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {examAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-200 hover:bg-purple-50/50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(attempt.status)}
                      <Badge
                        variant="outline"
                        className={getStatusColor(attempt.status)}
                      >
                        {attempt.status}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {attempt.exam.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{attempt.exam.examCategory?.name}</span>
                        <span>Started: {formatDate(attempt.createdAt)}</span>
                        {attempt.status === "COMPLETED" && attempt.percentage && (
                          <span className="font-medium">
                            Score: {attempt.percentage}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {attempt.status === "COMPLETED" && (
                    <Link href={`/admin/users/${student.id}/exam-report/${attempt.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Report
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Transaction History</span>
            <Badge variant="secondary">{transactions.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <Badge
                        variant="outline"
                        className={getStatusColor(transaction.status)}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {transaction.type.replace("_", " ")}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{formatDate(transaction.createdAt)}</span>
                        {transaction.description && (
                          <span>{transaction.description}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ₹{transaction.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}