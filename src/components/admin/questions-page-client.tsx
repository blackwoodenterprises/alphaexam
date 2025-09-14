"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Eye, Edit, Trash2, FileText, GraduationCap } from "lucide-react";
import { BulkAddToExamModal } from "./bulk-add-to-exam-modal";
import { QuestionUploadModal } from "@/components/admin/question-upload-modal";
import { QuestionPreview } from "@/components/admin/question-preview";
import { QuestionEditModal } from "@/components/admin/question-edit-modal";
import { QuestionsFilters } from "@/components/admin/questions-filters";
import { ConfirmationDialog } from "@/components/ui/dialog";

// Type definitions
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
  status: string;
  tags: string[];
  categoryId: string;
  subcategoryId?: string | null;
  category: { name: string };
  subcategory?: { name: string } | null;
  apiResponse?: Record<string, unknown>;
  figures?: { bbox: number[]; confidence: number; url: string; }[]; // Array of figure objects
  _count: { examQuestions: number };
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
  }[];
  _count: {
    questions: number;
  };
}

// Client-only component to prevent hydration issues with MathJax content
function QuestionTextDisplay({ questionText }: { questionText: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="text-sm font-medium text-gray-900 truncate">
        Loading question text...
      </div>
    );
  }

  return (
    <div className="text-sm font-medium text-gray-900 truncate">
      {questionText.substring(0, 100)}...
    </div>
  );
}

interface QuestionsPageClientProps {
  questions: Question[];
  categories: Category[];
  totalQuestionsCount: number;
}

