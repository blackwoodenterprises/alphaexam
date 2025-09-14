import { prisma } from "@/lib/prisma";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { Suspense } from "react";
import { ExamsClient } from "@/components/exams-client";

async function getPublicExams() {
  try {
    const exams = await prisma.exam.findMany({
      where: {
        isActive: true,
      },
      include: {
        examCategory: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            examQuestions: true,
            examAttempts: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return exams;
  } catch (error) {
    console.error("Error fetching public exams:", error);
    return [];
  }
}

async function getExamCategories() {
  try {
    const categories = await prisma.examCategory.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching exam categories:", error);
    return [];
  }
}

export default async function ExamsPage() {
  const [exams, examCategories] = await Promise.all([
    getPublicExams(),
    getExamCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <main className="py-12">
        <div className="container-restricted px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Mock Tests & Practice Exams
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive collection of mock tests for Mathematical Olympiads,
              JEE, NEET and other competitive exams. Practice with our
              AI-powered question bank and track your progress.
            </p>
          </div>

          {/* Client-side search and filters */}
          <Suspense fallback={<div className="text-center py-8">Loading exams...</div>}>
            <ExamsClient initialExams={exams} examCategories={examCategories} />
          </Suspense>

          {/* CTA Section */}
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
              <CardContent className="text-center py-12 px-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Ready to Start Your Preparation?
                </h2>
                <p className="text-purple-100 mb-8 max-w-2xl mx-auto text-base sm:text-lg">
                  Join thousands of students who have improved their scores with
                  our comprehensive mock tests and AI-powered practice sessions.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/sign-up" className="inline-block">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 font-semibold"
                    >
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/dashboard" className="inline-block">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-2 border-white/90 text-white hover:bg-white hover:text-purple-600 px-8 py-3 font-semibold backdrop-blur-sm bg-white/10"
                    >
                      View Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
