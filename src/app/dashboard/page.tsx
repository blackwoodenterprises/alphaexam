import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createOrUpdateUser } from "@/lib/auth";
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
  Calendar,
} from "lucide-react";

async function getUserData() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  let user;
  try {
    user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        examAttempts: {
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            exam: {
              select: {
                title: true,
              },
            },
          },
        },
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 3,
          where: {
            status: "COMPLETED",
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Don't redirect here, let it fall through to user creation logic
    user = null;
  }

  if (!user) {
    // User exists in Clerk but not in our database, create user first
    const createdUser = await createOrUpdateUser();
    if (!createdUser) {
      console.error('Failed to create user');
    }
    // Always redirect to onboarding for new users
    redirect("/onboarding");
  }

  if (!user.onboardingComplete) {
    // User exists but hasn't completed onboarding
    redirect("/onboarding");
  }

  return user;
}

export default async function UserDashboard() {
  const user = await getUserData();
  const clerkUser = await currentUser();

  const stats = [
    {
      title: "Exams Taken",
      value: user.examAttempts.length.toString(),
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Exams */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span>Recent Exam Attempts</span>
                </CardTitle>
                <CardDescription>Your latest test performances</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {user.examAttempts.length > 0 ? (
                  <div className="space-y-4">
                    {user.examAttempts.map((attempt) => (
                      <div
                        key={attempt.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {attempt.exam.title.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {attempt.exam.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(attempt.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {attempt.status}
                          </div>
                          {attempt.percentage !== null && (
                            <div className="text-xs text-gray-500">
                              Score: {attempt.percentage}%
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No exams taken yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start your preparation journey with your first mock test
                    </p>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Browse Exams
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
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
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="/exams"
                    className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors duration-200 group text-center"
                  >
                    <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                    <div className="font-medium text-gray-900">Take Exam</div>
                    <div className="text-sm text-gray-500">
                      Start a mock test
                    </div>
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
                    href="/analytics"
                    className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors duration-200 group text-center"
                  >
                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                    <div className="font-medium text-gray-900">Analytics</div>
                    <div className="text-sm text-gray-500">View progress</div>
                  </a>

                  <a
                    href="/credits"
                    className="p-4 border border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-200 transition-colors duration-200 group text-center"
                  >
                    <CreditCard className="w-8 h-8 text-pink-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                    <div className="font-medium text-gray-900">Buy Credits</div>
                    <div className="text-sm text-gray-500">Add balance</div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Study Schedule */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span>Study Schedule</span>
              </CardTitle>
              <CardDescription>
                Recommended exams based on your preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white">
                  <h3 className="font-bold text-lg mb-2">Today&apos;s Goal</h3>
                  <p className="text-purple-100 mb-3">
                    Complete 1 practice test in Mathematics
                  </p>
                  <Button
                    variant="outline"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    Start Now
                  </Button>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">This Week</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Physics Mock Test</li>
                    <li>• Chemistry Practice</li>
                    <li>• Math Olympiad Prep</li>
                  </ul>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Upcoming</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• JEE Mock Test - Jan 25</li>
                    <li>• NEET Practice - Jan 28</li>
                    <li>• Olympiad Prep - Feb 1</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
