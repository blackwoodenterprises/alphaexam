"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, Trophy, Home, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ExamResult {
  attemptId: string;
  totalMarks: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  status: string;
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
}

interface ExamCompletionProps {
  result: ExamResult;
  examTitle: string;
  questions: Question[];
  userAnswers: Record<string, string>;
  onReturnToDashboard: () => void;
}

const ExamCompletion: React.FC<ExamCompletionProps> = ({
  result,
  userAnswers,
}) => {
  const router = useRouter();

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getGradeColor = (percentage: number): string => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-yellow-600";
    return "text-red-600";
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



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Exam Completed Successfully!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for taking the exam. Here are your results:
          </p>
        </div>

        {/* Results Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getGradeColor(result.percentage)}`}>
                {result.percentage.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Grade: {getGrade(result.percentage)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Correct Answers</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {result.correctAnswers}
              </div>
              <p className="text-xs text-muted-foreground">
                out of {result.totalQuestions}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wrong Answers</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {result.totalQuestions - result.correctAnswers - Object.keys(userAnswers).filter(q => !userAnswers[q]).length}
              </div>
              <p className="text-xs text-muted-foreground">
                negative marks applied
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatTime(result.timeSpent)}
              </div>
              <p className="text-xs text-muted-foreground">
                total time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{result.totalMarks}</div>
                <div className="text-sm text-gray-600">Total Marks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{result.correctAnswers}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {result.totalQuestions - result.correctAnswers - Object.keys(userAnswers).filter(q => !userAnswers[q]).length}
                </div>
                <div className="text-sm text-gray-600">Wrong</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {Object.keys(userAnswers).filter(q => !userAnswers[q]).length}
                </div>
                <div className="text-sm text-gray-600">Unanswered</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push(`/exam-analysis/${result.attemptId}`)}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            View Detailed Analysis
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="px-8 py-3"
            size="lg"
          >
            <Home className="mr-2 h-5 w-5" />
            Go to Dashboard
          </Button>
        </div>

        {/* Thank You Message */}
        <div className="text-center bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Thank You for Taking the Exam!
          </h3>
          <p className="text-gray-600">
            Your performance has been recorded. You can view all your exam attempts 
            and download reports anytime from your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExamCompletion;