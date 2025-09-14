"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dropdown } from "@/components/ui/dropdown";
import { X } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface ExamCategory {
  id: string;
  name: string;
  description: string | null;
}

interface ExamCreateModalProps {
  children: React.ReactNode;
}

export function ExamCreateModal({ children }: ExamCreateModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Settings, 3: About This Exam
  const [loading, setLoading] = useState(false);
  const [examCategories, setExamCategories] = useState<ExamCategory[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    richDescription: "",
    examCategoryId: "",
    duration: 60,
    questionsToServe: "",
    price: 0,
    isFree: true,
    isActive: true,
    imageUrl: "",
  });

  // Fetch exam categories
  const fetchExamCategories = async () => {
    try {
      const response = await fetch("/api/admin/exam-categories");
      if (response.ok) {
        const categories = await response.json();
        setExamCategories(categories);
      }
    } catch (error) {
      console.error("Error fetching exam categories:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchExamCategories();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsOpen(false);
        router.refresh();
        resetForm();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Create exam error:", error);
      alert("Failed to create exam. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      title: "",
      description: "",
      richDescription: "",
      examCategoryId: "",
      duration: 60,
      questionsToServe: "",
      price: 0,
      isFree: true,
      isActive: true,
      imageUrl: "",
    });
  };

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
                  Create New Exam
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsOpen(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                {[
                  { step: 1, label: "Basic Info" },
                  { step: 2, label: "Settings" },
                  { step: 3, label: "About This Exam" },
                ].map(({ step: stepNum, label }) => (
                  <div key={stepNum} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        step >= stepNum
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {stepNum}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {label}
                    </span>
                    {stepNum < 3 && (
                      <div className="w-8 h-px bg-gray-300 ml-4" />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Content */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Enter the basic details for your exam
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <Dropdown
                          label="Exam Category"
                          value={formData.examCategoryId}
                          onChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              examCategoryId: value as string,
                            }))
                          }
                          options={examCategories.map((category) => ({
                            value: category.id,
                            label: category.name,
                          }))}
                          placeholder="Select a category"
                          required
                        />

                        <Input
                          label="Duration (minutes)"
                          type="number"
                          value={formData.duration.toString()}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              duration: parseInt(e.target.value) || 0,
                            }))
                          }
                          min="1"
                          required
                        />

                        <Input
                          label="Questions to Serve"
                          type="number"
                          value={formData.questionsToServe}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              questionsToServe: e.target.value,
                            }))
                          }
                          min="1"
                          placeholder="Number of questions for users"
                          required
                        />
                      </div>

                      <Input
                        label="Exam Title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="e.g., JEE Main Mock Test 2024"
                        required
                      />

                      <Textarea
                        label="Description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Describe what this exam covers..."
                        rows={3}
                      />

                      <div className="flex justify-end">
                        <Button
                          onClick={() => setStep(2)}
                          disabled={!formData.title || !formData.examCategoryId || !formData.questionsToServe}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                          Next: Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Exam Settings</CardTitle>
                    <CardDescription>
                      Configure pricing and availability settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Pricing */}
                      <div>
                        <label className="flex items-center space-x-2 mb-4">
                          <input
                            type="checkbox"
                            checked={formData.isFree}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                isFree: e.target.checked,
                                price: e.target.checked ? 0 : prev.price,
                              }))
                            }
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            This is a free exam
                          </span>
                        </label>

                        {!formData.isFree && (
                          <Input
                            label="Price (Credits)"
                            type="number"
                            value={formData.price.toString()}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                price: parseFloat(e.target.value) || 0,
                              }))
                            }
                            min="0"
                            step="0.1"
                          />
                        )}
                      </div>

                      {/* Status */}
                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                isActive: e.target.checked,
                              }))
                            }
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Make this exam active and available to students
                          </span>
                        </label>
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setStep(1)}>
                          Back
                        </Button>
                        <Button
                          onClick={() => setStep(3)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                          Next: About This Exam
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>About This Exam</CardTitle>
                    <CardDescription>
                      Provide a detailed description of what this exam covers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rich Description
                        </label>
                        <RichTextEditor
                          content={formData.richDescription}
                          onChange={(content) =>
                            setFormData((prev) => ({
                              ...prev,
                              richDescription: content,
                            }))
                          }
                          placeholder="Provide a detailed description of this exam, including topics covered, difficulty level, and any special instructions..."
                          className="min-h-[300px]"
                        />
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setStep(2)}>
                          Back
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          disabled={loading || !formData.title || !formData.questionsToServe}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                          {loading ? "Creating..." : "Create Exam"}
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
