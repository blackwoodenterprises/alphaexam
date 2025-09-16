"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  BookOpen,
  Clock,
  TrendingUp,
  User,
  CreditCard,
  Target,
  Receipt,
  Plus,
  HelpCircle,
} from "lucide-react";

interface ExamAttempt {
  id: string;
  score: number;
  totalQuestions: number;
  totalMarks: number;
  percentage: number;
  status: string;
  createdAt: Date;
  exam: {
    title: string;
    subject: string;
  };
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  credits: number;
  status: string;
  createdAt: string;
  currency?: string;
  paymentGateway?: string;
  description?: string;
}

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  credits: number;
}

export default function UserDashboard() {
  const { isLoaded, userId } = useAuth();
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      router.push("/sign-in");
      return;
    }

    const fetchUserData = async () => {
      try {
        const [profileResponse, transactionsResponse] = await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/user/transactions"),
        ]);

        if (profileResponse.ok) {
          const data = await profileResponse.json();
          if (data.redirect) {
            router.push(data.redirect);
            return;
          }
          setUserData(data.user);
          setExamAttempts(data.examAttempts || []);
        }

        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          setTransactions(transactionsData.transactions || []);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, userId, router]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load user data</p>
        </div>
      </div>
    );
  }

  const user = userData;

  const stats = [
    {
      title: "Exams Taken",
      value: (examAttempts?.length || 0).toString(),
      change: "+2 this week",
      changeType: "positive" as const,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Average Score",
      value: "85%",
      change: "+5% improvement",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Credits Balance",
      value: user.credits.toString(),
      change: "Available for tests",
      changeType: "neutral" as const,
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Study Streak",
      value: "7 days",
      change: "Keep it up!",
      changeType: "positive" as const,
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <main className="py-8">
        <div className="container-restricted px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.firstName || clerkUser?.firstName}!
            </h1>
            <p className="text-gray-600 mt-1">
              Ready to continue your exam preparation journey?
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
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
                <CardContent className="pt-0">
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

          {/* Quick Actions - Separate Row */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-purple-600" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>
                What would you like to do today?
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a
                  href="/exams"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors duration-200 group text-center"
                >
                  <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                  <div className="font-medium text-gray-900">Take Exam</div>
                  <div className="text-sm text-gray-500">Start a mock test</div>
                </a>

                <a
                  href="/profile"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors duration-200 group text-center"
                >
                  <User className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                  <div className="font-medium text-gray-900">Profile</div>
                  <div className="text-sm text-gray-500">Update settings</div>
                </a>

                <a
                  href="/buy-credits"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-200 transition-colors duration-200 group text-center"
                >
                  <CreditCard className="w-8 h-8 text-pink-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                  <div className="font-medium text-gray-900">Buy Credits</div>
                  <div className="text-sm text-gray-500">Add balance</div>
                </a>

                <a
                  href="/help"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-200 transition-colors duration-200 group text-center"
                >
                  <HelpCircle className="w-8 h-8 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                  <div className="font-medium text-gray-900">Help Center</div>
                  <div className="text-sm text-gray-500">Get support</div>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Recent Exam Attempts - Enhanced Table */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span>Recent Exam Attempts</span>
              </CardTitle>
              <CardDescription>
                Your latest test performances and detailed analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {examAttempts.length > 0 ? (
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {/* Table Header */}
                    <div className="grid grid-cols-10 gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg border-b border-purple-100">
                      <div className="col-span-4 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                        Exam Details
                      </div>
                      <div className="col-span-2 font-semibold text-gray-700 text-sm uppercase tracking-wide text-center">
                        Status
                      </div>
                      <div className="col-span-2 font-semibold text-gray-700 text-sm uppercase tracking-wide text-center">
                        Score
                      </div>
                      <div className="col-span-2 font-semibold text-gray-700 text-sm uppercase tracking-wide text-center">
                        Actions
                      </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-100">
                      {examAttempts.map(
                        (attempt: ExamAttempt, index: number) => (
                          <div
                            key={attempt.id}
                            className={`grid grid-cols-10 gap-4 p-4 hover:bg-gradient-to-r hover:from-purple-25 hover:to-pink-25 transition-all duration-200 ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-25"
                            }`}
                          >
                            {/* Exam Details */}
                            <div className="col-span-4 flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {attempt.exam.title.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 text-base truncate">
                                  {attempt.exam.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(attempt.createdAt).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })} at {new Date(attempt.createdAt).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Status */}
                            <div className="col-span-2 flex items-center justify-center">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                                  attempt.status === "COMPLETED"
                                    ? "bg-green-100 text-green-800 border border-green-200"
                                    : attempt.status === "IN_PROGRESS"
                                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                                    : "bg-gray-100 text-gray-800 border border-gray-200"
                                }`}
                              >
                                {attempt.status.replace("_", " ")}
                              </span>
                            </div>

                            {/* Score */}
                            <div className="col-span-2 flex items-center justify-center">
                              {attempt.percentage !== null ? (
                                <div className="text-center">
                                  <div
                                    className={`text-2xl font-bold ${
                                      attempt.percentage >= 80
                                        ? "text-green-600"
                                        : attempt.percentage >= 60
                                        ? "text-blue-600"
                                        : attempt.percentage >= 40
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {attempt.percentage.toFixed(1)}%
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {attempt.score}/{attempt.totalQuestions}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">
                                  N/A
                                </span>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="col-span-2 flex items-center justify-center space-x-2">
                              {attempt.status === "COMPLETED" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                  onClick={() => {
                                    router.push(`/exam-analysis/${attempt.id}`);
                                  }}
                                >
                                  <TrendingUp className="w-3 h-3" />
                                  <span className="hidden sm:inline ml-1">
                                    Analysis
                                  </span>
                                </Button>
                              )}
                              {attempt.status === "IN_PROGRESS" && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                  onClick={() => {
                                    // Resume exam
                                    console.log("Resume exam:", attempt.id);
                                  }}
                                >
                                  Resume
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    No exams taken yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start your preparation journey with your first mock test
                  </p>
                  <Link href="/exams">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Browse Exams
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transactions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Receipt className="w-5 h-5 text-purple-600" />
                  <span>Recent Transactions</span>
                </div>
                <Button
                  onClick={() => router.push("/buy-credits")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Buy Credits
                </Button>
              </CardTitle>
              <CardDescription>
                Your recent credit transactions and purchases
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === "CREDIT_PURCHASE"
                              ? "bg-green-100 text-green-600"
                              : transaction.type === "ADMIN_CREDIT"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {transaction.type === "CREDIT_PURCHASE" ? (
                            <Plus className="w-5 h-5" />
                          ) : transaction.type === "ADMIN_CREDIT" ? (
                            <CreditCard className="w-5 h-5" />
                          ) : (
                            <Receipt className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {transaction.type === "CREDIT_PURCHASE"
                              ? "Credit Purchase"
                              : transaction.type === "ADMIN_CREDIT"
                              ? "Admin Credit"
                              : transaction.type === "REFUND"
                              ? "Refund"
                              : transaction.type}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.description || "No description"}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(transaction.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-semibold ${
                            transaction.amount >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.amount >= 0 ? "+" : ""}
                          {transaction.currency === 'USD' || transaction.paymentGateway === 'PAYPAL' ? '$' : '₹'}
                          {Math.abs(transaction.amount)}
                        </div>
                        <div className={`text-sm font-medium ${
                          transaction.type === 'EXAM_PAYMENT'
                            ? "text-red-600"
                            : transaction.type === 'CREDIT_PURCHASE' || transaction.type === 'ADMIN_CREDIT'
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}>
                          {transaction.type === 'EXAM_PAYMENT'
                            ? `-${Math.abs(transaction.credits)} credits`
                            : transaction.type === 'CREDIT_PURCHASE' || transaction.type === 'ADMIN_CREDIT'
                            ? `+${Math.abs(transaction.credits)} credits`
                            : `${transaction.credits >= 0 ? "+" : ""}${transaction.credits} credits`
                          }
                        </div>
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            transaction.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    No transactions yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Purchase credits to start taking exams and track your
                    transactions here
                  </p>
                  <Button
                    onClick={() => router.push("/buy-credits")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Buy Credits
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
