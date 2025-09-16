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
import { Plus, Upload, Eye, Edit, Trash2, FileText, GraduationCap, PenTool } from "lucide-react";
import { BulkAddToExamModal } from "./bulk-add-to-exam-modal";
import { QuestionUploadModal } from "@/components/admin/question-upload-modal";
import { QuestionAddManualModal } from "@/components/admin/question-add-manual-modal";
import { QuestionPreview } from "@/components/admin/question-preview";
import { QuestionEditModal } from "@/components/admin/question-edit-modal";
import { QuestionsFilters } from "@/components/admin/questions-filters";
import { ConfirmationDialog } from "@/components/ui/dialog";
import { MathJax } from "@/components/ui/mathjax";

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

  // Truncate the text but preserve mathematical expressions
  const truncatedText = questionText.length > 100 ? questionText.substring(0, 100) + '...' : questionText;

  return (
    <div className="text-sm font-medium text-gray-900 truncate">
      <MathJax>{truncatedText}</MathJax>
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

  const refreshQuestions = async (filters?: {
    searchTerm?: string;
    categoryId?: string;
    subcategoryId?: string;
    difficulty?: string;
    classLevel?: string;
  }) => {
    setIsRefreshing(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (filters?.searchTerm) params.append('search', filters.searchTerm);
      if (filters?.categoryId) params.append('categoryId', filters.categoryId);
      if (filters?.subcategoryId) params.append('subcategoryId', filters.subcategoryId);
      if (filters?.difficulty) params.append('difficultyLevel', filters.difficulty);
      if (filters?.classLevel) params.append('class', filters.classLevel);
      
      const url = `/api/admin/questions${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      
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
    subcategoryId: string;
    difficulty: string;
    classLevel: string;
  }) => {
    // Call the backend API with filters instead of client-side filtering
    refreshQuestions(filters);
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
        <div className="flex space-x-3">
          <QuestionAddManualModal categories={categories} onQuestionCreated={refreshQuestions}>
            <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
              <PenTool className="w-4 h-4 mr-2" />
              Add Manually
            </Button>
          </QuestionAddManualModal>
          <QuestionUploadModal categories={categories} onQuestionCreated={refreshQuestions}>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </QuestionUploadModal>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              Subcategories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {categories.reduce((acc, category) => acc + category.subcategories.length, 0)}
            </div>
            <p className="text-xs text-indigo-600">Specialized Topics</p>
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
              <div className="space-y-4">
                {/* Select All Header */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedQuestions.size === filteredQuestions.length && filteredQuestions.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Select All ({filteredQuestions.length} questions)
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {selectedQuestions.size} selected
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Question Cards */}
                {filteredQuestions.map((question) => (
                  <Card
                    key={question.id}
                    className={`transition-all duration-200 hover:shadow-md ${
                      selectedQuestions.has(question.id) 
                        ? 'ring-2 ring-purple-500 bg-purple-50' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                        {/* Checkbox and Question Icon */}
                        <div className="flex items-start space-x-3 flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={selectedQuestions.has(question.id)}
                            onChange={(e) => handleSelectQuestion(question.id, e.target.checked)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <div className="w-12 h-12 sm:w-16 sm:h-12 flex items-center justify-center bg-gray-100 rounded border">
                            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                          </div>
                        </div>

                        {/* Question Content */}
                        <div className="flex-1 min-w-0">
                          <div className="mb-3">
                            <QuestionTextDisplay questionText={question.questionText} />
                          </div>
                          
                          {/* Tags */}
                          {question.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {question.tags.slice(0, 3).map((tag: string) => (
                                <span
                                  key={tag}
                                  className="inline-block bg-gray-100 rounded px-2 py-1 text-xs text-gray-600"
                                >
                                  {tag}
                                </span>
                              ))}
                              {question.tags.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{question.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}

                          {/* Category and Status - Mobile Layout */}
                           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                             <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                               <div className="flex items-center space-x-2">
                                 <span className="text-sm text-gray-500">Category:</span>
                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                   {question.category?.name || 'Uncategorized'}
                                 </span>
                               </div>
                               <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500">Status:</span>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    question.status === "PUBLISHED"
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {question.status}
                                  </span>
                                </div>
                             </div>

                             {/* Actions */}
                             <div className="flex items-center space-x-2">
                               <QuestionPreview question={question}>
                                 <Button variant="ghost" size="sm" className="text-gray-600 hover:text-purple-600">
                                   <Eye className="w-4 h-4" />
                                   <span className="ml-1 hidden sm:inline">Preview</span>
                                 </Button>
                               </QuestionPreview>
                               <QuestionEditModal 
                                 question={question} 
                                 categories={categories}
                                 onQuestionUpdated={refreshQuestions}
                               >
                                 <Button variant="ghost" size="sm" disabled={isRefreshing} className="text-gray-600 hover:text-blue-600">
                                   <Edit className="w-4 h-4" />
                                   <span className="ml-1 hidden sm:inline">Edit</span>
                                 </Button>
                               </QuestionEditModal>
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 className="text-red-600 hover:text-red-700"
                                 onClick={() => handleDeleteClick(question)}
                                 disabled={deletingQuestionId === question.id || isRefreshing}
                               >
                                 <Trash2 className="w-4 h-4" />
                                 <span className="ml-1 hidden sm:inline">Delete</span>
                               </Button>
                             </div>
                           </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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