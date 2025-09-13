"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dropdown } from "@/components/ui/dropdown";
import { Plus, X, FolderTree, Save } from "lucide-react";

interface CategoryCreateModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultType?: "MAIN" | "SUB";
  parentCategoryId?: string;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

export function CategoryCreateModal({ 
  isOpen: externalIsOpen, 
  onOpenChange, 
  defaultType = "MAIN",
  parentCategoryId 
}: CategoryCreateModalProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: defaultType,
    parentCategory: parentCategoryId || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories for parent category dropdown
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const categoriesData = await response.json();
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          name: "",
          description: "",
          type: defaultType,
          parentCategory: parentCategoryId || "",
        });
        setIsOpen(false);
        // Refresh the page to show new category
        window.location.reload();
      } else {
        console.error("Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDropdownChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: Array.isArray(value) ? value[0] || "" : value,
    }));
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Category
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FolderTree className="w-5 h-5 text-purple-600" />
              <span>Create Category</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Category Name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Mathematics, Physics"
            />

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Brief description of this category..."
            />

            <Dropdown
              label="Category Type"
              required
              value={formData.type}
              onChange={(value) => handleDropdownChange("type", value)}
              options={[
                { value: "MAIN", label: "Main Category" },
                { value: "SUB", label: "Subcategory" },
              ]}
              placeholder="Select category type"
              searchable={false}
            />

            {formData.type === "SUB" && (
              <Dropdown
                label="Parent Category"
                required
                value={formData.parentCategory}
                onChange={(value) => handleDropdownChange("parentCategory", value)}
                options={categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
                placeholder="Select a parent category"
              />
            )}

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Category
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
