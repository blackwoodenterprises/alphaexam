import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { CorrectAnswer } from "@prisma/client";

interface SubmitExamRequest {
  answers: Record<string, string>;
  timeSpent: number; // in seconds
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { examId } = await params;
    const body: SubmitExamRequest = await request.json();
    const { answers, timeSpent } = body;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, credits: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get the active exam attempt first
    const existingAttempt = await prisma.examAttempt.findFirst({
      where: {
        examId,
        userId: user.id,
        status: "IN_PROGRESS",
      },
      select: {
        id: true,
        servedQuestions: true,
      },
    });

    if (!existingAttempt) {
      return NextResponse.json(
        { error: "No active exam attempt found" },
        { status: 404 }
      );
    }

    // Get exam details with only the served questions
    const exam = await prisma.exam.findUnique({
      where: {
        id: examId,
        isActive: true,
      },
      include: {
        examQuestions: {
          where: {
            questionId: { in: existingAttempt.servedQuestions },
          },
          include: {
            question: {
              select: {
                id: true,
                correctAnswer: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!exam) {
      return NextResponse.json(
        { error: "Exam not found or inactive" },
        { status: 404 }
      );
    }

    // Calculate scores
    let totalMarks = 0;
    let correctAnswers = 0;
    const examAnswers: {
      questionId: string;
      selectedAnswer: CorrectAnswer | null;
      isCorrect: boolean | null;
      marksObtained: number;
      timeSpent: number;
    }[] = [];

    for (const examQuestion of exam.examQuestions) {
      const questionId = examQuestion.question.id;
      const userAnswer = answers[questionId];
      const correctAnswer = examQuestion.question.correctAnswer;
      const isCorrect = userAnswer === correctAnswer;
      
      let marksObtained = 0;
      if (userAnswer) {
        if (isCorrect) {
          marksObtained = examQuestion.marks;
          correctAnswers++;
        } else {
          marksObtained = -examQuestion.negativeMarks;
        }
      }
      
      totalMarks += marksObtained;
      
      examAnswers.push({
        questionId,
        selectedAnswer: userAnswer ? (userAnswer as CorrectAnswer) : null,
        isCorrect: userAnswer ? isCorrect : null,
        marksObtained,
        timeSpent: Math.floor(timeSpent / exam.examQuestions.length), // Distribute time evenly
      });
    }

    // Calculate percentage
    const maxPossibleMarks = exam.examQuestions.reduce(
      (sum, eq) => sum + eq.marks,
      0
    );
    const percentage = maxPossibleMarks > 0 ? (totalMarks / maxPossibleMarks) * 100 : 0;

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Update the existing exam attempt
      const examAttempt = await tx.examAttempt.update({
        where: { id: existingAttempt.id },
        data: {
          endTime: new Date(),
          status: "COMPLETED",
          totalMarks,
          percentage: Math.max(0, percentage), // Ensure percentage is not negative
          answers: {
            create: examAnswers,
          },
        },
        include: {
          answers: true,
        },
      });

      // Credits were already deducted when exam attempt was created

      return examAttempt;
    });

    // Return exam results
    return NextResponse.json({
      attemptId: result.id,
      totalMarks,
      percentage: Math.max(0, percentage),
      correctAnswers,
      totalQuestions: exam.examQuestions.length,
      timeSpent,
      status: "COMPLETED",
      message: "Exam submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting exam:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}