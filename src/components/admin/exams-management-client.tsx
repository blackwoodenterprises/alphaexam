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
  }, [searchTerm, categoryFilter, statusFilter, priceFilter, exams, filterExams]);

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
      change: `${stats.monthlyGrowth >= 0 ? '+' : ''}${stats.monthlyGrowth}% this month`,
      changeType: stats.monthlyGrowth >= 0 ? "positive" as const : "negative" as const,
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
    {
      title: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      change: "From completed transactions",
      changeType: "neutral" as const,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Exam Details
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Questions
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Duration
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Credits
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Attempts
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExams.map((exam) => (
                    <tr
                      key={exam.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {exam.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            Created by {exam.createdBy.firstName}{" "}
                            {exam.createdBy.lastName}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                            exam.examCategory?.name || null
                          )}`}
                        >
                          {exam.examCategory?.name || "No Category"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-900">
                            {exam._count.examQuestions}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs px-2 py-1 h-6"
                            onClick={() =>
                              (window.location.href = `/admin/exams/${exam.id}/questions`)
                            }
                          >
                            <FileQuestion className="w-3 h-3 mr-1" />
                            Manage
                          </Button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-900">
                        {exam.duration} min
                      </td>
                      <td className="py-4 px-4">
                        {exam.isFree ? (
                          <span className="text-green-600 font-medium">
                            Free
                          </span>
                        ) : (
                          <span className="text-gray-900">{exam.price}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-900">
                        {exam._count.examAttempts}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            exam.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {exam.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <ExamEditModal
                            exam={exam}
                            onExamUpdated={handleExamUpdated}
                          >
                            <Button size="sm" variant="outline">
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
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </ExamDeleteModal>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