export function QuestionsPageClient({ 
  questions: initialQuestions, 
  categories,
  totalQuestionsCount 
}: QuestionsPageClientProps) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [filteredQuestions, setFilteredQuestions] = useState(initialQuestions);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  
  // Bulk selection state
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);

  const refreshQuestions = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/admin/questions');
      if (response.ok) {
        const data = await response.json();
        const updatedQuestions = data.questions || data;
        setQuestions(updatedQuestions);
        setFilteredQuestions(updatedQuestions);
      }
    } catch (error) {
      console.error('Failed to refresh questions:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Bulk selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allQuestionIds = new Set(filteredQuestions.map(q => q.id));
      setSelectedQuestions(allQuestionIds);
    } else {
      setSelectedQuestions(new Set());
    }
  };

  const handleSelectQuestion = (questionId: string, checked: boolean) => {
    const newSelected = new Set(selectedQuestions);
    if (checked) {
      newSelected.add(questionId);
    } else {
      newSelected.delete(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  const handleClearSelection = () => {
    setSelectedQuestions(new Set());
  };

  const handleBulkAddSuccess = () => {
    setSelectedQuestions(new Set());
    // Optionally refresh questions or show success message
  };

  // Update bulk actions visibility
  useEffect(() => {
    setShowBulkActions(selectedQuestions.size > 0);
  }, [selectedQuestions]);

  const handleDeleteClick = (question: Question) => {
    setQuestionToDelete(question);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!questionToDelete) return;

    setDeletingQuestionId(questionToDelete.id);
    try {
      const response = await fetch(`/api/admin/questions/${questionToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the question from local state
        const updatedQuestions = questions.filter(q => q.id !== questionToDelete.id);
        setQuestions(updatedQuestions);
        setFilteredQuestions(updatedQuestions);
        setDeleteConfirmOpen(false);
        setQuestionToDelete(null);
      } else {
        const errorData = await response.json();
        // You could add a toast notification here instead of alert
        console.error('Failed to delete question:', errorData.error);
      }
    } catch (error) {
      console.error('Delete question error:', error);
      // You could add a toast notification here instead of alert
    } finally {
      setDeletingQuestionId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setQuestionToDelete(null);
  };

  const handleSearch = (filters: {
    searchTerm: string;
    categoryId: string;
    difficulty: string;
    classLevel: string;
  }) => {
    let filtered = questions;

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(q => 
        q.questionText.toLowerCase().includes(searchLower) ||
        q.optionA.toLowerCase().includes(searchLower) ||
        q.optionB.toLowerCase().includes(searchLower) ||
        q.optionC.toLowerCase().includes(searchLower) ||
        q.optionD.toLowerCase().includes(searchLower) ||
        (q.explanation && q.explanation.toLowerCase().includes(searchLower))
      );
    }

    // Filter by category
    if (filters.categoryId) {
      filtered = filtered.filter(q => q.categoryId === filters.categoryId);
    }

    // Filter by difficulty
    if (filters.difficulty) {
      filtered = filtered.filter(q => q.difficultyLevel === filters.difficulty);
    }

    // Filter by class level
    if (filters.classLevel) {
      filtered = filtered.filter(q => q.class === parseInt(filters.classLevel));
    }

    setFilteredQuestions(filtered);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Question Bank</h1>
          <p className="text-gray-600 mt-1">
            Manage your question database with AI-powered processing
          </p>
        </div>
        <QuestionUploadModal categories={categories} onQuestionCreated={refreshQuestions}>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </QuestionUploadModal>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {totalQuestionsCount.toLocaleString()}
            </div>
            <p className="text-xs text-green-600">AI Processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {categories.length}
            </div>
            <p className="text-xs text-blue-600">Well Organized</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Difficulty Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">4</div>
            <p className="text-xs text-purple-600">Easy to Expert</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Used in Exams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {filteredQuestions.reduce((acc, q) => acc + q._count.examQuestions, 0)}
            </div>
            <p className="text-xs text-orange-600">Active Usage</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <QuestionsFilters categories={categories} onSearch={handleSearch} />

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-purple-900">
                  {selectedQuestions.size} question{selectedQuestions.size !== 1 ? 's' : ''} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSelection}
                  className="text-purple-700 border-purple-300 hover:bg-purple-100"
                >
                  Clear Selection
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
              size="sm"
              onClick={() => setShowBulkAddModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Add to Exam
            </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions List */}
      <Card>
        <CardHeader>
          <CardTitle>Questions Database</CardTitle>
          <CardDescription>
            All questions with AI processing status and details
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-12">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No questions found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search filters or upload new questions
                </p>
                <QuestionUploadModal categories={categories}>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Your First Question
                  </Button>
                </QuestionUploadModal>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 w-12">
                        <input
                          type="checkbox"
                          checked={selectedQuestions.size === filteredQuestions.length && filteredQuestions.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Question
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuestions.map((question) => (
                      <tr
                        key={question.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 ${
                          selectedQuestions.has(question.id) ? 'bg-purple-50' : ''
                        }`}
                      >
                        <td className="py-4 px-4">
                          <input
                            type="checkbox"
                            checked={selectedQuestions.has(question.id)}
                            onChange={(e) => handleSelectQuestion(question.id, e.target.checked)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-16 h-12 flex items-center justify-center bg-gray-100 rounded border">
                              <FileText className="w-6 h-6 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <QuestionTextDisplay questionText={question.questionText} />
                              <div className="text-xs text-gray-500 mt-1">
                                {question.tags.slice(0, 3).map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="inline-block bg-gray-100 rounded px-2 py-1 mr-1"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-900">
                            {question.category.name}
                          </div>
                          {question.subcategory && (
                            <div className="text-xs text-gray-500">
                              {question.subcategory.name}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              question.status === "PUBLISHED"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {question.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <QuestionPreview question={question}>
                              <Button variant="ghost" size="icon">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </QuestionPreview>
                            <QuestionEditModal 
                              question={question} 
                              categories={categories}
                              onQuestionUpdated={refreshQuestions}
                            >
                              <Button variant="ghost" size="icon" disabled={isRefreshing}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            </QuestionEditModal>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteClick(question)}
                              disabled={deletingQuestionId === question.id || isRefreshing}
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
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Question"
        description={`Are you sure you want to delete this question? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deletingQuestionId === questionToDelete?.id}
        variant="danger"
      />

      {/* Bulk Add to Exam Modal */}
      <BulkAddToExamModal
        isOpen={showBulkAddModal}
        onClose={() => setShowBulkAddModal(false)}
        selectedQuestionIds={Array.from(selectedQuestions)}
        onSuccess={handleBulkAddSuccess}
      />
    </div>
  );
}