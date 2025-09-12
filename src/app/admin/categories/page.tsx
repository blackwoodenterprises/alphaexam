import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminHeader } from "@/components/admin/admin-header";
import { requireAdminAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  BookOpen,
  Tag,
  MoreHorizontal,
  BarChart3,
} from "lucide-react";
import { CategoryCreateModal } from "@/components/admin/category-create-modal";

async function getCategoriesData() {
  try {
    const [categories, subcategories, questionsCount] = await Promise.all([
      prisma.category.findMany({
        include: {
          subcategories: {
            include: {
              _count: {
                select: {
                  questions: true,
                },
              },
            },
          },
          _count: {
            select: {
              questions: true,
              subcategories: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.subcategory.count(),
      prisma.question.count(),
    ]);

    return { categories, subcategories, questionsCount };
  } catch (error) {
    console.error("Error fetching categories data:", error);
    return { categories: [], subcategories: 0, questionsCount: 0 };
  }
}

export default async function CategoriesPage() {
  await requireAdminAuth();
  const { categories, subcategories, questionsCount } =
    await getCategoriesData();

  const stats = [
    {
      title: "Total Categories",
      value: categories.length,
      icon: FolderTree,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Subcategories",
      value: subcategories,
      icon: Tag,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Questions Organized",
      value: questionsCount,
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Avg Questions/Category",
      value:
        categories.length > 0
          ? Math.round(questionsCount / categories.length)
          : 0,
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Categories Management"
        description="Organize subjects and topics for better question categorization"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>
        </div>
        <CategoryCreateModal />
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <FolderTree className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No categories yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start organizing your questions by creating categories and
                subcategories.
              </p>
              <CategoryCreateModal />
            </CardContent>
          </Card>
        ) : (
          categories.map((category) => (
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
                        {category.description || "No description provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {category._count.questions} questions
                    </Badge>
                    <Badge variant="outline">
                      {category._count.subcategories} subcategories
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Subcategories */}
                {category.subcategories.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Subcategories:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {category.subcategories.map((subcategory) => (
                        <div
                          key={subcategory.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <Tag className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">
                              {subcategory.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {subcategory._count.questions}
                            </Badge>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm" className="p-1">
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 text-purple-600 border-purple-200 hover:bg-purple-50"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Subcategory
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Tag className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-3">
                      No subcategories yet
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Subcategory
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
