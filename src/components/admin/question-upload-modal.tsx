"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Upload,
  FileImage,
  Brain,
  CheckCircle,
  AlertCircle,
  Loader2,
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
}

interface ProcessingResponse {
  message: string;
  success: boolean;
  original_image_url: string;
  processed_images: {
    figures: Array<{
      bbox: number[];
      confidence: number;
      url: string;
    }>;
    processed_image: string;
  };
  transcription: {
    figures_detected: number;
    processing_status: string;
    transcription: {
      confidence: number;
      figures: Array<{
        description: string;
        id: string;
      }>;
      options: {
        A: string;
        B: string;
        C: string;
        D: string;
      };
      question_text: string;
    };
  };
}

export function QuestionUploadModal({
  categories,
  children,
}: QuestionUploadModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload, 2: Processing, 3: Review, 4: Finalize
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
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
      // Call the question processing API
      const response = await fetch(
        process.env.NEXT_PUBLIC_QUESTION_API_URL ||
          "https://questionbankapi.onrender.com/inference",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image_url: imageUrl,
          }),
        }
      );

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

  const handleSaveQuestion = async () => {
    if (!processedData || !imageUrl) return;

    try {
      const questionData = {
        imageUrl,
        questionText: processedData.transcription.transcription.question_text,
        optionA: processedData.transcription.transcription.options.A,
        optionB: processedData.transcription.transcription.options.B,
        optionC: processedData.transcription.transcription.options.C,
        optionD: processedData.transcription.transcription.options.D,
        correctAnswer: formData.correctAnswer,
        explanation: formData.explanation,
        adminNotes: formData.adminNotes,
        class: formData.class,
        difficultyLevel: formData.difficultyLevel,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        apiResponse: processedData,
        figures: processedData.processed_images.figures,
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
      router.refresh();
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                      <label htmlFor="image-upload">
                        <Button
                          type="button"
                          disabled={uploading}
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
                      </label>
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
                    <CardHeader>
                      <CardTitle>Review Processed Question</CardTitle>
                      <CardDescription>
                        Review the AI-extracted content and make any necessary
                        corrections.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Original Image */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Original Image
                          </h4>
                          <img
                            src={imageUrl}
                            alt="Question"
                            className="w-full border rounded-lg"
                          />
                        </div>

                        {/* Extracted Content */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Extracted Content
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Question Text
                              </label>
                              <div className="p-3 bg-gray-50 rounded border text-sm">
                                {
                                  processedData.transcription.transcription
                                    .question_text
                                }
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              {Object.entries(
                                processedData.transcription.transcription
                                  .options
                              ).map(([key, value]) => (
                                <div key={key}>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Option {key}
                                  </label>
                                  <div className="p-2 bg-gray-50 rounded border text-sm">
                                    {value}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4 mt-6">
                        <Button variant="outline" onClick={() => setStep(1)}>
                          Upload Different Image
                        </Button>
                        <Button
                          onClick={() => setStep(4)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                          Looks Good - Continue
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                          </label>
                          <select
                            value={formData.categoryId}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                categoryId: e.target.value,
                                subcategoryId: "",
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                            required
                          >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subcategory
                          </label>
                          <select
                            value={formData.subcategoryId}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                subcategoryId: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                            disabled={!selectedCategory}
                          >
                            <option value="">Select Subcategory</option>
                            {selectedCategory?.subcategories.map((subcat) => (
                              <option key={subcat.id} value={subcat.id}>
                                {subcat.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Class *
                            </label>
                            <select
                              value={formData.class}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  class: parseInt(e.target.value),
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                              required
                            >
                              {Array.from({ length: 12 }, (_, i) => i + 1).map(
                                (cls) => (
                                  <option key={cls} value={cls}>
                                    Class {cls}
                                  </option>
                                )
                              )}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Difficulty *
                            </label>
                            <select
                              value={formData.difficultyLevel}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  difficultyLevel: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                              required
                            >
                              <option value="EASY">Easy</option>
                              <option value="MEDIUM">Medium</option>
                              <option value="HARD">Hard</option>
                              <option value="EXPERT">Expert</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Correct Answer *
                          </label>
                          <select
                            value={formData.correctAnswer}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                correctAnswer: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                            required
                          >
                            <option value="A">Option A</option>
                            <option value="B">Option B</option>
                            <option value="C">Option C</option>
                            <option value="D">Option D</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tags (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                tags: e.target.value,
                              }))
                            }
                            placeholder="algebra, quadratic, factoring"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Explanation
                          </label>
                          <textarea
                            value={formData.explanation}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                explanation: e.target.value,
                              }))
                            }
                            placeholder="Detailed explanation of the solution..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Admin Notes
                          </label>
                          <textarea
                            value={formData.adminNotes}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                adminNotes: e.target.value,
                              }))
                            }
                            placeholder="Internal notes for admins..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                      <Button variant="outline" onClick={() => setStep(3)}>
                        Back to Review
                      </Button>
                      <Button
                        onClick={handleSaveQuestion}
                        disabled={!formData.categoryId}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      >
                        Save Question
                      </Button>
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
