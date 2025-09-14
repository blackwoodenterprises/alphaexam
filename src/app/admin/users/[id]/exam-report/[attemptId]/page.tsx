import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import {
  ArrowLeft,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trophy,
  BookOpen,
  User,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MathJax } from "@/components/ui/mathjax";
import Image from "next/image";

interface ExamReportPageProps {
  params: {
    id: string;
    attemptId: string;
  };
}

interface ExamResponse {
  id: string;
  attemptId: string;
  questionId: string;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  marksObtained: number;
  timeSpent: number | null;
}

async function getExamReportData(userId: string, attemptId: string) {
  try {
    const [examAttempt, responses] = await Promise.all([
      // Get exam attempt with exam and user details
      prisma.examAttempt.findUnique({
        where: {
          id: attemptId,
          userId: userId,
        },
        include: {
          exam: {
            include: {
              examCategory: {
                select: {
                  name: true,
                },
              },
              examQuestions: {
                include: {
                  question: {
                    select: {
                      id: true,
                      questionText: true,
                      optionA: true,
                      optionB: true,
                      optionC: true,
                      optionD: true,
                      correctAnswer: true,
                      imageUrl: true,
                      figures: true,
                    },
                  },
                },
                orderBy: { order: "asc" },
              },
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      // Get exam answers for this attempt
      prisma.examAnswer.findMany({
        where: {
          attemptId: attemptId,
        },
      }),
    ]);

    if (!examAttempt) {
      return null;
    }

    // Calculate detailed stats - only for answered questions
    const answeredResponses = responses.filter((response) => response.selectedAnswer);
    const totalQuestions = examAttempt.exam.examQuestions.length;
    const answeredQuestions = answeredResponses.length;
    const correctAnswers = answeredResponses.filter((response) => response.isCorrect).length;
    const incorrectAnswers = answeredResponses.filter((response) => !response.isCorrect).length;
    const unansweredQuestions = totalQuestions - answeredQuestions;

    // Calculate time spent
    const timeSpent = examAttempt.endTime && examAttempt.startTime
      ? Math.floor((examAttempt.endTime.getTime() - examAttempt.startTime.getTime()) / 1000 / 60)
      : 0;

    return {
      examAttempt,
      responses,
      stats: {
        totalQuestions,
        answeredQuestions,
        correctAnswers,
        incorrectAnswers,
        unansweredQuestions,
        timeSpent,
        accuracy: answeredQuestions > 0 ? ((correctAnswers / answeredQuestions) * 100).toFixed(1) : "0.0",
      },
    };
  } catch (error) {
    console.error("Error fetching exam report data:", error);
    return null;
  }
}

export default async function ExamReportPage({ params }: ExamReportPageProps) {
  const data = await getExamReportData(params.id, params.attemptId);

  if (!data) {
    notFound();
  }

  const { examAttempt, responses, stats } = data;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAnswerStatus = (response: ExamResponse | undefined) => {
    if (!response) {
      return {
        status: "unanswered",
        icon: <AlertCircle className="w-4 h-4" />,
        color: "text-gray-500",
        bgColor: "bg-gray-100",
        label: "Not Answered",
      };
    }

    if (response.isCorrect) {
      return {
        status: "correct",
        icon: <CheckCircle className="w-4 h-4" />,
        color: "text-green-600",
        bgColor: "bg-green-100",
        label: "Correct",
      };
    }

    return {
      status: "incorrect",
      icon: <XCircle className="w-4 h-4" />,
      color: "text-red-600",
      bgColor: "bg-red-100",
      label: "Incorrect",
    };
  };

  const overviewStats = [
    {
      title: "Questions Answered",
      value: stats.answeredQuestions,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Correct Answers",
      value: stats.correctAnswers,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Time Spent",
      value: `${stats.timeSpent} min`,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Final Score",
      value: `${examAttempt.percentage || 0}%`,
      icon: Trophy,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/admin/users/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Student
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Exam Report
            </h1>
            <p className="text-gray-600">{examAttempt.exam.title}</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`${
            examAttempt.status === "COMPLETED"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {examAttempt.status}
        </Badge>
      </div>

      {/* Exam Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Exam Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Student</p>
                <p className="font-semibold">
                  {examAttempt.user.firstName
                    ? `${examAttempt.user.firstName} ${examAttempt.user.lastName}`
                    : examAttempt.user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-semibold">{examAttempt.exam.examCategory?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Started</p>
                <p className="font-semibold">
                  {examAttempt.startTime ? formatDate(examAttempt.startTime) : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="font-semibold">
                  {examAttempt.endTime ? formatDate(examAttempt.endTime) : "N/A"}
                </p>
              </div>
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

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Overall Score</span>
                <span className="text-sm font-medium text-gray-900">
                  {examAttempt.percentage || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${examAttempt.percentage || 0}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{stats.correctAnswers}</p>
                <p className="text-sm text-gray-600">Correct</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">{stats.incorrectAnswers}</p>
                <p className="text-sm text-gray-600">Incorrect</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question-wise Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Question-wise Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {examAttempt.exam.examQuestions
              .filter((examQuestion) => {
                const response = responses.find((r) => r.questionId === examQuestion.question.id);
                return response && response.selectedAnswer; // Only show questions that were answered
              })
              .map((examQuestion, index) => {
              const question = examQuestion.question;
              const response = responses.find((r) => r.questionId === question.id);
              const answerStatus = getAnswerStatus(response);
              const correctAnswer = question.correctAnswer;
              const selectedAnswer = response?.selectedAnswer || null;
              
              const options = [
                { label: 'A', text: question.optionA },
                { label: 'B', text: question.optionB },
                { label: 'C', text: question.optionC },
                { label: 'D', text: question.optionD },
              ];

              return (
                <div
                  key={question.id}
                  className="border border-gray-200 rounded-lg p-6 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Badge variant="outline" className="text-xs">
                          Q{index + 1}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`${answerStatus.bgColor} ${answerStatus.color}`}
                        >
                          {answerStatus.icon}
                          <span className="ml-1">{answerStatus.label}</span>
                        </Badge>
                      </div>

                      {question.figures && Array.isArray(question.figures) && question.figures.length > 0 && (
                         <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                           {(question.figures as (string | { bbox: number[]; confidence: number; url: string; })[]).map((figure: string | { bbox: number[]; confidence: number; url: string; }, figIndex: number) => {
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
                      <h3 className="font-medium text-gray-900 mb-4">
                        <MathJax>{question.questionText}</MathJax>
                      </h3>
                      
                      <div className="space-y-2">
                        {options.map((option) => {
                          const isCorrect = option.label === correctAnswer;
                          const isSelected = option.label === selectedAnswer;
                          
                          let optionClass = "p-3 rounded-lg border ";
                          if (isCorrect) {
                            optionClass += "border-green-200 bg-green-50";
                          } else if (isSelected && !isCorrect) {
                            optionClass += "border-red-200 bg-red-50";
                          } else {
                            optionClass += "border-gray-200 bg-gray-50";
                          }

                          return (
                            <div key={option.label} className={optionClass}>
                              <div className="flex items-center space-x-3">
                                {isCorrect && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                                {isSelected && !isCorrect && (
                                  <XCircle className="w-4 h-4 text-red-600" />
                                )}
                                <span className="font-medium text-sm">
                                  {option.label}.
                                </span>
                                <span className="text-sm text-gray-700">
                                  <MathJax>{option.text}</MathJax>
                                </span>
                                {isCorrect && (
                                  <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                                    Correct Answer
                                  </Badge>
                                )}
                                {isSelected && (
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800 text-xs">
                                    Your Answer
                                  </Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}