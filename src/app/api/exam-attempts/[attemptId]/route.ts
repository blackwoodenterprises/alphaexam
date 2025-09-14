import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { attemptId } = await params;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get exam attempt with all related data
    const examAttempt = await prisma.examAttempt.findUnique({
      where: {
        id: attemptId,
        userId: user.id, // Ensure user can only access their own attempts
      },
      select: {
        id: true,
        examId: true,
        totalMarks: true,
        percentage: true,
        status: true,
        createdAt: true,
        servedQuestions: true,
        exam: {
          select: {
            id: true,
            title: true,
            description: true,
            examCategory: {
              select: {
                name: true,
              },
            },
          },
        },
        answers: {
          select: {
            questionId: true,
            selectedAnswer: true,
            isCorrect: true,
            marksObtained: true,
            timeSpent: true,
          },
        },
      },
    });

    if (!examAttempt) {
      return NextResponse.json(
        { error: "Exam attempt not found" },
        { status: 404 }
      );
    }

    // Get only the questions that were served to the user (for detailed analysis)
    const examQuestions = await prisma.examQuestion.findMany({
      where: {
        examId: examAttempt.examId,
        questionId: { in: examAttempt.servedQuestions },
      },
      include: {
        question: {
          select: {
            id: true,
            questionText: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            correctAnswer: true,
            explanation: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    // Calculate derived values
    const correctAnswers = examAttempt.answers.filter(answer => answer.isCorrect).length;
    const totalQuestions = examAttempt.answers.length;
    const totalTimeSpent = examAttempt.answers.reduce((sum, answer) => sum + (answer.timeSpent || 0), 0);

    // Format the response
    const result = {
      attemptId: examAttempt.id,
      totalMarks: examAttempt.totalMarks || 0,
      percentage: examAttempt.percentage || 0,
      correctAnswers,
      totalQuestions,
      timeSpent: totalTimeSpent,
      status: examAttempt.status,
      exam: {
        title: examAttempt.exam.title,
        subject: examAttempt.exam.examCategory?.name || 'General',
        description: examAttempt.exam.description,
      },
      createdAt: examAttempt.createdAt.toISOString(),
    };

    const questions = examQuestions.map(eq => ({
      id: eq.question.id,
      questionText: eq.question.questionText,
      optionA: eq.question.optionA,
      optionB: eq.question.optionB,
      optionC: eq.question.optionC,
      optionD: eq.question.optionD,
      correctAnswer: eq.question.correctAnswer,
      explanation: eq.question.explanation,
      marks: eq.marks,
      negativeMarks: eq.negativeMarks,
    }));

    const userAnswers = examAttempt.answers.map(answer => ({
      questionId: answer.questionId,
      selectedAnswer: answer.selectedAnswer,
      isCorrect: answer.isCorrect,
      marksObtained: answer.marksObtained,
    }));

    return NextResponse.json({
      result,
      questions,
      userAnswers,
    });

  } catch (error) {
    console.error("Error fetching exam attempt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}