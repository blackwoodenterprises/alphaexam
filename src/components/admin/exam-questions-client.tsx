"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  FileQuestion,
} from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ExamQuestion {
  id: string;
  marks: number;
  negativeMarks: number;
  order: number;
  question: {
    id: string;
    questionText: string;
    difficultyLevel: string;
    category?: {
      name: string;
    };
    subcategory: {
      name: string;
    } | null;
  };
}

interface Exam {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  price: number;
  isFree: boolean;
  isActive: boolean;
  examCategory: {
    name: string;
  } | null;
  createdBy: {
    firstName: string | null;
    lastName: string | null;
  };
  _count: {
    examQuestions: number;
    examAttempts: number;
  };
}

interface ExamQuestionsClientProps {
  exam: Exam;
  examQuestions: ExamQuestion[];
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "EASY":
      return "bg-green-100 text-green-800";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800";
    case "HARD":
      return "bg-red-100 text-red-800";
    case "EXPERT":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function ExamQuestionsClient({ exam, examQuestions: initialExamQuestions }: ExamQuestionsClientProps) {
  const router = useRouter();
  const [examQuestions, setExamQuestions] = useState(initialExamQuestions);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteQuestion = (questionId: string) => {
    setQuestionToDelete(questionId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!questionToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/exams/${exam.id}/questions/${questionToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the question from the local state
        setExamQuestions(prev => prev.filter(eq => eq.id !== questionToDelete));
        setShowDeleteDialog(false);
        setQuestionToDelete(null);
        // Refresh the page to update counts
        router.refresh();
      } else {
        const error = await response.json();
        console.error('Failed to delete question:', error);
        alert('Failed to remove question from exam. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('An error occurred while removing the question. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setQuestionToDelete(null);
  };

  return (
    <div>
      {/* Questions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
          <CardDescription>
            Manage questions associated with this exam
          </CardDescription>
        </CardHeader>
        <CardContent>
          {examQuestions.length === 0 ? (
            <div className="text-center py-12">
              <FileQuestion className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No questions added
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding questions to this exam.
              </p>
              <div className="mt-6">
                <Link href="/admin/questions">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Question
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Question
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Subcategory
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Difficulty
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Marks
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {examQuestions.map((examQuestion) => (
                    <tr
                      key={examQuestion.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div className="max-w-xs">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {examQuestion.question.questionText}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {examQuestion.question.category?.name || "No Category"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {examQuestion.question.subcategory?.name || "No Subcategory"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                            examQuestion.question.difficultyLevel
                          )}`}
                        >
                          {examQuestion.question.difficultyLevel}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-900">
                        {examQuestion.marks}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteQuestion(examQuestion.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Remove Question from Exam"
        description="Are you sure you want to remove this question from the exam? This action cannot be undone."
        confirmText={isDeleting ? "Removing..." : "Remove Question"}
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}