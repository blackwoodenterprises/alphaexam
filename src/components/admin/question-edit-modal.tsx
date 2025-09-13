"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dropdown,
  SearchableDropdown,
} from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  X,
  Eye,
  BookOpen,
  BarChart3,
  GraduationCap,
  CheckCircle,
} from "lucide-react";
import { MathJax } from "@/components/ui/mathjax";

interface Category {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
  }[];
}

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
  status: string;
  tags: string[];
  categoryId: string;
  subcategoryId?: string | null;
  category: { name: string };
  subcategory?: { name: string } | null;
  apiResponse?: Record<string, unknown>;
  figures?: Array<{
    bbox: number[];
    confidence: number;
    url: string;
  }>;
  _count: { examQuestions: number };
  createdAt: Date;
  updatedAt: Date;
}

interface QuestionEditModalProps {
  question: Question;
  categories: Category[];
  children: React.ReactNode;
  onQuestionUpdated?: () => void;
}

export function QuestionEditModal({
  question,
  categories,
  children,
  onQuestionUpdated,
}: QuestionEditModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    imageUrl: question.imageUrl,
    questionText: question.questionText,
    optionA: question.optionA,
    optionB: question.optionB,
    optionC: question.optionC,
    optionD: question.optionD,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation || "",
    adminNotes: question.adminNotes || "",
    class: question.class,
    difficultyLevel: question.difficultyLevel,
    status: question.status,
    tags: question.tags.join(", "),
    categoryId: question.categoryId,
    subcategoryId: question.subcategoryId || "",
  });

  const handleSaveQuestion = async (status?: string) => {
    setSaving(true);
    try {
      const finalStatus = status || formData.status;

      const questionData = {
        imageUrl: formData.imageUrl,
        questionText: formData.questionText,
        optionA: formData.optionA,
        optionB: formData.optionB,
        optionC: formData.optionC,
        optionD: formData.optionD,
        correctAnswer: formData.correctAnswer,
        explanation: formData.explanation,
        adminNotes: formData.adminNotes,
        class: formData.class,
        difficultyLevel: formData.difficultyLevel,
        status: finalStatus,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        categoryId: formData.categoryId,
        subcategoryId: formData.subcategoryId || null,
        // Keep existing apiResponse and figures
        apiResponse: question.apiResponse || {},
        figures: question.figures || null,
      };

      const response = await fetch(`/api/admin/questions/${question.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        throw new Error("Failed to update question");
      }

      // Success - close modal and refresh
      setIsOpen(false);
      if (onQuestionUpdated) {
        onQuestionUpdated();
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update question. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const selectedCategory = categories.find(
    (cat) => cat.id === formData.categoryId
  );

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Edit Question #{question.id}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-col h-[calc(95vh-120px)]">
              <div className="grid grid-cols-2 gap-4 p-4 flex-1 overflow-y-auto">
                {/* Left Column - Question Preview */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Question Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {/* Original Image */}
                        <div className="bg-white p-2 rounded border">
                          <Image
                            src={formData.imageUrl}
                            alt="Question"
                            width={500}
                            height={300}
                            className="w-full max-w-lg mx-auto h-auto rounded border"
                          />
                        </div>

                        {/* Question Text */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                          <div className="bg-white p-2 rounded border">
                            <MathJax className="text-gray-900 leading-relaxed text-sm">
                              {formData.questionText}
                            </MathJax>
                          </div>
                        </div>

                        {/* Options and Figures in Two Columns */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* Options on Left */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                            <h5 className="text-xs font-semibold text-green-900 mb-2">
                              Answer Options
                            </h5>
                            <div className="space-y-1">
                              {[
                                { key: "A", value: formData.optionA },
                                { key: "B", value: formData.optionB },
                                { key: "C", value: formData.optionC },
                                { key: "D", value: formData.optionD },
                              ].map(({ key, value }) => {
                                const isCorrect =
                                  formData.correctAnswer === key;
                                return (
                                  <div
                                    key={key}
                                    className={`p-2 border rounded flex items-start space-x-2 ${
                                      isCorrect
                                        ? "border-green-500 bg-green-50"
                                        : "border-gray-200 bg-white"
                                    }`}
                                  >
                                    <span className="font-semibold text-green-700 flex-shrink-0 text-xs">
                                      {key}.
                                    </span>
                                    <MathJax className="flex-1 text-xs">
                                      {value}
                                    </MathJax>
                                    {isCorrect && (
                                      <span className="text-green-600 font-bold text-xs">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Figures on Right */}
                          {question.figures && question.figures.length > 0 && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                              <h5 className="text-xs font-semibold text-gray-900 mb-2">
                                Figures
                              </h5>
                              <div className="space-y-2">
                                {question.figures.map((figure, index) => (
                                  <div
                                    key={index}
                                    className="bg-white border rounded p-2"
                                  >
                                    <Image
                                      src={figure.url}
                                      alt={`Figure ${index + 1}`}
                                      width={400}
                                      height={200}
                                      className="w-full h-auto rounded"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Explanation Preview */}
                        {formData.explanation && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                            <h5 className="text-xs font-semibold text-blue-900 mb-1">
                              Explanation
                            </h5>
                            <div className="bg-white p-2 rounded border">
                              <MathJax className="text-blue-900 text-xs">
                                {formData.explanation}
                              </MathJax>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Edit Form */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">
                        Edit Question Details
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Modify the question content and metadata.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Question Text */}
                      <Textarea
                        label="Question Text"
                        required
                        value={formData.questionText}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            questionText: e.target.value,
                          }))
                        }
                        rows={3}
                        placeholder="Enter question text (LaTeX supported: $x^2 + 2x + 1$)"
                      />

                      {/* Options */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          Answer Options *
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                          {[
                            { key: "A", field: "optionA" },
                            { key: "B", field: "optionB" },
                            { key: "C", field: "optionC" },
                            { key: "D", field: "optionD" },
                          ].map(({ key, field }) => {
                            const value = formData[
                              field as keyof typeof formData
                            ] as string;
                            const isCorrect = formData.correctAnswer === key;
                            return (
                              <div
                                key={key}
                                className={`border rounded-lg p-3 ${
                                  isCorrect
                                    ? "border-green-300 bg-green-50"
                                    : "border-gray-200"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
                                    <span
                                      className={`text-xs font-bold px-2 py-1 rounded ${
                                        isCorrect
                                          ? "bg-green-600 text-white"
                                          : "bg-gray-600 text-white"
                                      }`}
                                    >
                                      {key}
                                    </span>
                                  </div>
                                  <input
                                    type="text"
                                    value={value}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        [field]: e.target.value,
                                      }))
                                    }
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                                    placeholder={`Enter option ${key} (LaTeX supported)`}
                                    required
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Question Metadata */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          Question Metadata
                        </h4>

                        {/* Category and Subcategory */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Category *
                            </label>
                            <SearchableDropdown
                              value={formData.categoryId}
                              onChange={(value) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  categoryId: value as string,
                                  subcategoryId: "",
                                }))
                              }
                              placeholder="Select Category"
                              options={categories.map((cat) => ({
                                value: cat.id,
                                label: cat.name,
                                icon: BookOpen,
                              }))}
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Subcategory
                            </label>
                            <SearchableDropdown
                              value={formData.subcategoryId}
                              onChange={(value) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  subcategoryId: value as string,
                                }))
                              }
                              placeholder="Select Subcategory"
                              options={
                                selectedCategory?.subcategories.map(
                                  (subcat) => ({
                                    value: subcat.id,
                                    label: subcat.name,
                                    icon: BookOpen,
                                  })
                                ) || []
                              }
                              disabled={!selectedCategory}
                              className="w-full"
                            />
                          </div>
                        </div>

                        {/* Class, Difficulty, Correct Answer */}
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Class *
                            </label>
                            <SearchableDropdown
                              value={formData.class.toString()}
                              onChange={(value) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  class: parseInt(value as string),
                                }))
                              }
                              placeholder="Select Class"
                              options={Array.from(
                                { length: 12 },
                                (_, i) => i + 1
                              ).map((cls) => ({
                                value: cls.toString(),
                                label: `Class ${cls}`,
                                icon: GraduationCap,
                              }))}
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Difficulty *
                            </label>
                            <Dropdown
                              value={formData.difficultyLevel}
                              onChange={(value) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  difficultyLevel: value as string,
                                }))
                              }
                              placeholder="Select Difficulty"
                              searchable={false}
                              options={[
                                {
                                  value: "EASY",
                                  label: "Easy",
                                  icon: BarChart3,
                                },
                                {
                                  value: "MEDIUM",
                                  label: "Medium",
                                  icon: BarChart3,
                                },
                                {
                                  value: "HARD",
                                  label: "Hard",
                                  icon: BarChart3,
                                },
                                {
                                  value: "EXPERT",
                                  label: "Expert",
                                  icon: BarChart3,
                                },
                              ]}
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Correct Answer *
                            </label>
                            <Dropdown
                              value={formData.correctAnswer}
                              onChange={(value) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  correctAnswer: value as string,
                                }))
                              }
                              placeholder="Select Answer"
                              searchable={false}
                              options={[
                                {
                                  value: "A",
                                  label: "Option A",
                                  icon: CheckCircle,
                                },
                                {
                                  value: "B",
                                  label: "Option B",
                                  icon: CheckCircle,
                                },
                                {
                                  value: "C",
                                  label: "Option C",
                                  icon: CheckCircle,
                                },
                                {
                                  value: "D",
                                  label: "Option D",
                                  icon: CheckCircle,
                                },
                              ]}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <Input
                        label="Tags (comma-separated)"
                        value={formData.tags}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            tags: e.target.value,
                          }))
                        }
                        placeholder="algebra, quadratic, factoring"
                      />

                      {/* Explanation */}
                      <Textarea
                        label="Explanation"
                        value={formData.explanation}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            explanation: e.target.value,
                          }))
                        }
                        placeholder="Detailed explanation of the solution (LaTeX supported)..."
                        rows={3}
                      />

                      {/* Admin Notes */}
                      <Textarea
                        label="Admin Notes"
                        value={formData.adminNotes}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            adminNotes: e.target.value,
                          }))
                        }
                        placeholder="Internal notes for admins..."
                        rows={2}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Action Buttons - Outside scrollable area */}
              <div className="bg-white flex justify-between items-center p-4 border-t shadow-lg">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleSaveQuestion("DRAFT")}
                    disabled={saving || !formData.categoryId}
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    {saving ? "Saving..." : "Save Draft"}
                  </Button>
                  <Button
                    onClick={() => handleSaveQuestion("PUBLISHED")}
                    disabled={saving || !formData.categoryId}
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    {saving ? "Publishing..." : "Publish"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
