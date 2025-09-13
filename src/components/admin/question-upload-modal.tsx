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
import { MathJax } from "@/components/ui/mathjax";
import { Dropdown, SearchableDropdown } from "@/components/ui/dropdown";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Upload,
  FileImage,
  Brain,
  CheckCircle,
  AlertCircle,
  Loader2,
  BookOpen,
  BarChart3,
  GraduationCap,
  FileCheck,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
  }[];
}

interface QuestionUploadModalProps {
  categories: Category[];
  children: React.ReactNode;
  onQuestionCreated?: () => void;
}

interface ProcessingResponse {
  success: boolean;
  originalImageUrl: string;
  processedImageUrl: string;
  figures: Array<{
    bbox: number[];
    confidence: number;
    url: string;
  }>;
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  figuresDetected: number;
  confidence: number;
  figureDescriptions: Array<{
    description: string;
    id: string;
  }>;
  rawApiResponse: Record<string, unknown>;
}

export function QuestionUploadModal({
  categories,
  children,
  onQuestionCreated,
}: QuestionUploadModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload, 2: Processing, 3: Review, 4: Finalize
  const [uploading, setUploading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [processing, setProcessing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [processedData, setProcessedData] = useState<ProcessingResponse | null>(
    null
  );
  const [formData, setFormData] = useState({
    categoryId: "",
    subcategoryId: "",
    class: 10,
    difficultyLevel: "MEDIUM",
    correctAnswer: "A",
    status: "DRAFT",
    tags: "",
    explanation: "",
    adminNotes: "",
  });

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      // Upload to Vercel Blob Storage
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const { url } = await uploadResponse.json();
      setImageUrl(url);
      setStep(2);

      // Start AI processing
      await processImage(url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const processImage = async (imageUrl: string) => {
    setProcessing(true);
    try {
      // Call our internal processing API
      const response = await fetch("/api/admin/process-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process image");
      }

      const data = await response.json();
      setProcessedData(data);
      setStep(3);
    } catch (error) {
      console.error("Processing error:", error);
      alert("Failed to process image with AI. Please try again.");
      setStep(1);
    } finally {
      setProcessing(false);
    }
  };

  const handleSaveQuestion = async (status?: string) => {
    if (!processedData || !imageUrl) return;

    const finalStatus = status || formData.status;

    try {
      const questionData = {
        imageUrl,
        questionText: processedData?.questionText || 'No question text available',
        optionA: processedData?.options?.A || '',
        optionB: processedData?.options?.B || '',
        optionC: processedData?.options?.C || '',
        optionD: processedData?.options?.D || '',
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
        apiResponse: processedData,
        figures: processedData?.figures || [],
        categoryId: formData.categoryId,
        subcategoryId: formData.subcategoryId || null,
      };

      const response = await fetch("/api/admin/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        throw new Error("Failed to save question");
      }

      // Success - close modal and refresh
      setIsOpen(false);
      if (onQuestionCreated) {
        onQuestionCreated();
      } else {
        router.refresh();
      }
      resetModal();
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save question. Please try again.");
    }
  };

  const resetModal = () => {
    setStep(1);
    setImageFile(null);
    setImageUrl("");
    setProcessedData(null);
    setFormData({
      categoryId: "",
      subcategoryId: "",
      class: 10,
      difficultyLevel: "MEDIUM",
      correctAnswer: "A",
      status: "DRAFT",
      tags: "",
      explanation: "",
      adminNotes: "",
    });
  };

  const selectedCategory = categories.find(
    (cat) => cat.id === formData.categoryId
  );

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Upload Question
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsOpen(false);
                    resetModal();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </Button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                {[
                  { step: 1, label: "Upload", icon: Upload },
                  { step: 2, label: "Processing", icon: Brain },
                  { step: 3, label: "Review", icon: CheckCircle },
                  { step: 4, label: "Finalize", icon: AlertCircle },
                ].map(({ step: stepNum, label, icon: Icon }) => (
                  <div key={stepNum} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        step >= stepNum
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step > stepNum ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {label}
                    </span>
                    {stepNum < 4 && (
                      <div className="w-8 h-px bg-gray-300 ml-4" />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Content */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Question Image</CardTitle>
                    <CardDescription>
                      Upload an image of the question. Our AI will process it
                      and extract the text and options.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Choose an image file
                      </h3>
                      <p className="text-gray-600 mb-4">
                        PNG, JPG, or WebP. Max file size 10MB.
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImageFile(file);
                            handleImageUpload(file);
                          }
                        }}
                        className="hidden"
                        id="image-upload"
                        disabled={uploading}
                      />
                      <Button
                        type="button"
                        disabled={uploading}
                        onClick={() => document.getElementById('image-upload')?.click()}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white cursor-pointer"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Image
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>AI Processing</CardTitle>
                    <CardDescription>
                      Our AI is analyzing the image and extracting the question
                      text and options.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Loader2 className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Processing your question...
                      </h3>
                      <p className="text-gray-600">
                        This may take a few seconds. Please wait.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 3 && processedData && (
                <div className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {/* Original Image at Top */}
                        <div className="bg-white p-3 rounded border">
                          <Image
                            src={imageUrl}
                            alt="Question"
                            width={800}
                            height={600}
                            className="w-full max-w-2xl mx-auto h-auto rounded border"
                          />
                        </div>

                        {/* Question Text */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="bg-white p-3 rounded border">
                            <MathJax className="text-gray-900 leading-relaxed">
                              {processedData?.questionText || 'No question text available'}
                            </MathJax>
                          </div>
                        </div>

                        {/* Options and Figures in Two Columns */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Options on Left */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <h5 className="text-sm font-semibold text-green-900 mb-2">Answer Options (Select Correct Answer)</h5>
                            <div className="space-y-2">
                              {Object.entries(processedData?.options || {}).map(([key, value]) => (
                                <label key={key} className={`flex items-start space-x-3 p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                                  formData.correctAnswer === key ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
                                }`}>
                                  <input
                                    type="radio"
                                    name="correctAnswer"
                                    value={key}
                                    checked={formData.correctAnswer === key}
                                    onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: e.target.value }))}
                                    className="mt-1 text-green-600"
                                  />
                                  <div className="flex items-start flex-1">
                                    <span className="font-semibold text-green-700 mr-2 flex-shrink-0">{key}.</span>
                                    <MathJax className="flex-1">{String(value)}</MathJax>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Figures on Right */}
                          {processedData?.figures && processedData.figures.length > 0 && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                              <h5 className="text-sm font-semibold text-gray-900 mb-2">Figures Detected</h5>
                              <div className="space-y-3">
                                {processedData.figures.map((figure, index: number) => (
                                  <div key={index} className="bg-white border rounded p-3">
                                    <Image 
                                      src={figure.url} 
                                      alt={`Figure ${index + 1}`}
                                      width={300}
                                      height={200}
                                      className="w-full h-auto rounded mb-2"
                                    />

                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>


                      </div>

                      <div className="flex justify-end space-x-4 mt-6">
                        <Button variant="outline" onClick={() => setStep(1)}>
                          Upload Different Image
                        </Button>
                        <Button
                          onClick={() => setStep(4)}
                          disabled={!formData.correctAnswer}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {formData.correctAnswer ? 'Looks Good - Continue' : 'Select Correct Answer First'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {step === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Finalize Question</CardTitle>
                    <CardDescription>
                      Add metadata and save the question to your database.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                            Category *
                          </label>
                          <SearchableDropdown
                              options={categories.map((cat) => ({
                                value: cat.id,
                                label: cat.name,
                                icon: BookOpen,
                              }))}
                              value={formData.categoryId}
                              onChange={(value) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  categoryId: value as string,
                                  subcategoryId: "",
                                }))
                              }
                              placeholder="Select Category"
                              searchPlaceholder="Search categories..."
                              className="w-full"
                            />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                            Subcategory
                          </label>
                          <SearchableDropdown
                             options={selectedCategory?.subcategories.map((subcat) => ({
                               value: subcat.id,
                               label: subcat.name,
                               icon: FileCheck,
                             })) || []}
                             value={formData.subcategoryId}
                             onChange={(value) =>
                               setFormData((prev) => ({
                                 ...prev,
                                 subcategoryId: value as string,
                               }))
                             }
                             placeholder="Select Subcategory"
                             searchPlaceholder="Search subcategories..."
                             disabled={!selectedCategory}
                             className="w-full"
                           />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                              Class *
                            </label>
                            <SearchableDropdown
                               options={Array.from({ length: 12 }, (_, i) => i + 1).map(
                                 (cls) => ({
                                   value: cls.toString(),
                                   label: `Class ${cls}`,
                                   icon: GraduationCap,
                                 })
                               )}
                               value={formData.class.toString()}
                               onChange={(value) =>
                                 setFormData((prev) => ({
                                   ...prev,
                                   class: parseInt(value as string),
                                 }))
                               }
                               placeholder="Select Class"
                               searchPlaceholder="Search classes..."
                               className="w-full"
                             />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                              Difficulty *
                            </label>
                            <Dropdown
                               options={[
                                 { value: "EASY", label: "Easy", icon: BarChart3 },
                                 { value: "MEDIUM", label: "Medium", icon: BarChart3 },
                                 { value: "HARD", label: "Hard", icon: BarChart3 },
                                 { value: "EXPERT", label: "Expert", icon: BarChart3 },
                               ]}
                               value={formData.difficultyLevel}
                               onChange={(value) =>
                                 setFormData((prev) => ({
                                   ...prev,
                                   difficultyLevel: value as string,
                                 }))
                               }
                               placeholder="Select Difficulty"
                               searchable={false}
                               className="w-full"
                             />
                          </div>
                        </div>




                      </div>

                      <div className="space-y-4">
                        <div>
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
                        </div>

                        <Textarea
                          label="Explanation"
                          value={formData.explanation}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              explanation: e.target.value,
                            }))
                          }
                          placeholder="Detailed explanation of the solution..."
                          rows={3}
                        />

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
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                      <Button variant="outline" onClick={() => setStep(3)}>
                        Back to Review
                      </Button>
                      <div className="flex space-x-3">
                        <Button
                          onClick={() => handleSaveQuestion('DRAFT')}
                          disabled={!formData.categoryId}
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Save as Draft
                        </Button>
                        <Button
                          onClick={() => handleSaveQuestion('PUBLISHED')}
                          disabled={!formData.categoryId}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                        >
                          Save & Publish
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
