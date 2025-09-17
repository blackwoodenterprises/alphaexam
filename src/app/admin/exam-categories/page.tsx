"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { truncateText } from "@/lib/utils";

import { PageLoading } from "@/components/ui/spinner";
import {
  FolderTree,
  Edit,
  Trash2,
  Search,
  Filter,
  BookOpen,
  MoreHorizontal,
  BarChart3,
  GraduationCap,
} from "lucide-react";
import { ExamCategoryCreateModal } from "@/components/admin/exam-category-create-modal";
import { ExamCategoryEditModal } from "@/components/admin/exam-category-edit-modal";
import { ExamCategoryDeleteModal } from "@/components/admin/exam-category-delete-modal";

interface ExamCategory {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    exams: number;
  };
}

export default function ExamCategoriesPage() {
  const [examCategories, setExamCategories] = useState<ExamCategory[]>([]);
  const [totalExams, setTotalExams] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<ExamCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ExamCategory | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/exam-categories');
      if (response.ok) {
        const categories = await response.json();
        setExamCategories(categories);
        // Calculate total exams from categories
        const total = categories.reduce((sum: number, cat: ExamCategory) => sum + cat._count.exams, 0);
        setTotalExams(total);
      }
    } catch (error) {
      console.error('Error fetching exam categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClose = () => {
    setEditingCategory(null);
    fetchData(); // Refresh data
  };

  const handleDeleteClose = () => {
    setDeletingCategory(null);
    fetchData(); // Refresh data
  };

  const stats = [
    {
      title: "Total Exam Categories",
      value: examCategories.length,
      icon: FolderTree,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Exams",
      value: totalExams,
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Exams Organized",
      value: examCategories.reduce((sum: number, cat: ExamCategory) => sum + cat._count.exams, 0),
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Avg Exams/Category",
      value:
        examCategories.length > 0
          ? Math.round(
              examCategories.reduce((sum: number, cat: ExamCategory) => sum + cat._count.exams, 0) /
                examCategories.length
            )
          : 0,
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <PageLoading text="Loading exam categories..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Categories</h1>
          <p className="text-gray-600 mt-1">
            Organize your exams by creating and managing exam categories.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search exam categories..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>
        </div>
        <ExamCategoryCreateModal onSuccess={fetchData} />
      </div>

      {/* Exam Categories List */}
      <div className="space-y-4">
        {examCategories.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <FolderTree className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No exam categories yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start organizing your exams by creating exam categories.
              </p>
              <ExamCategoryCreateModal onSuccess={fetchData} />
            </CardContent>
          </Card>
        ) : (
          examCategories.map((category) => (
            <Card
              key={category.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <FolderTree className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {truncateText(category.description, 10) || "No description provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {category._count.exams} exams
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {category._count.exams} exams in this category
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2"
                      onClick={() => setEditingCategory(category)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 text-red-600 hover:text-red-700"
                      onClick={() => setDeletingCategory(category)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modals */}
      {editingCategory && (
        <ExamCategoryEditModal
          category={editingCategory}
          onClose={handleEditClose}
          onSuccess={fetchData}
        />
      )}
      
      {deletingCategory && (
        <ExamCategoryDeleteModal
          category={deletingCategory}
          onClose={handleDeleteClose}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}