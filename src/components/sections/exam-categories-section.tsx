"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Users,
  Clock,
  Loader2,
} from "lucide-react";

interface ExamCategory {
  id: string;
  name: string;
  description: string | null;
  examCount: number;
  totalAttempts: number;
  totalQuestions: number;
  avgDuration: number;
}

export function ExamCategoriesSection() {
  const [examCategories, setExamCategories] = useState<ExamCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExamCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/exam-categories');
        if (!response.ok) {
          throw new Error('Failed to fetch exam categories');
        }
        const data = await response.json();
        setExamCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchExamCategories();
  }, []);



  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="container-restricted px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choose Your
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}
                Exam Category
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive mock tests designed specifically for different
              competitive exams. Select your target exam and start practicing
              today.
            </p>
          </div>
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <span className="ml-2 text-gray-600">Loading exam categories...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="container-restricted px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choose Your
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}
                Exam Category
              </span>
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600">Failed to load exam categories. Please try again later.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container-restricted px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Choose Your
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}
              Exam Category
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive mock tests designed specifically for different
            competitive exams. Select your target exam and start practicing
            today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examCategories.map((category, index) => (
            <Card
              key={category.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="bg-gradient-to-br from-purple-50 to-purple-100 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-600">
                      {category.examCount} Tests
                    </div>
                  </div>
                </div>

                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {category.name}
                </CardTitle>

                <CardDescription className="text-gray-600">
                  {category.description || `Comprehensive preparation for ${category.name} examinations`}
                </CardDescription>

                <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-full blur-xl" />
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Simplified Statistics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <BookOpen className="w-4 h-4 text-purple-500" />
                      </div>
                      <div className="text-lg font-bold text-gray-900">{category.examCount}</div>
                      <div className="text-xs text-gray-500">Total Exams</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="w-4 h-4 text-purple-500" />
                      </div>
                      <div className="text-lg font-bold text-gray-900">{category.avgDuration}m</div>
                      <div className="text-xs text-gray-500">Avg Duration</div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/exams?category=${category.id}`}
                    className="block mt-6"
                  >
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white btn-animate">
                      Explore Tests
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="text-gray-900">
              <div className="font-semibold">
                Can&apos;t find your exam category?
              </div>
              <div className="text-sm text-gray-600">
                We&apos;re constantly adding new exams and subjects
              </div>
            </div>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                Request New Category
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
