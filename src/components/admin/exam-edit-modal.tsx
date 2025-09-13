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

interface ExamCategory {
  id: string;
  name: string;
  description: string | null;
}

interface Exam {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  questionsToServe: number | null;
  price: number;
  isFree: boolean;
  isActive: boolean;
  examCategoryId: string | null;
  examCategory: {
    name: string;
  } | null;
}

interface ExamEditModalProps {
  children: React.ReactNode;
  exam: Exam;
  onExamUpdated?: () => void;
}

export function ExamEditModal({
  children,
  exam,
  onExamUpdated,
}: ExamEditModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [examCategories, setExamCategories] = useState<ExamCategory[]>([]);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: exam.title,
    description: exam.description || "",
    examCategoryId: exam.examCategoryId,
    duration: exam.duration,
    questionsToServe: exam.questionsToServe?.toString() || "",
    price: exam.price,
    isFree: exam.isFree,
    isActive: exam.isActive,
    imageUrl: "",
  });

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
      const response = await fetch(`/api/admin/exams/${exam.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          examCategoryId: formData.examCategoryId,
          duration: formData.duration,
          questionsToServe: formData.questionsToServe
            ? parseInt(formData.questionsToServe)
            : null,
          price: formData.price,
          isFree: formData.isFree,
          isActive: formData.isActive,
        }),
      });

      if (response.ok) {
        setIsOpen(false);
        setStep(1);
        if (onExamUpdated) {
          onExamUpdated();
        }
        router.refresh();
      } else {
        console.error("Failed to update exam");
      }
    } catch (error) {
      console.error("Error updating exam:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      title: exam.title,
      description: exam.description || "",
      examCategoryId: exam.examCategoryId,
      duration: exam.duration,
      questionsToServe: exam.questionsToServe?.toString() || "",
      price: exam.price,
      isFree: exam.isFree,
      isActive: exam.isActive,
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
                <h2 className="text-2xl font-bold text-gray-900">Edit Exam</h2>
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
                    <span
                      className={`ml-2 text-sm font-medium ${
                        step >= stepNum ? "text-purple-600" : "text-gray-500"
                      }`}
                    >
                      {label}
                    </span>
                    {stepNum < 2 && (
                      <div
                        className={`w-8 h-0.5 mx-4 ${
                          step > stepNum ? "bg-purple-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Basic Information */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Update the basic details for your exam
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <Dropdown
                          label="Exam Category"
                          value={formData.examCategoryId || ""}
                          onChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              examCategoryId: (value as string) || null,
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
                          disabled={!formData.title || !formData.examCategoryId}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                          Next: Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Settings */}
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
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="isFree"
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
                        <label
                          htmlFor="isFree"
                          className="text-sm font-medium text-gray-700"
                        >
                          Make this exam free for all students
                        </label>
                      </div>

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
                          step="0.01"
                          placeholder="Enter exam price"
                        />
                      )}

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              isActive: e.target.checked,
                            }))
                          }
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <label
                          htmlFor="isActive"
                          className="text-sm font-medium text-gray-700"
                        >
                          Make this exam active and available to students
                        </label>
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setStep(1)}>
                          Back
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          disabled={loading || !formData.title}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                          {loading ? "Updating..." : "Update Exam"}
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
