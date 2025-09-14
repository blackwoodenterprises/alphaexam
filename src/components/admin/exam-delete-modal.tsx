"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle } from "lucide-react";

interface Exam {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  questionsToServe: number;
  price: number;
  isFree: boolean;
  isActive: boolean;
  examCategoryId: string | null;
  examCategory: {
    name: string;
  } | null;
}

interface ExamDeleteModalProps {
  children: React.ReactNode;
  exam: Exam;
  onExamDeleted?: () => void;
}

export function ExamDeleteModal({
  children,
  exam,
  onExamDeleted,
}: ExamDeleteModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/exams/${exam.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIsOpen(false);
        if (onExamDeleted) {
          onExamDeleted();
        }
        router.refresh();
      } else {
        console.error("Failed to delete exam");
      }
    } catch (error) {
      console.error("Error deleting exam:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Delete Exam
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete this exam? This action cannot
                  be undone.
                </p>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {exam.title}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Category: {exam.examCategory?.name || "N/A"}</p>
                    <p>Duration: {exam.duration} minutes</p>
                    <p>Price: {exam.isFree ? "Free" : `${exam.price}`}</p>
                    <p>Status: {exam.isActive ? "Active" : "Inactive"}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {loading ? "Deleting..." : "Delete Exam"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
