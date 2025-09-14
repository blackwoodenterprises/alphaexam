"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SearchableDropdown } from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Clock, Users, Plus, Loader2 } from "lucide-react";

interface Exam {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  _count: {
    examQuestions: number;
    examAttempts: number;
  };
  examCategory: {
    name: string;
  } | null;
}

interface BulkAddToExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedQuestionIds: string[];
  onSuccess: () => void;
}

export function BulkAddToExamModal({
  isOpen,
  onClose,
  selectedQuestionIds,
  onSuccess,
}: BulkAddToExamModalProps) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [marksPerQuestion, setMarksPerQuestion] = useState<string>("1");
  const [negativeMarks, setNegativeMarks] = useState<string>("0");
  const [loading, setLoading] = useState(false);
  const [fetchingExams, setFetchingExams] = useState(false);

  // Fetch exams when modal opens
  useEffect(() => {
    const fetchExams = async () => {
      setFetchingExams(true);
      try {
        const response = await fetch("/api/admin/exams");
        if (response.ok) {
          const data = await response.json();
          setExams(data.exams || data);
        }
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      } finally {
        setFetchingExams(false);
      }
    };

    if (isOpen) {
      fetchExams();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!selectedExamId || selectedQuestionIds.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch("/api/admin/exams/bulk-add-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examId: selectedExamId,
          questionIds: selectedQuestionIds,
          marks: parseFloat(marksPerQuestion) || 1,
          negativeMarks: parseFloat(negativeMarks) || 0,
        }),
      });

      if (response.ok) {
        onSuccess();
        handleClose();
      } else {
        const error = await response.json();
        console.error("Failed to add questions to exam:", error);
      }
    } catch (error) {
      console.error("Failed to add questions to exam:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedExamId("");
    setMarksPerQuestion("1");
    setNegativeMarks("0");
    onClose();
  };

  const selectedExam = exams.find((exam) => exam.id === selectedExamId);

  const examOptions = exams.map((exam) => ({
    value: exam.id,
    label: exam.title,
    description: `${exam._count.examQuestions} questions • ${exam.duration} min`,
    icon: GraduationCap,
  }));

  return (
    <Dialog
      isOpen={isOpen}
      className="max-w-2xl max-h-[90vh] overflow-y-auto"
    >
      <div className="bg-white rounded-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <span>Add Questions to Exam</span>
              </div>
            </h2>
            <p className="text-sm text-gray-600">
              Add {selectedQuestionIds.length} selected question
              {selectedQuestionIds.length !== 1 ? "s" : ""} to an exam
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Exam Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Select Exam *
            </label>
            {fetchingExams ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                <span className="ml-2 text-gray-600">Loading exams...</span>
              </div>
            ) : (
              <SearchableDropdown
                options={examOptions}
                value={selectedExamId}
                onChange={(value) => setSelectedExamId(value as string)}
                placeholder="Choose an exam..."
                searchPlaceholder="Search exams..."
                size="default"
              />
            )}
          </div>

          {/* Selected Exam Info */}
          {selectedExam && (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-purple-900">
                  {selectedExam.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-700">
                      {selectedExam._count.examQuestions} questions
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-700">
                      {selectedExam.duration} minutes
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-700">
                      {selectedExam._count.examAttempts} attempts
                    </span>
                  </div>
                </div>
                {selectedExam.examCategory && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      {selectedExam.examCategory.name}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Marks Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marks per Question *
              </label>
              <Input
                type="number"
                value={marksPerQuestion}
                onChange={(e) => setMarksPerQuestion(e.target.value)}
                placeholder="1"
                min="0"
                step="0.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Negative Marks
              </label>
              <Input
                type="number"
                value={negativeMarks}
                onChange={(e) => setNegativeMarks(e.target.value)}
                placeholder="0"
                min="0"
                step="0.25"
              />
            </div>
          </div>

          {/* Summary */}
          <Card className="border-gray-200">
            <CardContent className="pt-4">
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Summary:</strong> Adding {selectedQuestionIds.length}{" "}
                  question{selectedQuestionIds.length !== 1 ? "s" : ""} to the
                  selected exam
                </p>
                <p>
                  Each question will be worth{" "}
                  <strong>
                    {marksPerQuestion || "1"} mark
                    {parseFloat(marksPerQuestion || "1") !== 1 ? "s" : ""}
                  </strong>
                  {parseFloat(negativeMarks || "0") > 0 && (
                    <span>
                      {" "}
                      with{" "}
                      <strong>
                        {negativeMarks} negative mark
                        {parseFloat(negativeMarks) !== 1 ? "s" : ""}
                      </strong>{" "}
                      for wrong answers
                    </span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 px-6 pb-6">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              loading || !selectedExamId || selectedQuestionIds.length === 0
            }
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding Questions...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add to Exam
              </>
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
