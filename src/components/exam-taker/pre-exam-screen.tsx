"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle,
  Users,
  Trophy,
  ArrowRight,
  X,
} from "lucide-react";

interface PreExamScreenProps {
  examTitle: string;
  duration: number; // in minutes
  questionsToServe: number;
  examPrice: number;
  isFree: boolean;
  onStartExam: () => void;
  onCancel: () => void;
}

const PreExamScreen: React.FC<PreExamScreenProps> = ({
  examTitle,
  duration,
  questionsToServe,
  examPrice,
  isFree,
  onStartExam,
  onCancel,
}) => {
  const examRules = [
    "Read each question carefully before selecting your answer.",
    "You can navigate between questions using the Previous/Next buttons.",
    "You can review and change your answers before final submission.",
    "The exam will auto-submit when the time limit is reached.",
    "Ensure you have a stable internet connection throughout the exam.",
    "Do not refresh the browser or navigate away during the exam.",
    "Once submitted, you cannot retake the exam.",
  ];

  const examGuidelines = [
    "Each question carries equal marks unless specified otherwise.",
    "Negative marking may apply for incorrect answers.",
    "Unanswered questions will not be penalized.",
    "Results will be displayed immediately after submission.",
    "You can download a detailed PDF report after completion.",
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 z-50 overflow-y-auto">
      <div className="min-h-screen flex flex-col justify-center p-4 py-8">
        <div className="max-w-4xl w-full mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-blue-100 p-4 rounded-full">
                <FileText className="h-16 w-16 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {examTitle}
            </h1>
            <p className="text-lg text-gray-600">
              Please read the instructions carefully before starting the exam
            </p>
          </div>

          {/* Exam Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Duration</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{duration} min</div>
                <p className="text-xs text-muted-foreground">
                  total time limit
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Questions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{questionsToServe}</div>
                <p className="text-xs text-muted-foreground">
                  total questions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isFree ? "Free" : `${examPrice} Credits`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isFree ? "no cost" : "will be deducted"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Instructions and Rules */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Exam Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <span>Exam Rules</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {examRules.map((rule, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-xs font-semibold text-orange-600">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Guidelines</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {examGuidelines.map((guideline, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{guideline}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Important Notice */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-2">
                    Important Notice
                  </h3>
                  <p className="text-sm text-yellow-700">
                    Once you start the exam, the timer will begin immediately. Make sure you are in a
                    quiet environment with a stable internet connection. You cannot pause the exam
                    once started, and the system will automatically submit your answers when time
                    expires.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onCancel}
              variant="outline"
              className="px-8 py-3"
              size="lg"
            >
              <X className="mr-2 h-5 w-5" />
              Cancel
            </Button>
            
            <Button
              onClick={onStartExam}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3"
              size="lg"
            >
              Start Exam
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>
              By clicking &quot;Start Exam&quot;, you agree to follow all the rules and guidelines mentioned above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreExamScreen;