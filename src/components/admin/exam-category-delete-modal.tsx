"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Trash2, AlertTriangle } from "lucide-react";

interface ExamCategory {
  id: string;
  name: string;
  description: string | null;
  _count: {
    exams: number;
  };
}

interface ExamCategoryDeleteModalProps {
  category: ExamCategory;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ExamCategoryDeleteModal({ category, onClose, onSuccess }: ExamCategoryDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/exam-categories?id=${category.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        onClose();
        // Call success callback to refresh data
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to delete exam category:", errorData.error);
        alert(errorData.error || "Failed to delete exam category");
      }
    } catch (error) {
      console.error("Error deleting exam category:", error);
      alert("Error deleting exam category");
    } finally {
      setIsDeleting(false);
    }
  };

  const hasExams = category._count.exams > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>Delete Exam Category</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-red-900 mb-1">
                    Are you sure you want to delete this exam category?
                  </h3>
                  <p className="text-sm text-red-700">
                    You are about to delete the exam category <strong>&ldquo;{category.name}&rdquo;</strong>.
                    {hasExams ? (
                      <span className="block mt-2 font-medium">
                        ⚠️ This category has {category._count.exams} exam(s) associated with it and cannot be deleted.
                      </span>
                    ) : (
                      <span className="block mt-2">
                        This action cannot be undone.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {category.description && (
              <div>
                <p className="text-sm text-gray-600">
                  <strong>Description:</strong> {category.description}
                </p>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || hasExams}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    {hasExams ? "Cannot Delete" : "Delete Category"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}