"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchableDropdown } from "@/components/ui/dropdown";
import {
  Clock,
  Users,
  GraduationCap,
  Star,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface ExamCategory {
  name: string;
}

interface Exam {
  id: string;
  title: string;
  description: string | null;
  price: number;
  duration: number;
  questionsToServe: number | null;
  isFree: boolean;
  examCategory: ExamCategory | null;
  _count: {
    examQuestions: number;
    examAttempts: number;
  };
}

interface ExamsClientProps {
  initialExams: Exam[];
  examCategories: { id: string; name: string }[];
}



export function ExamsClient({ initialExams, examCategories }: ExamsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");


  // Initialize filters from URL parameters
  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // Create category options for dropdown
  const categoryOptions = useMemo(() => {
    return examCategories.map(cat => ({
      value: cat.id,
      label: cat.name,
      description: `${cat.name} exams`
    }));
  }, [examCategories]);

  // Filter exams
  const filteredAndSortedExams = useMemo(() => {
    let filtered = initialExams;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(exam =>
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.examCategory?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      const categoryName = examCategories.find(cat => cat.id === selectedCategory)?.name;
      if (categoryName) {
        filtered = filtered.filter(exam => 
          exam.examCategory?.name === categoryName
        );
      }
    }

    return filtered;
  }, [initialExams, searchTerm, selectedCategory, examCategories]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "OLYMPIAD":
        return "bg-purple-100 text-purple-800";
      case "JEE":
        return "bg-blue-100 text-blue-800";
      case "NEET":
        return "bg-green-100 text-green-800";
      case "OTHER":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "OLYMPIAD":
        return "🏆";
      case "JEE":
        return "⚙️";
      case "NEET":
        return "🩺";
      case "OTHER":
        return "📚";
      default:
        return "📚";
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    router.push("/exams");
  };

  return (
    <>
      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <Input
                  variant="search"
                  placeholder="Search exams by title, category, or topic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  clearable
                  onClear={() => setSearchTerm("")}
                />
              </div>
              <SearchableDropdown
                options={categoryOptions}
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value as string)}
                placeholder="All Categories"
                clearable
              />
            </div>
            
            {/* Clear Filters Button */}
            {(searchTerm || selectedCategory) && (
              <div className="flex justify-end">
                <Button variant="ghost" onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Exams Grid */}
      {filteredAndSortedExams.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No exams found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find exams.
            </p>
            <Button onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedExams.map((exam) => (
              <Link key={exam.id} href={`/exams/detail/${exam.id}`} className="block">
                <Card
                  className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col h-full"
                >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        getCategoryColor(exam.examCategory?.name || "Unknown")
                      }`}
                    >
                      <span className="mr-1">
                        {getCategoryIcon(exam.examCategory?.name || "Unknown")}
                      </span>
                      {exam.examCategory?.name || "Unknown"}
                    </span>
                    {exam.isFree ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Free
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        {exam.price} Credits
                      </span>
                    )}
                  </div>
                  <CardTitle className="group-hover:text-purple-600 transition-colors">
                    {exam.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {exam.description ||
                      "Comprehensive mock test to assess your knowledge and preparation level."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col h-full pt-0">
                  <div className="grid grid-cols-3 gap-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center justify-center space-x-1 bg-gray-50 rounded-lg p-2">
                      <GraduationCap className="w-4 h-4" />
                      <span className="font-medium">
                        {exam.questionsToServe || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-1 bg-gray-50 rounded-lg p-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{exam.duration}m</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1 bg-gray-50 rounded-lg p-2">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">
                        {exam._count.examAttempts}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600 ml-1 font-medium">
                          4.8
                        </span>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white group-hover:shadow-lg transition-all">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
                </Card>
              </Link>
            ))}
          </div>


        </>
      )}
    </>
  );
}