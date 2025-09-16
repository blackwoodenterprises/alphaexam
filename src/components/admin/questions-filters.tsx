"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dropdown, SearchableDropdown, DropdownOption } from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, BookOpen, BarChart3, GraduationCap, RefreshCw } from "lucide-react";

interface Category {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
  }[];
  _count: {
    questions: number;
  };
}

interface QuestionsFiltersProps {
  categories: Category[];
  onSearch: (filters: {
    searchTerm: string;
    categoryId: string;
    subcategoryId: string;
    difficulty: string;
    classLevel: string;
  }) => void;
}

export function QuestionsFilters({ categories, onSearch }: QuestionsFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [classLevel, setClassLevel] = useState("");

  // Handle manual refresh/apply filters
  const handleApplyFilters = () => {
    onSearch({
      searchTerm,
      categoryId,
      subcategoryId,
      difficulty,
      classLevel,
    });
  };

  // Convert categories to dropdown options
  const categoryOptions: DropdownOption[] = categories.map((category) => ({
    value: category.id,
    label: category.name,
    description: `${category._count.questions} questions`,
    icon: BookOpen,
  }));

  // Get selected category for subcategory options
  const selectedCategory = categories.find(cat => cat.id === categoryId);

  // Convert subcategories to dropdown options
  const subcategoryOptions: DropdownOption[] = selectedCategory?.subcategories.map((subcategory) => ({
    value: subcategory.id,
    label: subcategory.name,
    icon: BookOpen,
  })) || [];

  // Difficulty options
  const difficultyOptions: DropdownOption[] = [
    {
      value: "EASY",
      label: "Easy",
      description: "Beginner level",
      icon: BarChart3,
    },
    {
      value: "MEDIUM",
      label: "Medium",
      description: "Intermediate level",
      icon: BarChart3,
    },
    {
      value: "HARD",
      label: "Hard",
      description: "Advanced level",
      icon: BarChart3,
    },
    {
      value: "EXPERT",
      label: "Expert",
      description: "Expert level",
      icon: BarChart3,
    },
  ];

  // Class level options
  const classOptions: DropdownOption[] = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Class ${i + 1}`,
    description: `Grade ${i + 1} level`,
    icon: GraduationCap,
  }));





  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="w-5 h-5" />
          <span>Filters & Search</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col space-y-4">
          {/* Search Bar - Full Width */}
          <div className="w-full">
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onSearch({
                  searchTerm: e.target.value,
                  categoryId,
                  subcategoryId,
                  difficulty,
                  classLevel,
                });
              }}
              variant="search"
              size="sm"
              clearable
              onClear={() => {
                setSearchTerm("");
                onSearch({
                  searchTerm: "",
                  categoryId,
                  subcategoryId,
                  difficulty,
                  classLevel,
                });
              }}
            />
          </div>

          {/* Filter Controls - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            <SearchableDropdown
              options={categoryOptions}
              value={categoryId}
              onChange={(value) => {
                const newCategoryId = value as string;
                setCategoryId(newCategoryId);
                setSubcategoryId(""); // Reset subcategory when category changes
                onSearch({
                  searchTerm,
                  categoryId: newCategoryId,
                  subcategoryId: "",
                  difficulty,
                  classLevel,
                });
              }}
              placeholder="All Categories"
              searchPlaceholder="Search categories..."
              clearable
              size="sm"
            />

            <SearchableDropdown
              options={subcategoryOptions}
              value={subcategoryId}
              onChange={(value) => {
                const newSubcategoryId = value as string;
                setSubcategoryId(newSubcategoryId);
                onSearch({
                  searchTerm,
                  categoryId,
                  subcategoryId: newSubcategoryId,
                  difficulty,
                  classLevel,
                });
              }}
              placeholder="All Subcategories"
              searchPlaceholder="Search subcategories..."
              clearable
              disabled={!selectedCategory}
              size="sm"
            />

            <Dropdown
              options={difficultyOptions}
              value={difficulty}
              onChange={(value) => {
                const newDifficulty = value as string;
                setDifficulty(newDifficulty);
                onSearch({
                  searchTerm,
                  categoryId,
                  subcategoryId,
                  difficulty: newDifficulty,
                  classLevel,
                });
              }}
              placeholder="All Difficulties"
              searchable={false}
              clearable
              size="sm"
            />

            <Dropdown
              options={classOptions}
              value={classLevel}
              onChange={(value) => {
                const newClassLevel = value as string;
                setClassLevel(newClassLevel);
                onSearch({
                  searchTerm,
                  categoryId,
                  subcategoryId,
                  difficulty,
                  classLevel: newClassLevel,
                });
              }}
              placeholder="All Classes"
              searchable={false}
              clearable
              size="sm"
            />
            
            {/* Apply Filters Button */}
            <div className="sm:col-span-2 lg:col-span-4 xl:col-span-1">
              <Button
                onClick={handleApplyFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}