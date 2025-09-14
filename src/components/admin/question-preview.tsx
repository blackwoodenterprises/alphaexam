"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { MathJax } from "@/components/ui/mathjax";
import { X, CheckCircle } from "lucide-react";

interface Question {
  id: string;
  imageUrl: string | null;
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
  figures?: { bbox: number[]; confidence: number; url: string; }[] | string[]; // Array of figure objects or string URLs
}

interface QuestionPreviewProps {
  question: Question;
  children: React.ReactNode;
}

export function QuestionPreview({ question, children }: QuestionPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { key: "A", value: question.optionA },
    { key: "B", value: question.optionB },
    { key: "C", value: question.optionC },
    { key: "D", value: question.optionD },
  ];



  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Compact Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Question Preview
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Original Image at Top */}
                    {question.imageUrl && (
                      <div className="bg-white p-3 rounded border">
                        <Image
                          src={question.imageUrl}
                          alt="Question"
                          width={600}
                          height={400}
                          className="w-full max-w-2xl mx-auto h-auto rounded border"
                        />
                      </div>
                    )}

                    {/* Question Text */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="bg-white p-3 rounded border">
                        <MathJax className="text-gray-900 leading-relaxed">
                          {question.questionText}
                        </MathJax>
                      </div>
                    </div>

                    {/* Options and Figures in Two Columns */}
                    <div className={`grid grid-cols-1 gap-6 ${question.figures && question.figures.length > 0 ? 'lg:grid-cols-2' : ''}`}>
                      {/* Options on Left */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <h5 className="text-sm font-semibold text-green-900 mb-2">Answer Options</h5>
                        <div className="space-y-2">
                          {options.map((option) => {
                            const isCorrect = option.key === question.correctAnswer;

                            return (
                              <div
                                key={option.key}
                                className={`w-full text-left p-3 border rounded flex items-start justify-between ${
                                  isCorrect
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-200 bg-white"
                                }`}
                              >
                                <div className="flex items-start flex-1">
                                  <span className="font-semibold text-green-700 mr-2 flex-shrink-0">{option.key}.</span>
                                  <MathJax className="flex-1">
                                    {option.value}
                                  </MathJax>
                                </div>
                                {isCorrect && (
                                  <div className="flex-shrink-0">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Figures on Right */}
                      {question.figures && question.figures.length > 0 && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <h5 className="text-sm font-semibold text-gray-900 mb-2">Figures</h5>
                          <div className="space-y-3">
                            {question.figures.map((figure, index) => {
                              // Handle both string URLs and object format
                              const figureUrl = typeof figure === 'string' ? figure : figure.url;
                              
                              return (
                                <div key={index} className="bg-white border rounded p-3">
                                  {figureUrl && figureUrl.trim() !== "" ? (
                                    <Image 
                                      src={figureUrl} 
                                      alt={`Figure ${index + 1}`}
                                      width={400}
                                      height={200}
                                      className="w-full h-auto rounded mb-2"
                                    />
                                  ) : (
                                    <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center text-gray-500 text-sm">
                                      No image available
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Explanation (if available) */}
                  {question.explanation && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Explanation
                        </h4>
                        <div className="p-4 bg-blue-50 rounded-lg text-blue-900 text-sm">
                          <MathJax>
                            {question.explanation}
                          </MathJax>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Compact metadata section */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                  <div className="flex flex-wrap gap-1">
                    {question.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div>
                    <span className="font-medium">ID:</span> {question.id}
                  </div>
                  {question.adminNotes && (
                    <div>
                      <span className="font-medium">Notes:</span> {question.adminNotes}
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
