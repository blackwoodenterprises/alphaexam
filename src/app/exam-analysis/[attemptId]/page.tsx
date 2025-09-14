"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  Home,
  ArrowLeft,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MathJax } from "@/components/ui/mathjax";
import Image from "next/image";

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

interface Question {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation?: string;
  marks: number;
  negativeMarks: number;
  imageUrl?: string;
  figures?: string[] | { bbox: number[]; confidence: number; url: string; }[]; // Array of figure URLs or objects
}

interface UserAnswer {
  questionId: string;
  selectedAnswer: string;
}

export default function ExamAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const [result, setResult] = useState<ExamResult | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
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
        setQuestions(data.questions || []);

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

  const getStatusColor = (isCorrect: boolean, isAnswered: boolean): string => {
    if (!isAnswered) return "text-orange-600";
    return isCorrect ? "text-green-600" : "text-red-600";
  };

  const getStatusIcon = (isCorrect: boolean, isAnswered: boolean) => {
    if (!isAnswered) return <Clock className="w-4 h-4" />;
    return isCorrect ? (
      <CheckCircle className="w-4 h-4" />
    ) : (
      <XCircle className="w-4 h-4" />
    );
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
                  Loading Analysis
                </h3>
                <p className="text-gray-600">
                  Preparing your detailed exam analysis...
                </p>
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
                  Unable to Load Analysis
                </h3>
                <p className="text-gray-600 mb-4">
                  {error || "Exam analysis not found"}
                </p>
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="outline"
                >
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

      <main className="py-8">
        <div className="container-restricted px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-purple-600 hover:text-purple-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Detailed Analysis
            </h1>
            <p className="text-lg text-gray-600">{result.exam.title}</p>
          </div>

          {/* Performance Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">
                      Correct Answers
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {result.correctAnswers}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-sm font-medium">
                      Wrong Answers
                    </p>
                    <p className="text-2xl font-bold text-red-700">
                      {wrongAnswers}
                    </p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">
                      Unanswered
                    </p>
                    <p className="text-2xl font-bold text-orange-700">
                      {unanswered}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Grade</p>
                    <p
                      className={`text-2xl font-bold ${getGradeColor(
                        result.percentage
                      )}`}
                    >
                      {getGrade(result.percentage)}
                    </p>
                  </div>
                  <Trophy className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question-wise Analysis */}
          <div className="mb-8">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  Question-wise Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questions.map((question, index) => {
                    const userAnswer = userAnswers[question.id] || "";
                    const isAnswered = !!userAnswer;
                    const isCorrect = userAnswer === question.correctAnswer;

                    let marksObtained = 0;
                    if (isAnswered) {
                      marksObtained = isCorrect
                        ? question.marks
                        : -question.negativeMarks;
                    }

                    return (
                      <div
                        key={question.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              Q{index + 1}
                            </Badge>
                            <div
                              className={`flex items-center gap-1 ${getStatusColor(
                                isCorrect,
                                isAnswered
                              )}`}
                            >
                              {getStatusIcon(isCorrect, isAnswered)}
                              <span className="text-sm font-medium">
                                {!isAnswered
                                  ? "Unanswered"
                                  : isCorrect
                                  ? "Correct"
                                  : "Wrong"}
                              </span>
                            </div>
                          </div>
                          <Badge
                            variant={
                              marksObtained > 0
                                ? "default"
                                : marksObtained < 0
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {marksObtained > 0 ? "+" : ""}
                            {marksObtained} marks
                          </Badge>
                        </div>

                        {question.imageUrl && (
                          <div className="mb-4">
                            <Image
                              src={question.imageUrl}
                              alt={`Question ${index + 1} figure`}
                              width={600}
                              height={400}
                              className="rounded-lg border border-gray-200"
                            />
                          </div>
                        )}
                        {question.figures && question.figures.length > 0 && (
                          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {question.figures.map((figure, figIndex) => {
                              // Handle both string URLs and object format
                              const figureUrl = typeof figure === 'string' ? figure : figure.url;
                              
                              return (
                                <Image
                                  key={figIndex}
                                  src={figureUrl}
                                  alt={`Question ${index + 1} figure ${
                                    figIndex + 1
                                  }`}
                                  width={300}
                                  height={200}
                                  className="rounded-lg border border-gray-200"
                                />
                              );
                            })}
                          </div>
                        )}
                        <div className="text-sm text-gray-700 mb-3">
                          <MathJax>{question.questionText}</MathJax>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
                          {["A", "B", "C", "D"].map((option) => {
                            const optionText = question[
                              `option${option}` as keyof Question
                            ] as string;
                            const isUserAnswer = userAnswer === option;
                            const isCorrectAnswer =
                              question.correctAnswer === option;

                            return (
                              <div
                                key={option}
                                className={`p-3 rounded-lg border transition-colors ${
                                  isCorrectAnswer
                                    ? "bg-green-50 border-green-200 text-green-700"
                                    : isUserAnswer
                                    ? "bg-red-50 border-red-200 text-red-700"
                                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <span className="font-semibold text-sm flex-shrink-0 min-w-[1.5rem]">{option}.</span>
                                  <div className="flex-1 text-sm">
                                    <MathJax>{optionText}</MathJax>
                                  </div>
                                  <div className="flex-shrink-0">
                                    {isCorrectAnswer && (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    )}
                                    {isUserAnswer && !isCorrectAnswer && (
                                      <XCircle className="w-4 h-4 text-red-600" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {question.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                            <div className="text-xs text-blue-700">
                              <strong>Explanation:</strong>{" "}
                              <MathJax>{question.explanation}</MathJax>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
            <Button
              onClick={() => router.push("/exams")}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Take Another Exam
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
