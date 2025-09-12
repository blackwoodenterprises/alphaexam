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
import { X, GraduationCap, Plus, Search } from "lucide-react";

interface ExamCreateModalProps {
  children: React.ReactNode;
}

export function ExamCreateModal({ children }: ExamCreateModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Add Questions, 3: Settings
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "OLYMPIAD",
    duration: 60,
    price: 0,
    isFree: true,
    isActive: true,
    imageUrl: "",
  });

  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          questionIds: selectedQuestions,
        }),
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
      category: "OLYMPIAD",
      duration: 60,
      price: 0,
      isFree: true,
      isActive: true,
      imageUrl: "",
    });
    setSelectedQuestions([]);
  };

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
                  { step: 2, label: "Add Questions" },
                  { step: 3, label: "Settings" },
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Exam Title *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          placeholder="e.g., JEE Main Mock Test 2024"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Describe what this exam covers..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                category: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                            required
                          >
                            <option value="OLYMPIAD">
                              Mathematical Olympiad
                            </option>
                            <option value="JEE">JEE Main/Advanced</option>
                            <option value="NEET">NEET</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration (minutes) *
                          </label>
                          <input
                            type="number"
                            value={formData.duration}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                duration: parseInt(e.target.value),
                              }))
                            }
                            min="1"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          onClick={() => setStep(2)}
                          disabled={!formData.title || !formData.category}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                          Next: Add Questions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Add Questions</CardTitle>
                    <CardDescription>
                      Select questions for this exam from your question bank
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Search and Filters */}
                      <div className="flex gap-4">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            placeholder="Search questions..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500">
                          <option value="">All Categories</option>
                          <option value="algebra">Algebra</option>
                          <option value="geometry">Geometry</option>
                          <option value="calculus">Calculus</option>
                        </select>
                      </div>

                      {/* Selected Questions Count */}
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-2">
                          Selected Questions: {selectedQuestions.length}
                        </h4>
                        <p className="text-sm text-purple-700">
                          Add questions to build your exam. Each question can
                          have different marks and negative marking.
                        </p>
                      </div>

                      {/* Placeholder for question selection */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Question Selection Coming Soon
                        </h3>
                        <p className="text-gray-600">
                          This will show your question bank with checkboxes to
                          select questions for the exam.
                        </p>
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setStep(1)}>
                          Back
                        </Button>
                        <Button
                          onClick={() => setStep(3)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                          Next: Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
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
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Price (Credits)
                            </label>
                            <input
                              type="number"
                              value={formData.price}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  price: parseFloat(e.target.value),
                                }))
                              }
                              min="0"
                              step="0.1"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
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
                        <Button variant="outline" onClick={() => setStep(2)}>
                          Back
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          disabled={loading || !formData.title}
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
