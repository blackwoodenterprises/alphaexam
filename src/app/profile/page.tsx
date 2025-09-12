import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
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
  User,
  Mail,
  Phone,
  Calendar,
  Target,
  BookOpen,
  Trophy,
  Settings,
  Edit,
  CreditCard,
  TrendingUp,
} from "lucide-react";

async function getUserProfile() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        examAttempts: {
          include: {
            exam: {
              select: {
                title: true,
                category: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        transactions: {
          where: {
            status: "COMPLETED",
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!user) {
      redirect("/onboarding");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    redirect("/onboarding");
  }
}

export default async function ProfilePage() {
  const user = await getUserProfile();
  const clerkUser = await currentUser();

  // Calculate statistics
  const totalExams = user.examAttempts.length;
  const completedExams = user.examAttempts.filter(
    (attempt) => attempt.status === "COMPLETED"
  ).length;
  const averageScore =
    user.examAttempts.length > 0
      ? Math.round(
          user.examAttempts.reduce(
            (sum, attempt) => sum + (attempt.score || 0),
            0
          ) / user.examAttempts.length
        )
      : 0;

  const getPreferredExamDisplay = (exams: string[]) => {
    const examNames = {
      olympiad: "Mathematical Olympiad",
      jee: "JEE Main/Advanced",
      neet: "NEET",
      competitive: "Other Competitive",
    };
    return exams
      .map((exam) => examNames[exam as keyof typeof examNames] || exam)
      .join(", ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <main className="py-12">
        <div className="container-restricted px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Profile Settings
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your account settings and view your progress
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card>
                <CardHeader className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {user.firstName?.charAt(0) ||
                      clerkUser?.firstName?.charAt(0) ||
                      "U"}
                  </div>
                  <CardTitle className="text-xl">
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                    {user.phoneNumber && (
                      <div className="flex items-center space-x-3 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{user.phoneNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-3 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span>{user.credits} Credits</span>
                    </div>
                  </div>
                  <Button className="w-full mt-6" variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span>Quick Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Exams Taken</span>
                      <span className="font-semibold">{totalExams}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completed</span>
                      <span className="font-semibold">{completedExams}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Average Score
                      </span>
                      <span className="font-semibold">{averageScore}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Current Streak
                      </span>
                      <span className="font-semibold">7 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-purple-600" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={user.firstName || ""}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={user.lastName || ""}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={user.phoneNumber || ""}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Academic Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span>Academic Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Exams
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {user.preferredExams.map((exam, index) => (
                          <span
                            key={index}
                            className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                          >
                            {getPreferredExamDisplay([exam])}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Academic Level
                      </label>
                      <input
                        type="text"
                        value={user.academicLevel || ""}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Goals
                      </label>
                      <textarea
                        value={user.goals || ""}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <span>Recent Exam Attempts</span>
                  </CardTitle>
                  <CardDescription>
                    Your latest test performances and progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {user.examAttempts.length === 0 ? (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
                  ) : (
                    <div className="space-y-4">
                      {user.examAttempts.slice(0, 5).map((attempt) => (
                        <div
                          key={attempt.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {attempt.exam.category.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {attempt.exam.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(
                                  attempt.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {attempt.status}
                            </div>
                            {attempt.score !== null && (
                              <div className="text-sm text-gray-500">
                                Score: {attempt.score}%
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {user.examAttempts.length > 5 && (
                        <Button variant="outline" className="w-full">
                          View All Attempts ({user.examAttempts.length})
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-purple-600" />
                    <span>Account Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Email Notifications
                        </h4>
                        <p className="text-sm text-gray-600">
                          Receive updates about new exams and results
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          SMS Notifications
                        </h4>
                        <p className="text-sm text-gray-600">
                          Get reminders and important updates via SMS
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Weekly Progress Report
                        </h4>
                        <p className="text-sm text-gray-600">
                          Receive weekly summary of your performance
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-6">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Save Changes
                    </Button>
                    <Button variant="outline">Reset to Default</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
