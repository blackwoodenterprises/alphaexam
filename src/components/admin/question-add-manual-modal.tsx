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
  Upload,
  Trash2,
  Plus,
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

interface QuestionAddManualModalProps {
  categories: Category[];
  children: React.ReactNode;
  onQuestionCreated?: () => void;
}

export function QuestionAddManualModal({
  categories,
  children,
  onQuestionCreated,
}: QuestionAddManualModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingFigure, setUploadingFigure] = useState(false);
  const [figures, setFigures] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    imageUrl: "",
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    explanation: "",
    adminNotes: "",
    class: 10,
    difficultyLevel: "MEDIUM",
    status: "DRAFT",
    tags: "",
    categoryId: "",
    subcategoryId: "",
  });

  const handleSaveQuestion = async (status?: string) => {
    setSaving(true);
    try {
      const finalStatus = status || formData.status;

      const questionData = {
        imageUrl: formData.imageUrl || null,
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
        figures: figures,
        apiResponse: {},
      };

      const response = await fetch("/api/admin/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        throw new Error("Failed to create question");
      }

      // Success - close modal and refresh
      setIsOpen(false);
      resetForm();
      if (onQuestionCreated) {
        onQuestionCreated();
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Create error:", error);
      alert("Failed to create question. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      imageUrl: "",
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "A",
      explanation: "",
      adminNotes: "",
      class: 10,
      difficultyLevel: "MEDIUM",
      status: "DRAFT",
      tags: "",
      categoryId: "",
      subcategoryId: "",
    });
    setFigures([]);
  };

  const handleFigureUpload = async (file: File) => {
    setUploadingFigure(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error("Failed to upload figure");
      }

      const { url } = await response.json();
      setFigures(prev => [...prev, url]);
    } catch (error) {
      console.error("Figure upload error:", error);
      alert("Failed to upload figure. Please try again.");
    } finally {
      setUploadingFigure(false);
    }
  };

  const handleMainImageUpload = async (file: File) => {
    setUploadingFigure(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const { url } = await response.json();
      setFormData(prev => ({ ...prev, imageUrl: url }));
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingFigure(false);
    }
  };

  const removeFigure = (index: number) => {
    setFigures(prev => prev.filter((_, i) => i !== index));
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
                Add Question Manually
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  resetForm();
                }}
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
                        {/* Main Image */}
                        {formData.imageUrl && (
                          <div className="bg-white p-2 rounded border">
                            <Image
                              src={formData.imageUrl}
                              alt="Question"
                              width={500}
                              height={300}
                              className="w-full max-w-lg mx-auto h-auto rounded border"
                            />
                          </div>
                        )}

                        {/* Question Text */}
                        {formData.questionText && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                            <div className="bg-white p-2 rounded border">
                              <MathJax className="text-gray-900 leading-relaxed text-sm">
                                {formData.questionText}
                              </MathJax>
                            </div>
                          </div>
                        )}

                        {/* Options and Figures in Two Columns */}
                        <div className={`grid grid-cols-1 gap-4 ${figures.length > 0 ? 'lg:grid-cols-2' : ''}`}>
                          {/* Options on Left */}
                          {(formData.optionA || formData.optionB || formData.optionC || formData.optionD) && (
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
                                ].map(({ key, value }) => (
                                  value && (
                                    <div
                                      key={key}
                                      className={`flex items-start space-x-2 p-2 rounded text-xs ${
                                        formData.correctAnswer === key
                                          ? "bg-green-200 border border-green-400"
                                          : "bg-white border border-gray-200"
                                      }`}
                                    >
                                      <span className="font-semibold text-green-900 min-w-[16px]">
                                        {key}.
                                      </span>
                                      <MathJax className="text-green-900 flex-1">
                                        {value}
                                      </MathJax>
                                      {formData.correctAnswer === key && (
                                        <CheckCircle className="w-3 h-3 text-green-600 mt-0.5" />
                                      )}
                                    </div>
                                  )
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Figures on Right */}
                          {figures.length > 0 && (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                              <h5 className="text-xs font-semibold text-orange-900 mb-2">
                                Figures ({figures.length})
                              </h5>
                              <div className="grid grid-cols-1 gap-2">
                                {figures.map((figureUrl, index) => (
                                  <div key={index} className="bg-white border rounded p-2">
                                    <Image 
                                      src={figureUrl} 
                                      alt={`Figure ${index + 1}`}
                                      width={200}
                                      height={150}
                                      className="w-full h-auto rounded mb-1"
                                    />
                                    <p className="text-xs text-orange-800 text-center">
                                      Figure {index + 1}
                                    </p>
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
                        Question Details
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Enter the question content and metadata manually.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Main Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Main Question Image (Optional)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                          {formData.imageUrl ? (
                            <div className="space-y-2">
                              <Image
                                src={formData.imageUrl}
                                alt="Main question image"
                                width={200}
                                height={150}
                                className="mx-auto rounded"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                              >
                                Remove Image
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-600 mb-2">Upload main question image</p>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleMainImageUpload(file);
                                }}
                                className="hidden"
                                id="main-image-upload"
                                disabled={uploadingFigure}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={uploadingFigure}
                                onClick={() => document.getElementById('main-image-upload')?.click()}
                              >
                                {uploadingFigure ? "Uploading..." : "Choose Image"}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Question Text */}
                      <Textarea
                        label="Question Text *"
                        value={formData.questionText}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            questionText: e.target.value,
                          }))
                        }
                        placeholder="Enter the question text (LaTeX supported)..."
                        rows={3}
                        required
                      />

                      {/* Options */}
                      <div className="grid grid-cols-1 gap-3">
                        <Input
                          label="Option A *"
                          value={formData.optionA}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              optionA: e.target.value,
                            }))
                          }
                          placeholder="Enter option A (LaTeX supported)..."
                          required
                        />
                        <Input
                          label="Option B *"
                          value={formData.optionB}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              optionB: e.target.value,
                            }))
                          }
                          placeholder="Enter option B (LaTeX supported)..."
                          required
                        />
                        <Input
                          label="Option C *"
                          value={formData.optionC}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              optionC: e.target.value,
                            }))
                          }
                          placeholder="Enter option C (LaTeX supported)..."
                          required
                        />
                        <Input
                          label="Option D *"
                          value={formData.optionD}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              optionD: e.target.value,
                            }))
                          }
                          placeholder="Enter option D (LaTeX supported)..."
                          required
                        />
                      </div>

                      {/* Correct Answer */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          options={[
                            { value: "A", label: "Option A", icon: CheckCircle },
                            { value: "B", label: "Option B", icon: CheckCircle },
                            { value: "C", label: "Option C", icon: CheckCircle },
                            { value: "D", label: "Option D", icon: CheckCircle },
                          ]}
                          placeholder="Select correct answer"
                          searchable={false}
                          className="w-full"
                        />
                      </div>

                      {/* Figures Upload Section */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Figures
                        </label>
                        <div className="space-y-3">
                          {/* Upload Area */}
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                            <Plus className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600 mb-2">Upload additional figures</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFigureUpload(file);
                              }}
                              className="hidden"
                              id="figure-upload"
                              disabled={uploadingFigure}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={uploadingFigure}
                              onClick={() => document.getElementById('figure-upload')?.click()}
                            >
                              {uploadingFigure ? "Uploading..." : "Add Figure"}
                            </Button>
                          </div>

                          {/* Uploaded Figures */}
                          {figures.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                              {figures.map((figureUrl, index) => (
                                <div key={index} className="relative border rounded-lg p-2 bg-gray-50">
                                  <Image
                                    src={figureUrl}
                                    alt={`Figure ${index + 1}`}
                                    width={150}
                                    height={100}
                                    className="w-full h-20 object-cover rounded"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-1 right-1 h-6 w-6 p-0 bg-red-100 hover:bg-red-200"
                                    onClick={() => removeFigure(index)}
                                  >
                                    <Trash2 className="h-3 w-3 text-red-600" />
                                  </Button>
                                  <p className="text-xs text-center mt-1">Figure {index + 1}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Category and Metadata */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            options={categories.map((cat) => ({
                              value: cat.id,
                              label: cat.name,
                              icon: BookOpen,
                            }))}
                            placeholder="Select category"
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            options={
                              selectedCategory?.subcategories.map((subcat) => ({
                                value: subcat.id,
                                label: subcat.name,
                                icon: BookOpen,
                              })) || []
                            }
                            placeholder="Select subcategory"
                            disabled={!selectedCategory}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            options={Array.from({ length: 12 }, (_, i) => i + 1).map((cls) => ({
                              value: cls.toString(),
                              label: `Class ${cls}`,
                              icon: GraduationCap,
                            }))}
                            placeholder="Select class"
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            options={[
                              { value: "EASY", label: "Easy", icon: BarChart3 },
                              { value: "MEDIUM", label: "Medium", icon: BarChart3 },
                              { value: "HARD", label: "Hard", icon: BarChart3 },
                              { value: "EXPERT", label: "Expert", icon: BarChart3 },
                            ]}
                            placeholder="Select Difficulty"
                            searchable={false}
                            className="w-full"
                          />
                        </div>
                      </div>

                      {/* Tags */}
                      <Input
                        label="Tags"
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
                  onClick={() => {
                    setIsOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleSaveQuestion("DRAFT")}
                    disabled={saving || !formData.categoryId || !formData.questionText || !formData.optionA || !formData.optionB || !formData.optionC || !formData.optionD}
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    {saving ? "Saving..." : "Save Draft"}
                  </Button>
                  <Button
                    onClick={() => handleSaveQuestion("PUBLISHED")}
                    disabled={saving || !formData.categoryId || !formData.questionText || !formData.optionA || !formData.optionB || !formData.optionC || !formData.optionD}
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