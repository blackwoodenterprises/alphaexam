"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, CheckCircle, XCircle } from "lucide-react";

interface Question {
  id: string;
  imageUrl: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation?: string;
  adminNotes?: string;
  class: number;
  difficultyLevel: string;
  tags: string[];
  category: {
    name: string;
  };
  subcategory?: {
    name: string;
  } | null;
}

interface QuestionPreviewProps {
  question: Question;
  children: React.ReactNode;
}

export function QuestionPreview({ question, children }: QuestionPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const options = [
    { key: "A", value: question.optionA },
    { key: "B", value: question.optionB },
    { key: "C", value: question.optionC },
    { key: "D", value: question.optionD },
  ];

  const handleAnswerSelect = (optionKey: string) => {
    setSelectedAnswer(optionKey);
    setShowExplanation(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HARD":
        return "bg-orange-100 text-orange-800";
      case "EXPERT":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Question Preview
                  </h2>
                  <div className="flex items-center space-x-2 mt-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        question.difficultyLevel
                      )}`}
                    >
                      {question.difficultyLevel}
                    </span>
                    <span className="text-sm text-gray-500">
                      Class {question.class}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {question.category.name}
                    </span>
                    {question.subcategory && (
                      <>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">
                          {question.subcategory.name}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedAnswer(null);
                    setShowExplanation(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Question Image */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Question Image
                  </h3>
                  <img
                    src={question.imageUrl}
                    alt="Question"
                    className="w-full border rounded-lg shadow-sm"
                  />
                </div>

                {/* Question Content */}
                <div className="space-y-6">
                  {/* Question Text */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Question</h3>
                    <div
                      className="p-4 bg-gray-50 rounded-lg text-gray-900"
                      dangerouslySetInnerHTML={{
                        __html: question.questionText,
                      }}
                    />
                  </div>

                  {/* Options */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Options</h3>
                    <div className="space-y-3">
                      {options.map((option) => {
                        const isCorrect = option.key === question.correctAnswer;
                        const isSelected = option.key === selectedAnswer;
                        const showResult = showExplanation;

                        return (
                          <button
                            key={option.key}
                            onClick={() => handleAnswerSelect(option.key)}
                            disabled={showExplanation}
                            className={`w-full p-3 text-left border rounded-lg transition-colors ${
                              showResult
                                ? isCorrect
                                  ? "border-green-500 bg-green-50"
                                  : isSelected
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-200 bg-gray-50"
                                : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-start space-x-3">
                                <span
                                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                                    showResult
                                      ? isCorrect
                                        ? "bg-green-600 text-white"
                                        : isSelected
                                        ? "bg-red-600 text-white"
                                        : "bg-gray-400 text-white"
                                      : "bg-gray-200 text-gray-700"
                                  }`}
                                >
                                  {option.key}
                                </span>
                                <div
                                  className="flex-1 text-gray-900"
                                  dangerouslySetInnerHTML={{
                                    __html: option.value,
                                  }}
                                />
                              </div>
                              {showResult && (
                                <div className="flex-shrink-0">
                                  {isCorrect ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  ) : isSelected ? (
                                    <XCircle className="w-5 h-5 text-red-600" />
                                  ) : null}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Results */}
                  {showExplanation && (
                    <div className="space-y-4">
                      <div
                        className={`p-4 rounded-lg ${
                          selectedAnswer === question.correctAnswer
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          {selectedAnswer === question.correctAnswer ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span
                            className={`font-medium ${
                              selectedAnswer === question.correctAnswer
                                ? "text-green-800"
                                : "text-red-800"
                            }`}
                          >
                            {selectedAnswer === question.correctAnswer
                              ? "Correct!"
                              : "Incorrect"}
                          </span>
                        </div>
                        <p
                          className={`text-sm ${
                            selectedAnswer === question.correctAnswer
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          The correct answer is option {question.correctAnswer}.
                        </p>
                      </div>

                      {question.explanation && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Explanation
                          </h4>
                          <div
                            className="p-4 bg-blue-50 rounded-lg text-blue-900 text-sm"
                            dangerouslySetInnerHTML={{
                              __html: question.explanation,
                            }}
                          />
                        </div>
                      )}

                      <Button
                        onClick={() => {
                          setSelectedAnswer(null);
                          setShowExplanation(false);
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {question.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Question ID
                    </h4>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {question.id}
                    </code>
                  </div>

                  {question.adminNotes && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Admin Notes
                      </h4>
                      <p className="text-gray-600">{question.adminNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
