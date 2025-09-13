import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileQuestion,
  Clock,
  Target,
} from "lucide-react";
import { ExamQuestionsClient } from "@/components/admin/exam-questions-client";

interface PageProps {
  params: {
    id: string;
  };
}

async function getExam(examId: string) {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        examCategory: {
          select: {
            name: true,
          },
        },
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            examQuestions: true,
            examAttempts: true,
          },
        },
      },
    });

    return exam;
  } catch (error) {
    console.error("Error fetching exam:", error);
    return null;
  }
}

async function getExamQuestions(examId: string) {
  try {
    const examQuestions = await prisma.examQuestion.findMany({
      where: { examId },
      include: {
        question: {
          include: {
            category: {
              select: {
                name: true,
              },
            },
            subcategory: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { order: "asc" },
    });

    return examQuestions;
  } catch (error) {
    console.error("Error fetching exam questions:", error);
    return [];
  }
}



export default async function ExamQuestionsPage({ params }: PageProps) {
  const user = await currentUser();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  const exam = await getExam(params.id);
  const examQuestions = await getExamQuestions(params.id);

  if (!exam) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Questions for &ldquo;{exam.title}&rdquo;
        </h1>
        <p className="text-gray-600 mt-1">
          Manage questions for this exam
        </p>
      </div>

      {/* Exam Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Category</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exam.examCategory?.name || "No Category"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exam._count.examQuestions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exam.duration} min</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attempts</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exam._count.examAttempts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Questions Table */}
      <ExamQuestionsClient exam={exam} examQuestions={examQuestions} />
    </div>
  );
}