import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Upload, Eye, Edit, Trash2 } from "lucide-react";
import { QuestionUploadModal } from "@/components/admin/question-upload-modal";
import { QuestionPreview } from "@/components/admin/question-preview";

async function getQuestions() {
  try {
    const questions = await prisma.question.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
        subcategory: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            examQuestions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20, // Limit for performance
    });

    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            questions: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function QuestionsPage() {
  const questions = await getQuestions();
  const categories = await getCategories();

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
        <QuestionUploadModal categories={categories}>
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
              {questions.length.toLocaleString()}
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
              {questions.reduce((acc, q) => acc + q._count.examQuestions, 0)}
            </div>
            <p className="text-xs text-orange-600">Active Usage</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category._count.questions})
                </option>
              ))}
            </select>

            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
              <option value="EXPERT">Expert</option>
            </select>

            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="">All Classes</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((cls) => (
                <option key={cls} value={cls}>
                  Class {cls}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

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
            {questions.length === 0 ? (
              <div className="text-center py-12">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No questions yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start building your question bank by uploading images
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
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Question
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Difficulty
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Class
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Usage
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((question) => (
                      <tr
                        key={question.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-start space-x-3">
                            <img
                              src={question.imageUrl}
                              alt="Question"
                              className="w-16 h-12 object-cover rounded border"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {question.questionText.substring(0, 100)}...
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {question.tags.slice(0, 3).map((tag) => (
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
                              question.difficultyLevel === "EASY"
                                ? "bg-green-100 text-green-800"
                                : question.difficultyLevel === "MEDIUM"
                                ? "bg-yellow-100 text-yellow-800"
                                : question.difficultyLevel === "HARD"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {question.difficultyLevel}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-900">
                            Class {question.class}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-900">
                            {question._count.examQuestions} exams
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <QuestionPreview question={question}>
                              <Button variant="ghost" size="icon">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </QuestionPreview>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700"
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
    </div>
  );
}
