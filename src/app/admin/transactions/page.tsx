import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { prisma } from "@/lib/prisma";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Receipt,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

async function getTransactionsData() {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      transactions,
      totalRevenue,
      totalTransactions,
      successfulTransactions,
      pendingTransactions,
      lastMonthRevenue,
      lastMonthTransactions,
      lastMonthSuccessful,
      lastMonthPending,
    ] = await Promise.all([
      prisma.transaction.findMany({
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50, // Limit for performance
      }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { status: "COMPLETED" },
      }),
      prisma.transaction.count(),
      prisma.transaction.count({
        where: { status: "COMPLETED" },
      }),
      prisma.transaction.count({
        where: { status: "PENDING" },
      }),
      // Last month data for growth calculation
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          status: "COMPLETED",
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
      }),
      prisma.transaction.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
      }),
      prisma.transaction.count({
        where: {
          status: "COMPLETED",
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
      }),
      prisma.transaction.count({
        where: {
          status: "PENDING",
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
      }),
    ]);

    // Calculate growth rates
    const revenueGrowth =
      lastMonthRevenue._sum.amount && lastMonthRevenue._sum.amount > 0
        ? (
            (((totalRevenue._sum.amount || 0) - lastMonthRevenue._sum.amount) /
              lastMonthRevenue._sum.amount) *
            100
          ).toFixed(1)
        : "0.0";

    const transactionsGrowth =
      lastMonthTransactions > 0
        ? (
            ((totalTransactions - lastMonthTransactions) /
              lastMonthTransactions) *
            100
          ).toFixed(1)
        : "0.0";

    const currentSuccessRate =
      totalTransactions > 0
        ? (successfulTransactions / totalTransactions) * 100
        : 0;
    const lastMonthSuccessRate =
      lastMonthTransactions > 0
        ? (lastMonthSuccessful / lastMonthTransactions) * 100
        : 0;
    const successRateGrowth =
      lastMonthSuccessRate > 0
        ? (
            ((currentSuccessRate - lastMonthSuccessRate) /
              lastMonthSuccessRate) *
            100
          ).toFixed(1)
        : "0.0";

    const pendingGrowth =
      lastMonthPending > 0
        ? (
            ((pendingTransactions - lastMonthPending) / lastMonthPending) *
            100
          ).toFixed(1)
        : "0.0";

    return {
      transactions,
      totalRevenue: totalRevenue._sum.amount || 0,
      totalTransactions,
      successfulTransactions,
      pendingTransactions,
      failedTransactions:
        totalTransactions - successfulTransactions - pendingTransactions,
      revenueGrowth,
      transactionsGrowth,
      successRateGrowth,
      pendingGrowth,
    };
  } catch (error) {
    console.error("Error fetching transactions data:", error);
    return {
      transactions: [],
      totalRevenue: 0,
      totalTransactions: 0,
      successfulTransactions: 0,
      pendingTransactions: 0,
      failedTransactions: 0,
      revenueGrowth: "0.0",
      transactionsGrowth: "0.0",
      successRateGrowth: "0.0",
      pendingGrowth: "0.0",
    };
  }
}

export default async function TransactionsPage() {
  const data = await getTransactionsData();

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${data.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: `${parseFloat(data.revenueGrowth) >= 0 ? "+" : ""}${
        data.revenueGrowth
      }%`,
    },
    {
      title: "Total Transactions",
      value: data.totalTransactions,
      icon: Receipt,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: `${parseFloat(data.transactionsGrowth) >= 0 ? "+" : ""}${
        data.transactionsGrowth
      }%`,
    },
    {
      title: "Success Rate",
      value: `${
        data.totalTransactions > 0
          ? Math.round(
              (data.successfulTransactions / data.totalTransactions) * 100
            )
          : 0
      }%`,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: `${parseFloat(data.successRateGrowth) >= 0 ? "+" : ""}${
        data.successRateGrowth
      }%`,
    },
    {
      title: "Pending",
      value: data.pendingTransactions,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      change: `${parseFloat(data.pendingGrowth) >= 0 ? "+" : ""}${
        data.pendingGrowth
      }%`,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4" />;
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "FAILED":
        return <XCircle className="w-4 h-4" />;
      case "CANCELLED":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "CREDIT_PURCHASE":
        return "bg-blue-100 text-blue-800";
      case "EXAM_PAYMENT":
        return "bg-purple-100 text-purple-800";
      case "SUBSCRIPTION":
        return "bg-indigo-100 text-indigo-800";
      case "ADMIN_ADJUSTMENT":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number) => {
    return amount >= 0 ? `+₹${amount}` : `-₹${Math.abs(amount)}`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div
                  className={`flex items-center text-sm ${
                    stat.change.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
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

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Date Range</span>
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-purple-600" />
            <span>All Transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {data.transactions.length === 0 ? (
              <div className="text-center py-16">
                <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No transactions found
                </h3>
                <p className="text-gray-600">
                  Transactions will appear here once users start making
                  payments.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Transaction
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        User
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {transaction.razorpayPaymentId || transaction.id}
                            </p>
                            {transaction.description && (
                              <p className="text-sm text-gray-600 truncate max-w-xs">
                                {transaction.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {transaction.user.firstName?.charAt(0) ||
                                transaction.user.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {transaction.user.firstName
                                  ? `${transaction.user.firstName} ${transaction.user.lastName}`
                                  : transaction.user.email}
                              </p>
                              <p className="text-sm text-gray-600">
                                {transaction.user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant="outline"
                            className={getTypeColor(transaction.type)}
                          >
                            {transaction.type.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`font-semibold ${
                              transaction.amount >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {formatAmount(transaction.amount)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(
                              transaction.status
                            )} flex items-center space-x-1`}
                          >
                            {getStatusIcon(transaction.status)}
                            <span>{transaction.status}</span>
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-600">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Receipt className="w-4 h-4" />
                            </Button>
                            {transaction.status === "PENDING" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Razorpay</span>
                <span className="font-semibold">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Admin Adjustment</span>
                <span className="font-semibold">12%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Other</span>
                <span className="font-semibold">3%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transaction Types</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Credit Purchase</span>
                <span className="font-semibold">65%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Exam Payment</span>
                <span className="font-semibold">25%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Subscriptions</span>
                <span className="font-semibold">10%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Today&apos;s Revenue
                </span>
                <span className="font-semibold text-green-600">₹2,450</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Week</span>
                <span className="font-semibold text-blue-600">₹15,680</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="font-semibold text-purple-600">₹45,280</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
