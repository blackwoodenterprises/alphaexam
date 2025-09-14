import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Calendar,
  CreditCard,
  Trophy,
  BookOpen,
  TrendingUp,
  Eye,
  Edit,
  Ban,
} from "lucide-react";
import { AddCreditsModal } from "@/components/admin/add-credits-modal";

async function getUsersData() {
  try {
    const [users, totalUsers, activeUsers, totalCreditsIssued] =
      await Promise.all([
        prisma.user.findMany({
          include: {
            examAttempts: {
              include: {
                exam: {
                  select: {
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
              take: 3,
            },
            transactions: {
              where: {
                status: "COMPLETED",
              },
              orderBy: { createdAt: "desc" },
              take: 3,
            },
            _count: {
              select: {
                examAttempts: true,
                transactions: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 50, // Limit for performance
        }),
        prisma.user.count(),
        prisma.user.count({
          where: {
            examAttempts: {
              some: {
                createdAt: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                },
              },
            },
          },
        }),
        prisma.user.aggregate({
          _sum: {
            credits: true,
          },
        }),
      ]);

    return {
      users,
      totalUsers,
      activeUsers,
      totalCreditsIssued: totalCreditsIssued._sum.credits || 0,
    };
  } catch (error) {
    console.error("Error fetching users data:", error);
    return {
      users: [],
      totalUsers: 0,
      activeUsers: 0,
      totalCreditsIssued: 0,
    };
  }
}

export default async function UsersPage() {
  const { users, totalUsers, activeUsers, totalCreditsIssued } =
    await getUsersData();

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Users (30d)",
      value: activeUsers,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Credits Issued",
      value: totalCreditsIssued,
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Avg Exams/User",
      value:
        totalUsers > 0
          ? Math.round(
              users.reduce((sum, user) => sum + user._count.examAttempts, 0) /
                totalUsers
            )
          : 0,
      icon: BookOpen,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "USER":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {users.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No users found
                </h3>
                <p className="text-gray-600">
                  Users will appear here once they sign up to the platform.
                </p>
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-200 hover:bg-purple-50/50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.firstName?.charAt(0) ||
                        user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {user.firstName
                            ? `${user.firstName} ${user.lastName}`
                            : user.email}
                        </h3>
                        <Badge
                          variant="outline"
                          className={getRoleColor(user.role)}
                        >
                          {user.role}
                        </Badge>
                        {user.onboardingComplete && (
                          <Badge variant="secondary">Onboarded</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {formatDate(user.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CreditCard className="w-4 h-4" />
                          <span>{user.credits} credits</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-4 h-4" />
                          <span>{user._count.examAttempts} exams</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AddCreditsModal
                      userId={user.id}
                      userName={user.firstName || user.email}
                    />
                    <Link href={`/admin/users/${user.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Ban className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
