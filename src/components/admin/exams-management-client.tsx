"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dropdown } from "@/components/ui/dropdown";
import {
  Plus,
  Search,
  GraduationCap,
  Clock,
  Users,
  DollarSign,
  Edit,
  Trash2,
  FileQuestion,
} from "lucide-react";
import { ExamCreateModal } from "@/components/admin/exam-create-modal";
import { ExamEditModal } from "@/components/admin/exam-edit-modal";
import { ExamDeleteModal } from "@/components/admin/exam-delete-modal";

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
  createdAt: Date;
  examCategory: {
    name: string;
  } | null;
  createdBy: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  _count: {
    examQuestions: number;
    examAttempts: number;
  };
}

interface ExamStats {
  totalExams: number;
  activeExams: number;
  totalAttempts: number;
  totalRevenue: number;
  avgDuration: number;
  monthlyGrowth: number;
}

interface ExamCategory {
  id: string;
  name: string;
}

interface ExamsManagementClientProps {
  exams: Exam[];
  stats: ExamStats;
}

function getCategoryColor(categoryName: string | null) {
  if (!categoryName) return "bg-gray-100 text-gray-800";

  switch (categoryName.toUpperCase()) {
    case "OLYMPIAD":
      return "bg-purple-100 text-purple-800";
    case "JEE":
      return "bg-blue-100 text-blue-800";
    case "NEET":
      return "bg-green-100 text-green-800";
    default:
      return "bg-orange-100 text-orange-800";
  }
}

export function ExamsManagementClient({
  exams,
  stats,
}: ExamsManagementClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [filteredExams, setFilteredExams] = useState(exams);
  const [examCategories, setExamCategories] = useState<ExamCategory[]>([]);

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

  // Fetch categories on component mount
  useEffect(() => {
    fetchExamCategories();
  }, []);

  // Filter exams based on search term and filters
  const filterExams = useCallback(() => {
    let filtered = exams;

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (exam) =>
          exam.title.toLowerCase().includes(searchLower) ||
          exam.description?.toLowerCase().includes(searchLower) ||
          exam.examCategory?.name.toLowerCase().includes(searchLower) ||
          `${exam.createdBy.firstName} ${exam.createdBy.lastName}`
            .toLowerCase()
            .includes(searchLower)
      );
    }

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter(
        (exam) => exam.examCategoryId === categoryFilter
      );
    }

    // Filter by status
    if (statusFilter) {
      const isActive = statusFilter === "active";
      filtered = filtered.filter((exam) => exam.isActive === isActive);
    }

    // Filter by price type
    if (priceFilter) {
      if (priceFilter === "free") {
        filtered = filtered.filter((exam) => exam.isFree);
      } else if (priceFilter === "paid") {
        filtered = filtered.filter((exam) => !exam.isFree);
      }
    }

    setFilteredExams(filtered);
  }, [exams, searchTerm, categoryFilter, statusFilter, priceFilter]);

  // Update filtered exams when filters change
  useEffect(() => {
    filterExams();
  }, [
    searchTerm,
    categoryFilter,
    statusFilter,
    priceFilter,
    exams,
    filterExams,
  ]);

  const handleExamUpdated = () => {
    // Refresh the page to show updated data
    window.location.reload();
  };

  const handleExamDeleted = () => {
    // Refresh the page to show updated data
    window.location.reload();
  };

  const statsCards = [
    {
      title: "Total Exams",
      value: stats.totalExams.toString(),
      change: `${stats.activeExams} active`,
      changeType: "neutral" as const,
      icon: GraduationCap,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Attempts",
      value: stats.totalAttempts.toLocaleString(),
      change: `${stats.monthlyGrowth >= 0 ? "+" : ""}${
        stats.monthlyGrowth
      }% this month`,
      changeType:
        stats.monthlyGrowth >= 0
          ? ("positive" as const)
          : ("negative" as const),
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Avg Duration",
      value: `${stats.avgDuration}m`,
      change: "Average completion time",
      changeType: "neutral" as const,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exam Management</h1>
          <p className="text-gray-600 mt-1">
            Create and manage mock tests for students
          </p>
        </div>
        <ExamCreateModal>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Exam
          </Button>
        </ExamCreateModal>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <p
                className={`text-xs ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search exams by title, category, creator..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Dropdown
              placeholder="All Categories"
              options={[
                { value: "", label: "All Categories" },
                ...examCategories.map((category) => ({
                  value: category.id,
                  label: category.name,
                })),
              ]}
              value={categoryFilter}
              onChange={(value: string | string[]) =>
                setCategoryFilter(Array.isArray(value) ? value[0] || "" : value)
              }
            />
            <Dropdown
              placeholder="All Status"
              options={[
                { value: "", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              value={statusFilter}
              onChange={(value: string | string[]) =>
                setStatusFilter(Array.isArray(value) ? value[0] || "" : value)
              }
            />
            <Dropdown
              placeholder="All Prices"
              options={[
                { value: "", label: "All Prices" },
                { value: "free", label: "Free" },
                { value: "paid", label: "Paid" },
              ]}
              value={priceFilter}
              onChange={(value: string | string[]) =>
                setPriceFilter(Array.isArray(value) ? value[0] || "" : value)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Exams List */}
      <Card>
        <CardHeader>
          <CardTitle>All Exams ({filteredExams.length})</CardTitle>
          <CardDescription>
            Manage your mock tests and practice exams
            {filteredExams.length !== exams.length && (
              <span className="text-sm text-gray-500 ml-2">
                (filtered from {exams.length} total)
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {filteredExams.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              {exams.length === 0 ? (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No exams created yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start by creating your first mock test for students
                  </p>
                  <ExamCreateModal>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Exam
                    </Button>
                  </ExamCreateModal>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No exams match your filters
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search terms or filters to find exams
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter("");
                      setStatusFilter("");
                      setPriceFilter("");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredExams.map((exam) => (
                <Card key={exam.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {/* Header Section */}
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-1 break-words">
                            {exam.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Created by {exam.createdBy.firstName} {exam.createdBy.lastName}
                          </p>
                        </div>
                        
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                              exam.examCategory?.name || null
                            )}`}
                          >
                            {exam.examCategory?.name || "No Category"}
                          </span>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              exam.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {exam.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      
                      {/* Stats Section */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileQuestion className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-600 flex-shrink-0">Questions:</span>
                          <span className="font-medium text-gray-900 truncate">
                            {exam._count.examQuestions}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-600 flex-shrink-0">Duration:</span>
                          <span className="font-medium text-gray-900 truncate">
                            {exam.duration} min
                          </span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-600 flex-shrink-0">Attempts:</span>
                          <span className="font-medium text-gray-900 truncate">
                            {exam._count.examAttempts}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-600 flex-shrink-0">Price:</span>
                          {exam.isFree ? (
                            <span className="font-medium text-green-600 truncate">Free</span>
                          ) : (
                            <span className="font-medium text-gray-900 truncate">₹{exam.price}</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions Section */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-3 border-t border-gray-100">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs px-3 py-2 flex-1 sm:flex-none"
                          onClick={() =>
                            (window.location.href = `/admin/exams/${exam.id}/questions`)
                          }
                        >
                          <FileQuestion className="w-3 h-3 mr-1" />
                          Manage Questions
                        </Button>
                        <div className="flex gap-2">
                          <ExamEditModal
                            exam={exam}
                            onExamUpdated={handleExamUpdated}
                          >
                            <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </ExamEditModal>
                          <ExamDeleteModal
                            exam={exam}
                            onExamDeleted={handleExamDeleted}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 flex-1 sm:flex-none"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </ExamDeleteModal>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
