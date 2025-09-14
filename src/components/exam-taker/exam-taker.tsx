"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  AlertTriangle,
} from "lucide-react";
import { MathJax } from "@/components/ui/mathjax";
import { ConfirmationDialog } from "@/components/ui/dialog";

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

  figures?: string[] | { bbox: number[]; confidence: number; url: string; }[]; // Array of figure URLs or objects
}

interface ExamTakerProps {
  examId: string;
  examTitle: string;
  duration: number; // in minutes
  questionsToServe: number;
  onExamComplete: (answers: Record<string, string>, timeSpent: number) => void;
  onExamExit?: () => void;
}

type AnswerOption = 'A' | 'B' | 'C' | 'D';

export function ExamTaker({
  examId,
  examTitle,
  duration,
  onExamComplete,
}: ExamTakerProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Exit confirmation removed - only timer expiration or manual submission allowed
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Removed showResult state - now navigates to exam-completion page
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const options = [
    { key: 'A' as AnswerOption, value: currentQuestion?.optionA },
    { key: 'B' as AnswerOption, value: currentQuestion?.optionB },
    { key: 'C' as AnswerOption, value: currentQuestion?.optionC },
    { key: 'D' as AnswerOption, value: currentQuestion?.optionD },
  ];

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/exams/${examId}/questions`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        
        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError('Failed to load exam questions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (examId) {
      fetchQuestions();
    }
  }, [examId]);



  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: string, answer: AnswerOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleFlagQuestion = () => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestionIndex)) {
        newSet.delete(currentQuestionIndex);
      } else {
        newSet.add(currentQuestionIndex);
      }
      return newSet;
    });
  };

  const isQuestionAnswered = (questionId: string) => {
    return answers[questionId] !== undefined;
  };

  const submitExam = useCallback(async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const timeSpent = (duration * 60) - timeLeft;
    
    try {
      const response = await fetch(`/api/exams/${examId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          timeSpent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit exam');
      }

      const result = await response.json();
      onExamComplete(answers, timeSpent);
      
      // Navigate to exam completion page
      router.push(`/exam-completion/${result.attemptId}`);
    } catch (error) {
      console.error('Error submitting exam:', error);
      setError('Failed to submit exam. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [examId, answers, timeLeft, duration, onExamComplete, isSubmitting, router]);

  // Handle automatic submission when timer expires
  const handleAutoSubmit = useCallback(async () => {
    await submitExam();
  }, [submitExam]);

  // Handle manual submission with confirmation
  const handleManualSubmit = useCallback(() => {
    setShowSubmitConfirmation(true);
  }, []);

  // Handle confirmed submission
  const handleConfirmedSubmit = useCallback(async () => {
    setShowSubmitConfirmation(false);
    await submitExam();
  }, [submitExam]);

  // Handle cancel submission
  const handleCancelSubmit = useCallback(() => {
    setShowSubmitConfirmation(false);
  }, []);

  // Timer effect - handles automatic submission when time expires
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleAutoSubmit]);

  // Exit functionality removed - only timer expiration or manual submission allowed

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Exam</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} className="w-full">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Removed inline result display - now navigates to exam-completion page

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Questions Available</h3>
              <p className="text-gray-600 mb-4">This exam doesn&apos;t have any questions yet.</p>
              <Button onClick={() => router.push('/dashboard')} className="w-full">
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">

      {/* Header */}
      <div className="bg-white border-b z-40 flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">{examTitle}</h1>
              <div className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <Clock className="h-4 w-4 text-red-600" />
                <span className={`font-mono text-sm ${
                  timeLeft <= 300 ? 'text-red-600 font-bold' : 'text-red-700'
                }`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              
              {/* Exit button removed - only timer expiration or manual submission allowed */}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <Card className="mb-6">
                <CardContent className="pt-6">
                  {/* Two-column layout for better screen utilization */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Figures */}
                    {currentQuestion?.figures && currentQuestion.figures.length > 0 ? (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Reference Material</h3>
                        <div className="space-y-4">
                          {currentQuestion.figures.map((figure, index) => {
                            // Handle both string URLs and object format
                            const figureUrl = typeof figure === 'string' ? figure : figure.url;
                            
                            return (
                              <div key={index} className="bg-gray-50 rounded-lg p-3">
                                {figureUrl && figureUrl.trim() !== "" ? (
                                  <Image
                                    src={figureUrl}
                                    alt={`Figure ${index + 1}`}
                                    width={600}
                                    height={400}
                                    className="w-full h-auto rounded border shadow-sm"
                                  />
                                ) : (
                                  <div className="w-full h-32 bg-gray-100 rounded border flex items-center justify-center text-gray-500 text-sm">
                                    No image available
                                  </div>
                                )}
                                {currentQuestion.figures!.length > 1 && (
                                  <p className="text-xs text-gray-600 mt-2 text-center font-medium">Figure {index + 1}</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                       </div>
                     ) : null}

                    {/* Right Column - Question and Options */}
                    <div className={`space-y-6 ${!(currentQuestion?.figures?.length) ? 'lg:col-span-2' : ''}`}>
                      {/* Question Text */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-blue-800 mb-2">Question</h3>
                        <MathJax className="text-gray-900 leading-relaxed text-base">
                          {currentQuestion?.questionText || 'Question text not available'}
                        </MathJax>
                      </div>

                      {/* Answer Options */}
                      <div className="space-y-3">
                        {options.map((option) => (
                          <button
                            key={option.key}
                            onClick={() => handleAnswerSelect(currentQuestion.id, option.key)}
                            className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 hover:shadow-md ${
                              answers[currentQuestion.id] === option.key
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
                                answers[currentQuestion.id] === option.key
                                  ? 'border-purple-500 bg-purple-500 text-white'
                                  : 'border-gray-300 text-gray-600'
                              }`}>
                                {option.key}
                              </div>
                              <div className="flex-1">
                                <MathJax className="text-gray-900">
                                  {option.value || `Option ${option.key} not available`}
                                </MathJax>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>

        {/* Question Navigator Sidebar */}
        <div className="w-80 bg-white border-l overflow-y-auto flex-shrink-0">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, index) => (
                <button
                  key={question.id}
                  onClick={() => handleQuestionJump(index)}
                  className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200 relative ${
                    index === currentQuestionIndex
                      ? 'bg-purple-600 text-white'
                      : flaggedQuestions.has(index)
                      ? 'bg-orange-100 text-orange-700 border border-orange-300'
                      : isQuestionAnswered(question.id)
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                  {flaggedQuestions.has(index) && (
                    <Flag className="h-3 w-3 absolute -top-1 -right-1 fill-orange-500 text-orange-500" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-gray-600">Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded relative">
                  <Flag className="h-2 w-2 absolute -top-0.5 -right-0.5 fill-orange-500 text-orange-500" />
                </div>
                <span className="text-gray-600">Flagged</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-600 rounded"></div>
                <span className="text-gray-600">Current</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                <span className="text-gray-600">Not Answered</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="text-sm text-gray-600 mb-4">
                <div>Answered: {Object.keys(answers).length}</div>
                <div>Flagged: {flaggedQuestions.size}</div>
                <div>Remaining: {questions.length - Object.keys(answers).length}</div>
              </div>
              
              <Button 
                onClick={handleManualSubmit}
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit Exam'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-white border-t z-30 flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleFlagQuestion}
                className={`flex items-center space-x-2 ${
                  flaggedQuestions.has(currentQuestionIndex)
                    ? 'bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100'
                    : 'hover:bg-gray-50'
                }`}
              >
                <Flag className={`h-4 w-4 ${
                  flaggedQuestions.has(currentQuestionIndex) ? 'fill-orange-500 text-orange-500' : ''
                }`} />
                <span>{flaggedQuestions.has(currentQuestionIndex) ? 'Unflag' : 'Flag'}</span>
              </Button>
            </div>
            
            <Button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showSubmitConfirmation}
        onConfirm={handleConfirmedSubmit}
        onClose={handleCancelSubmit}
        title="Submit Exam"
        description="Are you sure you want to submit your exam? You still have time remaining. This action cannot be undone."
        confirmText="Submit Exam"
        cancelText="Continue Exam"
        isLoading={isSubmitting}
        variant="default"
      />
    </div>
  );
}