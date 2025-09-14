"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  Home,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

interface ExamResult {
  attemptId: string;
  totalMarks: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  status: string;
  exam: {
    title: string;
    subject: string;
    description?: string;
  };
  createdAt: string;
}

interface UserAnswer {
  questionId: string;
  selectedAnswer: string;
}

export default function ExamCompletionPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const [result, setResult] = useState<ExamResult | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const attemptId = params.attemptId as string;

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      router.push("/sign-in");
      return;
    }

    const fetchExamResult = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/exam-attempts/${attemptId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch exam result");
        }

        const data = await response.json();
        setResult(data.result);

        // Convert user answers array to object
        const answersObj: Record<string, string> = {};
        if (data.userAnswers) {
          data.userAnswers.forEach((answer: UserAnswer) => {
            answersObj[answer.questionId] = answer.selectedAnswer;
          });
        }
        setUserAnswers(answersObj);
      } catch (err) {
         console.error("Error fetching exam result:", err);
         setError("Failed to load exam results");
       } finally {
         setLoading(false);
       }
     };

     fetchExamResult();
   }, [isLoaded, userId, attemptId, router]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getGrade = (percentage: number): string => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C+";
    if (percentage >= 40) return "C";
    return "F";
  };

  const getGradeColor = (percentage: number): string => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const handleReturnToDashboard = () => {
    router.push("/dashboard");
  };

  const handleViewAnalysis = () => {
    router.push(`/exam-analysis/${attemptId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Card className="w-96">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Loading Results
                </h3>
                <p className="text-gray-600">Preparing your exam results...</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Card className="w-96">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Unable to Load Results
                </h3>
                <p className="text-gray-600 mb-4">
                  {error || "Exam results not found"}
                </p>
                <Button onClick={handleReturnToDashboard} variant="outline">
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const wrongAnswers =
    result.totalQuestions -
    result.correctAnswers -
    Object.keys(userAnswers).filter((q) => !userAnswers[q]).length;
  const unanswered = Object.keys(userAnswers).filter(
    (q) => !userAnswers[q]
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-green-100 p-6 rounded-full shadow-lg">
                <CheckCircle className="h-20 w-20 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Exam Completed Successfully!
            </h1>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-700">
                {result.exam.title}
              </h2>
              <p className="text-lg text-gray-600">
                {result.exam.subject} • Completed on{" "}
                {new Date(result.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Results Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Overall Score
                </CardTitle>
                <Trophy className="h-5 w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-3xl font-bold ${getGradeColor(
                    result.percentage
                  )}`}
                >
                  {result.percentage.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Grade:{" "}
                  <span className="font-semibold">
                    {getGrade(result.percentage)}
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Correct Answers
                </CardTitle>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {result.correctAnswers}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  out of {result.totalQuestions} questions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Wrong Answers
                </CardTitle>
                <XCircle className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {wrongAnswers}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  negative marks applied
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Time Spent
                </CardTitle>
                <Clock className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {formatTime(result.timeSpent)}
                </div>
                <p className="text-sm text-gray-500 mt-1">total duration</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Performance Analysis */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-600">
                    {result.totalMarks}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Total Marks
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-600">
                    {result.correctAnswers}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Correct
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-red-600">
                    {wrongAnswers}
                  </div>
                  <div className="text-sm font-medium text-gray-600">Wrong</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-orange-600">
                    {unanswered}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Unanswered
                  </div>
                </div>
              </div>

              {/* Performance Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Performance Breakdown</span>
                  <span>{result.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      result.percentage >= 80
                        ? "bg-green-500"
                        : result.percentage >= 60
                        ? "bg-blue-500"
                        : result.percentage >= 40
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(result.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleViewAnalysis}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-3 text-lg"
              size="lg"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              View Detailed Analysis
            </Button>

            <Button
              onClick={handleReturnToDashboard}
              variant="outline"
              className="px-8 py-3 text-lg"
              size="lg"
            >
              <Home className="mr-2 h-5 w-5" />
              Go to Dashboard
            </Button>
          </div>

          {/* Thank You Message */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  Thank You for Taking the Exam!
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Your performance has been recorded and saved to your profile.
                  You can view all your exam attempts, download detailed
                  reports, and track your progress anytime from your dashboard.
                </p>
                <div className="pt-2">
                  <p className="text-sm text-purple-700 font-medium">
                    Keep practicing to improve your scores! 🎯
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
